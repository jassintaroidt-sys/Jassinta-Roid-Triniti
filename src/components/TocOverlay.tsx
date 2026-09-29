import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toc } from '../data/content';
import { cn } from '../lib/cn';

export interface TocOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const tocStyleMap: { [key: string]: { face: 'bold' | 'italic'; num: string } } = {
  '/': { face: 'bold', num: '01' },
  '/personal-brand': { face: 'italic', num: '02' },
  '/writing-portfolio': { face: 'bold', num: '03' },
  '/content-marketing-specialist': { face: 'italic', num: '04' },
  '/example-strategy': { face: 'bold', num: '05' },
  '/project-campus': { face: 'italic', num: '06' },
  '/podcast': { face: 'bold', num: '07' },
  '/archive': { face: 'italic', num: '08' },
  '/contact': { face: 'bold', num: '09' },
};

export const TocOverlay: React.FC<TocOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll and handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap focus
      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on close button or first item
    const firstBtn = overlayRef.current?.querySelector<HTMLElement>('button');
    firstBtn?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    onClose();

    const pathToIdMap: Record<string, string> = {
      '/': 'opening',
      '/personal-brand': 'personal-brand',
      '/writing-portfolio': 'writing-portfolio',
      '/content-marketing-specialist': 'content-marketing-specialist',
      '/example-strategy': 'example-strategy',
      '/project-campus': 'project-campus',
      '/podcast': 'podcast',
      '/archive': 'archive',
      '/contact': 'contact',
    };

    const targetId = pathToIdMap[path];
    const targetElement = targetId ? document.getElementById(targetId) : null;

    if (targetElement) {
      // Element exists on current page: smooth scroll directly
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', path);
    } else {
      // Dispatch custom event or navigate
      window.dispatchEvent(new CustomEvent('toc-navigate', { detail: { path } }));
      if (location.pathname !== path) {
        navigate(path);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Table of Contents"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#000000] text-[#FFFFFF] p-6 md:p-12 lg:p-16 select-none overflow-y-auto"
        >
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between border-b border-white/15 pb-6">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#D7261E]" />
              <span className="font-poppins text-micro text-[#FFFFFF]/80 tracking-widest uppercase">
                Table of Contents / Index
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="group flex items-center gap-2 text-micro tracking-widest text-[#FFFFFF] transition-colors hover:text-[#D7261E] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FFFFFF]"
            >
              <span className="underline decoration-white/30 underline-offset-4 group-hover:decoration-[#D7261E]">
                Close
              </span>
              <span className="font-mono text-sm leading-none opacity-60 group-hover:opacity-100">
                [ESC]
              </span>
            </button>
          </div>

          {/* Six TOC Items in large Sentient */}
          <nav className="my-auto py-8 flex flex-col gap-4 md:gap-6 max-w-4xl">
            {toc.map((item) => {
              const meta = tocStyleMap[item.path] || { face: 'bold', num: '00' };
              const isCurrent =
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  data-cursor="GO"
                  className="group relative flex items-baseline gap-4 md:gap-8 text-left transition-transform duration-200 ease-out hover:translate-x-2 focus-visible:outline-none"
                >
                  {/* Number 01-06 */}
                  <span className="font-sentient text-lg md:text-2xl text-[#FFFFFF]/40 transition-colors duration-200 group-hover:text-[#D7261E] tabular-nums">
                    {meta.num}
                  </span>

                  {/* Title */}
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'font-sentient text-2xl sm:text-3xl md:text-5xl lg:text-6xl transition-colors duration-200 group-hover:text-[#D7261E] leading-none tracking-tight text-[#FFFFFF]',
                        meta.face === 'bold' ? 'font-bold not-italic' : 'font-normal italic'
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Active Route Red Dot */}
                    {isCurrent && (
                      <span
                        className="inline-block h-2 w-2 md:h-2.5 md:md:w-2.5 rounded-full bg-[#D7261E] shrink-0"
                        title="Current page"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom Bar Info */}
          <div className="flex items-center justify-between border-t border-white/15 pt-6 text-micro text-[#FFFFFF]/60">
            <span>2026 Creative Portfolio</span>
            <span>Jassinta Roid Triniti</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
