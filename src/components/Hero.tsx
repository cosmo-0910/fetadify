import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Rocket, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const stats = [
  { icon: Shield, label: "Years of Experience", value: "5+" },
  { icon: Rocket, label: "Projects Delivered", value: "20+" },
  { icon: Globe, label: "Countries Served", value: "30+" },
  { icon: Users, label: "Client Satisfaction", value: "98%" },
];

const partners = [
  "THE WORLD BANK", "esri", "Trimble", "Terra Drone", "droneDeploy", "K2FLY"
];

const Hero = ({ onBookClick }: { onBookClick: () => void }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-[#020617]">
      {/* Background Pattern - Original Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.15),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-8 inline-flex px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                GIS & Spatial Intelligence Experts
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
              Build Powerful <span className="text-blue-500">GIS & Location Intelligence</span> Systems
            </h1>

            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
              We design and develop custom GIS platforms, data dashboards, and digital solutions that transform spatial data into smarter decisions and real business impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Button
                onClick={onBookClick}
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-xl font-bold group"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Book a Demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-white h-14 px-10 rounded-xl font-bold"
                asChild
              >
                <a href="/#work" className="flex items-center">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  View Our Work
                </a>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-blue-500/80 text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>Results-driven solutions • No commitment</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-blue-500/10">
              <img 
                src={dashboardPreview} 
                alt="Fetadify GeoPlatform Dashboard" 
                className="w-full h-auto"
              />
            </div>
            {/* Decorative Glow elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full" />
          </motion.div>
        </div>

        {/* Trusted By Section */}
        <div className="border-t border-white/5 pt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10">
            Trusted by startups and enterprise teams across 3+ continents
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {partners.map(p => (
              <span key={p} className="text-lg md:text-xl font-bold text-white tracking-wider">{p}</span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 pt-12 border-t border-white/5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-5"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider leading-tight">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

