import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { Camera } from 'lucide-react';
import { VideoOnView } from './VideoOnView';
import { Media } from './Media';
import { TocButton } from './TocButton';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { cn } from '../lib/cn';

export interface HeroRevealLinePart {
  text: string;
  face?: 'regular' | 'italic' | 'bold' | 'boldItalic';
  color?: string;
}

export type HeroRevealLine =
  | { text: string; face?: 'regular' | 'italic' | 'bold' | 'boldItalic'; color?: string }
  | HeroRevealLinePart[];

export interface HeroRevealMediaItem {
  kind: 'image' | 'video';
  src: string;
  poster?: string;
  aspect?: string;
}

export interface HeroRevealProps {
  lines?: HeroRevealLine[];
  narration?: string;
  media?: HeroRevealMediaItem[];
  tocPosition?: 'top-right' | 'bottom-right' | 'hidden';
  // Backward compatibility with generic wrapper usage
  children?: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'h1' | 'h2' | 'p' | 'span';
}

// Preset slot coordinates: (x %, y %, rotation deg, parallax depth)
// Exactly calibrated with mathematical symmetry relative to center typography (x = 50%):
// Slot 0 (Left Top):    x: 16%, y: 22%, rot: -3.5, depth: 14
// Slot 1 (Right Top):   x: 84%, y: 22%, rot: +3.5, depth: 14   (mirrored: 100 - 16 = 84%)
// Slot 2 (Left Mid):    x: 11%, y: 50%, rot: +2.5, depth: 16
// Slot 3 (Right Mid):   x: 89%, y: 50%, rot: -2.5, depth: 16   (mirrored: 100 - 11 = 89%)
// Slot 4 (Left Bottom): x: 16%, y: 78%, rot: -2.5, depth: 14
// Slot 5 (Right Bottom):x: 84%, y: 78%, rot: +2.5, depth: 14   (mirrored: 100 - 16 = 84%)
const DESKTOP_PRESETS_6 = [
  { x: 16, y: 22, rot: -3.5, depth: 14 },
  { x: 84, y: 22, rot: 3.5, depth: 14 },
  { x: 11, y: 50, rot: 2.5, depth: 16 },
  { x: 89, y: 50, rot: -2.5, depth: 16 },
  { x: 16, y: 78, rot: -2.5, depth: 14 },
  { x: 84, y: 78, rot: 2.5, depth: 14 },
];

const DESKTOP_PRESETS_4 = [
  { x: 16, y: 24, rot: -3.5, depth: 14 },
  { x: 84, y: 24, rot: 3.5, depth: 14 },
  { x: 16, y: 76, rot: 2.5, depth: 14 },
  { x: 84, y: 76, rot: -2.5, depth: 14 },
];

const MOBILE_PRESETS_6 = [
  // Top row (above typography) - symmetrical relative to 50%
  { x: 18, y: 12, rot: -3, depth: 0 },
  { x: 50, y: 8.5, rot: 1.5, depth: 0 },
  { x: 82, y: 12, rot: 3, depth: 0 },
  // Bottom row (below typography) - symmetrical relative to 50%
  { x: 18, y: 88, rot: 2.5, depth: 0 },
  { x: 50, y: 91.5, rot: -1.5, depth: 0 },
  { x: 82, y: 88, rot: -2.5, depth: 0 },
];

const MOBILE_PRESETS_4 = [
  { x: 22, y: 12, rot: -2.5, depth: 0 },
  { x: 78, y: 12, rot: 2.5, depth: 0 },
  { x: 22, y: 88, rot: 2.5, depth: 0 },
  { x: 78, y: 88, rot: -2.5, depth: 0 },
];

interface HeroMediaCardProps {
  item: HeroRevealMediaItem;
  preset: { x: number; y: number; rot: number; depth?: number };
  idx: number;
  isMobile: boolean;
  isLandscapePhone: boolean;
  prefersReducedMotion: boolean;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
  onRegisterRef: (el: HTMLDivElement | null) => void;
}

// Dedicated unclipped 520x520 square placeholder component
const SquarePlaceholder520: React.FC<{ src: string; isMobile: boolean }> = ({ src, isMobile }) => {
  const filename = src.split('/').pop() || 'asset';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2.5 sm:p-3 bg-gradient-to-br from-[#1c1c1c] via-[#141414] to-[#0c0c0c] text-center select-none overflow-hidden">
      {/* Subtle print drafting corner crosshairs (inside boundaries, never clipped) */}
      <div className="absolute top-1.5 left-1.5 text-[8px] font-mono text-[#EFE8D8]/25 leading-none select-none">
        +
      </div>
      <div className="absolute top-1.5 right-1.5 text-[8px] font-mono text-[#EFE8D8]/25 leading-none select-none">
        +
      </div>
      <div className="absolute bottom-1.5 left-1.5 text-[8px] font-mono text-[#EFE8D8]/25 leading-none select-none">
        +
      </div>
      <div className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-[#EFE8D8]/25 leading-none select-none">
        +
      </div>

      {/* Subtle dashed framing guide */}
      <div className="absolute inset-1.5 rounded-[4px] border border-dashed border-[#EFE8D8]/15 pointer-events-none" />

      {/* Center Icon and Dimensions */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#EFE8D8]/10 flex items-center justify-center text-[#EFE8D8]/80 mb-0.5">
          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EFE8D8]" />
        </div>

        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E] animate-pulse" />
          <span className="font-poppins font-semibold text-[10px] sm:text-xs text-[#EFE8D8] tracking-wider">
            520 × 520
          </span>
        </div>

        {!isMobile && (
          <span className="font-poppins text-[8px] text-[#EFE8D8]/45 tracking-widest uppercase truncate max-w-[110px]">
            {filename}
          </span>
        )}
      </div>
    </div>
  );
};

