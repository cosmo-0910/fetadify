import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          <img src={logo} alt="Fetadify Logo" className="h-8 md:h-10 w-auto transition-all" />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/services" className="hover:text-foreground transition-colors font-medium">Services</a>
          <a href="/#why" className="hover:text-foreground transition-colors font-medium">Why Us</a>
          <a href="/booking" className="hover:text-foreground transition-colors font-medium">Book</a>
          <Button onClick={onBookClick} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold">
            Get Started
          </Button>
        </div>

        <button className="md:hidden text-foreground p-2 -mr-2" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-6 py-8 space-y-6 overflow-hidden"
          >
            <div className="flex flex-col gap-6">
              <a href="/services" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>Services</a>
              <a href="/#why" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>Why Us</a>
              <a href="/booking" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>Book</a>
            </div>
            <div className="pt-4 border-t border-border/50">
              <Button onClick={() => { onBookClick(); setOpen(false); }} className="w-full bg-primary text-primary-foreground h-12 text-base font-semibold glow-primary">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
