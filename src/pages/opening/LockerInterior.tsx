import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye } from 'lucide-react';
import { opening } from '../../data/content';
import { cn } from '../../lib/cn';

export interface LockerInteriorProps {
  index: number;
  isOpen: boolean;
  onOpenFlyerLightbox: (src: string, alt: string, title: string) => void;
}

export const LockerInterior: React.FC<LockerInteriorProps> = ({
  index,
  isOpen,
  onOpenFlyerLightbox,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Center video playback management
  useEffect(() => {
    if (index !== 2 || !videoRef.current) return;

    const video = videoRef.current;

    if (isOpen) {
      video
        .play()
        .catch(() => {
          // Browser may restrict autoplay until interaction
        });
    } else {
      video.pause();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (isOpen) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      video.pause();
    };
  }, [isOpen, index]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div
      className={cn(
        'relative h-full w-full flex flex-col justify-between p-3 sm:p-4 md:p-5 overflow-hidden select-none transition-colors duration-700',
        isOpen
          ? 'bg-[#FFFFFF] text-[#111111] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]'
          : 'bg-gradient-to-b from-[#181818] via-[#111111] to-[#0a0a0a] text-[#EFE8D8] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(239,232,216,0.12)]'
      )}
    >
      {/* Top Locker Shelf Divider Line (Sketch Ink Line) */}
      <div
        className={cn(
          'w-full h-1 mb-2 transition-colors duration-700',
          isOpen ? 'bg-[#111111] shadow-none' : 'bg-[#1a1a1a] shadow-[0_1px_0_rgba(255,255,255,0.06),inset_0_1px_2px_rgba(0,0,0,0.8)]'
        )}
      />

      {/* Locker 1 (Index 0): I Can Help You With */}
      {index === 0 && (
        <div className="flex-1 flex flex-col justify-center">
          <div
            className={cn(
              'relative p-3.5 sm:p-4 md:p-5 rounded-[1px] rotate-[-0.8deg] transition-all duration-300 hover:rotate-0',
              isOpen
                ? 'bg-[#FAFAFA] text-[#111111] border-2 border-[#111111] shadow-[3px_4px_0px_rgba(0,0,0,0.15)]'
                : 'bg-[#EFE8D8] text-[#1a1a1a] shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(0,0,0,0.1)]'
            )}
          >
            {/* Top Pin Dot */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#D7261E] shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />

            <h3 className="font-sentient font-bold italic text-[clamp(14px,1.4vw,20px)] text-[#111] mb-2 sm:mb-3 pb-1 border-b border-[#111111]/20">
              {opening.help.title}
            </h3>

            <ul className="space-y-1 sm:space-y-1.5 font-poppins text-[clamp(10px,0.95vw,13px)] text-[#222222] leading-tight">
              {opening.help.items.map((item, idx) => (
                <li key={idx} className="flex items-baseline gap-1.5">
                  <span className="text-[#D7261E] font-bold">—</span>
                  <span className="truncate font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2.5 pt-1.5 border-t border-[#111111]/15 text-right">
              <span className="font-poppins italic text-[11px] text-[#111111]/60 font-medium">
                {opening.help.footnote}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Locker 2 (Index 1): Featured Artwork Flyer 1 */}
      {index === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            onClick={() =>
              onOpenFlyerLightbox(
                opening.flyers[0].src,
                opening.flyers[0].alt,
                'Special Occasion Poster 1 — Lassiewear'
              )
            }
            data-cursor="VIEW"
            className="group relative cursor-pointer flex flex-col items-center max-w-[94%] transition-transform duration-300 hover:scale-[1.02] hover:rotate-1 rotate-[-1deg]"
          >
            {/* Metal Clips at Top */}
            <div className="w-full flex justify-between px-3 -mb-1 z-10 pointer-events-none">
              <div className="w-3 h-4 bg-gradient-to-b from-[#ddd] to-[#888] shadow-sm rounded-t-[1px] border border-[#222]" />
              <div className="w-3 h-4 bg-gradient-to-b from-[#ddd] to-[#888] shadow-sm rounded-t-[1px] border border-[#222]" />
            </div>

            {/* Poster Image Frame */}
            <div
              className={cn(
                'relative overflow-hidden p-1 rounded-[1px] transition-all duration-300',
                isOpen
                  ? 'bg-[#FFFFFF] border-2 border-[#111111] shadow-[3px_4px_0px_rgba(0,0,0,0.15)]'
                  : 'bg-[#161616] border border-[rgba(239,232,216,0.15)] shadow-[0_6px_16px_rgba(0,0,0,0.8)]'
              )}
            >
              <img
                src={opening.flyers[0].src}
                alt={opening.flyers[0].alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover max-h-[52dvh] rounded-[1px]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.flyer-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="flyer-fallback hidden flex-col items-center justify-center p-6 aspect-[4/5] bg-[#F5F5F5] text-[#111] text-center border border-[#111]">
                <span className="font-sentient text-xs font-bold">[ Poster 1 ]</span>
                <span className="text-[10px] text-[#111]/60 mt-1">Special Occasion · Lassiewear</span>
              </div>

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-micro text-[#FFFFFF]">
                <Eye className="w-3.5 h-3.5 text-[#D7261E]" />
                <span className="font-semibold tracking-wider">EXPAND</span>
              </div>
            </div>

            <span className="mt-2 font-poppins text-[10px] uppercase tracking-wider text-[#111111]/70 font-medium">
              Occasion Poster 1 · 4:5
            </span>
          </div>
        </div>
      )}

      {/* Locker 3 (Index 2, Center): Self-Introduction Video */}
      {index === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[94%] flex flex-col items-center">
            {/* Minimalist Screen Container with Sketch Frame */}
            <div
              className={cn(
                'relative w-full aspect-[9/16] max-h-[50dvh] bg-[#000000] rounded-[2px] overflow-hidden group transition-all duration-300',
                isOpen
                  ? 'border-2 border-[#111111] shadow-[3px_5px_0px_rgba(0,0,0,0.18)]'
                  : 'border border-[rgba(239,232,216,0.2)] shadow-[0_8px_24px_rgba(0,0,0,0.9)]'
              )}
            >
              <video
                ref={videoRef}
                src={opening.introVideo.src}
                poster={opening.introVideo.poster}
                preload={isOpen ? 'auto' : 'none'}
                muted={isMuted}
                loop
                playsInline
                {...{ 'webkit-playsinline': 'true' }}
                onLoadedData={() => setVideoLoaded(true)}
                onError={() => setVideoError(true)}
                className="h-full w-full object-contain bg-[#050505]"
              />

              {/* Video Fallback Box if video asset missing */}
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#181818] text-center border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#D7261E] animate-ping mb-2" />
                  <span className="font-sentient text-xs text-[#FFFFFF]">
                    [ Intro Video ]
                  </span>
                  <span className="font-poppins text-[10px] text-[#FFFFFF]/70 mt-1">
                    Jassinta Roid Triniti
                  </span>
                </div>
              )}
            </div>

            {/* Audio Toggle Button */}
            <div className="mt-3 flex items-center justify-center">
              <button
                type="button"
                onClick={toggleSound}
                aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-micro transition-all active:scale-95 shadow-sm cursor-pointer',
                  isOpen
                    ? 'bg-[#FFFFFF] border-2 border-[#111111] text-[#111111] hover:bg-[#D7261E] hover:text-[#FFFFFF] hover:border-[#D7261E]'
                    : 'bg-[#181818] border border-[rgba(239,232,216,0.2)] text-[#EFE8D8] hover:border-[#D7261E] hover:text-[#D7261E]'
                )}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#D7261E]" />
                    <span className="text-[10px] font-medium tracking-wider">Sound On</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-medium tracking-wider">Sound Off</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locker 4 (Index 3): Featured Artwork Flyer 2 */}
      {index === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            onClick={() =>
              onOpenFlyerLightbox(
                opening.flyers[1].src,
                opening.flyers[1].alt,
                'Special Occasion Poster 2 — Lassiewear'
              )
            }
            data-cursor="VIEW"
            className="group relative cursor-pointer flex flex-col items-center max-w-[94%] transition-transform duration-300 hover:scale-[1.02] hover:-rotate-1 rotate-[1.2deg]"
          >
            {/* Metal Clips at Top */}
            <div className="w-full flex justify-between px-3 -mb-1 z-10 pointer-events-none">
              <div className="w-3 h-4 bg-gradient-to-b from-[#ddd] to-[#888] shadow-sm rounded-t-[1px] border border-[#222]" />
              <div className="w-3 h-4 bg-gradient-to-b from-[#ddd] to-[#888] shadow-sm rounded-t-[1px] border border-[#222]" />
            </div>

            {/* Poster Image Frame */}
            <div
              className={cn(
                'relative overflow-hidden p-1 rounded-[1px] transition-all duration-300',
                isOpen
                  ? 'bg-[#FFFFFF] border-2 border-[#111111] shadow-[3px_4px_0px_rgba(0,0,0,0.15)]'
                  : 'bg-[#161616] border border-[rgba(239,232,216,0.15)] shadow-[0_6px_16px_rgba(0,0,0,0.8)]'
              )}
            >
              <img
                src={opening.flyers[1].src}
                alt={opening.flyers[1].alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover max-h-[52dvh] rounded-[1px]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.flyer-fallback-2');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="flyer-fallback-2 hidden flex-col items-center justify-center p-6 aspect-[4/5] bg-[#F5F5F5] text-[#111] text-center border border-[#111]">
                <span className="font-sentient text-xs font-bold">[ Poster 2 ]</span>
                <span className="text-[10px] text-[#111]/60 mt-1">Special Occasion · Lassiewear</span>
              </div>

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-micro text-[#FFFFFF]">
                <Eye className="w-3.5 h-3.5 text-[#D7261E]" />
                <span className="font-semibold tracking-wider">EXPAND</span>
              </div>
            </div>

            <span className="mt-2 font-poppins text-[10px] uppercase tracking-wider text-[#111111]/70 font-medium">
              Occasion Poster 2 · 4:5
            </span>
          </div>
        </div>
      )}

      {/* Locker 5 (Index 4): Platforms Proficient In */}
      {index === 4 && (
        <div className="flex-1 flex flex-col justify-center">
          <div
            className={cn(
              'relative p-3.5 sm:p-4 md:p-5 rounded-[1px] rotate-[0.9deg] transition-all duration-300 hover:rotate-0',
              isOpen
                ? 'bg-[#FAFAFA] text-[#111111] border-2 border-[#111111] shadow-[3px_4px_0px_rgba(0,0,0,0.15)]'
                : 'bg-[#EFE8D8] text-[#1a1a1a] shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(0,0,0,0.1)]'
            )}
          >
            {/* Top Pin Dot */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#D7261E] shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />

            <h3 className="font-sentient font-bold italic text-[clamp(14px,1.4vw,20px)] text-[#111] mb-2 sm:mb-3 pb-1 border-b border-[#111111]/20">
              {opening.platforms.title}
            </h3>

            <ul className="space-y-1 sm:space-y-1.5 font-poppins text-[clamp(10px,0.95vw,13px)] text-[#222222] leading-tight">
              {opening.platforms.items.map((item, idx) => (
                <li key={idx} className="flex items-baseline gap-1.5">
                  <span className="text-[#D7261E] font-bold">—</span>
                  <span className="truncate font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2.5 pt-1.5 border-t border-[#111111]/15 text-right">
              <span className="font-poppins italic text-[11px] text-[#111111]/60 font-medium">
                Tools & Suites
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Locker Shelf Divider Line (Sketch Ink Line) */}
      <div
        className={cn(
          'w-full h-1 mt-2 transition-colors duration-700',
          isOpen ? 'bg-[#111111] shadow-none' : 'bg-[#1a1a1a] shadow-[0_1px_0_rgba(255,255,255,0.06),inset_0_1px_2px_rgba(0,0,0,0.8)]'
        )}
      />
    </div>
  );
};
