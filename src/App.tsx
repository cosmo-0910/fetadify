import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import ServicesPage from "./pages/Services";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              {/* Placeholder for other admin modules */}
              <Route path="services" element={<ServicesManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="replies" element={<AIRepliesManager />} />
              <Route path="messages" element={<MessagesManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="bookings" element={<BookingsManager />} />
            </Route>
  
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
