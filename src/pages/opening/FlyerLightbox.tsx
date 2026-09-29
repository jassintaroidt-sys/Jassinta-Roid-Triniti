import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FlyerLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title: string;
}

export const FlyerLightbox: React.FC<FlyerLightboxProps> = ({
  isOpen,
  onClose,
  src,
  alt,
  title,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Flyer Artwork View'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]/95 p-4 md:p-8 backdrop-blur-md select-none"
        >
          <div
            ref={containerRef}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center max-w-[92vw] max-h-[90dvh]"
          >
            {/* Top Bar with title and Close button */}
            <div className="w-full flex items-center justify-between pb-3 text-micro text-[#EFE8D8]/70 border-b border-[rgba(239,232,216,0.1)] mb-4">
              <span className="truncate max-w-[70vw] font-poppins font-medium tracking-widest uppercase">
                {title || 'Featured Artwork'}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close artwork view"
                className="group flex items-center gap-1.5 text-micro tracking-widest text-[#EFE8D8] hover:text-[#D7261E] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#EFE8D8]"
              >
                <span>Close</span>
                <span className="font-mono text-xs opacity-60 group-hover:opacity-100">[ESC]</span>
              </button>
            </div>

            {/* Poster Image with elegant border & shadow */}
            <div className="relative overflow-hidden bg-[#141414] shadow-2xl border border-[rgba(239,232,216,0.2)] max-h-[76dvh] rounded-[2px]">
              <img
                src={src}
                alt={alt}
                className="w-auto h-auto max-h-[76dvh] max-w-[85vw] object-contain"
                onError={(e) => {
                  // Fallback for missing asset
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.fallback-box');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="fallback-box hidden flex-col items-center justify-center p-12 text-center aspect-[4/5] w-[320px] max-w-full">
                <span className="font-sentient text-lg text-[#EFE8D8] mb-2">[ Artwork Poster ]</span>
                <span className="text-micro text-[#EFE8D8]/60">{alt}</span>
              </div>
            </div>

            <div className="pt-3 text-[11px] font-poppins text-[#EFE8D8]/40 tracking-wider">
              Lassiewear Special Occasions · 1080 × 1350
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
