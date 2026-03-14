import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Mail, CheckCircle, RefreshCw, Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const SupportManager = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .or("subject.ilike.%support%,message.ilike.%support%,subject.ilike.%help%")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      console.error("Error fetching support tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      
      setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
      toast.success(`Support ticket marked as ${status}.`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Operations</h1>
          <p className="text-muted-foreground">Managing high-priority client technical interfaces.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTickets} disabled={loading} className="rounded-xl border-primary/20">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </Button>
      </div>

      <Card className="glass border-primary/10 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-primary" />
            Incident Stream
          </CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-widest opacity-60">
            Automated filtering for help and support priority requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-primary/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>User Terminal</TableHead>
                  <TableHead>Technical Issue</TableHead>
                  <TableHead>Vector Status</TableHead>
                  <TableHead className="text-right">Resolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                      <p className="text-sm font-medium">Decrypting Tickets...</p>
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                      No active support incidents detected.
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell>
                        <div className="font-bold text-sm tracking-tight">{ticket.name}</div>
                        <div className="text-[10px] font-mono opacity-50">{ticket.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-black text-[10px] uppercase tracking-wider mb-1 text-primary">{ticket.subject}</div>
                        <div className="text-xs font-light max-w-md leading-relaxed opacity-80">{ticket.message}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ticket.status === 'resolved' ? 'default' : 'outline'} 
                          className={ticket.status === 'resolved' ? 'bg-primary/10 text-primary border-primary/20 font-black text-[9px]' : 'text-[9px] font-bold opacity-40'}>
                          {ticket.status?.toUpperCase() || 'OPEN'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {ticket.status !== 'resolved' && (
                            <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-black border-primary/20 hover:bg-primary/5 text-primary" onClick={() => updateStatus(ticket.id, 'resolved')}>
                              <CheckCircle className="w-3 h-3 mr-1" /> RESOLVE
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-8 rounded-lg text-[10px] font-black" onClick={() => window.location.href = `mailto:${ticket.email}`}>
                            <Mail className="w-3 h-3 mr-1" /> REPLY <ArrowUpRight className="w-2 h-2 ml-1" />
                          </Button>
                        </div>
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

export default SupportManager;
