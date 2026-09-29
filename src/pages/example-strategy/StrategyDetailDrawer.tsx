import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, ExternalLink, Eye } from 'lucide-react';
import { StrategyItem, strategy } from '../../data/content';
import { VideoOnView } from '../../components/VideoOnView';
import { FootageLightbox } from './FootageLightbox';
import { CounterNumber, KineticTitle } from './KineticText';
import { cn } from '../../lib/cn';

interface StrategyDetailDrawerProps {
  item: StrategyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPillar: (item: StrategyItem) => void;
}

export const StrategyDetailDrawer: React.FC<StrategyDetailDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onSelectPillar,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const currentIndex = item ? strategy.findIndex((s) => s.slug === item.slug) : -1;
  const total = strategy.length;
  const prevPillar = currentIndex >= 0 ? strategy[(currentIndex - 1 + total) % total] : strategy[0];
  const nextPillar = currentIndex >= 0 ? strategy[(currentIndex + 1) % total] : strategy[0];

  // Lock body scroll and handle keyboard navigation (ESC, Arrow keys)
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && nextPillar) {
        onSelectPillar(nextPillar);
      } else if (e.key === 'ArrowLeft' && prevPillar) {
        onSelectPillar(prevPillar);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, lightboxIndex, nextPillar, prevPillar, onClose, onSelectPillar]);

  if (!item) return null;

  // Format footage as objects for lightbox
  const footagePhotos = item.footage.map((src, i) => ({
    src,
    caption: `${item.label} · Production Still 0${i + 1}`,
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Slide-over In-Depth Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-5xl h-[100dvh] bg-[#0A0A0A] border-l border-[rgba(239,232,216,0.15)] text-[#EFE8D8] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden select-none"
          >
            {/* Drawer Top Navigation Bar */}
            <header className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-[rgba(239,232,216,0.1)] shrink-0 bg-[#0E0E0E]/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#D7261E] animate-pulse" />
                <span className="font-mono text-micro text-[#EFE8D8]/50 tabular-nums">
                  0{currentIndex + 1} / 04
                </span>
                <span className="text-[rgba(239,232,216,0.2)]">|</span>
                <span className="font-sentient font-bold text-sm sm:text-base tracking-wider text-[#EFE8D8] uppercase">
                  {item.label} Pillar
                </span>
              </div>

              {/* Navigation Switchers & Close Button */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1 border border-[rgba(239,232,216,0.15)] rounded-full p-1 bg-black/40">
                  <button
                    type="button"
                    onClick={() => onSelectPillar(prevPillar)}
                    aria-label="Previous strategy pillar"
                    className="p-1.5 text-[#EFE8D8]/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    title={prevPillar.label}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPillar(nextPillar)}
                    aria-label="Next strategy pillar"
                    className="p-1.5 text-[#EFE8D8]/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    title={nextPillar.label}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close strategy details"
                  data-cursor="CLOSE"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#D7261E] text-[#EFE8D8] text-micro uppercase tracking-widest transition-colors cursor-pointer group"
                >
                  <span className="font-mono text-xs opacity-70 group-hover:opacity-100">✕</span>
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </header>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-12 py-8 no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: 1080x1920 Reference Video Stage */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-xl overflow-hidden bg-[#141414] border border-[rgba(239,232,216,0.2)] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                    <VideoOnView
                      src={item.video}
                      poster={item.poster}
                      aspect="9/16"
                      className="w-full h-full object-cover"
                      cursorLabel="PLAY"
                    />

                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 font-mono text-[9px] text-[#EFE8D8]/80 uppercase tracking-widest pointer-events-none">
                      1080 × 1920 HD
                    </div>
                  </div>

                  <span className="mt-3 font-poppins text-micro text-[#EFE8D8]/50 tracking-wider text-center">
                    Original Reference Footage · {item.label}
                  </span>
                </div>

                {/* Right Column: In-Depth Narrative, Key Metrics, Breakdown & Photo Gallery */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Headline & Subtitle */}
                  <div>
                    <span className="font-poppins text-micro text-[#D7261E] uppercase tracking-[0.25em] font-semibold">
                      Strategy Pillar · 0{currentIndex + 1}
                    </span>
                    <h2 className="font-sentient text-2xl sm:text-4xl lg:text-5xl font-bold italic text-[#EFE8D8] mt-1 leading-[1.05] tracking-tight">
                      {item.label}
                    </h2>
                    <p className="font-poppins text-sm sm:text-base text-[#EFE8D8]/70 mt-3.5 leading-relaxed font-normal">
                      {item.about}
                    </p>
                  </div>

                  {/* Best Paragraph (accentuated highlight) */}
                  <div className="pl-4 border-l-2 border-[#D7261E]/80 py-1.5 bg-white/[0.01]">
                    <p className="font-poppins text-xs sm:text-sm text-[#EFE8D8] leading-relaxed italic">
                      "{item.best}"
                    </p>
                  </div>

                  {/* Quantitative Impact / Results Block */}
                  <div className="p-5 sm:p-6 rounded-xl bg-[#111111] border border-[rgba(239,232,216,0.12)]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-poppins text-micro text-[#EFE8D8]/50 uppercase tracking-widest font-mono">
                        Results & Performance
                      </span>
                      {item.seeMore && (
                        <a
                          href={item.seeMore}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="LINK"
                          className="group inline-flex items-center gap-1.5 text-xs font-poppins font-medium text-[#EFE8D8] hover:text-[#D7261E] pb-0.5 border-b border-[rgba(239,232,216,0.25)] hover:border-[#D7261E] transition-colors cursor-pointer"
                        >
                          <span>See More</span>
                          <span className="font-mono text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            ↗
                          </span>
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                      <div className="flex flex-col p-3 rounded-[6px] bg-[#161616] border border-[rgba(239,232,216,0.08)]">
                        <span className="font-poppins text-[10px] text-[#EFE8D8]/50 uppercase tracking-widest mb-1">
                          Views
                        </span>
                        <CounterNumber
                          value={item.results.views}
                          className="font-sentient font-bold text-lg sm:text-xl text-[#EFE8D8] tracking-tight tabular-nums"
                        />
                      </div>

                      <div className="flex flex-col p-3 rounded-[6px] bg-[#161616] border border-[rgba(239,232,216,0.08)]">
                        <span className="font-poppins text-[10px] text-[#EFE8D8]/50 uppercase tracking-widest mb-1">
                          Likes
                        </span>
                        <CounterNumber
                          value={item.results.likes}
                          className="font-sentient font-bold text-lg sm:text-xl text-[#EFE8D8] tracking-tight tabular-nums"
                        />
                      </div>

                      <div className="flex flex-col p-3 rounded-[6px] bg-[#161616] border border-[rgba(239,232,216,0.08)]">
                        <span className="font-poppins text-[10px] text-[#EFE8D8]/50 uppercase tracking-widest mb-1">
                          Shared
                        </span>
                        <CounterNumber
                          value={item.results.shared}
                          className="font-sentient font-bold text-lg sm:text-xl text-[#EFE8D8] tracking-tight tabular-nums"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Production Footage Grid (4 High-Res Stills) */}
                  {item.footage && item.footage.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-baseline justify-between">
                        <span className="font-poppins text-micro text-[#EFE8D8]/50 uppercase tracking-widest font-mono">
                          Production Footage (Click to Inspect)
                        </span>
                        <span className="font-mono text-[10px] text-[#EFE8D8]/40">
                          {item.footage.length} Stills
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {item.footage.map((src, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => setLightboxIndex(fIdx)}
                            className="group relative aspect-[4/3] rounded-[6px] overflow-hidden bg-[#161616] border border-white/10 hover:border-[#D7261E] transition-all cursor-pointer"
                          >
                            <img
                              src={src}
                              alt={`${item.label} footage ${fIdx + 1}`}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Credit Table */}
                  {item.credit && item.credit.length > 0 && (
                    <div className="pt-4 border-t border-[rgba(239,232,216,0.1)]">
                      <span className="font-poppins text-micro text-[#EFE8D8]/50 uppercase tracking-widest font-mono block mb-2.5">
                        Credits
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {item.credit.map(([role, name], cIdx) => (
                          <div key={cIdx} className="flex flex-col">
                            <span className="font-poppins text-[10px] text-[#EFE8D8]/40 uppercase tracking-wider">
                              {role}
                            </span>
                            <span className="font-poppins font-medium text-[#EFE8D8]/90">
                              {name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footage Lightbox */}
            {lightboxIndex !== null && item.footage && item.footage[lightboxIndex] && (
              <FootageLightbox
                images={item.footage}
                currentIndex={lightboxIndex}
                isOpen={true}
                onClose={() => setLightboxIndex(null)}
                onNavigate={(idx) => setLightboxIndex(idx)}
                title={`${item.label} · Production Footage`}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
