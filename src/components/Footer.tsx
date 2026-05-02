import { Linkedin, Send, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";

const Footer = () => {
  const [services, setServices] = useState<{ id: string, title: string }[]>([]);

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
              <a href="https://www.tiktok.com/@fetadify?_r=1&_t=ZS-95Bgj029UV2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all hover:-translate-y-1"><Video size={20} /></a>
              <a href="https://www.linkedin.com/company/fetadify/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all hover:-translate-y-1"><Linkedin size={20} /></a>
              <a href="https://wa.me/447378864922" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all hover:-translate-y-1"><Linkedin size={20} /></a>
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
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
              />
              <button 
                className="absolute right-2 top-2 p-2.5 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-all glow-primary"
                type="submit"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          <p>
            © 2026 <span className="text-foreground">Fetadify Systems</span>. Mapping the Future.
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
