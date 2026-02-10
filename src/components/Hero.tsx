import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceTicker from "./ServiceTicker";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = ({ onBookClick }: { onBookClick: () => void }) => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 sm:pt-20 sm:pb-20">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="absolute inset-0 bg-[hsl(222,47%,11%)]/70 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 sm:px-4 text-[10px] sm:text-xs font-mono text-white mb-6 sm:mb-8">
            <Sparkles size={12} className="sm:w-[14px] sm:h-[14px]" />
            AI-Powered Digital Solutions
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1] sm:leading-[0.95] mb-6 text-white"
        >
          We Build the Future
          <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500"> with AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto max-w-2xl text-base sm:text-xl text-white/70 mb-8 sm:mb-10 px-4 sm:px-0"
        >
          Fetadify infuses artificial intelligence into every service we deliver — 
          from software engineering to blockchain, web design to data analytics. 
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16"
        >
          <Button
            onClick={onBookClick}
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8 h-12"
          >
            Book a Service <ArrowRight size={18} className="ml-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 h-12 px-8 bg-transparent"
            asChild
          >
            <a href="/services">Explore Services</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-8 sm:mt-12 w-full"
        >
          <ServiceTicker />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
