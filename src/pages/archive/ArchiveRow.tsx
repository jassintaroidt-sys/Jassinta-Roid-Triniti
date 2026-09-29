import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchiveWorkItem } from '../../data/archive';
import { VideoOnView } from '../../components/VideoOnView';
import { cn } from '../../lib/cn';

export interface ArchiveRowProps {
  work: ArchiveWorkItem;
  index: number;
  isSelected: boolean;
  hasActiveSelection: boolean;
  isMobile: boolean;
  isExpandedMobile: boolean;
  onSelect: (index: number) => void;
  onToggleMobile: (id: string) => void;
}

export const ArchiveRow: React.FC<ArchiveRowProps> = memo(
  ({
    work,
    index,
    isSelected,
    hasActiveSelection,
    isMobile,
    isExpandedMobile,
    onSelect,
    onToggleMobile,
  }) => {
    const num = String(index + 1).padStart(2, '0') + '.';

    // Click handler
    const handleClick = () => {
      if (isMobile) {
        onToggleMobile(work.id);
      } else {
        onSelect(index);
        if (work.url) {
          window.open(work.url, '_blank', 'noopener,noreferrer');
        }
      }
    };

    // Mobile layout
    if (isMobile) {
      return (
        <motion.li
          layout="position"
          className="border-b border-[rgba(239,232,216,0.12)] list-none overflow-hidden"
        >
          <div
            onClick={handleClick}
            className={cn(
              'w-full py-3.5 px-3 flex flex-col gap-1 transition-colors select-none cursor-pointer',
              isSelected ? 'bg-white/[0.04]' : 'active:bg-white/[0.02]'
            )}
          >
            {/* Title & Number Row */}
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-xs text-[#D7261E] tabular-nums shrink-0">
                {num}
              </span>
              <span className="font-sentient italic text-base sm:text-lg text-[#EFE8D8] leading-tight line-clamp-2">
                {work.title}
              </span>
            </div>

            {/* Metadata Subline */}
            <div className="pl-6 flex items-center justify-between text-[11px] font-poppins text-[#EFE8D8]/50 uppercase tracking-wider">
              <span className="truncate">
                {work.company} · {work.format} · {work.type}
              </span>
              <span className="text-micro text-[#D7261E] shrink-0 font-medium">
                {isExpandedMobile ? '− LESS' : '+ VIEW'}
              </span>
            </div>
          </div>

          {/* Mobile Accordion Inline Media */}
          <AnimatePresence>
            {isExpandedMobile && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden bg-[#0F0F0F] border-t border-[rgba(239,232,216,0.08)] px-4 py-4"
              >
                <div className="w-full max-h-[60dvh] flex flex-col items-center justify-center">
                  <div className="w-full max-h-[50dvh] aspect-[9/16] max-w-[280px] mx-auto rounded-[4px] overflow-hidden bg-black/80 border border-[rgba(239,232,216,0.18)] shadow-lg flex items-center justify-center">
                    {work.kind === 'video' ? (
                      <VideoOnView
                        src={work.src}
                        poster={work.poster}
                        aspect={work.aspect || '9/16'}
                        className="w-full h-full object-cover"
                        cursorLabel="PLAY"
                      />
                    ) : (
                      <img
                        src={work.src}
                        alt={work.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="w-full max-w-[280px] mt-3 flex items-center justify-between">
                    <span className="font-poppins text-[10px] text-[#EFE8D8]/60 uppercase tracking-wider">
                      {work.format} · {work.type}
                    </span>

                    {work.url ? (
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-poppins font-medium text-[#D7261E] hover:underline"
                      >
                        <span>Open</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      <span className="font-poppins text-[10px] text-[#EFE8D8]/30">
                        No link
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.li>
      );
    }

    // Desktop and Tablet layout
    return (
      <motion.li
        layout="position"
        onMouseEnter={() => onSelect(index)}
        onClick={handleClick}
        className={cn(
          'w-full min-h-[50px] lg:min-h-[52px] py-2 px-2 flex items-center border-b border-[rgba(239,232,216,0.1)] transition-all duration-200 select-none cursor-pointer group',
          isSelected
            ? 'opacity-100 bg-white/[0.03]'
            : hasActiveSelection
              ? 'opacity-40 hover:opacity-100'
              : 'opacity-85 hover:opacity-100'
        )}
      >
        {/* Number with red dot on hover/selection */}
        <div className="w-12 shrink-0 flex items-center font-mono text-xs tabular-nums text-[#EFE8D8]/60 group-hover:text-white">
          {isSelected ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E] mr-1.5 shrink-0 animate-pulse" />
              <span className="text-[#EFE8D8] font-semibold">{num}</span>
            </>
          ) : (
            <span className="pl-3">{num}</span>
          )}
        </div>

        {/* Title: Sentient Italic fluid clamp(20px, 2.1vw, 32px), truncated to 1 line */}
        <div className="flex-1 min-w-0 pr-4">
          <span className="font-sentient italic text-[clamp(19px,2vw,30px)] text-[#EFE8D8] group-hover:text-white transition-colors truncate block">
            {work.title}
          </span>
        </div>

        {/* Company: Poppins 500 uppercase, letter-spaced */}
        <div className="w-32 lg:w-40 shrink-0 truncate font-poppins font-medium text-[11px] lg:text-[12px] uppercase tracking-wider text-[#EFE8D8]/70 group-hover:text-[#EFE8D8]">
          {work.company}
        </div>

        {/* Format: Poppins 500 uppercase (hidden on tablet 768-1023) */}
        <div className="hidden lg:block w-24 shrink-0 truncate font-poppins font-medium text-[11px] lg:text-[12px] uppercase tracking-wider text-[#EFE8D8]/60 group-hover:text-[#EFE8D8]/90">
          {work.format}
        </div>

        {/* Type: Poppins 500 uppercase, letter-spaced */}
        <div className="w-32 lg:w-40 shrink-0 truncate font-poppins font-medium text-[11px] lg:text-[12px] uppercase tracking-wider text-[#EFE8D8]/60 group-hover:text-[#EFE8D8]/90 text-right lg:text-left pr-2">
          {work.type}
        </div>
      </motion.li>
    );
  }
);

ArchiveRow.displayName = 'ArchiveRow';
