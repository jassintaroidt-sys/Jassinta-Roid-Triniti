import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { EditorialItem } from '../../data/content';
import { cn } from '../../lib/cn';

interface EditorialInfoPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  item: EditorialItem;
  isMobile: boolean;
}

const STAT_CONFIG = [
  { key: 'views', label: 'Views', icon: Eye },
  { key: 'likes', label: 'Likes', icon: Heart },
  { key: 'comments', label: 'Comments', icon: MessageCircle },
  { key: 'saves', label: 'Saves', icon: Bookmark },
  { key: 'shared', label: 'Shares', icon: Share2 },
] as const;

export const EditorialInfoPopover: React.FC<EditorialInfoPopoverProps> = ({
  isOpen,
  onClose,
  item,
  isMobile,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Extract year from iso (e.g., "2025-06-22" -> "2025")
  const year = item.iso.split('-')[0] || '2025';

  // Available stats entries
  const availableStats = STAT_CONFIG.filter(
    (cfg) => typeof item.stats[cfg.key as keyof typeof item.stats] === 'number'
  );

  // Handle ESC key and outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Use timeout to prevent immediate trigger from opening button click
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleClickOutside);
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />
          )}

          {/* Popover container */}
          {isMobile ? (
            /* Mobile Bottom Sheet */
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Editorial Information"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[82vh] overflow-y-auto bg-[#121212] border-t border-[rgba(239,232,216,0.18)] p-6 pt-3 rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] text-[#EFE8D8]"
            >
              {/* Sheet grab handle */}
              <div className="w-12 h-1 bg-[rgba(239,232,216,0.25)] rounded-full mx-auto mb-4" />

              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[rgba(239,232,216,0.1)]">
                <div>
                  <div className="text-[10px] font-poppins uppercase tracking-widest text-[#EFE8D8]/50">
                    {item.platform} · {item.contentType}
                  </div>
                  <h3 className="font-sentient font-bold italic text-xl text-[#EFE8D8] mt-1 leading-snug">
                    {item.title} ({year})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close information"
                  className="p-2 text-[#EFE8D8]/60 hover:text-[#EFE8D8] rounded-full hover:bg-white/5 active:scale-95 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Info text */}
              <div className="py-4 space-y-3">
                {item.info.map((p, i) => (
                  <p
                    key={i}
                    className="font-poppins text-sm text-[#EFE8D8]/80 leading-relaxed text-pretty"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Stats row */}
              {availableStats.length > 0 ? (
                <div className="pt-4 border-t border-[rgba(239,232,216,0.1)]">
                  <div className="text-[10px] font-poppins uppercase tracking-widest text-[#EFE8D8]/45 mb-3">
                    Performance Metrics
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {availableStats.map((cfg) => {
                      const val = item.stats[cfg.key as keyof typeof item.stats];
                      return (
                        <div
                          key={cfg.key}
                          className="bg-[#181818] p-2.5 rounded-[6px] border border-[rgba(239,232,216,0.08)] flex flex-col items-center text-center"
                        >
                          <span className="font-sentient font-bold text-2xl text-[#EFE8D8] leading-none mb-1">
                            {val?.toLocaleString() ?? 0}
                          </span>
                          <span className="font-poppins text-[10px] uppercase tracking-wider text-[#EFE8D8]/50">
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-[rgba(239,232,216,0.1)] text-center text-xs text-[#EFE8D8]/40 font-poppins italic">
                  Campaign Visual Asset · Weekly Promotional Series
                </div>
              )}
            </motion.div>
          ) : (
            /* Desktop Anchored Popover */
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Editorial Information"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-[420px] max-w-[90vw] bg-[#121212]/95 backdrop-blur-xl border border-[rgba(239,232,216,0.18)] p-6 rounded-[8px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-[#EFE8D8]"
            >
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[rgba(239,232,216,0.12)]">
                <div>
                  <span className="text-[10px] font-poppins uppercase tracking-widest text-[#EFE8D8]/50">
                    {item.platform} · {item.contentType}
                  </span>
                  <h3 className="font-sentient font-bold italic text-xl text-[#EFE8D8] mt-0.5 leading-snug">
                    {item.title} ({year})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close information"
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-micro text-[#EFE8D8]/50 hover:text-[#EFE8D8] rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-[10px]">Close</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Info text */}
              <div className="py-4 space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {item.info.map((p, i) => (
                  <p
                    key={i}
                    className="font-poppins text-xs text-[#EFE8D8]/80 leading-relaxed text-pretty"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Stats row */}
              {availableStats.length > 0 ? (
                <div className="pt-3 border-t border-[rgba(239,232,216,0.1)]">
                  <div className="text-[9px] font-poppins uppercase tracking-widest text-[#EFE8D8]/40 mb-2">
                    Performance Stats
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableStats.map((cfg) => {
                      const val = item.stats[cfg.key as keyof typeof item.stats];
                      return (
                        <div
                          key={cfg.key}
                          className="flex-1 min-w-[64px] bg-[#191919] px-2.5 py-2 rounded-[4px] border border-[rgba(239,232,216,0.08)] flex flex-col items-center text-center"
                        >
                          <span className="font-sentient font-bold text-xl text-[#EFE8D8] leading-none mb-0.5">
                            {val?.toLocaleString() ?? 0}
                          </span>
                          <span className="font-poppins text-[9px] uppercase tracking-wider text-[#EFE8D8]/50">
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="pt-2.5 border-t border-[rgba(239,232,216,0.1)] text-center text-[11px] text-[#EFE8D8]/45 font-poppins italic">
                  Campaign Visual Asset · Weekly Promotional Series
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
