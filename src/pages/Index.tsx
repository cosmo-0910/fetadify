import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const openBooking = () => navigate("/booking");

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={openBooking} />
      <Hero onBookClick={openBooking} />
      <Services onBookClick={openBooking} />
      <WhyUs />
      <Footer />
    </div>
  );
};

export default Index;
