import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const AVAILABLE_SERVICES = [
  "Web Design",
  "Branding",
  "App Development",
  "Social Media Ad",
  "SEO Optimization",
  "Graphic Design",
  "Digital Marketing",
  "Content Strategy"
];

interface InvoiceModalProps {
  onSuccess?: () => void;
}

export const InvoiceModal = ({ onSuccess }: InvoiceModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState({
    name: "",
    emails: [""] as string[],
    amount: "",
    currency: "NGN",
    services: [] as string[],
    message: "",
    due_date: "",
  });

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("bookings") // Using bookings as the default storage if no invoices table exists
        .insert([{
          full_name: invoice.name,
          email: invoice.emails.filter(e => e.trim() !== "").join(", "),
          service: invoice.services.join(", "),
          status: 'confirmed',
          created_at: new Date().toISOString(),
          // Note: Add any other fields as needed based on 'bookings' schema
        }]);

      if (error) throw error;

      toast.success("Invoice created successfully");
      setIsOpen(false);
      setInvoice({ 
        name: "", 
        emails: [""], 
        amount: "", 
        currency: "NGN", 
        services: [], 
        message: "", 
        due_date: "" 
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error("Error creating invoice: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addEmailField = () => {
    setInvoice({ ...invoice, emails: [...invoice.emails, ""] });
  };

  const removeEmailField = (index: number) => {
    const updated = invoice.emails.filter((_, i) => i !== index);
    setInvoice({ ...invoice, emails: updated });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={18} /> New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Manual Invoice
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateInvoice} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input 
              id="name" 
              value={invoice.name} 
              onChange={(e) => setInvoice({...invoice, name: e.target.value})} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex justify-between items-center">
              <span>Client Email(s)</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 rounded-full"
                onClick={addEmailField}
              >
                <Plus size={14} />
              </Button>
            </Label>
            <div className="space-y-2">
              {invoice.emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="email@example.com"
                    value={email} 
                    onChange={(e) => {
                      const updated = [...invoice.emails];
                      updated[index] = e.target.value;
                      setInvoice({...invoice, emails: updated});
                    }} 
                    required={index === 0} 
                  />
                  {invoice.emails.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0 text-destructive hover:bg-destructive/10"
                      onClick={() => removeEmailField(index)}
                    >
                      <span className="text-lg">×</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Services</Label>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg">
              {AVAILABLE_SERVICES.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`service-${service}`} 
                    checked={invoice.services.includes(service)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setInvoice({...invoice, services: [...invoice.services, service]});
                      } else {
                        setInvoice({...invoice, services: invoice.services.filter(s => s !== service)});
                      }
                    }}
                  />
                  <label htmlFor={`service-${service}`} className="text-xs">{service}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select 
                id="currency"
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={invoice.currency}
                onChange={(e) => setInvoice({...invoice, currency: e.target.value})}
              >
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="0.00"
                value={invoice.amount} 
                onChange={(e) => setInvoice({...invoice, amount: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date (Optional)</Label>
            <Input 
              id="due_date" 
              type="date" 
              value={invoice.due_date} 
              onChange={(e) => setInvoice({...invoice, due_date: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Description/Message</Label>
            <Textarea 
              id="message" 
              value={invoice.message} 
              onChange={(e) => setInvoice({...invoice, message: e.target.value})} 
              placeholder="NOTE: A 50% deposit is required before project commencement."
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
