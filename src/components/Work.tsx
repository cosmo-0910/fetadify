import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowUpRight, ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MediaLightbox } from "@/components/MediaLightbox";

interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  result: string;
  description: string;
}

const Work = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="work" className="py-20 sm:py-28 px-6 bg-secondary/5">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-primary font-mono text-sm mb-3">SELECTED WORK</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Proven Results, <span className="text-gradient">Real Impact</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Explore how we've helped industry leaders transform their businesses through bespoke AI solutions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] rounded-2xl bg-secondary/20 animate-pulse border border-border" />
            ))
          ) : (
            projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="aspect-[16/10] overflow-hidden relative group">
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

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-16 text-center"
        >
          <Button 
            onClick={() => window.location.href = "/portfolio"} 
            variant="outline"
            size="lg"
            className="gap-2 px-8 h-12 text-base font-semibold border-primary/20 hover:bg-primary/5 hover:border-primary/50"
          >
            View All Projects <ArrowUpRight size={18} />
          </Button>
        </motion.div>
      </div>
      <MediaLightbox 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
        media={currentGallery}
        initialIndex={activeMediaIndex}
      />
    </section>
  );
};

export default Work;
