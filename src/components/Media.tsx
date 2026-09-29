import React, { useState } from 'react';
import { cn } from '../lib/cn';

export interface MediaProps {
  src: string;
  poster?: string;
  kind?: 'image' | 'video';
  aspect?: string; // e.g. "1/1", "1080/1350", "9/16", "16/9", "1080/1920"
  alt?: string;
  priority?: boolean;
  className?: string;
  cursorLabel?: string;
}

export const Media: React.FC<MediaProps> = ({
  src,
  poster,
  kind = 'image',
  aspect = '16/9',
  alt = '',
  priority = false,
  className,
  cursorLabel,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract clean filename from src
  const filename = src.split('/').pop() || src;

  // Convert aspect ratio format (e.g., "1080/1350" -> 1080/1350)
  const normalizedAspect = aspect.includes('/')
    ? aspect
    : aspect.includes(':')
      ? aspect.replace(':', '/')
      : aspect;

  if (hasError) {
    return (
      <div
        className={cn(
          'relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] p-4 text-center border border-[rgba(239,232,216,0.16)]',
          className
        )}
        style={{ aspectRatio: normalizedAspect }}
        data-cursor={cursorLabel}
      >
        <div className="flex flex-col items-center gap-1.5 opacity-60">
          <span className="font-sentient text-xs text-[#EFE8D8] tracking-widest uppercase">
            [ {kind === 'video' ? 'Reel / Video' : 'Asset'} ]
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
      className={cn('relative overflow-hidden bg-[#111111]', className)}
      style={{ aspectRatio: normalizedAspect }}
      data-cursor={cursorLabel}
    >
      {kind === 'video' ? (
        <video
          src={src}
          poster={poster}
          muted
          playsInline
          loop
          preload="none"
          onError={() => setHasError(true)}
          onLoadedData={() => setIsLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Subtle loader shimmer before asset loads */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#161616] animate-pulse" />
      )}
    </div>
  );
};
