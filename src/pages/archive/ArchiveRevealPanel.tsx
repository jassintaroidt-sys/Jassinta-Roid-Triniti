import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchiveWorkItem } from '../../data/archive';

export interface ArchiveRevealPanelProps {
  work: ArchiveWorkItem;
}

function getMediaLayoutType(work: ArchiveWorkItem): 'landscape' | 'square' | 'portrait' {
  const aspectStr = (work.aspect || '').toLowerCase().trim();

  // If landscape (16:9, 1920:1080)
  if (
    aspectStr === '16/9' ||
    aspectStr === '16:9' ||
    aspectStr === '1920/1080' ||
    aspectStr === '1920:1080'
  ) {
    return 'landscape';
  }

  // If square or near-square (1:1, 1080/1072) or writing work
  if (
    aspectStr === '1/1' ||
    aspectStr === '1:1' ||
    aspectStr === '1080/1072' ||
    aspectStr === '1080:1072' ||
    work.format === 'Writing'
  ) {
    return 'square';
  }

  // If 4:5 flyer (1080/1350)
  if (
    aspectStr === '4/5' ||
    aspectStr === '4:5' ||
    aspectStr === '1080/1350' ||
    aspectStr === '1080:1350'
  ) {
    return 'square';
  }

  // Default to portrait (9:16, 1080/1920)
  return 'portrait';
}

export const ArchiveRevealPanel: React.FC<ArchiveRevealPanelProps> = memo(({ work }) => {
  const layoutType = getMediaLayoutType(work);
  const [hasError, setHasError] = useState(false);

  const handleClick = () => {
    if (work.url) {
      window.open(work.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Stack count based on aspect ratio:
  // - Landscape (16:9): 4 vertical stacked tiles (as in Aset 6.png filmstrip)
  // - Square (1:1 / 4:5): 2 vertical stacked tiles (forms 1:2 vertical ratio)
  // - Portrait (9:16): 1 single full-bleed tile
  const tileCount = layoutType === 'landscape' ? 4 : layoutType === 'square' ? 2 : 1;

  return (
    <div
      onClick={handleClick}
      data-cursor={work.url ? 'OPEN' : undefined}
      className={`w-full h-full relative overflow-hidden select-none bg-[#0c0c0c] ${
        work.url ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={work.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full relative"
        >
          {/* Landscape 16:9: 4 vertical stacked filmstrip panels (Aset 6 reference) */}
          {tileCount === 4 && (
            <div className="w-full h-full grid grid-rows-4 divide-y divide-black/60">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="relative w-full h-full overflow-hidden bg-[#111]">
                  {work.kind === 'video' ? (
                    <video
                      src={work.src}
                      poster={work.poster}
                      muted
                      playsInline
                      loop
                      autoPlay
                      onError={() => setHasError(true)}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  ) : (
                    <img
                      src={work.src}
                      alt={`${work.title} - ${idx + 1}`}
                      loading="eager"
                      onError={() => setHasError(true)}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Square 1:1 or 4:5: 2 vertical stacked collage panels */}
          {tileCount === 2 && (
            <div className="w-full h-full grid grid-rows-2 divide-y divide-black/60">
              {[0, 1].map((idx) => (
                <div key={idx} className="relative w-full h-full overflow-hidden bg-[#111]">
                  {work.kind === 'video' ? (
                    <video
                      src={work.src}
                      poster={work.poster}
                      muted
                      playsInline
                      loop
                      autoPlay
                      onError={() => setHasError(true)}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  ) : (
                    <img
                      src={work.src}
                      alt={`${work.title} - ${idx + 1}`}
                      loading="eager"
                      onError={() => setHasError(true)}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Portrait 9:16: 1 single full-bleed panel */}
          {tileCount === 1 && (
            <div className="relative w-full h-full overflow-hidden bg-[#111]">
              {work.kind === 'video' ? (
                <video
                  src={work.src}
                  poster={work.poster}
                  muted
                  playsInline
                  loop
                  autoPlay
                  onError={() => setHasError(true)}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              ) : (
                <img
                  src={work.src}
                  alt={work.title}
                  loading="eager"
                  onError={() => setHasError(true)}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              )}
            </div>
          )}

          {/* Graceful Fallback if asset is missing */}
          {hasError && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#181818] via-[#111111] to-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center select-none z-10">
              <span className="font-mono text-xs text-[#EFE8D8]/40 mb-1">
                {work.aspect || work.format}
              </span>
              <span className="font-sentient font-bold italic text-base text-[#EFE8D8] max-w-[280px]">
                {work.title}
              </span>
              <span className="font-poppins text-xs text-[#EFE8D8]/50 uppercase tracking-widest mt-1">
                {work.company} · {work.type}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

ArchiveRevealPanel.displayName = 'ArchiveRevealPanel';
