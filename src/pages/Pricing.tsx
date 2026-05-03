import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Check, ArrowRight, Mail, Loader2, Download, Info } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_custom_price?: boolean;
}

const Pricing = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instructions: "",
  });
  const [serviceRequirements, setServiceRequirements] = useState<{[key: string]: string}>({});
  
  const navigate = useNavigate();
  const openBooking = () => navigate("/booking");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleViewDetails = (service: Service) => {
    setSelectedServiceDetails(service);
    setShowServiceDetails(true);
  };

  const handleQuoteRequest = () => {
    if (selectedServices.length === 0) {
      toast.error("Please select at least one service to get a quote.");
      return;
    }
    setShowQuoteForm(true);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare detailed requirements
      const detailedRequirements = selectedServices.map(serviceId => {
        const service = services.find(s => s.id === serviceId);
        return {
          service: service?.title || '',
          requirements: serviceRequirements[serviceId] || ''
        };
      });

      // Save to bookings table as a proxy for quote requests
      const { error } = await supabase
        .from("bookings")
        .insert({
          full_name: formData.name,
          email: formData.email,
          service: selectedServices.map(id => services.find(s => s.id === id)?.title).join(", "),
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Quote request submitted successfully! We will contact you soon.");

      // Reset form
      setFormData({ name: "", email: "", instructions: "" });
      setShowQuoteForm(false);
      setSelectedServices([]);
      setServiceRequirements({});

    } catch (error: any) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIcon = (name: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className || "w-6 h-6"} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onBookClick={openBooking} />
        <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground animate-pulse">Loading premium services...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={openBooking} />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-16 h-16 mx-auto text-primary mb-6" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Service Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Select the services you need and get a customized quote for your project.
            </p>
            <div className="text-xs text-muted-foreground bg-secondary/30 border border-border/50 rounded-full px-4 py-2 inline-block">
              <strong>Note:</strong> Final pricing is customized based on your specific requirements and project scale.
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={`group relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden ${
                  selectedServices.includes(service.id) ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => toggleService(service.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl transition-colors ${
                      selectedServices.includes(service.id) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary group-hover:bg-primary/10'
                    }`}>
                      {renderIcon(service.icon_name, "w-6 h-6")}
                    </div>
                    {selectedServices.includes(service.id) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="w-6 h-6 text-primary bg-primary/10 rounded-full p-1" />
                      </motion.div>
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">{service.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2 min-h-[40px]">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(service);
                      }}
                      className="text-xs font-semibold hover:bg-primary/10 hover:text-primary"
                    >
                      Learn More <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {service.is_custom_price !== false ? "Custom Quote" : "Starting Price"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Services Summary */}
          {selectedServices.length > 0 && !showQuoteForm && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Card className="glass border-primary/30 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Check className="w-6 h-6 text-primary" />
                    Project Scope Summary
                  </CardTitle>
                  <CardDescription>
                    {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 mb-8">
                    {selectedServices.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      
                      return service ? (
                        <div key={serviceId} className="flex flex-col gap-2 p-4 rounded-xl bg-secondary/20 border border-border/50">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold flex items-center gap-2">
                              {renderIcon(service.icon_name, "w-4 h-4 text-primary")}
                              {service.title}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-background rounded-md">
                              {service.is_custom_price !== false ? "Estimate Required" : "Fixed Price"}
                            </span>
                          </div>
                          <div>
                            <Label htmlFor={`requirements-${serviceId}`} className="text-xs text-muted-foreground mb-1 block">
                              Briefly describe your requirements for this service:
                            </Label>
                            <Textarea
                              id={`requirements-${serviceId}`}
                              placeholder={`E.g. "I need a 5-page business website with e-commerce functionality..."`}
                              value={serviceRequirements[serviceId] || ""}
                              onChange={(e) => setServiceRequirements(prev => ({
                                ...prev,
                                [serviceId]: e.target.value
                              }))}
                              rows={2}
                              className="bg-background/50 text-sm focus:ring-primary/30"
                            />
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  <div className="text-center mb-8 p-6 bg-primary/5 rounded-2xl border border-dashed border-primary/30">
                    <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Our experts will analyze your requirements to provide a tailored investment plan.
                    </p>
                  </div>

                  <Button size="lg" className="w-full h-14 text-lg group bg-primary hover:bg-primary/90 glow-primary font-bold" onClick={handleQuoteRequest}>
                    Request Custom Quote
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quote Form */}
          {showQuoteForm && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card className="glass border-primary/30 max-w-2xl mx-auto overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Mail className="w-6 h-6 text-primary" />
                    Contact & Delivery Info
                  </CardTitle>
                  <CardDescription>
                    Provide your details and we'll send your project estimate within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmitQuote} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="John Doe"
                          required
                          disabled={isSubmitting}
                          className="h-11 bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                          required
                          disabled={isSubmitting}
                          className="h-11 bg-background/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
                      <Textarea
                        id="instructions"
                        value={formData.instructions}
                        onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Project deadline, preferred tech stack, or any other constraints..."
                        rows={4}
                        disabled={isSubmitting}
                        className="bg-background/50"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="flex-1 h-12 bg-primary hover:bg-primary/90 glow-primary font-bold" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Quote Request
                            <Download className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="lg" 
                        className="h-12 border-primary/20 hover:bg-primary/5 font-semibold"
                        onClick={() => setShowQuoteForm(false)}
                        disabled={isSubmitting}
                      >
                        Go Back
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {selectedServices.length === 0 && !showQuoteForm && (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl mt-12 bg-secondary/10">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-2">Build Your Solution</h3>
              <p className="text-muted-foreground text-lg">
                Choose the building blocks for your next digital breakthrough.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Service Details Dialog */}
      <Dialog open={showServiceDetails} onOpenChange={setShowServiceDetails}>
        <DialogContent className="max-w-2xl bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              {selectedServiceDetails && renderIcon(selectedServiceDetails.icon_name, "w-6 h-6 text-primary")}
              {selectedServiceDetails?.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              Learn more about how we deliver this service.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4 mt-4">
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Service Overview
                </h4>
                <p className="text-muted-foreground leading-relaxed">{selectedServiceDetails?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <h5 className="font-bold mb-1">Standard Delivery</h5>
                  <p className="text-xs text-muted-foreground">High-quality execution following industry best practices.</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <h5 className="font-bold mb-1">Scalable Results</h5>
                  <p className="text-xs text-muted-foreground">Built with future growth and expansion in mind.</p>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex gap-4 pt-6 mt-6 border-t border-border">
            <Button 
              className="flex-1 h-11 font-bold glow-primary" 
              onClick={() => {
                if (selectedServiceDetails && !selectedServices.includes(selectedServiceDetails.id)) {
                  toggleService(selectedServiceDetails.id);
                }
                setShowServiceDetails(false);
              }}
            >
              {selectedServiceDetails && selectedServices.includes(selectedServiceDetails.id) ? 
                'Service Selected' : 'Add to My Project'
              }
            </Button>
            <Button variant="outline" className="h-11 border-primary/20 font-semibold" onClick={() => setShowServiceDetails(false)}>
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
