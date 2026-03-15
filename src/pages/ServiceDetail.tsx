import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features?: string[];
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={() => navigate("/booking")} />
      
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-[80vh]">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/services")} 
          className="mb-8 hover:bg-white/5 group -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all services
        </Button>

        <div className="space-y-12">
          {/* Header */}
          <header className="space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/5">
              <Icon size={40} />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              {service.title}
            </h1>
          </header>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

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
          <div className="pt-12 border-t border-border/50 flex flex-col sm:flex-row gap-6 items-center justify-between">
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
