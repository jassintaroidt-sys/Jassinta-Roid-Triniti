import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { CassetteDisc } from './CassetteDisc';
import { writingWorks } from '../../data/content';
import { usePrefersReducedMotion } from '../../lib/useMediaQuery';
import { cn } from '../../lib/cn';

export const DiscCarousel: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const N = writingWorks.length;
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scroll physics & continuous index
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Responsive diameter and step sizes
  const [diameter, setDiameter] = useState(520);
  const [step, setStep] = useState(320);
  const [isMobile, setIsMobile] = useState(false);

  // Pointer position for gloss shift
  const [pointerX, setPointerX] = useState(0);
  const [pointerY, setPointerY] = useState(0);

  // Dragging state and refs for direct swipe / drag gesture ("geser")
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartFRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityXRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Spring smoothed continuous index
  const springF = useSpring(0, {
    damping: 32,
    stiffness: 180,
    mass: 0.6,
  });

  const [currentF, setCurrentF] = useState(0);

  useEffect(() => {
    const unsubscribe = springF.on('change', (latest) => {
      setCurrentF(latest);
      setActiveIndex(Math.min(N - 1, Math.max(0, Math.round(latest))));
    });
    return () => unsubscribe();
  }, [springF, N]);

  // Handle window sizing and disc proportions
  const updateSizes = useCallback(() => {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mobile = w < 768;
    setIsMobile(mobile);

    let d: number;
    let s: number;
    if (mobile) {
      d = Math.min(w * 0.60, h * 0.32, 250);
      s = d * 0.72;
    } else {
      d = Math.min(w * 0.38, h * 0.52, 540);
      s = d * 0.62;
    }
    setDiameter(Math.round(d));
    setStep(Math.round(s));
  }, []);

  useEffect(() => {
    updateSizes();
    window.addEventListener('resize', updateSizes, { passive: true });
    return () => window.removeEventListener('resize', updateSizes);
  }, [updateSizes]);

  // Pointer move handler for disc sheen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setPointerX((e.clientX - cx) / cx);
      setPointerY((e.clientY - cy) / cy);
    };

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (hasFinePointer) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    return () => {
      if (hasFinePointer) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const scrollToItem = useCallback(
    (index: number) => {
      const targetIndex = Math.min(N - 1, Math.max(0, index));
      springF.set(targetIndex);
    },
    [N, springF]
  );

  // Trackpad horizontal swipe support
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 6) {
        e.preventDefault();
        const delta = e.deltaX > 0 ? 0.3 : -0.3;
        springF.set(Math.max(0, Math.min(N - 1, currentF + delta)));
      }
    };

    stageEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => stageEl.removeEventListener('wheel', handleWheel);
  }, [N, currentF, springF]);

  // Direct Drag & Swipe Gesture Handlers ("geser dengan mouse / touch")
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartFRef.current = currentF;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;

    // Movement threshold before declaring active drag
    if (!hasMovedRef.current && Math.hypot(deltaX, deltaY) > 5) {
      hasMovedRef.current = true;
      setIsDragging(true);
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture fallback
      }
    }

    if (hasMovedRef.current) {
      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 8) {
        velocityXRef.current = (e.clientX - lastXRef.current) / dt;
        lastXRef.current = e.clientX;
        lastTimeRef.current = now;
      }

      // Drag sensitivity: pixels to traverse 1 item
      const pxPerItem = Math.max(140, Math.min(step * 0.75, 240));
      const deltaF = -deltaX / pxPerItem;
      const targetF = Math.max(0, Math.min(N - 1, dragStartFRef.current + deltaF));

      // Direct 1:1 instant tracking without lag
      springF.jump(targetF);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    if (hasMovedRef.current) {
      // Apply momentum flick if swiped with velocity
      let momentum = 0;
      if (Math.abs(velocityXRef.current) > 0.3) {
        momentum = velocityXRef.current < 0 ? 0.65 : -0.65;
      }

      const rawTarget = currentF + momentum;
      const snappedIndex = Math.max(0, Math.min(N - 1, Math.round(rawTarget)));

      // Smoothly snap spring
      springF.set(snappedIndex);
      scrollToItem(snappedIndex);
    }
  };

  const activeWork = writingWorks[activeIndex] || writingWorks[0];

  const handleDiscClick = (index: number) => {
    // If the user was dragging/swiping ("menggeser"), prevent click
    if (hasMovedRef.current) return;

    if (index === activeIndex) {
      if (activeWork.url) {
        window.open(activeWork.url, '_blank', 'noopener,noreferrer');
      }
    } else {
      scrollToItem(index);
    }
  };

  const renderLimit = isMobile ? 1.6 : 3.0;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full min-h-[100dvh] bg-[#FFFFFF]"
    >
      {/* 3D Carousel Stage */}
      <div
        ref={stageRef}
        style={{
          perspective: '1400px',
        }}
        className="relative min-h-[100dvh] w-full flex flex-col justify-between bg-[#FFFFFF] text-[#111111] select-none p-4 sm:p-8"
      >
        {/* Top-Left Info Panel (Compact & cleanly positioned to avoid overlapping vinyl discs) */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-6 md:top-7 md:left-8 z-30 flex flex-col w-auto max-w-[170px] xs:max-w-[190px] sm:max-w-[220px] md:max-w-[240px] pointer-events-none">
          {/* Animated Short Title in Sentient Regular */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={`short-${activeWork.id}`}
              initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="font-sentient text-[15px] sm:text-[18px] md:text-[20px] font-normal text-[#111111] tracking-tight leading-snug mb-1.5 sm:mb-2 truncate"
            >
              {activeWork.short}
            </motion.h2>
          </AnimatePresence>

          {/* Hairline-Separated 3-Row Metadata Table (Author, Date, Media) */}
          <div className="w-full border-t border-black/15 text-[9px] sm:text-[10px] md:text-[11px] font-poppins">
            <AnimatePresence mode="wait">
              <motion.div
                key={`table-${activeWork.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0"
              >
                {/* Row 1: Author */}
                <div className="flex items-center justify-between py-0.5 sm:py-1 border-b border-black/10 gap-2">
                  <span className="text-black/50 uppercase tracking-wider text-[8px] sm:text-[9px] shrink-0">
                    Author
                  </span>
                  <span className="text-[#111111] font-normal text-right truncate">
                    {activeWork.author}
                  </span>
                </div>

                {/* Row 2: Date */}
                <div className="flex items-center justify-between py-0.5 sm:py-1 border-b border-black/10 gap-2">
                  <span className="text-black/50 uppercase tracking-wider text-[8px] sm:text-[9px] shrink-0">
                    Date
                  </span>
                  <span className="text-[#111111] font-normal tabular-nums text-right shrink-0">
                    {activeWork.date}
                  </span>
                </div>

                {/* Row 3: Media */}
                <div className="flex items-center justify-between py-0.5 sm:py-1 border-b border-black/10 gap-2">
                  <span className="text-black/50 uppercase tracking-wider text-[8px] sm:text-[9px] shrink-0">
                    Media
                  </span>
                  <span className="text-[#111111] font-normal text-right truncate">
                    {activeWork.media}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Micro-label Counter: 01 / 11 */}
          <div className="pt-1 sm:pt-1.5 text-[8px] sm:text-[9px] text-black/40 tabular-nums">
            <span className="text-[#111111] font-medium">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="mx-1 text-black/30">/</span>
            <span>{String(N).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Top-Right Info Panel (On PC, Laptop, and Tablet - screens >= 768px) */}
        <div className="hidden md:flex absolute top-4 right-4 sm:top-5 sm:right-6 md:top-7 md:right-8 z-30 flex-col items-end text-right max-w-[240px] md:max-w-[280px] lg:max-w-[320px] pointer-events-auto">
          <div className="text-micro text-black/60 uppercase tracking-[0.2em] text-[10px] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E]" />
            <span>Selected Article</span>
          </div>

          {/* Animated Full Title in Sentient Regular */}
          <div className="min-h-[58px] sm:min-h-[72px] flex items-center justify-end">
            <AnimatePresence mode="wait">
              <motion.h3
                key={`title-desktop-${activeWork.id}`}
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="font-sentient text-[clamp(17px,1.8vw,25px)] font-normal text-[#111111] leading-snug line-clamp-3 text-balance"
                style={{ maxWidth: '38ch' }}
              >
                {activeWork.title}
              </motion.h3>
            </AnimatePresence>
          </div>

          {/* Action Link / Button */}
          <div className="mt-3">
            {activeWork.url ? (
              <a
                href={activeWork.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="READ"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-black text-white hover:bg-[#D7261E] text-micro tracking-widest uppercase transition-all duration-200 shadow-md active:scale-95"
              >
                <span>Open article</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <span className="text-micro text-black/35 tracking-widest italic cursor-default">
                Link unavailable
              </span>
            )}
          </div>
        </div>

        {/* Middle Flex Container for Mobile Disc Stage & Arrows / Absolute Stage for Desktop */}
        <div className="relative md:absolute md:inset-0 flex-1 md:flex-none flex items-center justify-center my-auto w-full">
          {/* Side Arrow Navigation Buttons */}
          <div className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto">
            <button
              type="button"
              onClick={() => scrollToItem(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous vinyl article"
              data-cursor="PREV"
              className="p-1.5 sm:p-2.5 md:p-3 rounded-full bg-black/5 hover:bg-[#D7261E] text-black hover:text-white border border-black/10 hover:border-[#D7261E] shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto">
            <button
              type="button"
              onClick={() => scrollToItem(Math.min(N - 1, activeIndex + 1))}
              disabled={activeIndex === N - 1}
              aria-label="Next vinyl article"
              data-cursor="NEXT"
              className="p-1.5 sm:p-2.5 md:p-3 rounded-full bg-black/5 hover:bg-[#D7261E] text-black hover:text-white border border-black/10 hover:border-[#D7261E] shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Center 3D Cassette / Disc Row Stage with Direct Drag & Swipe Gesture Zone ("geser") */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              transformStyle: 'preserve-3d',
              touchAction: 'pan-y',
            }}
            className={cn(
              'absolute inset-0 flex items-center justify-center select-none pointer-events-auto transition-cursor',
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
          >
            {writingWorks.map((work, idx) => {
              const offset = idx - currentF;
              const isVisible = Math.abs(offset) <= renderLimit;

              if (!isVisible) return null;

              return (
                <div key={work.id} className="pointer-events-auto select-none">
                  <CassetteDisc
                    item={work}
                    isActive={idx === activeIndex}
                    offset={offset}
                    step={step}
                    diameter={diameter}
                    onClick={() => handleDiscClick(idx)}
                    pointerX={pointerX}
                    pointerY={pointerY}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Mobile Title & Controls beneath the disc / Desktop Clean Helper & Track Indicator */}
        <div className="relative z-30 w-full flex flex-col items-center pointer-events-auto pb-3 sm:pb-5">
          {/* On Mobile (< 768px): "Selected Article" label, Full Title, and "Open article" button beneath the vinyl disc */}
          <div className="md:hidden flex flex-col items-center text-center max-w-[92vw] mx-auto pointer-events-auto px-2">
            {/* Selected Article micro tag */}
            <div className="text-micro text-black/60 uppercase tracking-[0.2em] text-[9px] sm:text-[10px] mb-1 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E]" />
              <span>Selected Article</span>
            </div>

            {/* Headline / News Title */}
            <div className="overflow-hidden min-h-[42px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={`title-mobile-${activeWork.id}`}
                  initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-sentient text-[14px] xs:text-[15px] sm:text-base font-normal text-[#111111] leading-snug line-clamp-2 text-balance max-w-[35ch]"
                >
                  {activeWork.title}
                </motion.h3>
              </AnimatePresence>
            </div>

            {/* Action Link / Button */}
            <div className="mt-2 flex items-center justify-center">
              {activeWork.url ? (
                <a
                  href={activeWork.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="READ"
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-black text-white hover:bg-[#D7261E] text-micro tracking-widest uppercase transition-all duration-200 shadow-sm active:scale-95 text-[10px]"
                >
                  <span>Open article</span>
                  <ExternalLink className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <span className="text-micro text-black/35 tracking-widest italic cursor-default text-[10px]">
                  Link unavailable
                </span>
              )}
            </div>

            {/* Mobile Track Dots Indicator */}
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {writingWorks.map((_, i) => (
                <button
                  key={`dot-m-${i}`}
                  type="button"
                  onClick={() => scrollToItem(i)}
                  aria-label={`Go to article ${i + 1}`}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300 cursor-pointer',
                    i === activeIndex
                      ? 'w-4 bg-[#D7261E]'
                      : 'w-1 bg-black/20'
                  )}
                />
              ))}
            </div>

            {/* Mobile Swipe Cue */}
            <div className="mt-1 flex items-center gap-2 text-micro text-black/45 uppercase tracking-[0.2em] text-[8.5px]">
              <span className="text-[#D7261E] font-bold">‹</span>
              <span>Swipe or drag discs to select</span>
              <span className="text-[#D7261E] font-bold">›</span>
            </div>
          </div>

          {/* On Desktop & Tablet (>= 768px): Sleek tactile drag indicator bar */}
          <div className="hidden md:flex flex-col items-center gap-2 pointer-events-none select-none">
            {/* Micro Disc Track Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-black/15 shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md">
              {writingWorks.map((_, i) => (
                <span
                  key={`dot-${i}`}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    i === activeIndex
                      ? 'w-5 bg-[#D7261E]'
                      : 'w-1 bg-black/20'
                  )}
                />
              ))}
            </div>

            {/* Gesture Instruction */}
            <div className="flex items-center gap-2 text-micro text-black/60 uppercase tracking-[0.2em] text-[10px]">
              <span className="text-[#D7261E] font-bold">‹</span>
              <span>Swipe or drag vinyl discs to navigate</span>
              <span className="text-[#D7261E] font-bold">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscCarousel;
