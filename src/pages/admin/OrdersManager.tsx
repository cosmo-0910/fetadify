import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, DollarSign, Edit, RefreshCw, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const OrdersManager = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order: any) => {
    setEditingOrder({
      ...order,
      service_price: order.service_price || 0,
      currency: order.currency || 'USD'
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          service_price: Number(editingOrder.service_price),
          currency: editingOrder.currency,
          status: 'confirmed'
        })
        .eq("id", editingOrder.id);

      if (error) throw error;
      
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...editingOrder, status: 'confirmed' } : o));
      toast.success("Project pricing and status locked.");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Quoting</h1>
          <p className="text-muted-foreground">Managing financial commitment for active project vectors.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading} className="rounded-xl border-primary/20">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Orders
        </Button>
      </div>

      <Card className="glass border-primary/10 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-tighter flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Project Pipeline
          </CardTitle>
          <CardDescription className="text-xs font-medium uppercase tracking-widest opacity-60">
            Define pricing models and lock project statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-primary/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Client Terminal</TableHead>
                  <TableHead>Service Vector</TableHead>
                  <TableHead>Financials</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                      <p className="text-sm font-medium">Ingesting Pipeline...</p>
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                      No project vectors detected in the pipeline.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell>
                        <div className="font-bold text-sm tracking-tight">{order.customer_name || 'Generic Client'}</div>
                        <div className="text-[10px] font-mono opacity-50">{order.customer_email || order.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(order.service_id || 'Consultation').split(',').map((s: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-[9px] font-bold border-primary/10 bg-primary/5">
                              {s.trim()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-black text-sm">
                          {order.service_price > 0 ? (
                            <>
                              <span className="text-primary">{order.currency === 'USD' ? '$' : '₦'}</span>
                              {order.service_price.toLocaleString()}
                            </>
                          ) : (
                            <span className="text-muted-foreground font-bold text-[10px] uppercase">Pending Quote</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'confirmed' ? 'default' : 'outline'} 
                          className={order.status === 'confirmed' ? 'bg-primary/10 text-primary border-primary/20 font-black text-[9px]' : 'text-[9px] font-bold opacity-40'}>
                          {order.status?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 rounded-lg text-primary hover:bg-primary/10"
                          onClick={() => handleEdit(order)}
                        >
                          <Edit className="w-3 h-3 mr-1" /> QUOTE
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass border-primary/20 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-bold uppercase tracking-tighter">Set Project Pricing</DialogTitle>
            <DialogDescription className="text-xs">
              Defining financial constraints for {editingOrder?.customer_name}
            </DialogDescription>
          </DialogHeader>

          {editingOrder && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Currency Vector</label>
                  <Select 
                    value={editingOrder.currency} 
                    onValueChange={(v) => setEditingOrder({...editingOrder, currency: v})}
                  >
                    <SelectTrigger className="bg-secondary/30 border-primary/10 rounded-xl">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      <SelectItem value="USD">USD (GLOBAL)</SelectItem>
                      <SelectItem value="NGN">NGN (LOCAL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Asset Value (Price)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary">
                      {editingOrder.currency === 'USD' ? '$' : '₦'}
                    </div>
                    <Input 
                      type="number"
                      value={editingOrder.service_price}
                      onChange={(e) => setEditingOrder({...editingOrder, service_price: e.target.value})}
                      className="pl-12 bg-secondary/30 border-primary/10 rounded-xl font-black h-12"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-[10px] text-muted-foreground leading-relaxed">
                <span className="font-black text-primary block mb-1">AUTOMATED WORKFLOW:</span>
                Saving this quote will lock the project status to <span className="text-foreground font-bold">CONFIRMED</span> and enable tracking for the client.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSave} className="rounded-xl h-12 px-6 glow-primary font-bold gap-2">
              <Save className="w-4 h-4" /> LOCK QUOTE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManager;
