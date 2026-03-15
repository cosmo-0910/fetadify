import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features?: string[];
}

const Services = ({ onBookClick }: { onBookClick: () => void }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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

  if (loading) return null;

  return (
    <section id="services" className="py-20 sm:py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-24"
        >
          <p className="text-primary font-mono text-sm mb-4 tracking-widest uppercase">Expertise</p>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Our <span className="text-gradient">Core Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            End-to-end geospatial engineering and custom software solutions designed for global scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = getIcon(service.icon_name);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                onClick={() => setSelectedService(service)}
                className="group cursor-pointer relative rounded-[2.5rem] glass p-10 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="mb-8 p-4 w-16 h-16 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 glow-primary flex items-center justify-center">
                    <Icon size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-4 group-hover:text-foreground/80 transition-colors">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features?.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-4 text-3xl font-bold">
              {selectedService && (() => {
                const ModalIcon = getIcon(selectedService.icon_name);
                return (
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <ModalIcon size={32} />
                  </div>
                );
              })()}
              {selectedService?.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Details and features for {selectedService?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-4">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selectedService?.description}
              </p>
            </div>

            {selectedService?.features && selectedService.features.length > 0 && (
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Key Features & Capabilities
                </h4>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {selectedService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                      <span className="text-foreground/90 leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter className="mt-8 gap-3 sm:gap-0">
            <Button variant="ghost" onClick={() => setSelectedService(null)} className="hover:bg-white/5">
              Close details
            </Button>
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
              onClick={() => {
                setSelectedService(null);
                onBookClick();
              }}>
              Book This Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Services;
