import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import ServicesPage from "./pages/Services";
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

import { ThemeProvider } from "./components/ThemeProvider";
import TestimonialsManager from "./pages/admin/TestimonialsManager";

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
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/reviews/submit" element={<ReviewSubmission />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="replies" element={<AIRepliesManager />} />
                <Route path="messages" element={<MessagesManager />} />
                <Route path="users" element={<UsersManager />} />
                <Route path="bookings" element={<BookingsManager />} />
                <Route path="blog" element={<BlogPostsManager />} />
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
