import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, Hammer, Globe, Rocket, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Maintenance = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Target date for countdown (example: August 1st, 2026)
  const targetDate = new Date("2026-08-01T00:00:00").getTime();
  
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Assuming 'subscribers' table exists or using 'bookings' as fallback if needed
      // But let's assume 'subscribers' for newsletter/waitlist
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          toast.info("Already Subscribed", {
            description: "You're already on our waitlist! We'll notify you soon.",
          });
        } else {
          throw error;
        }
      } else {
        toast.success("Successfully Joined!", {
          description: "Thank you for joining our waitlist.",
        });
        setEmail("");
      }
    } catch (error: any) {
      toast.error("Failed to join waitlist. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full space-y-12 relative z-10"
      >
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" 
            />
            <div className="bg-card w-24 h-24 rounded-3xl border border-border flex items-center justify-center shadow-2xl relative">
              <Hammer className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase">
            Engineering <span className="text-primary">Excellence</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto font-light">
            We're currently architecting a superior digital experience. Our systems will be back online shortly.
          </p>
        </div>

        {/* Countdown */}
        {timeLeft && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
            <TimeUnit label="Days" value={timeLeft.days} />
            <TimeUnit label="Hours" value={timeLeft.hours} />
            <TimeUnit label="Minutes" value={timeLeft.minutes} />
            <TimeUnit label="Seconds" value={timeLeft.seconds} />
          </div>
        )}

        {/* Waitlist Form */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass p-8 rounded-[2.5rem] border border-primary/20 space-y-6 max-w-md mx-auto shadow-2xl"
        >
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center justify-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Join the Waitlist
            </h3>
            <p className="text-sm text-muted-foreground">
              Be the first to receive technical updates and launch notifications.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="pl-12 h-14 bg-background/50 border-border rounded-2xl focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="h-14 rounded-2xl font-bold group overflow-hidden relative glow-primary">
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Secure Alpha Access"}
              </span>
            </Button>
          </form>
        </motion.div>

        {/* Footer info */}
        <div className="pt-12 flex flex-col items-center gap-4 text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>cosmoint24.com.ng</span>
          </div>
          <p className="text-[10px] opacity-40">© 2026 Cosmo INT. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

const TimeUnit = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="bg-secondary/30 backdrop-blur-sm border border-border p-4 rounded-2xl flex flex-col items-center">
      <span className="text-3xl font-black text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
        {label}
      </span>
    </div>
  );
};

export default Maintenance;
