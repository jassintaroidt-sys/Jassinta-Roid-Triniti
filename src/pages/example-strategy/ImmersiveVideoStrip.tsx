import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { strategy, StrategyItem } from '../../data/content';
import { VideoOnView } from '../../components/VideoOnView';
import { StrategyDetailDrawer } from './StrategyDetailDrawer';
import { usePrefersReducedMotion } from '../../lib/useMediaQuery';
import { cn } from '../../lib/cn';

export const ImmersiveVideoStrip: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeScrollIdx, setActiveScrollIdx] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [viewportWidth, setViewportWidth] = useState<number>(1440);
  const [viewportHeight, setViewportHeight] = useState<number>(900);
  const [bandFits, setBandFits] = useState<boolean>(true);
  const [maxTranslateX, setMaxTranslateX] = useState<number>(0);
  const [selectedPillar, setSelectedPillar] = useState<StrategyItem | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  // Scroll tracking across the pinned container
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const springConfig = { damping: 28, stiffness: 120, mass: 0.5 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Mouse tracking for fine-pointer tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 160 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 160 });

  // Update layout dimensions and responsive state
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;

      setViewportWidth(vw);
      setViewportHeight(vh);
      setIsMobile(mobile);

      if (!mobile) {
        const panelH = Math.min(vh * 0.7, 760);
        const panelW = panelH * (9 / 16);
        const gap = 4;
        const totalBandW = panelW * 4 + gap * 3;
        const fits = totalBandW <= vw - 80;

        setBandFits(fits);
        if (!fits) {
          const padding = 48;
          const overflow = totalBandW - vw + padding * 2;
          setMaxTranslateX(Math.max(0, overflow));
        } else {
          setMaxTranslateX(0);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) / cx);
      mouseY.set((e.clientY - cy) / cy);
    };

    if (hasFinePointer) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (hasFinePointer) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  // Track active panel index on desktop based on smoothProgress
  useEffect(() => {
    if (isMobile) return;

    const unsubscribe = smoothProgress.on('change', (p) => {
      if (bandFits) {
        const idx = Math.min(3, Math.max(0, Math.floor(p * 4)));
        setActiveScrollIdx(idx);
      } else {
        const center = viewportWidth / 2;
        let closestIdx = 0;
        let minDistance = Infinity;

        panelRefs.current.forEach((el, idx) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const elCenter = rect.left + rect.width / 2;
          const dist = Math.abs(elCenter - center);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }
        });

        setActiveScrollIdx(closestIdx);
      }
    });

    return () => unsubscribe();
  }, [smoothProgress, bandFits, viewportWidth, isMobile]);

  // Mobile horizontal scroll listener
  const handleMobileScroll = () => {
    const el = mobileTrackRef.current;
    if (!el) return;

    const center = el.scrollLeft + el.clientWidth / 2;
    let closestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    }

    setActiveScrollIdx(closestIdx);
  };

  const scrollToMobileIndex = (idx: number) => {
    const el = mobileTrackRef.current;
    if (!el || !el.children[idx]) return;
    const target = el.children[idx] as HTMLElement;
    const scrollTarget = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2;
    el.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
  };

  // Motion transforms driven by scroll progress
  // If band overflows: translates horizontally
  // If band fits: gentle camera rotation & focus shift
  const bandTranslateX = useTransform(smoothProgress, (p) => {
    if (bandFits) return 0;
    const startX = isMobile ? 24 : 48;
    return startX - p * maxTranslateX;
  });

  const cameraRotateY = useTransform(smoothProgress, (p) => {
    if (!bandFits) return 0;
    return (p - 0.5) * -10; // -5deg to +5deg
  });

  // Floor parallax based on mouse & scroll
  const floorParallaxY = useTransform(smoothProgress, (p) => p * 60);

  // Cylindrical curvature presets for 4 connected panels
  const panel3DCurves = useMemo(
    () => [
      { rotY: 9.5, transZ: -20 },
      { rotY: 3.2, transZ: -4 },
      { rotY: -3.2, transZ: -4 },
      { rotY: -9.5, transZ: -20 },
    ],
    []
  );

  if (isMobile) {
    return (
      <section className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center bg-[#FFFFFF] py-14 overflow-hidden select-none text-[#111111]">
        {/* 3D PERSPECTIVE ROOM: SOLID RED FLOOR BEHIND VIDEOS */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          style={{ perspective: 1000, perspectiveOrigin: '50% 36%' }}
        >
          {/* 3D Solid Red Floor Plane ("Lantai Full Merah di Belakang Video") */}
          <div
            className="absolute -inset-x-[60%] bottom-0 h-[65vh] pointer-events-none overflow-hidden"
            style={{
              transform: 'rotateX(68deg) translateY(0%) translateZ(-20px)',
              transformOrigin: '50% 100%',
              backgroundColor: '#D7261E',
            }}
          >
            {/* Architectural Perspective Grid on Solid Red Floor */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.35) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px',
              }}
            />
          </div>
        </div>

        {/* Top Header */}
        <div className="w-full px-6 mb-4 flex items-center justify-between z-20 pointer-events-none text-micro text-black/60 tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E]" />
            <span>04 · Pillars</span>
          </div>
          <span className="font-mono text-xs text-black/80 font-medium">
            0{activeScrollIdx + 1} / 04
          </span>
        </div>

        {/* Horizontal Scroll Track (Smooth direct sideways swipe on phone) */}
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="relative z-20 w-full overflow-x-auto flex gap-4 px-6 pt-2 pb-6 snap-x snap-mandatory scrollbar-none touch-pan-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {strategy.map((item: StrategyItem, idx: number) => {
            const isActive = activeScrollIdx === idx;

            return (
              <div
                key={item.slug}
                onClick={() => setSelectedPillar(item)}
                className="snap-center shrink-0 w-[72vw] max-w-[280px] flex flex-col cursor-pointer select-none"
              >
                {/* 1080 x 1920 (9:16) Video Card */}
                <div
                  className={cn(
                    'relative w-full aspect-[9/16] rounded-[6px] overflow-hidden bg-[#111111] border transition-all duration-300 shadow-[0_20px_45px_rgba(0,0,0,0.2)]',
                    isActive
                      ? 'border-[#D7261E] ring-1 ring-[#D7261E]/40 scale-[1.01]'
                      : 'border-black/15 opacity-85'
                  )}
                >
                  <VideoOnView
                    src={item.video}
                    poster={item.poster}
                    aspect="9/16"
                    className="w-full h-full object-cover"
                    cursorLabel="VIEW"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-[2px] bg-black/60 backdrop-blur-sm border border-white/10 opacity-70">
                    <span className="font-mono text-[9px] text-[#EFE8D8] tracking-widest">
                      1080 × 1920
                    </span>
                  </div>
                </div>

                {/* Soft Floor Reflection */}
                <div
                  className="w-full h-12 overflow-hidden pointer-events-none opacity-15 -mt-0.5"
                  style={{
                    transform: 'scaleY(-1)',
                    maskImage:
                      'linear-gradient(to top, transparent 15%, rgba(0,0,0,0.8) 90%)',
                    WebkitMaskImage:
                      'linear-gradient(to top, transparent 15%, rgba(0,0,0,0.8) 90%)',
                    filter: 'blur(2px)',
                  }}
                >
                  <img src={item.poster} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Below Panel: Label Row */}
                <div className="mt-2 flex items-baseline justify-between px-1 text-[#111111]">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs opacity-50">
                      0{idx + 1}
                    </span>
                    <span className="font-sentient font-normal italic text-base tracking-normal text-[#111111]">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-poppins text-[10px] tracking-widest uppercase text-[#D7261E] flex items-center gap-1 font-medium">
                    <span>View</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Indicator Bar */}
        <div className="relative z-20 flex items-center justify-between w-full px-6 mt-4">
          <span className="text-micro text-black/50 tracking-widest uppercase text-[10px]">
            ← Swipe to explore →
          </span>
          <div className="flex items-center gap-2">
            {strategy.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToMobileIndex(idx)}
                aria-label={`Jump to pillar ${idx + 1}`}
                className={cn(
                  'h-1.5 transition-all rounded-full',
                  activeScrollIdx === idx
                    ? 'w-6 bg-[#D7261E]'
                    : 'w-1.5 bg-black/20 hover:bg-black/50'
                )}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      className="relative w-full bg-[#FFFFFF] h-[100dvh] min-h-[640px] max-h-[920px] overflow-hidden text-[#111111]"
    >
      {/* 3D Stage Container */}
      <div className="relative h-full w-full overflow-hidden flex flex-col justify-center items-center bg-[#FFFFFF] select-none">
        {/* 3D PERSPECTIVE ROOM: FULL SOLID RED FLOOR BEHIND VIDEOS */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          style={{
            perspective: 1200,
            perspectiveOrigin: '50% 36%',
          }}
        >
          {/* 3D Full Solid Red Floor Plane ("Lantai Full Merah di Belakang Video") */}
          <motion.div
            className="absolute -inset-x-[60%] bottom-0 h-[75vh] pointer-events-none overflow-hidden"
            style={{
              transform: 'rotateX(68deg) translateY(0%) translateZ(-25px)',
              transformOrigin: '50% 100%',
              y: floorParallaxY,
              backgroundColor: '#D7261E',
            }}
          >
            {/* White Architectural Perspective Grid Lines on Full Red Floor */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.35) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 1px, transparent 1px)
                `,
                backgroundSize: '64px 64px',
              }}
            />
          </motion.div>
        </div>

        {/* Top Minimal Stage Header */}
        <div className="absolute top-6 md:top-8 left-6 md:left-8 z-30 pointer-events-none flex items-center gap-3 text-micro text-black/60 tracking-[0.2em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E]" />
          <span>04 · Example Strategy / 4 Pillars</span>
        </div>

        {/* Central 3D Video Band Stage */}
        <div
          className="relative z-20 w-full flex items-center justify-center overflow-visible"
          style={{
            perspective: 1400,
            perspectiveOrigin: '50% 45%',
          }}
        >
          {/* Scroll & Camera Controlled Band */}
          <motion.div
            ref={trackRef}
            style={{
              x: bandTranslateX,
              rotateY: prefersReducedMotion ? 0 : cameraRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-6 shrink-0"
          >
            {strategy.map((item: StrategyItem, idx: number) => {
              const isHovered = hoveredIdx === idx;
              const hasHover = hoveredIdx !== null;
              const isActive = hasHover ? isHovered : activeScrollIdx === idx;
              const curve = panel3DCurves[idx] || panel3DCurves[0];

              return (
                <div
                  key={item.slug}
                  ref={(el) => {
                    panelRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setSelectedPillar(item)}
                  data-cursor="VIEW"
                  style={{
                    transform: prefersReducedMotion
                      ? 'none'
                      : `rotateY(${curve.rotY}deg) translateZ(${curve.transZ}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                  className={cn(
                    'group relative cursor-pointer flex flex-col transition-all duration-500 ease-out select-none',
                    // Sizing: 9:16 aspect ratio
                    isMobile
                      ? 'w-[62vw] max-w-[280px]'
                      : 'w-[clamp(210px,21vw,360px)]',
                    // Hover scale & dimming
                    hasHover
                      ? isHovered
                        ? 'scale-[1.03] z-30 opacity-100'
                        : 'scale-[0.99] z-10 opacity-70'
                      : isActive
                        ? 'opacity-100 z-20'
                        : 'opacity-90 z-10'
                  )}
                >
                  {/* The Video Card */}
                  <div
                    className={cn(
                      'relative w-full aspect-[9/16] rounded-[6px] overflow-hidden bg-[#111111] border transition-all duration-300 shadow-[0_24px_50px_rgba(0,0,0,0.2)]',
                      isHovered
                        ? 'border-[#D7261E] ring-1 ring-[#D7261E]/40'
                        : isActive
                          ? 'border-black/30'
                          : 'border-black/15'
                    )}
                  >
                    {/* Video on view (plays when active/hovered) */}
                    <VideoOnView
                      src={item.video}
                      poster={item.poster}
                      aspect="9/16"
                      className="w-full h-full object-cover"
                      cursorLabel="VIEW"
                    />

                    {/* Gradient Overlay for Cinematic Depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Corner Drafting Mark */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-[2px] bg-black/60 backdrop-blur-sm border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity">
                      <span className="font-mono text-[9px] text-[#FFFFFF] tracking-widest uppercase">
                        9:16
                      </span>
                    </div>
                  </div>

                  {/* Soft Floor Reflection (mirrored below panel) */}
                  <div
                    className="absolute -bottom-[28%] left-0 right-0 h-[28%] overflow-hidden pointer-events-none select-none opacity-15 transition-opacity duration-300 group-hover:opacity-25"
                    style={{
                      transform: 'scaleY(-1)',
                      maskImage:
                        'linear-gradient(to top, transparent 15%, rgba(0,0,0,0.85) 90%)',
                      WebkitMaskImage:
                        'linear-gradient(to top, transparent 15%, rgba(0,0,0,0.85) 90%)',
                      filter: 'blur(2px)',
                    }}
                  >
                    <img
                      src={item.poster}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Below Panel: Label Row */}
                  <div className="mt-3.5 flex items-baseline justify-between px-1 text-[#111111] pointer-events-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs opacity-50">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-sentient font-normal italic text-sm sm:text-base tracking-normal group-hover:text-[#D7261E] transition-colors">
                        {item.label}
                      </span>
                    </div>

                    <span className="font-poppins text-[10px] tracking-widest uppercase text-[#111111]/70 group-hover:text-[#D7261E] group-hover:opacity-100 transition-all flex items-center gap-1 font-medium">
                      <span>View</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll Invitation Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none select-none opacity-70">
          <span className="font-poppins text-[9px] text-[#111111] tracking-[0.25em] uppercase font-medium">
            Click to explore · Scroll for Archive ↓
          </span>
          <div className="w-[1px] h-4 bg-gradient-to-b from-black/60 to-transparent" />
        </div>
      </div>

      {/* In-Depth Pillar Detail Drawer (Pop-in without leaving the one-page flow) */}
      <StrategyDetailDrawer
        item={selectedPillar}
        isOpen={selectedPillar !== null}
        onClose={() => setSelectedPillar(null)}
        onSelectPillar={(pillar) => setSelectedPillar(pillar)}
      />
    </section>
  );
};
