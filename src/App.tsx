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
import { AdminLayout } from "./components/admin/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ServicesManager from "./pages/admin/ServicesManager";
import ProjectsManager from "./pages/admin/ProjectsManager";
import BookingsManager from "./pages/admin/BookingsManager";
import AIRepliesManager from "./pages/admin/AIRepliesManager";
import MessagesManager from "./pages/admin/MessagesManager";
import UsersManager from "./pages/admin/UsersManager";
import BlogPostsManager from "./pages/admin/BlogPostsManager";
import AnalyticsManager from "./pages/admin/AnalyticsManager";
import SubscribersManager from "./pages/admin/SubscribersManager";
import SupportManager from "./pages/admin/SupportManager";
import OrdersManager from "./pages/admin/OrdersManager";
import SettingsManager from "./pages/admin/SettingsManager";

import InvoicesManager from "./pages/admin/InvoicesManager";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ProjectTracking from "./pages/ProjectTracking";
import InvoiceViewer from "./pages/InvoiceViewer";
import Maintenance from "./pages/Maintenance";

import { ThemeProvider } from "./components/ThemeProvider";
import TestimonialsManager from "./pages/admin/TestimonialsManager";

import Portfolio from "./pages/Portfolio";
import ReviewSubmission from "./pages/ReviewSubmission";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="fetadify-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
              {window.location.hostname.includes("admin") ? (
                <Route path="/" element={<Navigate to="/admin/login" replace />} />
              ) : (
                <Route path="/" element={<Index />} />
              )}
              
              <Route path="/booking" element={<Booking />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/tracker/:id" element={<ProjectTracking />} />
            <Route path="/invoice/:id" element={<InvoiceViewer />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/admin/login" element={<Login />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/reviews/submit" element={<ReviewSubmission />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="blog" element={<BlogPostsManager />} />
                <Route path="analytics" element={<AnalyticsManager />} />
                <Route path="subscribers" element={<SubscribersManager />} />
                <Route path="support" element={<SupportManager />} />
                <Route path="orders" element={<OrdersManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="invoices" element={<InvoicesManager />} />
                <Route path="messages" element={<MessagesManager />} />
                <Route path="users" element={<UsersManager />} />
                <Route path="bookings" element={<BookingsManager />} />
                <Route path="settings" element={<SettingsManager />} />
              </Route>
    
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
