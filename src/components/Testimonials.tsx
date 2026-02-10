import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO at TechFlow",
    content: "Fetadify transformed our data infrastructure. Their AI-first approach delivered results we didn't think were possible within our timeframe.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    stars: 5
  },
  {
    name: "Marcus Thorne",
    role: "CTO at Nexus Logistics",
    content: "The intelligent automation pipelines they built for us reduced our operational costs by nearly 30% in the first quarter alone.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    stars: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Product Lead at InnovateHealth",
    content: "Working with Fetadify felt like having an elite AI research team integrated into our company. Professional, fast, and deeply technical.",
    avatar: "https://i.pravatar.cc/150?u=elena",
    stars: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 sm:py-28 px-6 bg-background">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-primary font-mono text-sm mb-3">TESTIMONIALS</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-border bg-card p-8 flex flex-col hover:border-primary/30 transition-colors"
            >
              <Quote className="absolute top-6 right-8 text-primary/10 h-12 w-12" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-lg text-foreground/90 leading-relaxed mb-8 flex-1 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full border border-border" />
                <div>
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
