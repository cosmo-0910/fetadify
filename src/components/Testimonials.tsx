import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import aljadaLogo from "@/assets/aljada.svg";
import chingiLogo from "@/assets/chingitours.png";
import fktLogo from "@/assets/fkt-logo.png";
import kitovuLogo from "@/assets/kitovu.jpg";
import albatrossLogo from "@/assets/albatross aero.png";

const trustedCompanies = [
  { name: "Arada Developments", logo: aljadaLogo },
  { name: "Chingi Tours", logo: chingiLogo },
  { name: "Forking Tasty", logo: fktLogo },
  { name: "Kitovu", logo: kitovuLogo },
  { name: "Albatross Aero", logo: albatrossLogo },
];

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar_url: string;
  stars: number;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_featured", true);
      
      if (!error && data) {
        setTestimonials(data);
      }
      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  if (loading) return null;

  return (
    <section id="testimonials" className="py-20 sm:py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-24"
        >
          <p className="text-primary font-mono text-sm mb-4 tracking-widest uppercase">Client Success</p>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            See how Fetadify is helping organizations transform spatial data into competitive advantages.
          </p>
        </motion.div>
        
        {/* Trusted By Logos */}
        <div className="mb-24 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground mb-12">
            
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-20 gap-y-10 sm:gap-y-12 px-4 opacity-70 dark:opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {trustedCompanies.map((company) => (
              <div key={company.name} className="relative group/logo">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="h-8 md:h-12 w-auto object-contain transition-all duration-500 group-hover/logo:scale-110 dark:filter dark:brightness-200"
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-0 group-hover/logo:opacity-100 transition-opacity whitespace-nowrap">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-[2.5rem] glass p-10 flex flex-col hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="absolute top-8 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote size={60} />
              </div>
              
              <div className="flex gap-1 mb-8">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={18} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-xl text-foreground font-medium leading-relaxed mb-10 flex-1 italic relative z-10">
                "{t.content}"
              </p>

              <div className="flex items-center gap-5 pt-8 border-t border-white/10 group-hover:border-primary/20 transition-colors">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary/20 p-1 group-hover:border-primary/40 transition-all">
                  <img src={t.avatar_url || `https://i.pravatar.cc/150?u=${t.id}`} alt={t.name} className="h-full w-full rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{t.name}</h4>
                  <p className="text-sm text-muted-foreground font-mono uppercase tracking-tighter">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass lg:inline-flex items-center gap-8 p-8 rounded-[2.5rem]">
            <p className="text-lg font-medium text-muted-foreground mb-4 lg:mb-0">
               Experienced the Fetadify advantage?
            </p>
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl text-lg glow-primary">
              <Link to="/reviews/submit">Write a Review</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
