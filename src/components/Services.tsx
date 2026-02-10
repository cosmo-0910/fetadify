import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
}

const Services = ({ onBookClick }: { onBookClick: () => void }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setServices(data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name];
    return Icon || HelpCircle;
  };

  return (
    <section id="services" className="py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-3">WHAT WE DO</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            AI Infused Into <span className="text-gradient">Everything</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every service we offer is enhanced by artificial intelligence — delivering smarter, faster, and more impactful results.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
             Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-secondary/20 animate-pulse border border-border" />
            ))
          ) : (
            services.map((s, i) => {
              const Icon = getIcon(s.icon_name);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={onBookClick}
                  className="group cursor-pointer rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:glow-card transition-all duration-300"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary/20 transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
