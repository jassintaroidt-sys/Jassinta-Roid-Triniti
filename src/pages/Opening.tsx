import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LockerDoor } from './opening/LockerDoor';
import { PaperSign } from './opening/PaperSign';
import { FlyerLightbox } from './opening/FlyerLightbox';
import { toc, person } from '../data/content';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { cn } from '../lib/cn';

type SceneState = 'closed' | 'opening' | 'opened';

interface OpeningProps {
  onLockerStateChange?: (isOpened: boolean) => void;
}

export const Opening: React.FC<OpeningProps> = ({ onLockerStateChange }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Always start closed on fresh view so the replay / sign appears first
  const [sceneState, setSceneState] = useState<SceneState>('closed');

  const [isOpenTriggered, setIsOpenTriggered] = useState(false);
  const [isCenterHovered, setIsCenterHovered] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(2); // Center on locker 3 (index 2)
  const [flickerState, setFlickerState] = useState<'dim' | 'flickering' | 'warm'>('dim');
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  // Door individual rotation angles
  const [doorAngles, setDoorAngles] = useState<number[]>([0, 0, 0, 0, 0]);

  // Lock body scroll until the user explicitly presses OPEN
  useEffect(() => {
    if (sceneState !== 'opened') {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (onLockerStateChange) onLockerStateChange(false);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (onLockerStateChange) onLockerStateChange(true);
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [sceneState, onLockerStateChange]);

  // Lightbox state
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
    title: string;
  }>({
    isOpen: false,
    src: '',
    alt: '',
    title: '',
  });

  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Auto-center carousel on locker 3 (video) on mobile/tablet when opened
  useEffect(() => {
    if (sceneState === 'opened' && carouselRef.current) {
      const container = carouselRef.current;
      const centerLocker = container.children[2] as HTMLElement | undefined;
      if (centerLocker) {
        const scrollLeft =
          centerLocker.offsetLeft - (container.clientWidth - centerLocker.clientWidth) / 2;
        container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
      }
    }
  }, [sceneState]);

  // Handle open sequence (~2.2s total; doors swing open and dissolve completely)
  const handleOpenClick = () => {
    if (sceneState !== 'closed') return;

    if (prefersReducedMotion) {
      setIsOpenTriggered(true);
      setDoorAngles([-108, -106, -112, -107, -109]);
      setFlickerState('warm');
      setSceneState('opened');
      setStatusAnnouncement('Lockers opened');
      return;
    }

    setIsOpenTriggered(true);
    setSceneState('opening');

    // Step 1: 0–350ms padlock pops open and paper sign fades
    // Step 2: 350ms: center door swings open and dissolves
    setTimeout(() => {
      setDoorAngles((prev) => {
        const next = [...prev];
        next[2] = -112; // Center door swings open
        return next;
      });
    }, 350);

    // Step 3: 700ms ambience flickers & shifts into warm light
    setTimeout(() => {
      setFlickerState('flickering');
      setTimeout(() => setFlickerState('warm'), 600);
    }, 700);

    // Step 4: 950–1450ms other four doors open in alternating center-out stagger and dissolve
    setTimeout(() => {
      // Locker 2 (index 1)
      setDoorAngles((prev) => {
        const next = [...prev];
        next[1] = -106;
        return next;
      });
    }, 950);

    setTimeout(() => {
      // Locker 4 (index 3)
      setDoorAngles((prev) => {
        const next = [...prev];
        next[3] = -107;
        return next;
      });
    }, 1100);

    setTimeout(() => {
      // Locker 1 (index 0)
      setDoorAngles((prev) => {
        const next = [...prev];
        next[0] = -108;
        return next;
      });
    }, 1250);

    setTimeout(() => {
      // Locker 5 (index 4)
      setDoorAngles((prev) => {
        const next = [...prev];
        next[4] = -109;
        return next;
      });
    }, 1400);

    // Step 5: 2000ms complete transition: all doors disappear completely, leaving clear compartments
    setTimeout(() => {
      setSceneState('opened');
      setStatusAnnouncement('Lockers opened');
    }, 2000);
  };

  // Replay handler to reset back to Scene 1
  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setDoorAngles([0, 0, 0, 0, 0]);
    setIsOpenTriggered(false);
    setFlickerState('dim');
    setSceneState('closed');
    setActiveCarouselIndex(2);
    setStatusAnnouncement('Lockers closed');
  };

  // Lightbox handlers
  const handleOpenFlyerLightbox = (src: string, alt: string, title: string) => {
    setLightboxData({
      isOpen: true,
      src,
      alt,
      title,
    });
  };

  const handleCloseFlyerLightbox = () => {
    setLightboxData((prev) => ({ ...prev, isOpen: false }));
  };

  // Update carousel active index on scroll
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const containerCenter = scrollLeft + container.clientWidth / 2;
      const distance = Math.abs(childCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveCarouselIndex(closestIndex);
  };

  return (
    <div
      className={cn(
        'relative min-h-[100dvh] w-full flex flex-col justify-between overflow-x-clip transition-colors duration-1000',
        sceneState === 'opened'
          ? 'bg-[#FFFFFF] text-[#111111]' // Clean bright white atmosphere when lockers open
          : 'bg-[#08090d] text-[#EFE8D8]' // cold blue-black in scene 1
      )}
    >
      {/* Screen Reader Announcement */}
      <div aria-live="polite" className="sr-only">
        {statusAnnouncement}
      </div>

      {/* Subtle Floor Horizon Line */}
      <div className={cn(
        "pointer-events-none fixed bottom-12 md:bottom-16 left-0 right-0 h-[1px] z-0 transition-colors duration-1000",
        sceneState === 'opened'
          ? "bg-gradient-to-r from-transparent via-black/10 to-transparent"
          : "bg-gradient-to-r from-transparent via-[#EFE8D8]/10 to-transparent"
      )} />

      {/* Main Lockers Stage Container with Dolly Zoom on Open */}
      <motion.div
        animate={{
          scale: sceneState === 'opened' && !prefersReducedMotion ? 1.03 : 1,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-4 md:px-8 py-6 md:py-10"
      >
        {/* Lockers Stage Wrapper with Absolute Floating Paper Sign in Front */}
        <div className="relative w-full flex items-center justify-center">
          {/* 
            Lockers Row Container
            Desktop: 5 lockers side by side
            Tablet & Mobile: scroll-snap carousel (active in opened state)
          */}
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className={cn(
              'w-full flex items-center justify-start xl:justify-center',
              sceneState === 'closed'
                ? 'overflow-x-hidden xl:overflow-x-visible'
                : 'overflow-x-auto xl:overflow-x-visible',
              'snap-x snap-mandatory xl:snap-none',
              'no-scrollbar py-4',
              // Height calculation: min(78dvh, 860px); mobile landscape height awareness
              'h-[clamp(460px,76dvh,840px)] max-h-[860px]'
            )}
            style={{
              scrollbarWidth: 'none',
            }}
          >
            {/* 5 Lockers */}
            {[130, 131, 132, 133, 134].map((lockerNum, idx) => {
              const isCenter = idx === 2;

              return (
                <div
                  key={lockerNum}
                  className={cn(
                    'h-full snap-center flex-shrink-0 transition-all duration-300 relative',
                    // Responsive locker widths
                    sceneState === 'closed'
                      ? isCenter
                        ? 'w-[68vw] sm:w-[50vw] md:w-[28vw] lg:w-[22vw] xl:w-[min(18vw,230px)] z-30'
                        : 'w-[42vw] sm:w-[32vw] md:w-[24vw] lg:w-[20vw] xl:w-[min(18vw,230px)] opacity-60 xl:opacity-100 z-10'
                      : 'w-[78vw] sm:w-[48vw] md:w-[30vw] lg:w-[23vw] xl:w-[min(18vw,230px)] z-10',
                    // Gaps between lockers
                    idx > 0 ? 'ml-1 sm:ml-1.5 md:ml-2' : ''
                  )}
                >
                  <LockerDoor
                    index={idx}
                    lockerNumber={lockerNum}
                    isOpen={sceneState === 'opened' || (sceneState === 'opening' && doorAngles[idx] < -20)}
                    isFullyOpened={sceneState === 'opened'}
                    isOpenTriggered={isOpenTriggered}
                    isCenterHovered={isCenterHovered}
                    onOpenFlyerLightbox={handleOpenFlyerLightbox}
                    doorRotation={doorAngles[idx]}
                  />
                </div>
              );
            })}
          </div>

          {/* 
            The Raised Paper Sign:
            Placed directly IN FRONT of the lockers with z-50.
            Never clipped by any locker boundaries; spans naturally across neighbor lockers like the reference.
          */}
          <AnimatePresence>
            {sceneState !== 'opened' && (
              <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
                <div className="pointer-events-auto -mt-6 sm:-mt-8">
                  <PaperSign
                    onOpenClick={handleOpenClick}
                    onHoverChange={setIsCenterHovered}
                    isOpenTriggered={isOpenTriggered}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Dot Indicators for Carousel in Scene 2 */}
        {sceneState === 'opened' && (
          <div className="flex xl:hidden items-center justify-center gap-1.5 mt-3 select-none">
            {[0, 1, 2, 3, 4].map((dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  if (carouselRef.current) {
                    const child = carouselRef.current.children[dotIdx] as HTMLElement | undefined;
                    if (child) {
                      const container = carouselRef.current;
                      const scrollLeft =
                        child.offsetLeft - (container.clientWidth - child.clientWidth) / 2;
                      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                    }
                  }
                }}
                aria-label={`Go to locker ${130 + dotIdx}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  activeCarouselIndex === dotIdx
                    ? 'w-5 bg-[#D7261E]'
                    : 'w-1.5 bg-[#EFE8D8]/30 hover:bg-[#EFE8D8]/60'
                )}
              />
            ))}
          </div>
        )}

        {/* Mobile 2-Column TOC Grid in Scene 2 (Positioned above footer row) */}
        {sceneState === 'opened' && (
          <div className="w-full max-w-md xl:hidden mt-4 px-4 pt-3 border-t border-black/10">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-micro">
              {toc.map((item) => {
                const isCurrent = item.path === '/';
                const pathToId: Record<string, string> = {
                  '/': 'opening',
                  '/writing-portfolio': 'writing-portfolio',
                  '/content-marketing-specialist': 'content-marketing-specialist',
                  '/example-strategy': 'example-strategy',
                  '/archive': 'archive',
                  '/contact': 'contact',
                };
                const targetId = pathToId[item.path] || 'opening';

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(targetId);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.history.replaceState(null, '', item.path);
                      }
                    }}
                    data-cursor="GO"
                    className="flex items-center gap-1.5 text-[#111111]/80 hover:text-[#D7261E] transition-colors truncate text-left"
                  >
                    {isCurrent ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D7261E] shrink-0" />
                    ) : (
                      <span className="font-mono text-[9px] text-[#111111]/40 shrink-0">→</span>
                    )}
                    <span className="truncate tracking-wider text-[11px] font-poppins">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* 
        Custom Integrated Bottom Footer
        Left: 2026 (plus tiny "Replay" text button below in Scene 2)
        Center: Jassinta Roid Triniti
        Right: 
          Scene 1: "Creative Portfolio"
          Scene 2 Desktop: 6-line TOC stack right-aligned with red dot on OPENING
      */}
      <footer
        role="contentinfo"
        className={cn(
          "relative z-30 flex items-end justify-between px-6 py-4 text-micro select-none pointer-events-auto transition-colors duration-700",
          sceneState === 'opened' ? 'text-[#111111]' : 'text-[#EFE8D8]'
        )}
        style={{
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'calc(1.5rem + env(safe-area-inset-left, 0px))',
          paddingRight: 'calc(1.5rem + env(safe-area-inset-right, 0px))',
        }}
      >
        {/* Left Column: 2026 + Replay */}
        <div className="flex flex-col items-start gap-1">
          <span className="tracking-widest tabular-nums opacity-80">{person.year}</span>
          {sceneState === 'opened' && (
            <button
              type="button"
              onClick={handleReplay}
              aria-label="Replay intro sequence and close lockers"
              data-cursor="REPLAY"
              className="font-poppins text-[10px] text-[#111111]/60 hover:text-[#D7261E] uppercase tracking-widest underline decoration-black/20 hover:decoration-[#D7261E] transition-colors cursor-pointer"
            >
              Replay
            </button>
          )}
        </div>

        {/* Center Column: Name & Scroll to Explore Cue (Absolute Bottom Center when Opened) */}
        <div className={cn(
          "flex flex-col items-center gap-1.5 pb-0.5",
          sceneState === 'opened'
            ? "absolute left-1/2 -translate-x-1/2 bottom-4 z-30"
            : ""
        )}>
          <div className="tracking-widest font-medium opacity-90 text-center">
            {person.name}
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('writing-portfolio');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.history.replaceState(null, '', '/writing-portfolio');
              }
            }}
            data-cursor="SCROLL"
            aria-label="Scroll to explore Writing Portfolio"
            className={cn(
              "group flex items-center gap-1.5 px-3.5 py-1 rounded-full text-micro transition-all cursor-pointer shadow-sm animate-bounce",
              sceneState === 'opened'
                ? "bg-black/5 hover:bg-black/10 border border-black/15 text-[#111111]/80 hover:text-[#D7261E]"
                : "bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-[#EFE8D8]/70 hover:text-[#D7261E]"
            )}
          >
            <span className="font-poppins text-[9px] uppercase tracking-[0.2em]">
              Scroll to Explore
            </span>
            <span className="font-mono text-xs">↓</span>
          </button>
        </div>

        {/* Right Column: Creative Portfolio (Scene 1) OR 6-Line TOC Stack (Scene 2 Desktop) */}
        <div className="flex flex-col items-end">
          {sceneState !== 'opened' ? (
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('writing-portfolio');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="tracking-widest opacity-80 uppercase hover:text-[#D7261E] transition-colors cursor-pointer"
            >
              Creative Portfolio ↓
            </button>
          ) : (
            <div className="hidden xl:flex flex-col items-end gap-1 text-right">
              {toc.map((item) => {
                const isCurrent = item.path === '/';
                const pathToId: Record<string, string> = {
                  '/': 'opening',
                  '/writing-portfolio': 'writing-portfolio',
                  '/content-marketing-specialist': 'content-marketing-specialist',
                  '/example-strategy': 'example-strategy',
                  '/archive': 'archive',
                  '/contact': 'contact',
                };
                const targetId = pathToId[item.path] || 'opening';

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(targetId);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.history.replaceState(null, '', item.path);
                      }
                    }}
                    data-cursor="GO"
                    className="group flex items-center gap-2 text-[11px] font-poppins uppercase tracking-wider text-[#111111]/80 hover:text-[#D7261E] transition-colors cursor-pointer"
                  >
                    <span>{item.label}</span>
                    {isCurrent ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D7261E]" />
                    ) : (
                      <span className="font-mono text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </footer>

      {/* Fullscreen High-Resolution Lightbox for Posters */}
      <FlyerLightbox
        isOpen={lightboxData.isOpen}
        onClose={handleCloseFlyerLightbox}
        src={lightboxData.src}
        alt={lightboxData.alt}
        title={lightboxData.title}
      />
    </div>
  );
};

export default Opening;
