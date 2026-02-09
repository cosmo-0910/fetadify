import { motion } from "framer-motion";

const services = [
  "AI Software Development",
  "AI Web Design",
  "AI Blockchain Solutions",
  "AI Mobile Apps",
  "AI Data Analytics",
  "AI Cloud Architecture",
  "AI Cybersecurity",
  "AI DevOps",
  "AI UX/UI Design",
  "AI E-Commerce",
  "AI Machine Learning",
  "AI Automation",
  "AI API Integration",
  "AI SaaS Products",
];

const ServiceTicker = () => {
  return (
    <div className="relative overflow-hidden py-4">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-4 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...services, ...services].map((service, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground font-mono shrink-0"
          >
            {service}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ServiceTicker;
