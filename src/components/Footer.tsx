import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { Loader2, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const TikTok = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Whatsapp = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.435 5.632 1.435h.004c6.554 0 11.89-5.335 11.893-11.892a11.826 11.826 0 00-3.471-8.413Z" />
  </svg>
);

const Footer = () => {
  const [services, setServices] = useState<{ id: string, title: string }[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('id, title')
        .order('title', { ascending: true })
        .limit(4);
      
      if (data) {
        setServices(data);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // 1. Insert into subscribers table
      const { error: insertError } = await supabase
        .from("subscribers")
        .insert([{ email, is_active: true }]);

      if (insertError) {
        if (insertError.code === "23505") { // Unique violation
          toast.error("This email is already subscribed!");
          return;
        }
        throw insertError;
      }

      // 2. Notify Admin via Edge Function
      await supabase.functions.invoke('send-resend-email', {
        body: {
          to: "contact@fetadify.com",
          subject: "New Newsletter Subscriber",
          from: "Fetadify <contact@fetadify.com>",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; color: #1a1a1a; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #3b82f6; margin-bottom: 24px;">New Subscriber Alert</h2>
              <p style="font-size: 16px; line-height: 1.6;">You have a new subscriber to the Fetadify Intelligence Hub:</p>
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0; font-weight: 700; font-size: 18px; color: #1e293b;">${email}</p>
              </div>
              <p style="font-size: 14px; color: #64748b;">This pulse has been successfully added to the registry.</p>
            </div>
          `
        }
      });

      setIsSubscribed(true);
      toast.success("Successfully subscribed to the Intelligence Hub!");
      setEmail("");
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative border-t border-white/5 bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="mx-auto max-w-7xl pt-24 pb-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <a href="/" className="inline-block group">
              <img src={logo} alt="Fetadify Logo" className="h-12 w-auto group-hover:scale-105 transition-transform duration-500 dark:invert" />
            </a>
            <p className="text-muted-foreground leading-relaxed">
              Pioneering the next era of location intelligence through end-to-end geospatial engineering and custom AI strategies.
            </p>
            <div className="pt-2">
              <a href="mailto:contact@fetadify.com" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                contact@fetadify.com
              </a>
            </div>
            <div className="flex gap-5 text-muted-foreground">
              <a href="https://www.tiktok.com/@fetadify?_r=1&_t=ZS-95Bgj029UV2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all hover:-translate-y-1"><TikTok size={20} /></a>
              <a href="https://www.linkedin.com/company/fetadify/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all hover:-translate-y-1"><Linkedin size={20} /></a>
              <a href="https://wa.me/447378864922" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all hover:-translate-y-1"><Whatsapp size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-sm uppercase tracking-[0.2em] text-foreground/50">Expertise</h4>
            <ul className="space-y-4 text-sm font-medium">
              {services.map((service) => (
                <li key={service.id}>
                  <a href="/services" className="text-muted-foreground hover:text-primary transition-colors">{service.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-sm uppercase tracking-[0.2em] text-foreground/50">Ecosystem</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Spatial Blog</a></li>
              <li><a href="/#work" className="text-muted-foreground hover:text-primary transition-colors">Our Work</a></li>
              <li><a href="/booking" className="text-muted-foreground hover:text-primary transition-colors">Start Project</a></li>
              <li><a href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing Hub</a></li>
              <li><a href="/#why" className="text-muted-foreground hover:text-primary transition-colors">Philosophy</a></li>
            </ul>
          </div>

          <div className="glass p-8 rounded-[2rem] space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-[0.2em] text-primary">Intelligence Hub</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Get the latest spatial insights and engineering breakthroughs delivered locally.
            </p>
            <form className="relative" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isSubscribed}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 disabled:opacity-50"
              />
              <button 
                className="absolute right-2 top-2 p-2.5 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-all glow-primary disabled:opacity-50 disabled:hover:scale-100"
                type="submit"
                disabled={isLoading || isSubscribed}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">
                Transmission Successful - Pulse Added
              </p>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          <p>
            © 2026 <span className="text-foreground">Fetadify Tech Limited</span>. Mapping the Future.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
