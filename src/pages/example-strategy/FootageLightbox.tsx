import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface FootageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  title: string;
}

export const FootageLightbox: React.FC<FootageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
  title,
}) => {
  const total = images.length;
  const currentSrc = images[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} footage viewer`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0A0A0A]/95 p-4 sm:p-6 md:p-8 backdrop-blur-md select-none"
        >
          {/* Top Bar: Title, Counter, and Close Button */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-between pb-3 border-b border-[rgba(239,232,216,0.12)] text-[#EFE8D8]"
          >
            <div className="flex items-center gap-3">
              <span className="font-sentient font-bold italic text-base sm:text-lg">
                {title}
              </span>
              <span className="text-[#EFE8D8]/30">/</span>
              <span className="font-mono text-xs text-[#EFE8D8]/70 tracking-widest">
                {String(currentIndex + 1).padStart(2, '0')} · {String(total).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="flex items-center gap-1.5 text-micro tracking-[0.2em] uppercase text-[#EFE8D8]/70 hover:text-[#D7261E] transition-colors py-2 px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#EFE8D8]"
            >
              <span className="hidden sm:inline">Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Photo Display Area */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 w-full flex items-center justify-center py-4 overflow-hidden"
          >
            {/* Prev button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-[#111111]/80 hover:bg-[#D7261E] text-[#EFE8D8] border border-[rgba(239,232,216,0.15)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#EFE8D8]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Current Image with slide transition (1080 x 1920 px format) */}
            <div className="relative max-h-[82dvh] aspect-[1080/1920] max-w-[88vw] flex items-center justify-center">
              <motion.img
                key={currentIndex}
                src={currentSrc}
                alt={`${title} footage photo ${currentIndex + 1} (1080x1920)`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onError={(e) => {
                  // Fallback for missing local assets
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                className="h-full w-full object-cover rounded-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-[rgba(239,232,216,0.18)]"
              />

              {/* Graceful Fallback Placeholder if image file is missing */}
              <div
                style={{ display: 'none' }}
                className="w-full h-full aspect-[1080/1920] bg-[#141414] border border-[rgba(239,232,216,0.18)] rounded-[6px] flex flex-col items-center justify-center p-6 text-center select-none"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#EFE8D8]/80 mb-3">
                  <span className="font-mono text-xs">📷</span>
                </div>
                <span className="font-mono text-[10px] text-[#EFE8D8]/45 tracking-widest mb-1">
                  1080 × 1920 PX
                </span>
                <span className="font-sentient font-bold text-sm text-[#EFE8D8] mb-1">
                  Footage Snapshot #{currentIndex + 1}
                </span>
                <span className="font-poppins text-xs text-[#EFE8D8]/50 max-w-[260px] truncate">
                  {currentSrc.split('/').pop()}
                </span>
              </div>
            </div>

            {/* Next button */}
            {total > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-[#111111]/80 hover:bg-[#D7261E] text-[#EFE8D8] border border-[rgba(239,232,216,0.15)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#EFE8D8]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Instructions & Dots */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-between pt-3 border-t border-[rgba(239,232,216,0.12)] text-micro text-[#EFE8D8]/50"
          >
            <span className="hidden sm:inline tracking-wider">
              Use ← / → keys to navigate · ESC to exit
            </span>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onNavigate(idx)}
                  aria-label={`Jump to photo ${idx + 1}`}
                  className={`h-1.5 transition-all rounded-full ${
                    idx === currentIndex
                      ? 'w-6 bg-[#D7261E]'
                      : 'w-1.5 bg-[#EFE8D8]/30 hover:bg-[#EFE8D8]/70'
                  }`}
                />
              ))}
            </div>

            <span className="tracking-widest tabular-nums">
              {currentIndex + 1} OF {total}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
