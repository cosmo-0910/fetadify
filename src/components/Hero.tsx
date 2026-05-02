import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Rocket, Globe, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import aljadaLogo from "@/assets/aljada.svg";
import chingiLogo from "@/assets/chingitours.png";
import fktLogo from "@/assets/fkt-logo.png";
import kitovuLogo from "@/assets/kitovu.jpg";
import albatrossLogo from "@/assets/albatross aero.png";

const trustedCompanies = [
  { name: "Arada Developments", logo: aljadaLogo },
  { name: "Chingi Tours", logo: chingiLogo },
  { name: "Forking Tasty", logo: fktLogo },
  { name: "Kitovu", logo: kitovuLogo },
  { name: "Albatross Aero", logo: albatrossLogo },
];

const stats = [
  { icon: Shield, label: "Years of Experience", value: "5+" },
  { icon: Rocket, label: "Projects Delivered", value: "50+" },
  { icon: Globe, label: "Countries Served", value: "20+" },
  { icon: Users, label: "Client Satisfaction", value: "98%" },
];

const Hero = ({ onBookClick }: { onBookClick: () => void }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden bg-[#020617]">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.12),transparent_70%)]" />
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/80">
                GIS & Spatial Intelligence Experts
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-white mb-8 leading-[1.05] drop-shadow-sm">
              Build Powerful <span className="text-blue-500">GIS & <br />Location Intelligence</span> Systems
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-lg font-medium">
              We design and develop custom GIS platforms, data dashboards, and digital solutions that transform spatial data into smarter decisions and real business impact.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={onBookClick}
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-full font-bold text-base shadow-lg shadow-blue-600/20 group"
              >
                <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                Book a Demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/15 bg-transparent hover:bg-white/5 text-white h-14 px-10 rounded-full font-bold text-base"
                asChild
              >
                <a href="/#work" className="flex items-center">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  View Our Work
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative lg:ml-auto"
          >
            <div className="relative z-10 rounded-[2.5rem] border border-white/10 p-2 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-blue-500/5 overflow-hidden">
              <div className="rounded-[2rem] overflow-hidden border border-white/10">
                <img 
                  src={dashboardPreview} 
                  alt="Fetadify GeoPlatform Dashboard Mockup" 
                  className="w-full h-auto object-cover scale-[1.01]"
                />
              </div>
            </div>
            
            {/* Glow accent behind dashboard */}
            <div className="absolute inset-0 z-0 bg-blue-500/10 blur-[100px] rounded-[3rem] -m-10" />
          </motion.div>
        </div>

        {/* Trusted By Section */}
        <div className="border-t border-white/5 pt-16 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500/80 mb-12">
            Trusted by startups and enterprise teams across 3+ continents
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 sm:gap-x-20 gap-y-10 sm:gap-y-12 px-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {trustedCompanies.map((company) => (
              <div key={company.name} className="relative group/logo">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="h-8 md:h-12 w-auto object-contain transition-all duration-500 group-hover/logo:scale-110 filter brightness-200"
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-500 opacity-0 group-hover/logo:opacity-100 transition-opacity whitespace-nowrap">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mt-24 py-12 border-t border-white/5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-start lg:items-center gap-5"
            >
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shadow-inner">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-white tracking-tight leading-none mb-2">{stat.value}</span>
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-tight">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;

