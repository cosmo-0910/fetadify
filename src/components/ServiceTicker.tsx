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
    <div className="relative overflow-hidden py-4">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[hsl(222,47%,11%)]/70 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[hsl(222,47%,11%)]/70 to-transparent z-10" />

      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...services, ...services].map((service, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 font-mono shrink-0"
          >
            {service}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ServiceTicker;