const HeroMediaCard: React.FC<HeroMediaCardProps> = ({
  item,
  preset,
  idx,
  isMobile,
  isLandscapePhone,
  prefersReducedMotion,
  smoothMouseX,
  smoothMouseY,
  onRegisterRef,
}) => {
  const depth = typeof preset.depth === 'number' ? preset.depth : 14;
  const parallaxX = useTransform(smoothMouseX, (v) => (prefersReducedMotion ? 0 : v * depth));
  const parallaxY = useTransform(smoothMouseY, (v) => (prefersReducedMotion ? 0 : v * depth));
  const [imageError, setImageError] = useState(false);

  return (
    // Outer positioning wrapper: isolated from Framer Motion transform overrides
    // Guarantees exact center alignment at (preset.x%, preset.y%) across all viewports
    <div
      ref={onRegisterRef}
      className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        left: `${preset.x}%`,
        top: `${preset.y}%`,
      }}
    >
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.9,
                y: 16,
              }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.85,
                  delay: 0.15 + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                },
              }
        }
      >
        {/* Subtle continuous rotation tilt + mouse parallax */}
        <motion.div
          animate={
            prefersReducedMotion
              ? { rotate: preset.rot }
              : {
                  rotate: [preset.rot - 0.4, preset.rot + 0.4, preset.rot - 0.4],
                }
          }
          transition={
            prefersReducedMotion
              ? {}
              : {
                  duration: 5.5 + (idx % 3) * 0.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          style={{
            x: parallaxX,
            y: parallaxY,
          }}
          className={cn(
            'rounded-[8px] overflow-hidden bg-[#141414] border border-[rgba(239,232,216,0.22)] shadow-[0_16px_36px_rgba(0,0,0,0.85),0_3px_10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 hover:border-[#D7261E]/60 group',
            // Card dimensions: square 1:1 for 520x520 images, 9:16 for videos
            item.kind === 'video'
              ? isMobile
                ? 'w-[18vw] max-w-[80px] aspect-[9/16]'
                : 'w-[clamp(80px,8.5vw,140px)] aspect-[9/16]'
              : isMobile
                ? 'w-[20vw] max-w-[84px] aspect-square'
                : 'w-[clamp(95px,10.5vw,155px)] aspect-square',
            isLandscapePhone && 'scale-70'
          )}
        >
          {item.kind === 'video' ? (
            <VideoOnView
              src={item.src}
              poster={item.poster}
              aspect={item.aspect || '9/16'}
              className="w-full h-full object-cover"
              cursorLabel="PLAY"
            />
          ) : (
            <div className="relative w-full h-full">
              {!imageError ? (
                <img
                  src={item.src}
                  alt={`Writing Asset 520x520 - ${idx + 1}`}
                  loading="lazy"
                  decoding="async"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <SquarePlaceholder520 src={item.src} isMobile={isMobile} />
              )}

              {/* Subtle micro indicator badge */}
              <div className="pointer-events-none absolute bottom-1.5 right-1.5 px-1 py-0.5 rounded-[2px] bg-black/70 backdrop-blur-[2px] border border-white/10 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="font-poppins text-[8px] text-[#EFE8D8] tracking-widest leading-none uppercase">
                  520 × 520
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const HeroReveal: React.FC<HeroRevealProps> = ({
  lines,
  narration,
  media = [],
  tocPosition,
  children,
  delay = 0,
  className,
  as = 'div',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // If used as a simple text mask wrapper (backward compatibility for placeholders)
  if (!lines || !narration) {
    const Component = motion[as || 'div'];
    if (prefersReducedMotion) {
      return (
        <Component
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay }}
          className={className}
        >
          {children}
        </Component>
      );
    }
    return (
      <div className={cn('overflow-hidden', className)}>
        <Component
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            duration: 0.85,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {children}
        </Component>
      </div>
    );
  }

  // Full HeroReveal Section implementation (Aset 1 reference)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const [isLandscapePhone, setIsLandscapePhone] = useState(false);

  // Mouse move parallax values for fine-pointer devices
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 32, stiffness: 200, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkResponsive = () => {
      if (typeof window === 'undefined') return;
      setIsMobile(window.innerWidth < 768);
      setIsLandscapePhone(window.innerWidth > window.innerHeight && window.innerHeight < 480);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive, { passive: true });

    // Pointer move listener
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mouseX.set((e.clientX - centerX) / centerX);
      mouseY.set((e.clientY - centerY) / centerY);
    };

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (hasFinePointer) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', checkResponsive);
      if (hasFinePointer) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  // Dev-only assertion: verify cards do not intersect the text block
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const timer = setTimeout(() => {
        if (!textRef.current) return;
        const textRect = textRef.current.getBoundingClientRect();
        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          const cardRect = card.getBoundingClientRect();
          const isOverlapping = !(
            cardRect.right < textRect.left ||
            cardRect.left > textRect.right ||
            cardRect.bottom < textRect.top ||
            cardRect.top > textRect.bottom
          );
          if (isOverlapping) {
            console.warn(
              `[HeroReveal] Dev notice: card #${idx + 1} intersects the center text block at viewport size ${window.innerWidth}x${window.innerHeight}`
            );
          }
        });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [media.length]);

  const activePresets = isMobile
    ? media.length === 4
      ? MOBILE_PRESETS_4
      : MOBILE_PRESETS_6
    : media.length === 4
      ? DESKTOP_PRESETS_4
      : DESKTOP_PRESETS_6;

  const getFontFaceClass = (face: string) => {
    switch (face) {
      case 'boldItalic':
        return 'font-bold italic';
      case 'bold':
        return 'font-bold not-italic';
      case 'italic':
        return 'font-normal italic';
      default:
        return 'font-normal not-italic';
    }
  };

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-[#000000] text-[#FFFFFF] select-none',
        className
      )}
    >
      {/* Background Media Cards Scattered Around Center Text (All safely inside viewport) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-visible">
        {media.map((item, idx) => {
          const preset = activePresets[idx] || activePresets[0];

          return (
            <HeroMediaCard
              key={idx}
              item={item}
              preset={preset}
              idx={idx}
              isMobile={isMobile}
              isLandscapePhone={isLandscapePhone}
              prefersReducedMotion={prefersReducedMotion}
              smoothMouseX={smoothMouseX}
              smoothMouseY={smoothMouseY}
              onRegisterRef={(el) => {
                cardRefs.current[idx] = el;
              }}
            />
          );
        })}
      </div>

      {/* Center Text Block (Guaranteed z-index above media cards) */}
      <div
        ref={textRef}
        className="relative z-20 flex flex-col items-center justify-center text-center w-full max-w-[88vw] md:max-w-2xl lg:max-w-3xl px-4 sm:px-6 mx-auto pointer-events-auto"
      >
        {/* Headline Lines in Sentient */}
        <h1 className="font-sentient text-headline font-normal text-[#FFFFFF] leading-[1.02] tracking-tight text-balance flex flex-col items-center">
          {lines.map((line, lineIdx) => (
            <div key={lineIdx} className="overflow-hidden py-0.5">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { y: '105%' }}
                animate={prefersReducedMotion ? { opacity: 1 } : { y: '0%' }}
                transition={{
                  duration: 0.85,
                  delay: 0.1 + lineIdx * 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {Array.isArray(line) ? (
                  <div className="flex flex-wrap justify-center items-baseline gap-x-2.5">
                    {line.map((part, partIdx) => (
                      <span
                        key={partIdx}
                        className={cn(getFontFaceClass(part.face || 'regular'))}
                        style={{ color: part.color || '#FFFFFF' }}
                      >
                        {part.text}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span
                    className={cn(getFontFaceClass(line.face || 'regular'))}
                    style={{ color: line.color || '#FFFFFF' }}
                  >
                    {line.text}
                  </span>
                )}
              </motion.div>
            </div>
          ))}
        </h1>

        {/* Narration in Poppins italic - Pure White */}
        <motion.p
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 14, filter: 'blur(4px)' }
          }
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.8,
            delay: 0.45 + lines.length * 0.12,
            ease: 'easeOut',
          }}
          className="text-narration text-[#FFFFFF] text-center mx-auto text-pretty font-poppins italic opacity-95"
          style={{
            marginTop: 'var(--gap-headline, 1.5rem)',
            maxWidth: '58ch',
          }}
        >
          {narration}
        </motion.p>
      </div>

      {/* Bottom Center: Animated "Scroll" Invitation Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none select-none"
      >
        <span className="font-poppins text-micro text-[#EFE8D8]/45 tracking-[0.2em] uppercase text-[10px]">
          Scroll
        </span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#EFE8D8]/60 via-[#EFE8D8]/20 to-transparent relative overflow-hidden">
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-1/2 bg-[#D7261E]"
          />
        </div>
      </motion.div>

      {/* Index Trigger Button in Hero (if requested) */}
      {tocPosition && tocPosition !== 'hidden' && (
        <TocButton
          position={tocPosition}
          className="!absolute"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('open-toc'));
            }
          }}
        />
      )}
    </section>
  );
};

export default HeroReveal;
