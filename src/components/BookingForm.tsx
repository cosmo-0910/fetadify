import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";



const BookingForm = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<{ id: string, title: string }[]>([]);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('id, title').order('title');
      if (data) setServices(data);
    };
    if (open) fetchServices();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const bookingData = {
        customer_name: formData.get("name"),
        customer_email: formData.get("email"),
        customer_company: formData.get("company"),
        service_id: selectedService, 
        project_details: formData.get("details"),
        booking_date: new Date().toISOString(),
        status: 'Pending'
      };
      
      const { error } = await supabase.from('bookings').insert([{
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        service_id: selectedService, // This will now be the title string
        booking_date: bookingData.booking_date,
        status: 'Pending'
      }]);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      setSubmitted(true);
      toast.success("Booking submitted! We'll reach out within 24 hours.");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setSubmitted(false);
        setLoading(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-auto"
          >
            <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl mx-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Book a Service</h3>
                  <p className="text-sm text-muted-foreground mt-1">Tell us about your project and we'll get back within 24h.</p>
                </div>
                <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle size={56} className="mx-auto text-primary mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Booking Received!</h4>
                  <p className="text-muted-foreground text-sm">Our Team will analyze your requirements and reach out within 24 hours.</p>
                  <Button onClick={handleClose} className="mt-6 bg-primary text-primary-foreground">Close</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="name" placeholder="Full Name" required className="bg-muted/50 border-border" />
                    <Input name="email" type="email" placeholder="Email" required className="bg-muted/50 border-border" />
                  </div>
                  <Input name="company" placeholder="Company (optional)" className="bg-muted/50 border-border" />
                  <Select required onValueChange={setSelectedService}>
                    <SelectTrigger className="bg-muted/50 border-border">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    name="details"
                    placeholder="Tell us about your project, goals, and timeline..."
                    required
                    className="bg-muted/50 border-border min-h-[100px]"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-12 text-base"
                  >
                    {loading ? "Submitting..." : <>Submit Booking <Send size={16} className="ml-2" /></>}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingForm;
