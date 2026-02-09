import { motion } from "framer-motion";
import { Cpu, Rocket, Users, Clock } from "lucide-react";

const points = [
  { icon: Cpu, title: "AI-First Approach", desc: "Every project starts with AI at its core, not as an afterthought." },
  { icon: Rocket, title: "Rapid Delivery", desc: "AI-accelerated workflows mean faster turnarounds without sacrificing quality." },
  { icon: Users, title: "Expert Team", desc: "Engineers, designers, and data scientists working as one unit." },
  { icon: Clock, title: "24/7 AI Support", desc: "Our AI monitoring tools keep your systems healthy around the clock." },
];

const WhyUs = () => (
  <section id="why" className="py-28 px-6 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
    <div className="mx-auto max-w-5xl relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-primary font-mono text-sm mb-3">WHY FETADIFY</p>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Built Different, <span className="text-gradient">Built Smarter</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {points.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex gap-4 rounded-xl border border-border bg-card p-6"
          >
            <div className="shrink-0 rounded-lg bg-secondary/10 p-3 text-secondary h-fit">
              <p.icon size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;
