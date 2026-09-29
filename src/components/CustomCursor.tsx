import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop with fine pointer and hover
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(media.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setEnabled(e.matches);
    };

    if (media.addEventListener) {
      media.addEventListener('change', handleMediaChange);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        setLabel(cursorTarget.getAttribute('data-cursor'));
        setIsHovered(true);
      } else if (target.closest('a, button, [role="button"], input[type="submit"]')) {
        setLabel(null);
        setIsHovered(true);
      } else {
        setLabel(null);
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (media.removeEventListener) {
        media.removeEventListener('change', handleMediaChange);
      }
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          width: label ? 64 : isHovered ? 28 : 8,
          height: label ? 64 : isHovered ? 28 : 8,
          borderRadius: '50%',
          backgroundColor: label ? '#EFE8D8' : isHovered ? 'transparent' : '#EFE8D8',
          border: isHovered && !label ? '1.5px solid #EFE8D8' : 'none',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="flex items-center justify-center overflow-hidden text-center"
      >
        {label && (
          <span className="font-poppins text-[10px] font-semibold tracking-wider text-[#0A0A0A] uppercase select-none">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};
