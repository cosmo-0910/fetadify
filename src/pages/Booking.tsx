import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const serviceOptions = [
  "AI Software Development",
  "AI Web Design",
  "AI Blockchain Solutions",
  "AI Mobile Apps",
  "AI Data Analytics",
  "AI Cloud Architecture",
  "AI Cybersecurity",
  "AI Automation",
  "AI UX/UI Design",
  "AI E-Commerce",
  "Machine Learning",
  "AI API Integration",
];

const budgetOptions = ["Under $5K", "$5K - $15K", "$15K - $50K", "$50K+", "Not sure yet"];

const Booking = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Booking submitted! We'll reach out within 24 hours.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" className="mb-8 text-muted-foreground" asChild>
          <a href="/"><ArrowLeft size={16} className="mr-2" /> Back to Home</a>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-3">BOOK A SERVICE</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Let's Build Something <span className="text-gradient">Incredible</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl">
            Fill out the form below and our AI team will review your project within 24 hours.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 rounded-2xl border border-border bg-card"
          >
            <CheckCircle size={64} className="mx-auto text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-3">Booking Received!</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Our AI team will analyze your requirements and reach out within 24 hours with a tailored proposal.
            </p>
            <Button asChild className="bg-primary text-primary-foreground">
              <a href="/">Return Home</a>
            </Button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-border bg-card p-8 sm:p-10"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address *</label>
                <Input name="email" type="email" placeholder="john@company.com" required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input name="company" placeholder="Your company name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input name="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Service *</label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Details *</label>
              <Textarea
                name="details"
                placeholder="Describe your project, goals, timeline, and any specific requirements..."
                required
                className="min-h-[140px]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-12 text-base"
            >
              {loading ? "Submitting..." : <>Submit Booking <Send size={16} className="ml-2" /></>}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to be contacted about your project. We never share your data.
            </p>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default Booking;
