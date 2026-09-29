import React, { useState } from 'react';
import { WritingWork } from '../../data/content';
import { cn } from '../../lib/cn';

export interface CassetteDiscProps {
  item: WritingWork;
  isActive: boolean;
  offset: number; // continuous offset o = i - f
  step: number;
  diameter: number;
  onClick: () => void;
  pointerX?: number; // relative pointer position [-1, 1]
  pointerY?: number;
}

// High-fidelity simulated article screenshot mockup when actual image file is pending
const ArticleScreenshotMockup: React.FC<{ item: WritingWork; diameter: number }> = ({ item }) => {
  return (
    <div className="relative w-full h-full rounded-full bg-[#181818] text-[#EFE8D8] p-5 sm:p-7 flex flex-col justify-between select-none overflow-hidden font-poppins [clip-path:circle(50%_at_50%_50%)]">
      {/* Background newspaper grid watermark */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none rounded-full" />

      {/* Top Media Masthead Bar */}
      <div className="relative z-10 w-full flex items-center justify-between pb-2 border-b border-[rgba(239,232,216,0.18)]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E]" />
          <span className="font-poppins font-bold text-[9px] sm:text-[10px] tracking-wider uppercase text-[#EFE8D8]">
            {item.media}
          </span>
        </div>
        <span className="text-[8px] sm:text-[9px] text-[#EFE8D8]/50 tracking-wider">
          {item.date} · Digital
        </span>
      </div>

      {/* Main Headline & Byline */}
      <div className="relative z-10 my-auto py-2">
        <div className="inline-block px-1.5 py-0.5 rounded-[2px] bg-[#D7261E]/20 text-[#D7261E] text-[7px] sm:text-[8px] uppercase tracking-wider font-semibold mb-1">
          {item.type}
        </div>
        <h4 className="font-sentient text-[11px] sm:text-[13px] font-normal text-[#EFE8D8] leading-tight line-clamp-3 text-balance">
          {item.title}
        </h4>
        <p className="text-[8px] sm:text-[9px] text-[#EFE8D8]/60 mt-1 italic">
          By {item.author}
        </p>

        {/* Simulated Editorial 2-Column Article Paragraphs */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 opacity-50">
          <div className="space-y-1">
            <div className="h-1 bg-[#EFE8D8]/40 rounded-full w-full" />
            <div className="h-1 bg-[#EFE8D8]/30 rounded-full w-[90%]" />
            <div className="h-1 bg-[#EFE8D8]/35 rounded-full w-[75%]" />
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-[#EFE8D8]/35 rounded-full w-full" />
            <div className="h-1 bg-[#EFE8D8]/30 rounded-full w-[85%]" />
            <div className="h-1 bg-[#EFE8D8]/25 rounded-full w-[60%]" />
          </div>
        </div>
      </div>

      {/* Bottom Micro Indicator */}
      <div className="relative z-10 pt-1.5 border-t border-[rgba(239,232,216,0.12)] flex items-center justify-between text-[7px] sm:text-[8px] text-[#EFE8D8]/40">
        <span className="tracking-widest uppercase">Cover Artwork</span>
        <span className="font-mono text-[#D7261E]/70">Vinyl Disc Face ◯</span>
      </div>
    </div>
  );
};

export const CassetteDisc: React.FC<CassetteDiscProps> = ({
  item,
  isActive,
  offset,
  step,
  diameter,
  onClick,
  pointerX = 0,
  pointerY = 0,
}) => {
  const [imageError, setImageError] = useState(false);

  // 3D Transform calculations based on offset o:
  // translateX(o * step) translateZ(-min(|o|,3) * 120px) rotateY(clamp(-o*32, -58, 58)deg) rotateX(8deg) rotateZ(-o*4deg) scale(1 - min(|o|,3)*0.12)
  const clampO = Math.min(Math.abs(offset), 3);
  const tx = offset * step;
  const tz = -clampO * 120;
  const ry = Math.max(-58, Math.min(58, -offset * 32));
  const rx = 8 + (isActive ? pointerY * -5 : 0);
  const rz = -offset * 4;
  const scale = 1 - clampO * 0.12 + (isActive ? 0.02 : 0);
  const opacity = Math.max(0, 1 - clampO * 0.2);

  // Center hole diameter is ~22% of disc diameter
  const hubSize = Math.round(diameter * 0.22);
  const hubRadius = hubSize / 2;

  // TextPath SVG path circle coordinates for engraved rim text
  const svgSize = hubSize + 48;
  const svgCenter = svgSize / 2;
  const textRadius = hubRadius + 14;

  const engravedText = `SIDE A · ${item.media.toUpperCase()} · ${item.date}`;

  // Unique SVG textPath ID
  const pathId = `cassette-path-${item.id}`;

  return (
    <div
      onClick={onClick}
      data-cursor={isActive ? (item.url ? 'OPEN' : undefined) : undefined}
      style={{
        width: `${diameter}px`,
        height: `${diameter}px`,
        transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${scale})`,
        opacity,
        zIndex: Math.round(100 - Math.abs(offset) * 10),
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer select-none transition-shadow duration-300',
        isActive ? 'cursor-pointer' : 'cursor-pointer'
      )}
    >
      {/* Soft Contact Shadow Ellipse under the disc (Pure radial gradient, no CSS blur filter to avoid square raster bounding box) */}
      <div
        aria-hidden="true"
        style={{
          width: `${diameter * 0.85}px`,
          height: `${diameter * 0.28}px`,
          transform: `translateX(-50%) translateY(${diameter * 0.44}px) rotateX(75deg)`,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.12) 45%, transparent 70%)',
        }}
        className="pointer-events-none absolute left-1/2 rounded-full opacity-80"
      />

      {/* 1. Outer Metallic Rim with Conic Specular Highlight */}
      <div
        style={{
          padding: `${Math.max(4, Math.round(diameter * 0.038))}px`,
        }}
        className="relative h-full w-full rounded-full bg-gradient-to-tr from-[#888888] via-[#e5e5e5] to-[#555555] shadow-[0_12px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.5)] overflow-hidden [clip-path:circle(50%_at_50%_50%)]"
      >
        {/* Subtle dark hairline outer bevel */}
        <div className="absolute inset-0 rounded-full border border-black/25 pointer-events-none z-30" />

        {/* 2. Disc Face Container: Circular Clipping Mask for Square Screenshot Photo */}
        <div
          style={{
            clipPath: 'circle(50% at 50% 50%)',
          }}
          className="relative h-full w-full rounded-full overflow-hidden bg-[#141414] [clip-path:circle(50%_at_50%_50%)]"
        >
          {/* Square Screenshot Photo: clipped to the circular vinyl disc */}
          {!imageError ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover object-center rounded-full select-none pointer-events-none transform transition-transform duration-700 hover:scale-105 [clip-path:circle(50%_at_50%_50%)]"
            />
          ) : (
            <ArticleScreenshotMockup item={item} diameter={diameter} />
          )}

          {/* Concentric Real Vinyl Sound Grooves Over the Clipped Photo */}
          <div
            style={{
              background: `repeating-radial-gradient(circle at 50% 50%, transparent, transparent 3px, rgba(0,0,0,0.28) 4px, rgba(255,255,255,0.06) 5px)`,
            }}
            className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay opacity-90"
          />

          {/* CD/Cassette/Vinyl Gloss Overlay with Shifting Conic Light Streaks */}
          <div
            style={{
              background: `conic-gradient(from ${180 + pointerX * 35}deg at 50% 50%, rgba(255,255,255,0.35) 0deg, transparent 50deg, rgba(255,255,255,0.18) 120deg, transparent 180deg, rgba(255,255,255,0.3) 240deg, transparent 295deg, rgba(255,255,255,0.35) 360deg)`,
            }}
            className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay opacity-80"
          />

          {/* Concentric border ring */}
          <div className="pointer-events-none absolute inset-0 rounded-full border-[12px] border-black/20 opacity-50" />

          {/* 3. Center Cassette Spool Hub with Hole (Transparent See-Through Center) */}
          <div
            style={{
              width: `${hubSize + 48}px`,
              height: `${hubSize + 48}px`,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
          >
            {/* Circular Engraved TextPath ("SIDE A · MEDIA · DATE") */}
            <svg
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="absolute inset-0 h-full w-full pointer-events-none select-none"
            >
              <defs>
                <path
                  id={pathId}
                  d={`M ${svgCenter - textRadius}, ${svgCenter} a ${textRadius},${textRadius} 0 1,1 ${textRadius * 2},0 a ${textRadius},${textRadius} 0 1,1 -${textRadius * 2},0`}
                />
              </defs>
              <text className="font-poppins text-[7px] uppercase tracking-[0.22em] fill-[#EFE8D8]/50">
                <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                  {engravedText}
                </textPath>
              </text>
            </svg>

            {/* Hub Outer Precision Metallic Plastic Ring */}
            <div
              style={{
                width: `${hubSize + 16}px`,
                height: `${hubSize + 16}px`,
              }}
              className="rounded-full bg-gradient-to-tr from-[#1a1a1a] via-[#333333] to-[#222222] border border-[#555] shadow-[0_4px_12px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center p-1.5"
            >
              {/* Hub Spool Ring with 6 Cassette Reel Teeth */}
              <div
                style={{
                  width: `${hubSize}px`,
                  height: `${hubSize}px`,
                }}
                className="relative rounded-full bg-[#0A0A0A] border-2 border-[#666] shadow-[inset_0_2px_6px_rgba(0,0,0,0.95)] flex items-center justify-center"
              >
                {/* Transparent Inner Hole */}
                <div
                  style={{
                    width: `${Math.round(hubSize * 0.65)}px`,
                    height: `${Math.round(hubSize * 0.65)}px`,
                  }}
                  className="rounded-full bg-[#0A0A0A] border border-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,1)]"
                />

                {/* 6 Cassette Spool Drive Teeth Radially Arrayed */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <div
                    key={deg}
                    style={{
                      transform: `rotate(${deg}deg) translateY(-${Math.round(hubSize * 0.32)}px)`,
                    }}
                    className="absolute w-1 sm:w-1.5 h-2.5 sm:h-3 rounded-full bg-gradient-to-b from-[#888] to-[#222] shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CassetteDisc;
