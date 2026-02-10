import { Github, Twitter, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const Footer = () => {
  const [services, setServices] = useState<{ id: string, title: string }[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('id, title')
        .order('display_order', { ascending: true })
        .limit(4);
      
      if (data) {
        setServices(data);
      }
    };
    fetchServices();
  }, []);

  return (
    <footer className="border-t border-border bg-background pt-20 pb-10 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <a href="/" className="flex items-center gap-2">
              <img src="/src/assets/logo.png" alt="Fetadify Logo" className="h-[6.25rem] w-auto" />
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Pioneering the next generation of digital solutions by infusing artificial intelligence into every line of code.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {services.map((service) => (
                <li key={service.id}>
                  <a href="/services" className="hover:text-primary transition-colors">{service.title}</a>
                </li>
              ))}
              {services.length === 0 && (
                <>
                  <li><a href="/services" className="hover:text-primary transition-colors">AI Software Development</a></li>
                  <li><a href="/services" className="hover:text-primary transition-colors">AI Web Design</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="/#demo" className="hover:text-primary transition-colors">AI Demo</a></li>
              <li><a href="/#work" className="hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="/#why" className="hover:text-primary transition-colors">Why Fetadify</a></li>
              <li><a href="/booking" className="hover:text-primary transition-colors">Book a Service</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">Join the Waitlist</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest AI insights and product updates delivered to your inbox.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button 
                className="absolute right-2 top-1.5 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/20"
                type="submit"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 <span className="text-foreground font-semibold">Fetadify</span>. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
