import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Info } from 'lucide-react';
import { editorial, EditorialItem } from '../../data/content';
import { EditorialInfoPopover } from './EditorialInfoPopover';
import { EditorialCreditModal } from './EditorialCreditModal';
import { EditorialRulerTicks } from './EditorialRulerTicks';
import { TocButton } from '../../components/TocButton';
import { usePrefersReducedMotion } from '../../lib/useMediaQuery';
import { cn } from '../../lib/cn';

function parseAspect(aspectStr: string): number {
  if (aspectStr.includes('/')) {
    const [w, h] = aspectStr.split('/').map(Number);
    if (w && h) return w / h;
  }
  return 9 / 16;
}

function formatDayMonth(iso: string): string {
  const parts = iso.split('-');
  if (parts.length >= 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return iso;
}

function extractYear(iso: string): string {
  return iso.split('-')[0] || '2025';
}

export const EditorialGallery: React.FC = () => {
  const N = editorial.length;
  const prefersReducedMotion = usePrefersReducedMotion();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const creditTriggerRef = useRef<HTMLButtonElement | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  // Responsive stage dimensions
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscapePhone, setIsLandscapePhone] = useState(false);

  // Continuous smoothed index and active index
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentF, setCurrentF] = useState(0);

  // Audio mute state for active video (user-click toggle only)
  const [isMuted, setIsMuted] = useState(true);

  // Popover and Modal states
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCreditOpen, setIsCreditOpen] = useState(false);

  // Drag / swipe states
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityXRef = useRef(0);
  const hasMovedRef = useRef(false);

  const snapTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Spring physics for continuous index f
  const springF = useSpring(0, {
    damping: 34,
    stiffness: 190,
    mass: 0.65,
  });

  useEffect(() => {
    const unsub = springF.on('change', (val) => {
      setCurrentF(val);
      const rounded = Math.min(N - 1, Math.max(0, Math.round(val)));
      setActiveIndex(rounded);
    });
    return () => unsub();
  }, [springF, N]);

  // Window resize handler
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    setViewportWidth(w);
    setViewportHeight(h);
    setIsMobile(w < 768);
    setIsLandscapePhone(w > h && h < 480);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Height and width calculations for each item at scale 1
  const mediaHeight = useMemo(() => {
    if (isLandscapePhone) return Math.min(viewportHeight * 0.62, 360);
    if (isMobile) return Math.min(viewportHeight * 0.58, 560);
    return Math.min(viewportHeight * 0.64, 700);
  }, [viewportHeight, isMobile, isLandscapePhone]);

  const itemGap = useMemo(() => {
    return Math.max(20, viewportWidth * 0.04);
  }, [viewportWidth]);

  // Precompute unscaled width and center coordinate for each item
  const itemMetrics = useMemo(() => {
    const widths: number[] = [];
    const centers: number[] = [];
    let currentX = 0;

    for (let i = 0; i < N; i++) {
      const item = editorial[i];
      const aspect = parseAspect(item.aspect);
      let w = mediaHeight * aspect;
      if (isMobile) {
        w = Math.min(w, viewportWidth * 0.78);
      }
      widths.push(w);

      if (i === 0) {
        currentX = w / 2;
      } else {
        currentX += widths[i - 1] / 2 + itemGap + w / 2;
      }
      centers.push(currentX);
    }

    return { widths, centers };
  }, [N, mediaHeight, itemGap, isMobile, viewportWidth]);

  // Smooth interpolation of continuous center C(f)
  const continuousCenter = useMemo(() => {
    const { centers } = itemMetrics;
    if (currentF <= 0) return centers[0] || 0;
    if (currentF >= N - 1) return centers[N - 1] || 0;

    const k = Math.floor(currentF);
    const t = currentF - k;
    const c0 = centers[k] || 0;
    const c1 = centers[k + 1] || c0;
    return c0 + t * (c1 - c0);
  }, [currentF, itemMetrics, N]);

  // Stage center and track translateX
  const stageCenterX = viewportWidth / 2;
  const trackTranslateX = stageCenterX - continuousCenter;

  // Programmatic scroll to specific item index
  const scrollToItem = useCallback(
    (index: number) => {
      const targetIndex = Math.min(N - 1, Math.max(0, index));
      springF.set(targetIndex);
    },
    [N, springF]
  );

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input or modal is active
      if (isCreditOpen || isInfoOpen) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToItem(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToItem(activeIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isCreditOpen, isInfoOpen, scrollToItem]);

  // Horizontal wheel / shift+wheel mapping
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!isHorizontal) return;

      // Map horizontal trackpad or shift+wheel directly
      e.preventDefault();
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      const sensitivity = 0.0018;
      const nextF = Math.min(N - 1, Math.max(0, currentF + delta * sensitivity));
      springF.set(nextF);

      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      snapTimerRef.current = setTimeout(() => {
        const nearest = Math.round(nextF);
        scrollToItem(nearest);
      }, 120);
    },
    [currentF, N, springF, scrollToItem]
  );

  // Direct Drag & Swipe Gesture Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0) return;
    // Don't start drag on interactive buttons or links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartFRef.current = currentF;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityXRef.current = 0;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 8) {
      velocityXRef.current = (e.clientX - lastXRef.current) / dt;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    }

    // Convert pixel deltaX to index delta
    // Average item width determines step
    const avgStep = mediaHeight * 0.7 + itemGap;
    const deltaF = -deltaX / avgStep;
    const newF = Math.min(N - 1, Math.max(0, dragStartFRef.current + deltaF));
    springF.set(newF);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture error
    }

    if (hasMovedRef.current) {
      // Apply momentum flick
      const velocity = velocityXRef.current;
      let targetIndex = Math.round(currentF);
      if (velocity < -0.45) {
        targetIndex = Math.min(N - 1, Math.ceil(currentF));
      } else if (velocity > 0.45) {
        targetIndex = Math.max(0, Math.floor(currentF));
      }
      scrollToItem(targetIndex);
    }
  };

  const activeItem = editorial[activeIndex] || editorial[0];
  const activeYear = extractYear(activeItem.iso);
  const activeDate = formatDayMonth(activeItem.iso);

  return (
    <section
      ref={wrapperRef}
      aria-label="Editorial Works Gallery"
      className="relative w-full h-[100dvh] min-h-[640px] max-h-[920px] overflow-hidden bg-[#000000] text-[#FFFFFF] select-none"
    >
      {/* Dynamic Transparent Active Media Backdrop following active center item with 50% black overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-media-${activeItem.id}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.38, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center filter blur-md"
          >
            {activeItem.kind === 'video' ? (
              <video
                src={activeItem.src}
                poster={activeItem.poster}
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
                src={activeItem.src}
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

      {/* Fullscreen Stage */}
      <div
        ref={stageRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={cn(
          'relative h-full w-full overflow-hidden flex flex-col justify-between items-center select-none bg-transparent',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
      >
        {/* Decorative Vertical Ruler Ticks on Far Left and Right */}
        <EditorialRulerTicks side="left" />
        <EditorialRulerTicks side="right" />

        {/* ---------------- REGION 1: TOP HEADER ---------------- */}
        <header className="relative z-30 w-full px-6 md:px-12 pt-6 md:pt-8 flex items-center justify-between text-micro text-[#EFE8D8]">
          {/* Top Left: Counter on desktop, Info trigger on mobile */}
          <div className="flex items-center gap-3">
            {isMobile ? (
              <button
                type="button"
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                aria-expanded={isInfoOpen}
                aria-label="Toggle editorial information"
                className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] bg-[#141414]/90 backdrop-blur-md border border-[rgba(239,232,216,0.18)] hover:border-[#D7261E] rounded-[4px] text-micro tracking-widest text-[#EFE8D8] active:scale-95 transition-all cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-[#D7261E]" />
                <span>Info</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 tracking-[0.2em] opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E] animate-pulse" />
                <span className="font-mono text-xs">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </span>
                <span className="opacity-30">·</span>
                <span className="text-[10px] uppercase font-poppins">EDITORIAL</span>
              </div>
            )}
          </div>

          {/* Top Center: Button "Info" on Desktop (opens Popover) */}
          {!isMobile && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsInfoOpen(!isInfoOpen)}
                aria-expanded={isInfoOpen}
                aria-label="Toggle editorial information"
                data-cursor="INFO"
                className="group flex items-center gap-2 px-4 py-1.5 bg-[#141414]/90 backdrop-blur-md border border-[rgba(239,232,216,0.2)] hover:border-[#D7261E] rounded-[4px] text-micro tracking-widest text-[#EFE8D8] transition-all hover:text-[#D7261E] active:scale-95 cursor-pointer shadow-lg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E] transition-transform group-hover:scale-125" />
                <span className="font-medium">Info</span>
                <span className="opacity-40">/</span>
                <span className="text-[10px] opacity-70 font-normal italic lowercase">detail</span>
              </button>

              {/* Desktop Anchored Popover */}
              <EditorialInfoPopover
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                item={activeItem}
                isMobile={false}
              />
            </div>
          )}

          {/* Top Right: TocButton ("Index") */}
          <div className="flex items-center">
            <TocButton
              position="top-right"
              className="!relative !top-auto !right-auto !bottom-auto min-h-[44px]"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-toc'));
                }
              }}
            />
          </div>
        </header>

        {/* Mobile Info Bottom Sheet */}
        {isMobile && (
          <EditorialInfoPopover
            isOpen={isInfoOpen}
            onClose={() => setIsInfoOpen(false)}
            item={activeItem}
            isMobile={true}
          />
        )}

        {/* ---------------- REGION 2: CENTER STAGE ---------------- */}
        <div className="relative z-20 w-full flex-1 flex flex-col justify-center items-center overflow-visible">
          {/* Label Above Center Media: {platform} / {contentType} */}
          <div className="h-7 mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-micro text-[#EFE8D8]/60 tracking-[0.2em] uppercase text-[11px] sm:text-xs"
              >
                <span className="font-semibold text-[#EFE8D8]">{activeItem.platform}</span>
                <span className="opacity-30">/</span>
                <span>{activeItem.contentType}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Horizontal Media Track Container */}
          <div
            className="relative w-full overflow-visible"
            style={{
              height: `${mediaHeight}px`,
            }}
          >
            {/* The Track element shifted by translateX */}
            <div
              className="absolute top-0 left-0 h-full flex items-center will-change-transform"
              style={{
                transform: `translateX(${trackTranslateX}px)`,
                transition: isDragging ? 'none' : 'transform 0.08s ease-out',
              }}
            >
              {editorial.map((item, idx) => {
                const offset = idx - currentF;
                const absOffset = Math.abs(offset);

                // Cull items beyond 2.2 for performance
                if (absOffset > 2.2) return null;

                const centerCoord = itemMetrics.centers[idx] || 0;
                const itemWidth = itemMetrics.widths[idx] || 320;
                const isActive = absOffset < 0.5;

                // Scale: lerp(1, 0.72, clamp(|o|, 0, 1)) and 0.55 beyond 2
                let scale: number;
                if (absOffset <= 1) {
                  scale = 1 - absOffset * 0.28;
                } else if (absOffset <= 2) {
                  scale = 0.72 - (absOffset - 1) * 0.17;
                } else {
                  scale = 0.55;
                }

                // Opacity: 1 at center, 0.55 for ±1, 0.25 for ±2, 0 beyond
                let opacity: number;
                if (absOffset < 0.2) {
                  opacity = 1;
                } else if (absOffset <= 1) {
                  opacity = 1 - ((absOffset - 0.2) / 0.8) * 0.45;
                } else if (absOffset <= 2) {
                  opacity = 0.55 - (absOffset - 1) * 0.3;
                } else {
                  opacity = 0.25;
                }

                // Slight rotateY (±6deg) and small vertical offset
                const rotateY = Math.min(8, Math.max(-8, -offset * 6));
                const translateY = Math.min(16, absOffset * 8);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!isActive && !hasMovedRef.current) {
                        scrollToItem(idx);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: `${centerCoord}px`,
                      top: '50%',
                      width: `${itemWidth}px`,
                      height: `${mediaHeight}px`,
                      transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale}) perspective(1200px) rotateY(${rotateY}deg)`,
                      opacity,
                      zIndex: isActive ? 20 : 10 - Math.round(absOffset),
                      transformOrigin: 'center center',
                    }}
                    className={cn(
                      'transition-opacity duration-200 select-none group',
                      !isActive && 'cursor-pointer hover:opacity-80'
                    )}
                  >
                    {/* Media Card Shell */}
                    <div
                      className={cn(
                        'relative w-full h-full rounded-[8px] overflow-hidden bg-[#141414]',
                        'border transition-all duration-300',
                        isActive
                          ? 'border-[rgba(239,232,216,0.3)] shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_1px_rgba(255,255,255,0.2)] ring-1 ring-white/10'
                          : 'border-[rgba(239,232,216,0.12)] shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
                      )}
                    >
                      {/* Media element: Active video plays inline, neighbours show poster */}
                      {item.kind === 'video' ? (
                        isActive ? (
                          <div className="relative w-full h-full">
                            <video
                              ref={activeVideoRef}
                              src={item.src}
                              poster={item.poster}
                              autoPlay
                              playsInline
                              loop
                              muted={isMuted}
                              preload="auto"
                              onError={(e) => {
                                (e.currentTarget as HTMLVideoElement).src = 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-cream-41618-large.mp4';
                              }}
                              className="w-full h-full object-cover"
                            />

                            {/* Sound On / Off Pill for Active Video */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const next = !isMuted;
                                setIsMuted(next);
                                if (activeVideoRef.current) {
                                  activeVideoRef.current.muted = next;
                                }
                              }}
                              aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                              data-cursor="SOUND"
                              className="absolute bottom-3.5 right-3.5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A0A0A]/85 backdrop-blur-md border border-[rgba(239,232,216,0.25)] hover:border-[#D7261E] text-micro text-[#EFE8D8] hover:text-[#D7261E] transition-all active:scale-95 shadow-lg cursor-pointer"
                            >
                              {isMuted ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-[#D7261E]" />
                                  <span className="text-[10px] tracking-wider font-semibold">
                                    Sound Off
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-[10px] tracking-wider font-semibold">
                                    Sound On
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img
                              src={item.poster || item.src}
                              alt={item.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover pointer-events-none"
                            />
                            {/* Subtle play indicator on inactive neighbor */}
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="px-2.5 py-1 rounded bg-black/75 text-[10px] text-[#EFE8D8] font-poppins uppercase tracking-widest border border-white/10">
                                View
                              </span>
                            </div>
                          </div>
                        )
                      ) : (
                        /* Feed Image */
                        <div className="relative w-full h-full bg-[#181818]">
                          <img
                            src={item.src}
                            alt={item.title}
                            loading={isActive ? 'eager' : 'lazy'}
                            decoding="async"
                            className="w-full h-full object-contain pointer-events-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* On-screen Prev / Next Arrow Controls (Subtle 44px tap targets) */}
          <div className="pointer-events-none absolute inset-x-4 sm:inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between z-30">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                scrollToItem(activeIndex - 1);
              }}
              aria-label="Previous editorial project"
              className={cn(
                'pointer-events-auto w-11 h-11 rounded-full flex items-center justify-center bg-[#121212]/80 backdrop-blur-md border border-[rgba(239,232,216,0.18)] text-[#EFE8D8] transition-all shadow-xl active:scale-95 cursor-pointer',
                activeIndex === 0
                  ? 'opacity-20 cursor-not-allowed'
                  : 'hover:border-[#D7261E] hover:text-[#D7261E] hover:bg-[#181818]'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              disabled={activeIndex === N - 1}
              onClick={(e) => {
                e.stopPropagation();
                scrollToItem(activeIndex + 1);
              }}
              aria-label="Next editorial project"
              className={cn(
                'pointer-events-auto w-11 h-11 rounded-full flex items-center justify-center bg-[#121212]/80 backdrop-blur-md border border-[rgba(239,232,216,0.18)] text-[#EFE8D8] transition-all shadow-xl active:scale-95 cursor-pointer',
                activeIndex === N - 1
                  ? 'opacity-20 cursor-not-allowed'
                  : 'hover:border-[#D7261E] hover:text-[#D7261E] hover:bg-[#181818]'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ---------------- REGION 3: BOTTOM CONTROLS & METADATA ---------------- */}
        <footer className="relative z-30 w-full px-6 md:px-12 pb-14 md:pb-16 flex flex-col gap-3 select-none">
          {/* Bottom Center: {title} ({year}) with masked slide/blur transition */}
          <div className="w-full flex justify-center text-center overflow-hidden py-1">
            <AnimatePresence mode="wait">
              <motion.h2
                key={activeItem.id}
                initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-sentient font-normal text-xl sm:text-2xl md:text-3xl text-[#FFFFFF] tracking-tight max-w-[85vw] truncate"
                style={{ fontSize: 'var(--fs-title-md, clamp(20px, 2.2vw, 34px))' }}
              >
                {activeItem.title} ({activeYear})
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Bottom Row: Date & Counter on Left, Credit Button on Right */}
          <div className="w-full flex items-center justify-between">
            {/* Bottom Left: date dd/mm + counter */}
            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, x: -8, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 8, filter: 'blur(3px)' }}
                  transition={{ duration: 0.3 }}
                  className="flex items-baseline gap-2.5"
                >
                  {/* Large-ish micro date: dd/mm */}
                  <span className="font-poppins font-semibold text-base sm:text-lg text-[#EFE8D8] tracking-wider tabular-nums">
                    {activeDate}
                  </span>

                  {/* Counter indicator */}
                  <span className="font-mono text-xs text-[#EFE8D8]/45 tabular-nums">
                    [{String(activeIndex + 1).padStart(2, '0')}/{String(N).padStart(2, '0')}]
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Right: Button "Credit" (opens Credit Modal) */}
            <div>
              <button
                ref={creditTriggerRef}
                type="button"
                onClick={() => setIsCreditOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isCreditOpen}
                aria-label="Open project credits"
                data-cursor="CREDIT"
                className="group flex items-center gap-2 px-3.5 py-1.5 min-h-[44px] bg-[#141414]/90 backdrop-blur-md border border-[rgba(239,232,216,0.2)] hover:border-[#D7261E] rounded-[4px] text-micro tracking-widest text-[#EFE8D8] hover:text-[#D7261E] active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EFE8D8]/50 group-hover:bg-[#D7261E] transition-colors" />
                <span className="font-medium">Credit</span>
              </button>
            </div>
          </div>
        </footer>

        {/* Credit Modal Component */}
        <EditorialCreditModal
          isOpen={isCreditOpen}
          onClose={() => setIsCreditOpen(false)}
          item={activeItem}
          triggerRef={creditTriggerRef}
        />
      </div>
    </section>
  );
};
