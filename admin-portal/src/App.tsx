import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/admin/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServicesManager from "./pages/ServicesManager";
import ProjectsManager from "./pages/ProjectsManager";
import BookingsManager from "./pages/BookingsManager";
import AIRepliesManager from "./pages/AIRepliesManager";
import MessagesManager from "./pages/MessagesManager";
import UsersManager from "./pages/UsersManager";
import BlogPostsManager from "./pages/BlogPostsManager";
import AnalyticsManager from "./pages/AnalyticsManager";
import SubscribersManager from "./pages/SubscribersManager";
import SupportManager from "./pages/SupportManager";
import OrdersManager from "./pages/OrdersManager";
import SettingsManager from "./pages/SettingsManager";
import InvoicesManager from "./pages/InvoicesManager";
import TestimonialsManager from "./pages/TestimonialsManager";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="fetadify-admin-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/admin/login" element={<Login />} />
              
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
              
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
