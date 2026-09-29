import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Mail, MessageSquare, Phone, ExternalLink } from 'lucide-react';
import { person } from '../data/content';
import { usePrefersReducedMotion } from '../lib/useMediaQuery';
import { cn } from '../lib/cn';

export const Contact: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync document title
  useEffect(() => {
    document.title = 'Contact | Jassinta Roid Triniti';
  }, []);

  // Copy email to clipboard with fallback
  const handleCopyEmail = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const textToCopy = person.email;
    let successful = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        successful = true;
      }
    } catch {
      successful = false;
    }

    if (!successful) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        successful = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        successful = false;
      }
    }

    setToastMessage('Copied to clipboard');
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-x-hidden bg-[#070707] text-[#EFE8D8] select-none">
      {/* ============================================================ */}
      {/* BACKGROUND: FOTO JASSINTA ROID TRINITI ESTETIK.png + 50% BLACK */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
  src="/images/FOTO JASSINTA ROID TRINITI ESTETIK.png"
  alt="Jassinta Roid Triniti"
  className="w-full h-full object-cover scale-105 filter brightness-90 contrast-105"
/>
        {/* 50% Black transparency element covering the entire screen */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        {/* Subtle cinematic gradient vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTENT STAGE                                           */}
      {/* ============================================================ */}
      <main className="flex-1 w-full flex flex-col justify-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-20 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-micro uppercase tracking-[0.25em] text-[#EFE8D8]/80 mb-4 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E] animate-pulse" />
            <span>Get in Touch</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-sentient font-normal text-[clamp(28px,4vw,48px)] leading-tight text-[#FFFFFF] tracking-tight"
          >
            Let's Build Something <span className="text-[#D7261E] italic">Memorable</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-poppins text-xs sm:text-sm text-[#EFE8D8]/70 mt-3 font-normal max-w-lg mx-auto leading-relaxed"
          >
            Open for collaborations, content strategy discussions, writing projects, and professional inquiries.
          </motion.p>
        </div>

        {/* Three Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          {/* ================= CARD 1: EMAIL ================= */}
          <div
            onMouseEnter={() => setHoveredCol(0)}
            onMouseLeave={() => setHoveredCol(null)}
            className={cn(
              'group relative p-8 sm:p-10 rounded-[12px] bg-[#121212]/80 backdrop-blur-xl border border-white/15 hover:border-[#D7261E] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all duration-300',
              hoveredCol !== null && hoveredCol !== 0 ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'
            )}
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#D7261E]/15 border border-[#D7261E]/30 flex items-center justify-center text-[#D7261E] mb-6">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-sentient font-normal text-2xl sm:text-3xl text-[#FFFFFF] tracking-tight mb-2">
                Email
              </h3>
              <p className="font-poppins text-xs text-[#EFE8D8]/60 mb-6 leading-relaxed">
                Direct inbox for official proposals, editorial commissions, and professional collaborations.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={`mailto:${person.email}`}
                data-cursor="EMAIL"
                className="font-poppins text-sm sm:text-base font-medium text-[#EFE8D8] hover:text-[#D7261E] transition-colors truncate block"
              >
                {person.email}
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  data-cursor="COPY"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-[#D7261E] text-white text-micro uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Address</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= CARD 2: SOCIAL MEDIA ================= */}
          <div
            onMouseEnter={() => setHoveredCol(1)}
            onMouseLeave={() => setHoveredCol(null)}
            className={cn(
              'group relative p-8 sm:p-10 rounded-[12px] bg-[#121212]/80 backdrop-blur-xl border border-white/15 hover:border-[#D7261E] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all duration-300',
              hoveredCol !== null && hoveredCol !== 1 ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'
            )}
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#D7261E]/15 border border-[#D7261E]/30 flex items-center justify-center text-[#D7261E] mb-6">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h3 className="font-sentient font-normal text-2xl sm:text-3xl text-[#FFFFFF] tracking-tight mb-2">
                Social Media
              </h3>
              <p className="font-poppins text-xs text-[#EFE8D8]/60 mb-6 leading-relaxed">
                Connect and follow creative portfolio updates, behind-the-scenes content, and daily insights.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <span className="font-poppins text-sm sm:text-base font-medium text-[#EFE8D8] truncate">
                {person.instagram}
              </span>
              <div>
                <a
                  href={person.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="VISIT"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-[#D7261E] text-white text-micro uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  <span>Visit Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* ================= CARD 3: WA / PHONE ================= */}
          <div
            onMouseEnter={() => setHoveredCol(2)}
            onMouseLeave={() => setHoveredCol(null)}
            className={cn(
              'group relative p-8 sm:p-10 rounded-[12px] bg-[#121212]/80 backdrop-blur-xl border border-white/15 hover:border-[#D7261E] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between transition-all duration-300',
              hoveredCol !== null && hoveredCol !== 2 ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'
            )}
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#D7261E]/15 border border-[#D7261E]/30 flex items-center justify-center text-[#D7261E] mb-6">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-sentient font-normal text-2xl sm:text-3xl text-[#FFFFFF] tracking-tight mb-2">
                WhatsApp & Phone
              </h3>
              <p className="font-poppins text-xs text-[#EFE8D8]/60 mb-6 leading-relaxed">
                Instant messaging for fast communication, quick consultations, and urgent project discussions.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <span className="font-poppins text-sm sm:text-base font-medium text-[#EFE8D8] tabular-nums truncate">
                {person.phoneDisplay}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={person.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="CHAT"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-[#D7261E] text-white text-micro uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp</span>
                </a>
                <a
                  href={`tel:${person.phoneTel}`}
                  data-cursor="CALL"
                  aria-label={`Call ${person.phoneDisplay}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[4px] bg-white/5 hover:bg-white/15 text-white/90 text-micro uppercase tracking-wider transition-all cursor-pointer active:scale-95 border border-white/10"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* INTEGRATED FOOTER ROW                                        */}
      {/* ============================================================ */}
      <footer
        role="contentinfo"
        className="w-full h-11 border-t border-white/10 bg-black/80 backdrop-blur-md px-6 sm:px-10 lg:px-16 flex items-center justify-between text-micro text-[#EFE8D8] relative z-30 pointer-events-auto"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <span className="tracking-widest tabular-nums opacity-75">{person.year}</span>
        <span className="font-poppins font-medium tracking-widest text-[#EFE8D8]/90 text-center">
          {person.name}
        </span>
        <span className="font-mono text-xs tracking-widest text-[#EFE8D8]/70 text-right">
          Contact
        </span>
      </footer>

      {/* ============================================================ */}
      {/* FLOATING TOAST NOTIFICATION                                  */}
      {/* ============================================================ */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#141414]/95 border border-[rgba(239,232,216,0.25)] text-[#EFE8D8] text-xs font-poppins shadow-[0_12px_32px_rgba(0,0,0,0.9)] backdrop-blur-md select-none pointer-events-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E] animate-pulse" />
            <span className="font-medium tracking-wide">{toastMessage}</span>
            <Check className="w-3.5 h-3.5 text-[#D7261E] ml-0.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;
