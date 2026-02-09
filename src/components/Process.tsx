import { motion } from "framer-motion";
import { Search, Zap, Puzzle, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discovery & Strategy",
    desc: "We analyze your existing workflows to identify high-impact AI opportunities that align with your business goals."
  },
  {
    icon: Puzzle,
    title: "AI Integration",
    desc: "Our engineers build or integrate custom AI models into your tech stack, ensuring seamless data flow and performance."
  },
  {
    icon: Zap,
    title: "Accelerated Launch",
    desc: "Using AI-powered development tools, we deploy robust solutions faster than traditional agencies."
  },
  {
    icon: TrendingUp,
    title: "Continuous Optimization",
    desc: "We don't just ship and leave. We monitor, retrain, and scale your AI systems to ensure long-term value."
  }
];

const Process = () => {
  return (
    <section id="process" className="py-28 px-6 bg-secondary/5 overflow-hidden">
      <div className="mx-auto max-w-7xl relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-primary font-mono text-sm mb-3">HOW WE WORK</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Our AI-First <span className="text-gradient">Methodology</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A streamlined approach to turning complex technical challenges into competitive advantages.
          </p>
        </motion.div>

        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/4 left-0 w-full h-0.5 bg-border -z-10" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-background">
                  <step.icon size={28} />
                </div>
                {/* Step Number Badge */}
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-background border border-border rounded-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  0{i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
