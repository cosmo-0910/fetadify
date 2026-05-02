import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Download, Mail, Trash2, Send, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatSafeDate } from "@/lib/utils";
import { AdminNewsletterDialog } from "@/components/admin/AdminNewsletterDialog";

const SubscribersManager = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error: any) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("subscribers")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      setSubscribers(subscribers.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));
      toast.success(`Subscriber ${!currentStatus ? 'activated' : 'deactivated'}.`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const exportCSV = () => {
    const headers = ["Email", "Status", "Joined At"];
    const rows = subscribers.map(s => [s.email, s.is_active ? "Active" : "Inactive", s.created_at]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cosmoint_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    toast.success("Subscriber list downloaded as CSV.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ecosystem Waitlist</h1>
          <p className="text-muted-foreground">Manage authorized pulses and community communications.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSubscribers} disabled={loading} className="rounded-xl border-primary/20">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button size="sm" variant="outline" className="gap-2 rounded-xl border-primary/20" onClick={exportCSV}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-2 rounded-xl glow-primary" onClick={() => setIsNewsletterOpen(true)}>
            <Send className="h-4 w-4" /> Broadcast
          </Button>
        </div>
      </div>

      <Card className="glass border-primary/10 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Pulse Registry
          </CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-widest opacity-60">
            Verified members of the Fetadify newsletter network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-primary/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Email Contact</TableHead>
                  <TableHead>System Status</TableHead>
                  <TableHead>Ingress Date</TableHead>
                  <TableHead className="text-right">Administration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                      <p className="text-sm font-medium">Reading Registry...</p>
                    </TableCell>
                  </TableRow>
                ) : subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                      No pulses detected in the network.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-bold text-sm tracking-tight">{subscriber.email}</TableCell>
                      <TableCell>
                        <Badge variant={subscriber.is_active ? 'default' : 'outline'} 
                          className={subscriber.is_active ? 'bg-primary/10 text-primary border-primary/20 font-black text-[10px]' : 'text-[10px] font-bold opacity-40'}>
                          {subscriber.is_active ? 'ACTIVE' : 'OFFLINE'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs font-mono">
                        {formatSafeDate(subscriber.created_at, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className={`h-8 rounded-lg text-[10px] font-black uppercase ${subscriber.is_active ? 'text-destructive hover:bg-destructive/10' : 'text-primary hover:bg-primary/10'}`}
                          onClick={() => toggleStatus(subscriber.id, subscriber.is_active)}
                        >
                          {subscriber.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AdminNewsletterDialog 
        subscribers={subscribers}
        open={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />
    </div>
  );
};

export default SubscribersManager;
