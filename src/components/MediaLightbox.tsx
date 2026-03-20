import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  media: string[];
  initialIndex?: number;
}

export const MediaLightbox = ({ isOpen, onClose, media, initialIndex = 0 }: MediaLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

  if (!isOpen) return null;

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia?.toLowerCase().match(/\.(mp4|webm|ogg|mov|avi)$/) || currentMedia?.includes('/video');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm px-4"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-6 right-6 text-white hover:bg-white/10 z-[110]"
          onClick={onClose}
        >
          <X size={32} />
        </Button>

        {media.length > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-6 text-white hover:bg-white/10 z-[110] hidden md:flex"
              onClick={prev}
            >
              <ChevronLeft size={48} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-6 text-white hover:bg-white/10 z-[110] hidden md:flex"
              onClick={next}
            >
              <ChevronRight size={48} />
            </Button>
          </>
        )}

        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
        >
          {isVideo ? (
            <video 
              src={currentMedia} 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              autoPlay
              controls
              playsInline
            />
          ) : (
            <img 
              src={currentMedia} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          )}

          <div className="absolute -bottom-10 left-0 right-0 text-center text-white/60 text-sm">
            {currentIndex + 1} / {media.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
