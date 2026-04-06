import { motion } from "framer-motion";

const TawkToEmbed = () => {
  return (
    <section id="chat-embed" className="py-20 sm:py-28 px-6 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-5xl text-center mb-12">
        <p className="text-primary font-mono text-sm mb-3 uppercase tracking-wider">Direct Access</p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
          Chat with our <span className="text-gradient">AI Specialists</span>
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Need immediate assistance? Our team and AI agents are ready to help you navigate your digital transformation.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 w-full aspect-[16/10] sm:aspect-[16/9] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden glass"
        >
          <iframe 
            src="https://tawk.to/chat/68d41da30a2eb21927876f0d/1j5ua10o9" 
            className="w-full h-full border-none"
            title="Tawk.to Chat"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default TawkToEmbed;
