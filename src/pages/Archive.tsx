import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rawArchiveWorks, shuffleArchiveWorks, ArchiveWorkItem } from '../data/archive';
import { ArchiveRow } from './archive/ArchiveRow';
import { ArchiveRevealPanel } from './archive/ArchiveRevealPanel';
import { person } from '../data/content';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';

export const Archive: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Order MUST be randomized (Fisher-Yates) every time the page mounts
  const [works, setWorks] = useState<ArchiveWorkItem[]>(() => shuffleArchiveWorks(rawArchiveWorks));
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const listContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync document title
  useEffect(() => {
    document.title = 'Archive | Jassinta Roid Triniti';
  }, []);

  // Screen size check
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Active work
  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeWork = works[activeIndex] || works[0];

  // Shuffle button handler: reshuffles order with staggered layout animation
  const handleShuffle = useCallback(() => {
    setWorks((prev) => {
      const next = shuffleArchiveWorks(prev);
      return next;
    });
    setSelectedIndex(0);
    setHoveredIndex(null);
    if (listContainerRef.current) {
      listContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Keyboard navigation: ArrowUp/ArrowDown to select, Enter to open link
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % works.length);
        setHoveredIndex(null);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + works.length) % works.length);
        setHoveredIndex(null);
      } else if (e.key === 'Enter') {
        const current = works[selectedIndex];
        if (current && current.url) {
          window.open(current.url, '_blank', 'noopener,noreferrer');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [works, selectedIndex]);

  // Mobile accordion toggle
  const handleToggleMobile = useCallback((id: string) => {
    setExpandedMobileId((prev) => (prev === id ? null : id));
  }, []);

  // Background image source for desktop ambient blur
  const bgImage = activeWork.poster || (activeWork.kind === 'image' ? activeWork.src : undefined);

  return (
    <div className="relative h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#000000] text-[#FFFFFF] select-none">
      {/* Dynamic Transparent Active Media Backdrop following active item with 50% black overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-media-${activeWork.id}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.38, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center filter blur-md"
          >
            {activeWork.kind === 'video' ? (
              <video
                src={activeWork.src}
                poster={activeWork.poster}
                autoPlay
                loop
                muted
                playsInline
                onError={(e) => {
                  (e.currentTarget as HTMLVideoElement).src = 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-cream-41618-large.mp4';
                }}
                className="w-full h-full object-cover scale-110"
              />
            ) : (
              <img
                src={activeWork.src}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1080&auto=format&fit=crop';
                }}
                className="w-full h-full object-cover scale-110"
              />
            )}
          </motion.div>
        </AnimatePresence>
        {/* 50% Black transparency overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>

      {/* ============================================================ */}
      {/* MAIN TWO-COLUMN SPLIT STAGE                                  */}
      {/* ============================================================ */}
      <main className="flex-1 w-full flex overflow-hidden pt-4 pb-4 px-4 sm:px-8 lg:px-10 gap-6 xl:gap-10 relative z-10">
        {/* LEFT COLUMN: Scrollable Table List (~68% desktop, ~60% tablet, 100% mobile) */}
        <div className="w-full md:w-[60%] lg:w-[67%] xl:w-[68%] flex flex-col h-full overflow-hidden">
          {/* Sticky Table Header Row */}
          <div className="w-full shrink-0 flex items-center justify-between pb-3 px-2 border-b border-[rgba(239,232,216,0.18)] bg-transparent text-micro text-[#EFE8D8]/45 tracking-[0.2em] uppercase font-mono">
            <div className="w-12 shrink-0">No.</div>
            <div className="flex-1 min-w-0 pr-4">Title of Work</div>
            {!isMobile && (
              <>
                <div className="w-32 lg:w-40 shrink-0">Company</div>
                <div className="hidden lg:block w-24 shrink-0">Format</div>
                <div className="w-32 lg:w-40 shrink-0 text-right lg:text-left pr-2">Type</div>
              </>
            )}
            {isMobile && <div className="text-right">Info</div>}
          </div>

          {/* Scrollable Rows Container (Thin custom scrollbar) */}
          <div
            ref={listContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 pr-1.5"
          >
            <motion.ul layoutRoot className="w-full m-0 p-0">
              {works.map((work, idx) => (
                <ArchiveRow
                  key={work.id}
                  work={work}
                  index={idx}
                  isSelected={idx === activeIndex}
                  hasActiveSelection={hoveredIndex !== null}
                  isMobile={isMobile}
                  isExpandedMobile={expandedMobileId === work.id}
                  onSelect={setSelectedIndex}
                  onToggleMobile={handleToggleMobile}
                />
              ))}
            </motion.ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Media Reveal Panel (~32% desktop, ~40% tablet, hidden on mobile) */}
        {!isMobile && (
          <aside
            aria-label="Media Reveal Panel"
            className="hidden md:flex md:w-[40%] lg:w-[33%] xl:w-[32%] h-full relative rounded-[8px] overflow-hidden border border-[rgba(239,232,216,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#0C0C0C]"
          >
            <ArchiveRevealPanel work={activeWork} />
          </aside>
        )}
      </main>

      {/* ============================================================ */}
      {/* INTEGRATED INTERACTIVE FOOTER ROW                            */}
      {/* Left: 2026 · Shuffle · 34 Works | Center: Name | Right: Archive */}
      {/* ============================================================ */}
      <footer
        role="contentinfo"
        className="w-full h-11 border-t border-[rgba(239,232,216,0.12)] bg-[#0A0A0A]/95 backdrop-blur-md px-6 sm:px-10 lg:px-14 flex items-center justify-between text-micro text-[#EFE8D8] relative z-30 pointer-events-auto"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Left: Year + Shuffle button + Count */}
        <div className="flex items-center gap-3">
          <span className="tracking-widest tabular-nums opacity-75">{person.year}</span>
          <span className="opacity-30">·</span>
          <button
            type="button"
            onClick={handleShuffle}
            aria-label="Reshuffle archive works order"
            className="font-poppins font-medium text-xs text-[#EFE8D8] hover:text-[#D7261E] underline underline-offset-4 decoration-[rgba(239,232,216,0.3)] hover:decoration-[#D7261E] transition-colors cursor-pointer"
          >
            Shuffle
          </button>
          <span className="opacity-30 hidden sm:inline">·</span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#EFE8D8]/50 tabular-nums">
            {works.length} Works
          </span>
        </div>

        {/* Center: Creator Name */}
        <div className="font-poppins font-medium tracking-widest text-[#EFE8D8]/90 text-center">
          {person.name}
        </div>

        {/* Right: Section Identifier + Next Contact link */}
        <div className="flex items-center gap-2 text-right">
          <span className="font-mono text-xs tracking-widest text-[#EFE8D8]/70">
            Archive
          </span>
          <button
            type="button"
            onClick={() => {
              const nextEl = document.getElementById('contact');
              if (nextEl) {
                nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.history.replaceState(null, '', '/contact');
              }
            }}
            aria-label="Scroll to Contact section"
            className="hidden sm:inline-flex items-center gap-1 font-poppins text-[10px] text-[#EFE8D8]/60 hover:text-[#D7261E] uppercase tracking-wider pl-2 border-l border-[rgba(239,232,216,0.15)] transition-colors cursor-pointer"
          >
            <span>Contact</span>
            <span className="font-mono text-xs">↓</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Archive;
