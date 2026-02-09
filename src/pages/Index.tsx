import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => setBookingOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookClick={openBooking} />
      <Hero onBookClick={openBooking} />
      <Services onBookClick={openBooking} />
      <WhyUs />
      <Footer />
      <BookingForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
};

export default Index;
