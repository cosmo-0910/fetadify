import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceTicker from "./ServiceTicker";
import heroBg from "@/assets/hero-bg.mp4";

const Hero = ({ onBookClick }: { onBookClick: () => void }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-24 sm:pt-32 sm:pb-48 bg-background text-foreground transition-all duration-1000">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100 dark:opacity-80 grayscale-0 transition-opacity duration-1000"
        >
          <source src={heroBg} type="video/mp4" />
        </video>
        
        {/* Subtle Ethereal Glow */}
        <motion.div 
          className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_40%,var(--primary)_0%,transparent_60%)]"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Tiniest Fog */}
        <div className="absolute inset-0 bg-background/5 dark:bg-background/10 backdrop-blur-[1.5px]" />

        {/* Dense Vignette for Cleanliness - Transparent in the middle */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,background_150%)] opacity-30 dark:opacity-50" />
        
        {/* Bottom Fade - Very subtle to keep video visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30 dark:to-background/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full border border-primary/30 bg-background/50 dark:bg-background/50 backdrop-blur-md shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-foreground drop-shadow-sm">
              GIS & Spatial Intelligence Evolution
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9] sm:leading-[0.85] mb-6 sm:mb-8 text-foreground uppercase drop-shadow-2xl">
            Transforming <br className="hidden sm:inline" />
            <span className="text-gradient">Possibility</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-foreground/90 dark:text-foreground/90 mb-10 sm:mb-16 leading-relaxed font-medium px-4 drop-shadow-sm">
            Fetadify pioneers the next era of location intelligence. We build high-performance digital ecosystems that turn vast spatial data into precision strategies.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
            <Button
              onClick={onBookClick}
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-14 sm:h-16 px-8 sm:px-14 text-base sm:text-lg rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Start Your Project <ArrowRight size={20} className="ml-3 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto glass border-white/10 hover:bg-white/5 h-14 sm:h-16 px-8 sm:px-14 text-base sm:text-lg rounded-full font-semibold backdrop-blur-md transition-all hover:border-primary/30"
              asChild
            >
              <a href="/services">View Capabilities</a>
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-0 right-0 pointer-events-none"
      >
        <ServiceTicker />
      </motion.div>
    </section>
  );
};

export default Hero;

