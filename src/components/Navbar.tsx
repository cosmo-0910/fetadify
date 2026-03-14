import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { useTheme } from "./ThemeProvider";

const Navbar = ({ onBookClick }: { onBookClick: () => void }) => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Fetadify Logo" className="h-8 md:h-10 w-auto transition-all" />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/services" className="hover:text-foreground transition-colors font-medium">Services</a>
          <a href="/pricing" className="hover:text-foreground transition-colors font-medium">Pricing</a>
          <a href="/blog" className="hover:text-foreground transition-colors font-medium">Blog</a>
          <a href="/#why" className="hover:text-foreground transition-colors font-medium">Why Us</a>
          <a href="/booking" className="hover:text-foreground transition-colors font-medium">Book</a>
          
          <div className="flex items-center gap-1 border border-border rounded-full p-1 bg-secondary/50">
            <button 
              onClick={() => setTheme("light")} 
              className={cn("p-1.5 rounded-full transition-all", theme === "light" ? "bg-background text-primary shadow-sm" : "hover:text-foreground")}
            >
              <Sun size={14} />
            </button>
            <button 
              onClick={() => setTheme("dark")} 
              className={cn("p-1.5 rounded-full transition-all", theme === "dark" ? "bg-background text-primary shadow-sm" : "hover:text-foreground")}
            >
              <Moon size={14} />
            </button>
            <button 
              onClick={() => setTheme("system")} 
              className={cn("p-1.5 rounded-full transition-all", theme === "system" ? "bg-background text-primary shadow-sm" : "hover:text-foreground")}
            >
              <Monitor size={14} />
            </button>
          </div>

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
              <a href="/blog" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>Blog</a>
              <a href="/#why" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>Why Us</a>
              <a href="/booking" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpen(false)}>Book</a>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Appearance</span>
              <div className="flex items-center gap-1 border border-border rounded-full p-1 bg-secondary/50">
                <button 
                  onClick={() => setTheme("light")} 
                  className={cn("p-2 rounded-full transition-all", theme === "light" ? "bg-background text-primary shadow-sm" : "text-muted-foreground")}
                >
                  <Sun size={16} />
                </button>
                <button 
                  onClick={() => setTheme("dark")} 
                  className={cn("p-2 rounded-full transition-all", theme === "dark" ? "bg-background text-primary shadow-sm" : "text-muted-foreground")}
                >
                  <Moon size={16} />
                </button>
                <button 
                  onClick={() => setTheme("system")} 
                  className={cn("p-2 rounded-full transition-all", theme === "system" ? "bg-background text-primary shadow-sm" : "text-muted-foreground")}
                >
                  <Monitor size={16} />
                </button>
              </div>
            </div>
            <div className="pt-4">
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
