import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { DocumentCanvas } from './DocumentCanvas';

export const PersonalBrand: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 850 });

  useEffect(() => {
    const updateSize = () => {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      setIsMobile(w < 768);

      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Initial check after paint
    const timer = setTimeout(updateSize, 100);

    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="personal-brand"
      className="relative w-full min-h-[100dvh] lg:min-h-[130vh] bg-[#FFFFFF] text-[#000000] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Top Editorial Navbar (Menu only, no JASSINTA in corner) */}
      <Navbar />

      {/* Main Interactive Stage with Ref for Absolute Drag Tracking */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 flex flex-col items-center justify-center pt-16 pb-12 sm:pt-20 sm:pb-16"
      >
        {/* Central Giant Typography (in Sentient) + Cut-out Jassinta Portrait */}
        <div className="relative w-full max-w-[94vw] mx-auto flex items-center justify-center min-h-[650px] lg:min-h-[820px]">
          <Hero isMobile={isMobile} />

          {/* 10 Independent Draggable Document Sheets */}
          <DocumentCanvas
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Bottom Minimalist Editorial Footer Bar */}
      <div className="w-full border-t border-black/10 py-3.5 px-6 flex items-center justify-between text-micro text-black/50 font-mono uppercase tracking-widest bg-white z-20">
        <span>© Jassinta Roid Triniti</span>
        <span className="text-[#E10600]">Drag & Arrange Sheets</span>
      </div>
    </section>
  );
};

export default PersonalBrand;
