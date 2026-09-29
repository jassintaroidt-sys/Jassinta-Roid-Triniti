import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockerPadlock } from './LockerPadlock';
import { LockerInterior } from './LockerInterior';
import { usePrefersReducedMotion } from '../../lib/useMediaQuery';
import { cn } from '../../lib/cn';

export interface LockerDoorProps {
  index: number;
  lockerNumber: number; // 130 to 134
  isOpen: boolean;
  isFullyOpened: boolean;
  isOpenTriggered: boolean;
  isCenterHovered: boolean;
  onOpenFlyerLightbox: (src: string, alt: string, title: string) => void;
  doorRotation: number; // 0 to -115 deg
}

export const LockerDoor: React.FC<LockerDoorProps> = ({
  index,
  lockerNumber,
  isOpen,
  isFullyOpened,
  isOpenTriggered,
  isCenterHovered,
  onOpenFlyerLightbox,
  doorRotation,
}) => {
  const isCenter = index === 2;
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="relative h-full w-full flex-shrink-0 flex-grow-0"
      style={{
        perspective: '1400px',
      }}
    >
      {/* Recessed Locker Compartment Box (Interior) - Switches to Black & White Architectural Sketch when opened on white */}
      <div
        className={cn(
          'relative h-full w-full rounded-[2px] overflow-hidden transition-all duration-700',
          isOpen
            ? 'bg-[#FFFFFF] border-2 border-[#111111] shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            : 'bg-[#0c0c0c] border border-[#222]'
        )}
      >
        {/* Architectural Sketch Outlines & Corner Crosshairs when opened */}
        {isOpen && (
          <>
            {/* Top-left & top-right sketch drafting ticks */}
            <div className="pointer-events-none absolute top-1 left-1 w-2 h-2 border-t border-l border-black/40 z-20" />
            <div className="pointer-events-none absolute top-1 right-1 w-2 h-2 border-t border-r border-black/40 z-20" />
            <div className="pointer-events-none absolute bottom-1 left-1 w-2 h-2 border-b border-l border-black/40 z-20" />
            <div className="pointer-events-none absolute bottom-1 right-1 w-2 h-2 border-b border-r border-black/40 z-20" />
            {/* Fine architectural side sketch guides */}
            <div className="pointer-events-none absolute inset-x-2 top-0 h-[1px] bg-black/15 z-20" />
            <div className="pointer-events-none absolute inset-x-2 bottom-0 h-[1px] bg-black/15 z-20" />
          </>
        )}

        <LockerInterior
          index={index}
          isOpen={isOpen}
          onOpenFlyerLightbox={onOpenFlyerLightbox}
        />

        {/* Subtle sketch paper ambient texture when opened */}
        <motion.div
          animate={{ opacity: isOpen ? 0.35 : 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:16px_16px] mix-blend-multiply"
        />
      </div>

      {/* 
        Front Swinging Metal Door:
        Visible only when not fully opened.
        When opening, swings on left hinge and dissolves smoothly to opacity: 0.
        Once fully opened, completely disappears so no content is blocked!
      */}
      <AnimatePresence>
        {!isFullyOpened && (
          <motion.div
            initial={{ opacity: 1, rotateY: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? 'none' : 'auto' }
                : {
                    rotateY: doorRotation,
                    opacity: isOpen ? 0 : 1,
                    pointerEvents: isOpen ? 'none' : 'auto',
                  }
            }
            exit={{
              opacity: 0,
              transition: { duration: 0.35, ease: 'easeOut' },
            }}
            transition={
              prefersReducedMotion
                ? { duration: 0.3 }
                : {
                    rotateY: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.45, delay: isOpen ? 0.35 : 0 },
                  }
            }
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0 z-20 rounded-[2px] bg-gradient-to-b from-[#2e2e2e] via-[#1d1d1d] to-[#121212] border-r border-[#111] shadow-[inset_1px_0_0_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.1),inset_-1px_0_0_rgba(0,0,0,0.6),3px_0_10px_rgba(0,0,0,0.8)] overflow-hidden select-none"
          >
            {/* Subtle brushed metal horizontal & vertical texture */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]" />

            {/* Left Edge Hinges */}
            <div className="absolute top-8 left-0 w-1.5 h-6 bg-gradient-to-r from-[#111] via-[#666] to-[#222] shadow-[0_1px_2px_rgba(0,0,0,0.8)] rounded-r-[1px]" />
            <div className="absolute bottom-8 left-0 w-1.5 h-6 bg-gradient-to-r from-[#111] via-[#666] to-[#222] shadow-[0_1px_2px_rgba(0,0,0,0.8)] rounded-r-[1px]" />

            {/* Door Anatomy Inner Container */}
            <div className="relative h-full w-full flex flex-col justify-between p-3 sm:p-4">
              {/* Top Section: Rivets + 6 Louvres */}
              <div>
                {/* Top Corner Rivets */}
                <div className="flex justify-between items-center px-1 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.9),0_0.5px_0_rgba(255,255,255,0.3)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.9),0_0.5px_0_rgba(255,255,255,0.3)]" />
                </div>

                {/* 6 Top Louvre Ventilation Slots */}
                <div className="w-3/5 mx-auto space-y-1 sm:space-y-1.5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 sm:h-1.5 w-full bg-[#0a0a0a] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.08)]"
                    />
                  ))}
                </div>

                {/* Ivory Number Plate with red digits (130-134) */}
                <div className="mt-4 flex justify-center">
                  <div className="px-2 py-0.5 bg-[#EFE8D8] border border-[#222] shadow-[0_1px_3px_rgba(0,0,0,0.7)] flex items-center justify-center gap-1.5 rounded-[1px]">
                    <div className="w-1 h-1 rounded-full bg-[#333]" />
                    <span className="font-poppins font-bold text-[10px] sm:text-[11px] text-[#D7261E] tracking-wider leading-none">
                      {lockerNumber}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-[#333]" />
                  </div>
                </div>
              </div>

              {/* Middle Section: Latch & Padlock */}
              <div className="relative flex justify-center my-auto">
                <LockerPadlock
                  isRattling={isCenter && isCenterHovered && !isOpenTriggered}
                  isUnlocked={isCenter ? isOpenTriggered : false}
                />
              </div>

              {/* Bottom Section: 5 Louvres + Bottom Rivets */}
              <div>
                {/* 5 Bottom Louvre Slots */}
                <div className="w-3/5 mx-auto space-y-1 sm:space-y-1.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 sm:h-1.5 w-full bg-[#0a0a0a] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.08)]"
                    />
                  ))}
                </div>

                {/* Bottom Corner Rivets */}
                <div className="flex justify-between items-center px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.9),0_0.5px_0_rgba(255,255,255,0.3)]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_0.5px_1px_rgba(0,0,0,0.9),0_0.5px_0_rgba(255,255,255,0.3)]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
