import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import ServicesPage from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ProjectTracking from "./pages/ProjectTracking";
import InvoiceViewer from "./pages/InvoiceViewer";
import Maintenance from "./pages/Maintenance";

import { ThemeProvider } from "./components/ThemeProvider";

import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import ReviewSubmission from "./pages/ReviewSubmission";

import { useVisitorTracking } from "./hooks/useVisitorTracking";

const queryClient = new QueryClient();

const App = () => {
  useVisitorTracking();
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="fetadify-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              <Route path="/booking" element={<Booking />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/tracker/:id" element={<ProjectTracking />} />
            <Route path="/invoice/:id" element={<InvoiceViewer />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/reviews/submit" element={<ReviewSubmission />} />
              
              {/* Admin Routes moved to Standalone Admin Portal */}
    
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
