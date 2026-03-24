import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Activity, Globe, Monitor, Clock, Users, MousePointerClick, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { formatSafeDate } from "@/lib/utils";
import { toast } from "sonner";

interface VisitorAnalytics {
  id: string;
  session_id: string;
  ip_address: string;
  browser_type: string;
  operating_system: string;
  timezone: string;
  location: string;
  visited_urls: string[];
  total_visits: number;
  created_at: string;
  updated_at: string;
}

const AnalyticsManager = () => {
  const [data, setData] = useState<VisitorAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    activeToday: 0
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: analyticsData, error: fetchError } = await supabase
        .from('visitor_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      const typedData = (analyticsData || []) as VisitorAnalytics[];
      setData(typedData);

      const totalPageViews = typedData.reduce((acc, curr) => acc + (curr.total_visits || 0), 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeToday = typedData.filter(d => new Date(d.created_at) >= today).length;

      setMetrics({
        totalVisitors: typedData.length,
        totalPageViews,
        activeToday
      });

    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      if (err?.code === '42P01') {
         setError("The visitor_analytics table does not exist. Please ensure database migrations are applied.");
      } else {
         setError("Failed to load analytics data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border rounded-[2rem] border-destructive/20 bg-destructive/5 glass">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <h3 className="text-lg font-bold text-destructive">Analytics Sync Error</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={fetchData} className="rounded-xl">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitor Intelligence</h1>
          <p className="text-muted-foreground">Monitoring traffic engagement and system footprints.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="rounded-xl border-primary/20">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{metrics.totalVisitors}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase">Tracked uniquely</p>
          </CardContent>
        </Card>
        
        <Card className="glass border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Interaction Count</CardTitle>
            <MousePointerClick className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{metrics.totalPageViews}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase">Total interactions</p>
          </CardContent>
        </Card>

        <Card className="glass border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Today's Pulse</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{metrics.activeToday}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase">Active sessions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-primary/10">
        <CardHeader>
          <CardTitle>Session Stream</CardTitle>
          <CardDescription>
            Live technical breakdown of visitor profiles and behaviors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-primary/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Location / IP</TableHead>
                  <TableHead>System Environment</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                      <p className="text-sm font-medium">Syncing with Analytics Engine...</p>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No data streams detected.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((visitor) => (
                    <TableRow key={visitor.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm flex items-center gap-1">
                            <Globe className="w-3 h-3 text-primary" />
                            {visitor.location || 'Distributed'}
                          </span>
                          <span className="text-[10px] font-mono opacity-50">{visitor.ip_address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold flex items-center gap-1">
                            <Monitor className="w-3 h-3 text-muted-foreground" />
                            {visitor.operating_system || 'Legacy System'}
                          </span>
                          <span className="text-[10px] opacity-60">{visitor.browser_type || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className="font-bold border-primary/20 bg-primary/5 text-[10px]">
                           {visitor.total_visits} {visitor.total_visits === 1 ? 'EVENT' : 'EVENTS'}
                         </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">
                            {formatSafeDate(visitor.created_at, 'MMM dd, yyyy')}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatSafeDate(visitor.created_at, 'HH:mm:ss')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 rounded-lg hover:bg-primary/10">Analyze Path</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md glass border-primary/20 max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="font-bold">Session Intelligence</DialogTitle>
                              <DialogDescription className="text-[10px] font-mono">
                                ID: {visitor.session_id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                              <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider">
                                <div className="text-muted-foreground">Timezone</div>
                                <div className="text-right">{visitor.timezone}</div>
                                
                                <div className="text-muted-foreground">Session Duration</div>
                                <div className="text-right text-primary">
                                  {Math.max(1, Math.round((new Date(visitor.updated_at).getTime() - new Date(visitor.created_at).getTime()) / 60000))} MIN
                                </div>
                              </div>
                              
                              <div className="border-t border-primary/10 pt-4">
                                <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4 text-primary">Behavioral Roadmap ({visitor.total_visits})</h4>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                                  {visitor.visited_urls?.map((url, i) => (
                                    <div key={i} className="flex gap-3 items-start p-2 rounded-lg bg-secondary/30 border border-primary/5">
                                      <span className="text-[10px] font-black text-primary/40 mt-0.5">{i+1}</span>
                                      <code className="text-[11px] break-all font-mono opacity-80">
                                        {url}
                                      </code>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsManager;
