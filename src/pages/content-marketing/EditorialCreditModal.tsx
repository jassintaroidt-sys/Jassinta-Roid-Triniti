import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { EditorialItem } from '../../data/content';

interface EditorialCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: EditorialItem;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const EditorialCreditModal: React.FC<EditorialCreditModalProps> = ({
  isOpen,
  onClose,
  item,
  triggerRef,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Focus management and ESC key listener
  useEffect(() => {
    if (!isOpen) return;

    // Focus the modal or close button on open
    const prevActiveElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Simple focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Return focus to trigger
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (prevActiveElement) {
        prevActiveElement.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="credit-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none"
        >
          {/* Dimmed blur backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Centered credit card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-md bg-[#121212] border border-[rgba(239,232,216,0.18)] rounded-[8px] p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.9)] text-[#EFE8D8]"
          >
            {/* Header row */}
            <div className="flex items-center justify-between pb-5 border-b border-[rgba(239,232,216,0.12)] mb-6">
              <span
                id="credit-modal-title"
                className="font-poppins text-micro text-[#EFE8D8]/50 tracking-[0.2em] uppercase"
              >
                CREDITS & ATTRIBUTION
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close credit modal"
                className="p-1.5 -mr-1.5 text-[#EFE8D8]/60 hover:text-[#EFE8D8] rounded hover:bg-white/5 active:scale-95 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Exactly three lines as specified */}
            <div className="space-y-6">
              {/* Line 1: Company */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-poppins uppercase tracking-widest text-[#EFE8D8]/40">
                  Company
                </span>
                <span className="font-sentient font-bold text-lg sm:text-xl text-[#EFE8D8]">
                  {item.company}
                </span>
              </div>

              {/* Line 2: Account Handle with Link */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-poppins uppercase tracking-widest text-[#EFE8D8]/40">
                  Account
                </span>
                <a
                  href={item.accountUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-poppins font-medium text-base sm:text-lg text-[#EFE8D8] hover:text-[#D7261E] transition-colors underline underline-offset-4 decoration-[rgba(239,232,216,0.3)] hover:decoration-[#D7261E] w-fit"
                >
                  <span>{item.account}</span>
                  <ExternalLink className="w-4 h-4 text-[#EFE8D8]/60 group-hover:text-[#D7261E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Line 3: Created by */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-poppins uppercase tracking-widest text-[#EFE8D8]/40">
                  Created by
                </span>
                <span className="font-sentient font-bold italic text-lg sm:text-xl text-[#EFE8D8]">
                  Jassinta Roid Triniti
                </span>
              </div>
            </div>

            {/* Footer close button */}
            <div className="mt-8 pt-5 border-t border-[rgba(239,232,216,0.1)] flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 text-micro tracking-widest uppercase bg-[#1a1a1a] hover:bg-[#222222] border border-[rgba(239,232,216,0.2)] hover:border-[#D7261E]/60 text-[#EFE8D8] rounded-[4px] active:scale-95 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
