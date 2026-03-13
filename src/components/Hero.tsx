import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceTicker from "./ServiceTicker";
import heroBg from "@/assets/hero-bg.mp4";

const Hero = ({ onBookClick }: { onBookClick: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-40 bg-background text-foreground transition-all duration-1000">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70 dark:opacity-50 transition-opacity duration-1000"
        >
          <source src={heroBg} type="video/mp4" />
        </video>
        
        {/* Subtle Ethereal Glow */}
        <motion.div 
          className="absolute inset-0 opacity-10 dark:opacity-20 bg-[radial-gradient(circle_at_50%_50%,var(--primary)_0%,transparent_70%)]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Dynamic Glass Overlay */}
        <div className="absolute inset-0 bg-background/30 dark:bg-background/40 backdrop-blur-[1px]" />
        
        {/* Smooth Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,background_100%)] opacity-40 dark:opacity-60" />
        
        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:text-left grid lg:grid-cols-2 gap-16 items-center w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl mx-auto lg:mx-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-mono text-primary mb-8 backdrop-blur-md"
          >
            <Sparkles size={14} className="animate-pulse" />
            GIS & Spatial Intelligence Evolution
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight leading-[0.9] mb-8 text-foreground drop-shadow-sm">
            Insights beyond <br />
            <span className="text-gradient">the surface</span>
          </h1>

          <p className="max-w-xl text-lg md:text-xl text-muted-foreground mb-12 mx-auto lg:mx-0 leading-relaxed font-medium">
            Fetadify pioneers the next era of location intelligence. We build custom software gateways that turn vast spatial data into precision strategies.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start mb-12">
            <Button
              onClick={onBookClick}
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-16 px-12 text-lg rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
            >
              Start Your Project <ArrowRight size={20} className="ml-3" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto glass border-primary/20 dark:border-white/20 hover:bg-primary/5 dark:hover:bg-white/10 h-16 px-12 text-lg rounded-2xl font-semibold backdrop-blur-md transition-all"
              asChild
            >
              <a href="/services">View Capabilities</a>
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:grid grid-cols-2 gap-6 relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
          
          <div className="glass p-10 rounded-[2.5rem] translate-y-12 border-primary/10 shadow-2xl backdrop-blur-2xl">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary shadow-inner">
              <Sparkles size={28} />
            </div>
            <h3 className="text-4xl font-black mb-2 text-foreground">99%</h3>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">Spatial Precision</p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-primary/10 shadow-2xl backdrop-blur-2xl">
            <div className="h-14 w-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-500 shadow-inner">
              <ArrowRight size={28} className="-rotate-45" />
            </div>
            <h3 className="text-4xl font-black mb-2 text-foreground">15x</h3>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">Faster Analysis</p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] translate-y-12 col-span-2 flex items-center gap-8 border-primary/10 shadow-2xl backdrop-blur-2xl">
             <div className="relative">
               <div className="h-20 w-20 rounded-full border-4 border-primary/10 flex items-center justify-center">
                 <div className="h-14 w-14 rounded-full border-4 border-primary/40 border-t-primary animate-spin" />
               </div>
               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-50" />
             </div>
             <div>
                <h3 className="text-2xl font-bold text-foreground">Real-time Stream</h3>
                <p className="text-sm font-medium text-muted-foreground">5M+ geo-coordinates / second</p>
             </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-6 left-0 right-0 pointer-events-none"
      >
        <ServiceTicker />
      </motion.div>
    </section>
  );
};

export default Hero;
