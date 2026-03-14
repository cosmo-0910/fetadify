import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Clock, CreditCard, Layout, Milestone, CheckSquare, MessageSquare, Send, ShieldCheck, Lock, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProjectData {
  id: string;
  full_name: string;
  email: string;
  service: string;
  status: string;
  created_at: string;
  // Progress and price are not in the current bookings schema, we'll use defaults
  progress?: number;
  service_price?: number;
  currency?: string;
}

const ProjectTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const openBooking = () => navigate("/booking");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Enhance with defaults for fields not in schema
        setProject({
          ...data,
          progress: data.progress || 25,
          service_price: data.service_price || 0,
          currency: data.currency || 'USD'
        });

      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Project Not Found</h1>
        <p className="text-muted-foreground">The tracking link might be invalid or expired.</p>
        <Button onClick={() => navigate("/")} variant="outline" className="mt-4">
          Return Home
        </Button>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={openBooking} />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-32">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 hover:bg-secondary/50 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <div className="mb-12 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`uppercase tracking-widest text-[10px] py-1 px-3 ${getStatusColor(project.status)}`}>
              {project.status}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground font-mono">ID: #{project.id.substring(0, 8).toUpperCase()}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Project Status: {project.full_name}
          </h1>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {project.service.split(',').map((s, i) => (
              <Badge key={i} variant="secondary" className="bg-secondary/50 hover:bg-secondary border-border text-foreground py-1 px-3">
                {s.trim()}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass border-primary/20 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Milestone className="h-5 w-5 text-primary" />
                  Development Progress
                </CardTitle>
                <CardDescription>Real-time technical benchmarks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-bold text-primary">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-4 bg-secondary" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 font-bold">
                      <Clock className="h-3 w-3" /> Target Date
                    </p>
                    <p className="text-xl font-bold">On Schedule</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 font-bold">
                      <ShieldCheck className="h-3 w-3" /> QA Status
                    </p>
                    <p className="text-xl font-bold">Scanning...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                <Layout className="h-5 w-5 text-primary" />
                Project Roadmap
              </h3>
              
              <div className="space-y-3">
                {[
                  { desc: "Initial Consultation & Scope Analysis", completed: true },
                  { desc: "Design & Architectural Prototyping", completed: project.status === 'confirmed' },
                  { desc: "Core Development & Engineering Phase", completed: false },
                  { desc: "Testing, Optimization & Final Deployment", completed: false },
                ].map((task, i) => (
                  <div
                    key={i}
                    className={`group p-4 rounded-2xl border transition-all duration-300 ${
                      task.completed 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-secondary/20 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        task.completed ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'
                      }`}>
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <span className={`text-sm md:text-base font-medium ${task.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {task.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="glass border-primary/20 relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Total Quote</p>
                      <p className="text-2xl font-black">Custom</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3 font-bold uppercase">Recent Activity</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-[9px] border-primary/20 bg-primary/5">Project Initiated</Badge>
                      </div>
                      {project.status === 'confirmed' && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Today</span>
                          <Badge variant="outline" className="text-[9px] border-green-500/20 bg-green-500/5">Confirmed</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 font-bold bg-primary hover:bg-primary/90 glow-primary"
                  onClick={() => navigate(`/invoice/${project.id}`)}
                >
                  View Digital Invoice
                </Button>
              </CardContent>
            </Card>

            <div className="p-6 rounded-2xl glass border border-primary/20 flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bold text-lg tracking-tight">Project Support</h4>
              <p className="text-sm text-muted-foreground">
                Need to speak with our engineering team? Join the priority support channel.
              </p>
              <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                Join Secure Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectTracking;
