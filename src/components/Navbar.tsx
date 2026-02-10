import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Navbar = ({ onBookClick }: { onBookClick: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Fetadify Logo" className="h-10 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/services" className="hover:text-foreground transition-colors">Services</a>
          <a href="/#why" className="hover:text-foreground transition-colors">Why Us</a>
          <a href="/booking" className="hover:text-foreground transition-colors">Book</a>
          <Button onClick={onBookClick} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            Get Started
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border bg-background px-6 py-4 space-y-4"
        >
          <a href="/services" className="block text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>Services</a>
          <a href="/#why" className="block text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>Why Us</a>
          <a href="/booking" className="block text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>Book</a>
          <Button onClick={() => { onBookClick(); setOpen(false); }} className="w-full bg-primary text-primary-foreground">Get Started</Button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
