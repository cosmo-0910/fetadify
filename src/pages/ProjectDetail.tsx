import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Maximize2, Calendar, Tag, Target } from "lucide-react";
import { motion } from "framer-motion";
import { MediaLightbox } from "@/components/MediaLightbox";

interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  gallery_urls: string[];
  external_url: string;
  result: string;
  description: string;
  created_at: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Project Not Found</h1>
        <Button onClick={() => navigate("/portfolio")} variant="outline">
          Back to Portfolio
        </Button>
      </div>
    );
  }

  const allMedia = [project.image_url, ...(project.gallery_urls || [])].filter(Boolean);

  const openLightbox = (index: number) => {
    setActiveMediaIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={() => navigate("/booking")} />
      
      <main className="pt-32 pb-24">
        {/* Header Section */}
        <div className="mx-auto max-w-5xl px-6 mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-8 border border-primary/20"
          >
            {project.category}
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tightest mb-8 leading-[1.1] text-balance">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
               <Tag size={14} className="text-primary" />
               <span className="font-bold">{project.category}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 text-green-500">
               <Target size={14} />
               <span className="font-black uppercase tracking-tight">{project.result}</span>
            </div>
          </div>
        </div>

        {/* Featured Media */}
        <div className="mx-auto max-w-7xl px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl cursor-zoom-in"
            onClick={() => openLightbox(0)}
          >
            {project.image_url?.toLowerCase().match(/\.(mp4|webm|ogg|mov|avi)$/) || project.image_url?.includes('/video') ? (
              <video 
                src={project.image_url} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                autoPlay 
                muted 
                loop 
                playsInline 
              />
            ) : (
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 scale-90 group-hover:scale-100 transition-transform">
                  <Maximize2 className="text-white w-8 h-8" />
               </div>
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black tracking-tight mb-6">About the project</h2>
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {project.description}
            </div>

            {/* Gallery Grid */}
            {project.gallery_urls && project.gallery_urls.length > 0 && (
              <div className="mt-20">
                <h3 className="text-2xl font-bold mb-8">Process & Documentation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.gallery_urls.map((url, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative group aspect-square rounded-3xl overflow-hidden border border-border cursor-zoom-in"
                      onClick={() => openLightbox(idx + 1)}
                    >
                      {url.toLowerCase().match(/\.(mp4|webm|ogg|mov|avi)$/) || url.includes('/video') ? (
                        <video src={url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={url} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="text-white w-6 h-6" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-secondary/30 rounded-3xl p-8 border border-border/50 sticky top-32">
              <h3 className="text-xl font-bold mb-6">Project Info</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-1">Company / Client</label>
                  <p className="font-bold text-lg">{project.title}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-1">Impact</label>
                  <p className="font-black text-lg text-primary">{project.result}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest font-black text-muted-foreground block mb-1">Category</label>
                  <p className="font-bold text-lg">{project.category}</p>
                </div>
              </div>

              {project.external_url && (
                <Button 
                  className="w-full mt-10 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg gap-3"
                  onClick={() => window.open(project.external_url, '_blank')}
                >
                  Visit Project <ExternalLink size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-5xl px-6 mt-32">
           <div className="bg-primary/5 rounded-[3rem] p-12 sm:p-20 border border-primary/10 text-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
              
              <h2 className="text-4xl sm:text-5xl font-black tracking-tightest mb-8">Ready to achieve similar <span className="text-gradient">results</span>?</h2>
              <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
                Let's discuss how we can implement a custom AI solution tailored to your operational goals.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/booking")}
                className="h-16 px-10 rounded-full bg-primary text-primary-foreground text-xl font-black glow-primary"
              >
                Schedule a Consultation
              </Button>
           </div>
        </div>
      </main>

      <MediaLightbox 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
        media={allMedia}
        initialIndex={activeMediaIndex}
      />

      <Footer />
    </div>
  );
};

export default ProjectDetail;
