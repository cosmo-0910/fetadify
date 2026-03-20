import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink, Briefcase, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MediaLightbox } from "@/components/MediaLightbox";

interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  result: string;
  description: string;
  display_order: number;
}

const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error("Error fetching projects:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const openBooking = () => navigate("/booking");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={openBooking} />
      
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 border border-primary/20">
              <Briefcase size={12} /> Our Portfolio
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tightest mb-6">
              Showcasing Our <span className="text-gradient">Impact</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore the full range of AI solutions we've implemented for forward-thinking businesses across various industries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[16/10] rounded-2xl bg-secondary/20 animate-pulse border border-border" />
              ))
            ) : projects.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground">No projects found in our portfolio yet.</p>
              </div>
            ) : (
              projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentGallery([project.image_url]);
                          setActiveMediaIndex(0);
                          setLightboxOpen(true);
                        }}
                      >
                        <Maximize2 size={24} />
                      </Button>
                    </div>
                    {project.image_url?.toLowerCase().match(/\.(mp4|webm|ogg|mov|avi)$/) || project.image_url?.includes('/video') ? (
                      <video 
                        src={project.image_url} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
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
                      <button 
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-sm font-semibold flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
                      >
                        View Case Study <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      <MediaLightbox 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
        media={currentGallery}
        initialIndex={activeMediaIndex}
      />
      <Footer />
    </div>
  );
};

export default Portfolio;
