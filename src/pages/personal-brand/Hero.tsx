import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  isMobile?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isMobile = false }) => {
  const [photoSrcIdx, setPhotoSrcIdx] = useState(0);

  const photoCandidates = [
  '/images/foto_jassinta_duduk.png',
  '/images/FOTO JASSINTA ROID TRINITI ESTETIK.png',
];

  const handlePhotoError = () => {
    if (photoSrcIdx + 1 < photoCandidates.length) {
      setPhotoSrcIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none z-10 py-6">
      {/* ============================================================ */}
      {/* GIANT EDITORIAL TYPOGRAPHY IN SENTIENT TYPEFACE               */}
      {/* With varied Sentient weights/styles for each word              */}
      {/* ============================================================ */}
      <div className="w-full flex flex-col items-center justify-center text-center leading-[0.88] select-none pointer-events-none">
        {/* Line 1: WHICH (Sentient Regular) */}
        <span className="font-sentient font-normal text-[clamp(60px,13vw,190px)] text-[#000000] tracking-tight block">
          WHICH
        </span>

        {/* Line 2: COMPANIES (Sentient Bold Italic in Red #E10600) */}
        <span className="font-sentient font-bold italic text-[clamp(54px,12.5vw,180px)] text-[#E10600] tracking-tight block -mt-1 sm:-mt-3">
          COMPANIES
        </span>

        {/* Line 3: HAVE I (Sentient Light / Normal Italic) */}
        <span className="font-sentient font-normal italic text-[clamp(56px,13vw,185px)] text-[#000000] tracking-tight block -mt-1 sm:-mt-3">
          HAVE I
        </span>

        {/* Line 4: WORKED (Sentient Bold) */}
        <span className="font-sentient font-bold text-[clamp(58px,13.5vw,195px)] text-[#000000] tracking-tight block -mt-1 sm:-mt-3">
          WORKED
        </span>

        {/* Line 5: FOR? (Sentient Normal + Red Question Mark) */}
        <span className="font-sentient font-normal text-[clamp(60px,14vw,200px)] text-[#000000] tracking-tight block -mt-1 sm:-mt-3">
          FOR<span className="font-sentient font-bold italic text-[#E10600]">?</span>
        </span>
      </div>

      {/* ============================================================ */}
      {/* FOTO JASSINTA: Well-proportioned cut-out editorial portrait  */}
      {/* Carefully sized so it overlaps tastefully without blocking   */}
      {/* ============================================================ */}
      <div
        className="absolute z-15 pointer-events-none flex items-center justify-center"
        style={{
          top: isMobile ? '24%' : '20%',
          right: isMobile ? '8%' : '22%',
          width: isMobile ? '46vw' : '26vw',
          maxWidth: '360px',
        }}
      >
        <div className="relative group">
          {/* Subtle editorial cut-out drop shadow */}
          <div className="absolute inset-0 filter blur-xl bg-black/10 transform translate-y-6 scale-90 -z-10 rounded-full" />

          <img
            src={photoCandidates[photoSrcIdx]}
            alt="Jassinta Roid Triniti"
            onError={handlePhotoError}
            className="w-full h-auto object-contain filter contrast-105 brightness-100 drop-shadow-[0_16px_32px_rgba(0,0,0,0.18)] select-none pointer-events-none"
          />

          {/* Minimalist Editorial Stamp */}
          <div className="absolute -bottom-1 -left-2 px-1.5 py-0.5 rounded-[2px] bg-[#E10600] text-white font-mono text-[8px] sm:text-[9px] tracking-widest uppercase shadow select-none">
            JASSINTA
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
