import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const ReviewSubmission = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    avatar_url: "",
    stars: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("testimonials")
      .insert([{ ...formData, is_featured: false }]);

    if (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSubmitted(true);
      toast({
        title: "Review Received",
        description: "Thank you! Your review has been submitted for moderation.",
      });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[2.5rem] max-w-lg w-full text-center space-y-8"
        >
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Thank You!</h1>
            <p className="text-muted-foreground text-lg">
              Your feedback is invaluable to us. Our team will review your testimonial shortly.
            </p>
          </div>
          <Button asChild className="w-full h-14 rounded-2xl text-lg">
            <Link to="/">Return Home</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={() => window.location.href = '/booking'} />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all mb-8 font-medium">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-12"
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
              Share Your <span className="text-gradient">Experience</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're proud to support the giants of GIS. Your testimonial helps us continue maps the future of spatial intelligence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="E.g. Dr. Jane Map"
                    className="h-14 bg-background/50 border-white/10 rounded-xl px-4"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="role" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Role & Organization</Label>
                  <Input
                    id="role"
                    placeholder="E.g. CTO at GeoCore"
                    className="h-14 bg-background/50 border-white/10 rounded-xl px-4"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="rating" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Rating</Label>
                <div className="flex gap-4 p-4 glass rounded-xl bg-background/30 w-fit">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button
                       key={star}
                       type="button"
                       onClick={() => setFormData({ ...formData, stars: star })}
                       className="transition-all hover:scale-110 active:scale-95"
                     >
                       <Star 
                         size={28} 
                         className={star <= formData.stars ? "fill-primary text-primary" : "text-muted-foreground/30"} 
                       />
                     </button>
                   ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="content" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your Testimonial</Label>
                <Textarea
                  id="content"
                  placeholder="How did Fetadify transform your spatial data infrastructure?"
                  className="min-h-[160px] bg-background/50 border-white/10 rounded-xl px-4 py-4 leading-relaxed"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl text-xl font-bold bg-primary glow-primary hover:scale-[1.02] transition-all"
                disabled={loading}
              >
                {loading ? "Sending your maps..." : "Submit Experience"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmission;
