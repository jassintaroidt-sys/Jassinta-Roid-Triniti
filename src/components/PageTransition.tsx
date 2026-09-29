import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { scrollToTop } from '../lib/useLenis';

export interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      if (prefersReducedMotion) {
        scrollToTop(true);
        setDisplayLocation(location);
      } else {
        setIsWiping(true);
        const timer = setTimeout(() => {
          scrollToTop(true);
          setDisplayLocation(location);
          const endTimer = setTimeout(() => {
            setIsWiping(false);
          }, 350);
          return () => clearTimeout(endTimer);
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [location, displayLocation.pathname, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-screen w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Wipe Panels Overlay */}
      <AnimatePresence>
        {isWiping && (
          <>
            {/* Panel 1: Ivory panel sweeping upward */}
            <motion.div
              key="wipe-ivory"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[80] bg-[#EFE8D8] pointer-events-none"
            >
              {/* Thin red line at leading top edge */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D7261E]" />
            </motion.div>

            {/* Panel 2: Black panel sweeping upward slightly delayed */}
            <motion.div
              key="wipe-black"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[81] bg-[#0A0A0A] pointer-events-none"
            >
              {/* Thin red line at leading top edge */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#D7261E]" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen w-full">
        {children}
      </div>
    </div>
  );
};
