import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle, Clock } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features?: string[];
  image_url?: string;
  content?: string;
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setService(data);
      } catch (err) {
        console.error("Error fetching service details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name];
    return Icon || HelpCircle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 bg-primary/20 rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Service Not Found</h1>
        <Button onClick={() => navigate("/services")} variant="outline">
          Back to Services
        </Button>
      </div>
    );
  }

  const Icon = getIcon(service.icon_name);
  let fakedContent = "";
  if (!service.content) {
    const dummySection = `
## Overview

Our **${service.title}** services are designed to address the complex challenges of modern infrastructure and spatial analysis. By leveraging advanced technologies and industry-leading best practices, we deliver scalable, robust, and highly efficient solutions tailored to your unique operational requirements.

### Strategic Implementation

We begin by thoroughly analyzing your existing systems and understanding your strategic goals. This allows us to architect a solution that not only meets your current needs but also provides a flexible foundation for future growth. Our approach incorporates rigorous testing, detailed documentation, and continuous integration to ensure the highest level of quality and reliability.

1. **Comprehensive Analysis**: We assess your spatial data needs and operational workflows.
2. **Custom Architecture**: Designing robust solutions using state-of-the-art frameworks.
3. **Agile Development**: Iterative implementation with regular feedback loops.
4. **Seamless Deployment**: Ensuring smooth transitions and minimal downtime.

### Advanced Capabilities and Integration

Our team specializes in integrating diverse data sources and building intuitive interfaces that empower your users. Whether it's real-time environmental monitoring, complex land mapping, or enterprise-level infrastructure management, we bring deep expertise to every facet of the project.

- **Real-time Analytics**: Process and visualize data as it happens.
- **Cross-platform Compatibility**: Access your tools from desktop, web, or mobile environments.
- **High-performance Processing**: Efficient handling of large-scale datasets.
- **Secure Architecture**: Industry-standard security protocols to protect your sensitive data.

### Long-term Support and Evolution

Technology is constantly evolving, and so are your business needs. We provide ongoing support, regular maintenance, and iterative upgrades to ensure your systems remain at the cutting edge. Our dedicated team is always available to troubleshoot issues, implement new features, and optimize performance.

Partner with us to transform your data into actionable insights and drive meaningful progress in your organization. Our commitment to excellence and innovation ensures that your investment in ${service.title} yields significant and sustained returns.
    `.trim();

    fakedContent = service.description + '\n\n' + dummySection + '\n\n' + dummySection + '\n\n' + dummySection; // Tripled to simulate 5-10min read
  }

  const textContent = service.content || fakedContent;
  const readTime = Math.max(1, Math.ceil(textContent.split(' ').length / 200));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={() => navigate("/booking")} />
      
      <main className="pt-32 pb-24 min-h-[80vh]">
        {/* Header Section */}
        <div className="mx-auto max-w-4xl px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate("/services")} 
              className="hover:bg-white/5 group -ml-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to all services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center sm:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-8 border border-primary/20">
              <Icon size={12} /> {service.title}
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black tracking-tightest mb-10 leading-[1.1] text-balance">
              {service.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 text-sm text-muted-foreground bg-secondary/30 p-6 rounded-3xl border border-border/50 backdrop-blur-sm">
              <div className="flex flex-col gap-1 text-primary">
                <p className="text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Clock size={12} /> Est. Read Time
                </p>
                <p className="font-black text-lg">{readTime} min</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-6xl px-6 mb-16"
        >
          <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
            <img 
              src={service.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"} 
              alt={service.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <div className="mx-auto max-w-4xl px-6 space-y-12">
          {/* Content Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none 
              prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tighter
              prose-h1:text-5xl prose-h1:mb-8
              prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-primary/20
              prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-primary/90
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-foreground prose-strong:font-bold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-3xl prose-img:shadow-2xl"
          >
            {textContent.split('\n').map((line, idx) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return <div key={idx} className="h-4" />;

              if (trimmedLine.startsWith('### ')) {
                return <h3 key={idx}>{trimmedLine.replace('### ', '')}</h3>;
              }
              if (trimmedLine.startsWith('## ')) {
                return <h2 key={idx}>{trimmedLine.replace('## ', '')}</h2>;
              }
              if (trimmedLine.startsWith('# ')) {
                return <h1 key={idx}>{trimmedLine.replace('# ', '')}</h1>;
              }

              return (
                <p key={idx}>
                  {trimmedLine.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </p>
              );
            })}
          </motion.div>

          {/* Features Section */}
          {service.features && service.features.length > 0 && (
            <div className="bg-primary/5 rounded-[2rem] p-8 sm:p-12 border border-primary/10">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-primary" />
                Key Capabilities & Features
              </h3>
              <ul className="grid gap-6 sm:grid-cols-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0 shadow-[0_0_12px_rgba(var(--primary),0.8)]" />
                    <span className="text-lg text-foreground/90 leading-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA Action */}
          <div className="pt-12 border-t border-border/50 flex flex-col sm:flex-row gap-6 items-center justify-between mt-8">
            <div>
              <h4 className="text-2xl font-bold mb-2">Ready to start?</h4>
              <p className="text-muted-foreground">Book this specific service online and let's get to work.</p>
            </div>
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 h-14 px-8 text-lg font-semibold"
              onClick={() => navigate("/booking")}
            >
              Book {service.title}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
