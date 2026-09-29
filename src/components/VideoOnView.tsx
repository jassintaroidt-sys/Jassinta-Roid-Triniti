import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';

export interface VideoOnViewProps {
  src: string;
  poster?: string;
  aspect?: string;
  className?: string;
  alt?: string;
  allowSound?: boolean;
  cursorLabel?: string;
}

// Global active videos tracker to limit concurrent playback
const activeVideos = new Set<HTMLVideoElement>();
const MAX_CONCURRENT_DESKTOP = 4;
const MAX_CONCURRENT_MOBILE = 1;

function registerPlaying(video: HTMLVideoElement) {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const maxAllowed = isMobile ? MAX_CONCURRENT_MOBILE : MAX_CONCURRENT_DESKTOP;

  if (activeVideos.size >= maxAllowed) {
    // Pause the oldest video
    const oldest = activeVideos.values().next().value;
    if (oldest && oldest !== video) {
      oldest.pause();
      activeVideos.delete(oldest);
    }
  }
  activeVideos.add(video);
}

function unregisterPlaying(video: HTMLVideoElement) {
  activeVideos.delete(video);
}

export const VideoOnView: React.FC<VideoOnViewProps> = ({
  src,
  poster,
  aspect = '9/16',
  className,
  allowSound = false,
  cursorLabel = 'PLAY',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(!allowSound);

  const filename = src.split('/').pop() || src;
  const normalizedAspect = aspect.includes('/')
    ? aspect
    : aspect.includes(':')
      ? aspect.replace(':', '/')
      : aspect;

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            registerPlaying(video);
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // Autoplay may be restricted by browser until user gesture
                setIsPlaying(false);
              });
          } else {
            video.pause();
            unregisterPlaying(video);
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (video) {
        video.pause();
        unregisterPlaying(video);
      }
    };
  }, [src]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] p-4 text-center border border-[rgba(239,232,216,0.16)]',
          className
        )}
        style={{ aspectRatio: normalizedAspect }}
        data-cursor={cursorLabel}
      >
        <div className="flex flex-col items-center gap-1.5 opacity-60">
          <span className="font-sentient text-xs text-[#EFE8D8] tracking-widest uppercase">
            [ Video Stream ]
          </span>
          <span className="font-poppins text-[10px] text-[#EFE8D8]/60 tracking-wider truncate max-w-[200px]">
            {filename}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-[#111111] group', className)}
      style={{ aspectRatio: normalizedAspect }}
      data-cursor={cursorLabel}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        playsInline
        {...{ 'webkit-playsinline': 'true' }}
        loop
        preload="metadata"
        onError={() => setHasError(true)}
        onLoadedData={() => setIsLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Placeholder shimmer before video ready */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#161616] animate-pulse" />
      )}

      {/* Audio toggle button if sound allowed and video is playing */}
      {allowSound && isPlaying && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#0A0A0A]/70 text-[#EFE8D8] backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 border border-[rgba(239,232,216,0.2)]"
        >
          <span className="text-[10px] uppercase font-poppins font-medium">
            {isMuted ? 'MUTE' : 'ON'}
          </span>
        </button>
      )}
    </div>
  );
};
