import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const ServiceTicker = () => {
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('title')
        .order('display_order', { ascending: true });
      
      if (data) {
        setServices(data.map(s => s.title));
      }
    };
    fetchServices();
  }, []);

  if (services.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-6 sm:py-8 w-full">
      {/* Side fades using background color for seamless blending */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {/* Quadruple items to ensure width even with 1-2 services */}
        {[...services, ...services, ...services, ...services].map((service, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-full glass border border-primary/10 px-6 py-3 text-sm sm:text-base text-foreground font-mono font-medium tracking-tight shrink-0 shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-primary/60 mr-3 animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            {service}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ServiceTicker;
