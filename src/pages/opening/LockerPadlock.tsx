import React from 'react';
import { motion } from 'framer-motion';

export interface LockerPadlockProps {
  isRattling?: boolean;
  isUnlocked?: boolean;
  className?: string;
}

export const LockerPadlock: React.FC<LockerPadlockProps> = ({
  isRattling = false,
  isUnlocked = false,
  className = '',
}) => {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Chrome vertical latch recessed mount plate */}
      <div className="w-5 sm:w-6 h-14 sm:h-16 rounded-[2px] bg-gradient-to-r from-[#2a2a2a] via-[#888888] to-[#222222] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.15)] flex flex-col items-center justify-between py-1 border border-[#1a1a1a]">
        {/* Top rivet */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8),0_0.5px_0_rgba(255,255,255,0.4)]" />

        {/* Chrome turn lever / handle */}
        <div className="w-2.5 sm:w-3 h-6 sm:h-7 bg-gradient-to-b from-[#e0e0e0] via-[#9e9e9e] to-[#4e4e4e] rounded-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.8)] border border-[#333]" />

        {/* Latch loop ring */}
        <div className="w-2 sm:w-2.5 h-2.5 sm:h-3 rounded-full border-2 border-[#777] bg-[#111] -mb-1" />

        {/* Bottom rivet */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8),0_0.5px_0_rgba(255,255,255,0.4)]" />
      </div>

      {/* Padlock attached through the latch ring */}
      <motion.div
        animate={
          isUnlocked
            ? {
                y: [0, 4, 18],
                rotate: [0, 15, 28],
                opacity: [1, 1, 0],
                transition: { duration: 0.35, ease: 'easeIn' },
              }
            : isRattling
              ? {
                  rotate: [0, -6, 6, -5, 5, -2, 0],
                  x: [0, -1.5, 1.5, -1, 1, 0],
                  transition: { duration: 0.25, repeat: Infinity },
                }
              : {
                  rotate: 0,
                  x: 0,
                  y: 0,
                }
        }
        className="relative -mt-2 flex flex-col items-center z-10"
      >
        {/* Shackle (horseshoe hook) */}
        <motion.div
          animate={
            isUnlocked
              ? { y: -4, rotate: -25, transition: { duration: 0.15 } }
              : { y: 0, rotate: 0 }
          }
          className="w-5 sm:w-6 h-6 sm:h-7 border-[2.5px] border-[#b0b0b0] rounded-t-full border-b-0 shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          style={{ transformOrigin: 'top left' }}
        />

        {/* Padlock Body */}
        <div className="-mt-1.5 w-7 sm:w-8 h-8 sm:h-9 rounded-[3px] bg-gradient-to-b from-[#2e2e2e] via-[#1a1a1a] to-[#0f0f0f] border border-[#444] shadow-[0_4px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col items-center justify-center p-1">
          {/* Combination Rotary Dial */}
          <div className="w-5 sm:w-5.5 h-5 sm:h-5.5 rounded-full bg-gradient-to-tr from-[#111] via-[#333] to-[#222] border border-[#555] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center relative">
            {/* Notch marks */}
            <div className="absolute inset-0.5 rounded-full border border-dashed border-[#888]/40" />
            {/* Center knob */}
            <div className="w-2 h-2 rounded-full bg-gradient-to-b from-[#ddd] to-[#777] shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
