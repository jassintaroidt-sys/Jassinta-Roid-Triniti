import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { strategy } from '../data/content';
import { KineticTitle, CounterNumber } from './example-strategy/KineticText';
import { FootageLightbox } from './example-strategy/FootageLightbox';
import { VideoOnView } from '../components/VideoOnView';
import { TocButton } from '../components/TocButton';

export const StrategyDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const currentIndex = strategy.findIndex((s) => s.slug === type);

  // Lightbox state for right-column footage photos
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // If slug is invalid, redirect to /example-strategy
  if (currentIndex === -1) {
    return <Navigate to="/example-strategy" replace />;
  }

  const item = strategy[currentIndex];
  const total = strategy.length;
  const prevItem = strategy[(currentIndex - 1 + total) % total];
  const nextItem = strategy[(currentIndex + 1) % total];

  // Sync document title
  useEffect(() => {
    document.title = `${item.label} — Example Strategy | Jassinta Roid Triniti`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [item]);

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0A0A0A] text-[#EFE8D8] pb-24 selection:bg-[#D7261E] selection:text-white">
      {/* Top Navigation Header */}
      <div className="w-full border-b border-[rgba(239,232,216,0.1)] px-6 sm:px-10 lg:px-16 py-6 flex items-center justify-between">
        <Link
          to="/example-strategy"
          data-cursor="BACK"
          className="group inline-flex items-center gap-2.5 text-micro tracking-[0.2em] uppercase text-[#EFE8D8]/70 hover:text-[#D7261E] transition-colors"
        >
          <span className="font-mono text-xs transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          <span>Back to strategies</span>
        </Link>

        <div className="flex items-center gap-3 text-micro text-[#EFE8D8]/45 tracking-[0.2em] uppercase">
          <span className="font-mono text-xs tabular-nums text-[#D7261E]">
            0{currentIndex + 1} / 04
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{item.label}</span>
        </div>
      </div>

      {/* Main Two-Column Editorial Grid Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Sticky Info & Metadata (Desktop)               */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-8 lg:self-start space-y-8">
            {/* Title with kinetic mask reveal */}
            <div className="space-y-3">
              <span className="text-micro text-[#D7261E] tracking-[0.25em] uppercase font-mono">
                Strategy Pillar · 0{currentIndex + 1}
              </span>
              <KineticTitle
                text={item.label}
                className="font-sentient font-bold italic text-headline text-[#EFE8D8] leading-[1.02] tracking-tight"
              />
            </div>

            {/* Mobile Video Preview Card (< 1024px) */}
            <div className="lg:hidden w-full aspect-[9/16] max-w-[280px] mx-auto rounded-[6px] overflow-hidden bg-[#111] border border-[rgba(239,232,216,0.18)] shadow-[0_16px_36px_rgba(0,0,0,0.85)] my-6">
              <VideoOnView
                src={item.video}
                poster={item.poster}
                aspect="9/16"
                className="w-full h-full object-cover"
                cursorLabel="PLAY"
              />
            </div>

            {/* About Paragraph */}
            <p className="font-poppins text-sm sm:text-base text-[#EFE8D8]/70 leading-relaxed font-normal">
              {item.about}
            </p>

            {/* Best Paragraph (accentuated highlight) */}
            <div className="pl-4 border-l-2 border-[#D7261E]/80 py-1 bg-white/[0.01]">
              <p className="font-poppins text-sm sm:text-base text-[#EFE8D8] leading-relaxed italic">
                "{item.best}"
              </p>
            </div>

            {/* Results Block with Spacious Cards (Never colliding/berdempetan) */}
            <div className="pt-6 border-t border-[rgba(239,232,216,0.12)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-micro text-[#EFE8D8]/50 tracking-[0.2em] uppercase font-mono">
                  Results & Performance
                </span>
                <a
                  href={item.seeMore}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="LINK"
                  className="group inline-flex items-center gap-1.5 text-xs font-poppins font-medium text-[#EFE8D8] hover:text-[#D7261E] pb-0.5 border-b border-[rgba(239,232,216,0.25)] hover:border-[#D7261E] transition-colors"
                >
                  <span>See More</span>
                  <span className="font-mono text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </div>

              {/* 3 Spacious Metric Cards with generous room and no overcrowding */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                {/* Views */}
                <div className="flex flex-col p-3 sm:p-4 rounded-[6px] bg-[#121212] border border-[rgba(239,232,216,0.1)] min-w-0">
                  <span className="font-poppins text-[10px] text-[#EFE8D8]/50 uppercase tracking-widest mb-1.5">
                    Views
                  </span>
                  <CounterNumber
                    value={item.results.views}
                    className="font-sentient font-bold text-lg sm:text-xl xl:text-2xl text-[#EFE8D8] tracking-tight tabular-nums truncate"
                  />
                </div>

                {/* Likes */}
                <div className="flex flex-col p-3 sm:p-4 rounded-[6px] bg-[#121212] border border-[rgba(239,232,216,0.1)] min-w-0">
                  <span className="font-poppins text-[10px] text-[#EFE8D8]/50 uppercase tracking-widest mb-1.5">
                    Likes
                  </span>
                  <CounterNumber
                    value={item.results.likes}
                    className="font-sentient font-bold text-lg sm:text-xl xl:text-2xl text-[#EFE8D8] tracking-tight tabular-nums truncate"
                  />
                </div>

                {/* Shared */}
                <div className="flex flex-col p-3 sm:p-4 rounded-[6px] bg-[#121212] border border-[rgba(239,232,216,0.1)] min-w-0">
                  <span className="font-poppins text-[10px] text-[#EFE8D8]/50 uppercase tracking-widest mb-1.5">
                    Shared
                  </span>
                  <CounterNumber
                    value={item.results.shared}
                    className="font-sentient font-bold text-lg sm:text-xl xl:text-2xl text-[#EFE8D8] tracking-tight tabular-nums truncate"
                  />
                </div>
              </div>
            </div>

            {/* Reference (Format: 1080 x 1920 px) */}
            <div className="pt-6 border-t border-[rgba(239,232,216,0.12)]">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-micro text-[#EFE8D8]/50 tracking-[0.2em] uppercase font-mono">
                  Reference
                </span>
                <span className="font-mono text-[10px] text-[#EFE8D8]/45 tracking-widest">
                  1080 × 1920 PX
                </span>
              </div>

              <div className="relative w-full max-w-[280px] aspect-[1080/1920] rounded-[6px] overflow-hidden bg-[#141414] border border-[rgba(239,232,216,0.18)] group shadow-[0_12px_30px_rgba(0,0,0,0.7)]">
                <img
                  src={item.reference.image}
                  alt={`Reference for ${item.label} (1080x1920)`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fb = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = 'flex';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Graceful Fallback if image asset is missing */}
                <div
                  style={{ display: 'none' }}
                  className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#161616] text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#EFE8D8]/70 mb-2">
                    <span className="font-mono text-xs">📷</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#EFE8D8]/45 mb-1">1080 × 1920</span>
                  <span className="font-poppins text-xs text-[#EFE8D8]/80 italic">
                    {item.reference.by}
                  </span>
                </div>

                {/* Corner Micro Badge */}
                <div className="pointer-events-none absolute bottom-2 right-2 px-1.5 py-0.5 rounded-[2px] bg-black/75 backdrop-blur-sm border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono text-[9px] text-[#EFE8D8] tracking-widest">
                    1080 × 1920
                  </span>
                </div>
              </div>
              <span className="font-poppins text-xs text-[#EFE8D8]/65 italic mt-2.5 block truncate">
                Reference: {item.reference.by}
              </span>
            </div>

            {/* Credit List */}
            <div className="pt-6 border-t border-[rgba(239,232,216,0.12)]">
              <span className="text-micro text-[#EFE8D8]/45 tracking-[0.2em] uppercase mb-3 block">
                Credit
              </span>
              <div className="space-y-2.5">
                {item.credit.map(([label, val], cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-baseline justify-between sm:justify-start gap-4 text-xs font-poppins"
                  >
                    <span className="text-[#EFE8D8]/50 w-28 shrink-0">{label}</span>
                    <span className="text-[#EFE8D8] font-medium truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Footage Filmstrip Gallery (1080 x 1920 px)     */}
          {/* ============================================================ */}
          <div className="lg:col-span-6 xl:col-span-7 mt-12 lg:mt-0">
            {/* Sticky Column Header */}
            <div className="sticky top-0 z-20 bg-[#0A0A0A]/90 backdrop-blur-md py-3.5 px-2 border-b border-[rgba(239,232,216,0.12)] mb-6 flex items-center justify-between text-micro text-[#EFE8D8]">
              <span className="tracking-[0.25em] font-medium uppercase text-xs">
                Footage Gallery
              </span>
              <span className="font-mono text-xs text-[#EFE8D8]/50 tabular-nums tracking-widest">
                1080 × 1920 PX · 5 ARTIFACTS
              </span>
            </div>

            {/* Vertical Connected Filmstrip (Exact 1080 x 1920 px aspect ratio) */}
            <div className="flex flex-col gap-6 sm:gap-8">
              {item.footage.map((imgSrc, fIdx) => (
                <motion.div
                  key={fIdx}
                  initial={{ opacity: 0, y: 24, clipPath: 'inset(8% 0% 8% 0%)' }}
                  whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.75,
                    delay: fIdx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => {
                    setLightboxIndex(fIdx);
                    setIsLightboxOpen(true);
                  }}
                  data-cursor="ZOOM"
                  className="relative cursor-pointer rounded-[6px] overflow-hidden bg-[#141414] border border-[rgba(239,232,216,0.18)] aspect-[1080/1920] w-full max-w-[540px] mx-auto group shadow-[0_16px_36px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#D7261E]/70 hover:scale-[1.01]"
                >
                  <img
                    src={imgSrc}
                    alt={`${item.label} footage artifact ${fIdx + 1} (1080x1920)`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fb = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fb) fb.style.display = 'flex';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Fallback artifact placeholder (1080 x 1920 px) */}
                  <div
                    style={{ display: 'none' }}
                    className="w-full h-full bg-[#141414] flex flex-col items-center justify-center p-6 text-center select-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs text-[#EFE8D8]/70 mb-2">
                      #{fIdx + 1}
                    </div>
                    <span className="font-mono text-[10px] text-[#EFE8D8]/45 tracking-widest mb-1">
                      1080 × 1920 PX
                    </span>
                    <span className="font-sentient font-bold text-xs text-[#EFE8D8] mb-1">
                      {item.label} Footage #{fIdx + 1}
                    </span>
                    <span className="font-poppins text-[10px] text-[#EFE8D8]/40 truncate max-w-[200px]">
                      {imgSrc.split('/').pop()}
                    </span>
                  </div>

                  {/* Corner Badges: Dimension & Index */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none">
                    <span className="px-1.5 py-0.5 rounded-[2px] bg-black/75 backdrop-blur-sm border border-white/10 font-mono text-[9px] text-[#EFE8D8]/70 tracking-widest">
                      1080 × 1920
                    </span>
                    <span className="px-1.5 py-0.5 rounded-[2px] bg-black/75 backdrop-blur-sm border border-white/10 font-mono text-[9px] text-[#EFE8D8] tracking-widest">
                      0{fIdx + 1}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Strategy Navigation Bar (Prev / Next Type) */}
        <div className="mt-20 pt-8 border-t border-[rgba(239,232,216,0.12)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            to={`/example-strategy/${prevItem.slug}`}
            data-cursor="PREV"
            className="group flex flex-col sm:items-start text-center sm:text-left text-[#EFE8D8]/70 hover:text-[#D7261E] transition-colors"
          >
            <span className="text-micro text-[#EFE8D8]/40 uppercase tracking-widest mb-1">
              ← Previous Pillar
            </span>
            <span className="font-sentient font-bold italic text-lg sm:text-xl text-[#EFE8D8] group-hover:text-[#D7261E] transition-colors">
              {prevItem.label}
            </span>
          </Link>

          <Link
            to={`/example-strategy/${nextItem.slug}`}
            data-cursor="NEXT"
            className="group flex flex-col sm:items-end text-center sm:text-right text-[#EFE8D8]/70 hover:text-[#D7261E] transition-colors"
          >
            <span className="text-micro text-[#EFE8D8]/40 uppercase tracking-widest mb-1">
              Next Pillar →
            </span>
            <span className="font-sentient font-bold italic text-lg sm:text-xl text-[#EFE8D8] group-hover:text-[#D7261E] transition-colors">
              {nextItem.label}
            </span>
          </Link>
        </div>
      </main>

      {/* Lightbox for High-Resolution Footage Exploration */}
      <FootageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={item.footage}
        currentIndex={lightboxIndex}
        onNavigate={(idx) => setLightboxIndex(idx)}
        title={item.label}
      />
    </div>
  );
};

export default StrategyDetail;
