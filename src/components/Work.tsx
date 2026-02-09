import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "EcoScale AI",
    category: "AI Automation",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    result: "40% Efficiency Increase",
    description: "Automated supply chain logistics using predictive machine learning models."
  },
  {
    title: "NeuroBank",
    category: "AI Fintech",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    result: "99.9% Fraud Detection",
    description: "Real-time anomaly detection system for high-volume financial transactions."
  },
  {
    title: "HealthSync",
    category: "AI Healthcare",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=800",
    result: "2x Diagnosis Speed",
    description: "AI-assisted diagnostic tool for medical imagery and patient history analysis."
  }
];

const Work = () => {
  return (
    <section id="work" className="py-28 px-6 bg-secondary/5">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-3">SELECTED WORK</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Proven Results, <span className="text-gradient">Real Impact</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore how we've helped industry leaders transform their businesses through bespoke AI solutions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                  <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                    {project.result}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {project.title}
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {project.description}
                </p>
                <div className="mt-6 pt-6 border-t border-border">
                  <button className="text-sm font-semibold flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                    View Case Study <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
