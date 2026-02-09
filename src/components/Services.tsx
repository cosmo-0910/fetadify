import { motion } from "framer-motion";
import { 
  Code, Globe, Blocks, Smartphone, BarChart3, Cloud, 
  Shield, Workflow, Palette, ShoppingCart, Brain, Zap 
} from "lucide-react";

const services = [
  { icon: Code, title: "AI Software Development", desc: "Custom software infused with intelligent algorithms for smarter, faster solutions." },
  { icon: Globe, title: "AI Web Design", desc: "Websites that adapt, learn, and deliver personalized user experiences through AI." },
  { icon: Blocks, title: "AI Blockchain", desc: "Smart contracts and decentralized apps powered by AI-driven security and optimization." },
  { icon: Smartphone, title: "AI Mobile Apps", desc: "Native & cross-platform mobile apps with built-in AI capabilities." },
  { icon: BarChart3, title: "AI Data Analytics", desc: "Transform raw data into actionable insights with machine learning pipelines." },
  { icon: Cloud, title: "AI Cloud Architecture", desc: "Scalable cloud infrastructure with AI-powered auto-scaling and cost optimization." },
  { icon: Shield, title: "AI Cybersecurity", desc: "Threat detection and prevention powered by real-time AI monitoring." },
  { icon: Workflow, title: "AI Automation", desc: "Automate repetitive processes with intelligent workflow engines." },
  { icon: Palette, title: "AI UX/UI Design", desc: "Data-driven design decisions that maximize engagement and conversion." },
  { icon: ShoppingCart, title: "AI E-Commerce", desc: "Smart product recommendations, dynamic pricing, and AI-driven storefronts." },
  { icon: Brain, title: "Machine Learning", desc: "Custom ML models trained on your data for prediction and classification." },
  { icon: Zap, title: "AI API Integration", desc: "Seamless integration of AI services into your existing tech stack." },
];

const Services = ({ onBookClick }: { onBookClick: () => void }) => {
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
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              onClick={onBookClick}
              className="group cursor-pointer rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:glow-card transition-all duration-300"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary/20 transition-colors">
                <s.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
