import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Testimonials from "@/components/Testimonials";
import Process from "@/components/Process";
import AIAgentDemo from "@/components/AIAgentDemo";
import WhyUs from "@/components/WhyUs";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const openBooking = () => navigate("/booking");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onBookClick={openBooking} />
      <Hero onBookClick={openBooking} />
      <AIAgentDemo />
      <Services onBookClick={openBooking} />
      <Work />
      <Process />
      <WhyUs />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
