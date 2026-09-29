import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../lib/useMediaQuery';

export interface PaperSignProps {
  onOpenClick: () => void;
  onHoverChange: (isHovered: boolean) => void;
  isOpenTriggered?: boolean;
}

export const PaperSign: React.FC<PaperSignProps> = ({
  onOpenClick,
  onHoverChange,
  isOpenTriggered = false,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { y: -30, opacity: 0, scale: 0.95 }
      }
      animate={
        isOpenTriggered
          ? {
              opacity: 0,
              y: -15,
              scale: 0.96,
              transition: { duration: 0.4, ease: 'easeOut' },
            }
          : {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 120,
                damping: 14,
                mass: 0.8,
                delay: 0.2,
              },
            }
      }
      className="relative flex flex-col items-center select-none pointer-events-auto z-50"
    >
      {/* Outer Drop Shadow Wrapper (Filter applies shadow along actual polygon cut) */}
      <div className="relative filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)] drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]">
        {/* Embossed Raised Paper Plate */}
        <div
          className="relative w-[88vw] max-w-[460px] md:w-[34vw] bg-[#EFE8D8] text-[#1b1917] p-5 sm:p-7 md:p-8 -rotate-1 shadow-[inset_1px_1px_0_rgba(255,255,255,0.7),inset_-1px_-1px_0_rgba(0,0,0,0.2)] border border-[#d8cfbd]/50"
          style={{
            clipPath:
              'polygon(1% 1.8%, 98.6% 0.5%, 99.6% 98%, 84% 97.5%, 81% 99.4%, 24% 99.1%, 19% 97.8%, 0.6% 96.5%)',
          }}
        >
          {/* Subtle Paper Noise Texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-15"
          >
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="paper-noise">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.6"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#paper-noise)" />
            </svg>
          </div>

          {/* Translucent Frosted Tape Strips on Top Corners sticking to lockers behind */}
          <div
            aria-hidden="true"
            className="absolute -top-3 left-4 w-12 sm:w-16 h-6 sm:h-7 bg-[rgba(239,232,216,0.65)] backdrop-blur-[1px] -rotate-12 border-t border-b border-[rgba(255,255,255,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.35)] pointer-events-none z-30"
          />
          <div
            aria-hidden="true"
            className="absolute -top-3 right-4 w-12 sm:w-16 h-6 sm:h-7 bg-[rgba(239,232,216,0.65)] backdrop-blur-[1px] rotate-8 border-t border-b border-[rgba(255,255,255,0.5)] shadow-[0_2px_4px_rgba(0,0,0,0.35)] pointer-events-none z-30"
          />

          {/* Embossed Typography */}
          <div className="relative z-10 flex flex-col items-center text-center leading-[1.02] tracking-tight">
            {/* Line 1: Content that (Sentient Regular 400 normal) */}
            <div className="overflow-hidden">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
                animate={prefersReducedMotion ? { opacity: 1 } : { y: '0%' }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="font-sentient font-normal text-[clamp(16px,1.9vw,34px)] text-[#24211d]"
                style={{
                  textShadow:
                    '1px 1px 0 rgba(255,255,255,0.65), -1px -1px 0 rgba(0,0,0,0.3)',
                }}
              >
                Content that
              </motion.div>
            </div>

            {/* Line 2: is Felt, (Sentient Bold Italic 700, LARGEST line, "Felt," in --red) */}
            <div className="overflow-hidden my-0.5">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
                animate={prefersReducedMotion ? { opacity: 1 } : { y: '0%' }}
                transition={{ duration: 0.65, delay: 0.45 }}
                className="font-sentient font-bold italic text-[clamp(34px,4.2vw,76px)] leading-none text-[#1b1917]"
                style={{
                  textShadow:
                    '1px 1px 0 rgba(255,255,255,0.7), -1px -1px 0 rgba(0,0,0,0.35)',
                }}
              >
                <span>is </span>
                <span
                  className="text-[#D7261E]"
                  style={{
                    textShadow:
                      '1px 1px 0 rgba(255,255,255,0.5), -1px -1px 0 rgba(80,0,0,0.4)',
                  }}
                >
                  Felt,
                </span>
              </motion.div>
            </div>

            {/* Line 3: Shared, (Sentient Italic 400) */}
            <div className="overflow-hidden my-0.5">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
                animate={prefersReducedMotion ? { opacity: 1 } : { y: '0%' }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="font-sentient font-normal italic text-[clamp(22px,2.7vw,48px)] text-[#24211d]"
                style={{
                  textShadow:
                    '1px 1px 0 rgba(255,255,255,0.65), -1px -1px 0 rgba(0,0,0,0.3)',
                }}
              >
                Shared,
              </motion.div>
            </div>

            {/* Line 4: Remembered. (Sentient Bold 700) */}
            <div className="overflow-hidden">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
                animate={prefersReducedMotion ? { opacity: 1 } : { y: '0%' }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="font-sentient font-bold not-italic text-[clamp(28px,3.5vw,62px)] text-[#181614]"
                style={{
                  textShadow:
                    '1px 1px 0 rgba(255,255,255,0.7), -1px -1px 0 rgba(0,0,0,0.35)',
                }}
              >
                Remembered.
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* [OPEN] Button below the sign placed in front */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.35 }}
        className="mt-6 md:mt-8 z-30 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]"
      >
        <button
          type="button"
          onClick={onOpenClick}
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          onFocus={() => onHoverChange(true)}
          onBlur={() => onHoverChange(false)}
          disabled={isOpenTriggered}
          aria-label="Open the locker"
          data-cursor="OPEN"
          className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3 -rotate-2 bg-[#D7261E] text-[#EFE8D8] font-poppins font-semibold text-xs md:text-sm tracking-[0.14em] uppercase transition-all duration-200 hover:-translate-y-0.5 active:translate-y-1 shadow-[0_5px_15px_rgba(215,38,30,0.5),0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.4)] border border-[#a81912] focus-visible:outline-2 focus-visible:outline-[#EFE8D8] focus-visible:outline-offset-4 disabled:pointer-events-none"
        >
          <span className="leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
            OPEN
          </span>
          <span className="font-mono text-[10px] leading-none transition-transform duration-200 group-hover:translate-x-0.5">
            ▶
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};
