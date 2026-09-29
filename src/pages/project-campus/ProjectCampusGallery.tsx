import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { campusWorks, CampusWork } from '../../data/projectCampus';
import { cn } from '../../lib/cn';

export const ProjectCampusGallery: React.FC = () => {
  const [selectedWorkId, setSelectedWorkId] = useState<string>(campusWorks[0].id);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const activeWork = campusWorks.find((w) => w.id === selectedWorkId) || campusWorks[0];

  // Handle work switch
  const handleSelectWork = (id: string) => {
    setSelectedWorkId(id);
    setPageIndex(0);
  };

  // Next/Prev page flip
  const maxPages = activeWork.pages.length;
  const isSpread = activeWork.spreadLayout;
  const step = isSpread ? 2 : 1;

  const handleNextPage = () => {
    setPageIndex((prev) => Math.min(maxPages - step, prev + step));
  };

  const handlePrevPage = () => {
    setPageIndex((prev) => Math.max(0, prev - step));
  };

  return (
    <div className="w-full min-h-[90dvh] bg-[#FFFFFF] text-[#111111] py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center select-none relative overflow-hidden">
      {/* Subtle architectural background grid / tint */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000000 1px, transparent 1px),
            linear-gradient(to bottom, #000000 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Main 3-Column Layout: [Publication Shelf] [Flipbook Document Viewer] [Project Details] */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: Publication Shelf (Navigation Index)            */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 flex flex-col gap-4 bg-[#F8F9FA] p-5 sm:p-6 rounded-[8px] border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 pb-3 border-b border-black/10">
            <BookOpen className="w-4 h-4 text-[#D7261E]" />
            <span className="font-mono text-micro text-black/60 tracking-[0.2em] uppercase">
              Publication Shelf
            </span>
          </div>

          <nav aria-label="Publication Shelf" className="flex flex-col gap-2.5">
            {campusWorks.map((work, idx) => {
              const isActive = work.id === selectedWorkId;
              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => handleSelectWork(work.id)}
                  data-cursor="SELECT"
                  className={cn(
                    'group relative w-full text-left p-3.5 rounded-[6px] border transition-all duration-300 flex items-start gap-3 cursor-pointer',
                    isActive
                      ? 'bg-white border-[#D7261E] text-[#111111] shadow-[0_4px_16px_rgba(215,38,30,0.12)]'
                      : 'bg-white/70 border-black/10 text-black/70 hover:border-black/30 hover:bg-white'
                  )}
                >
                  <span className="font-mono text-xs text-[#D7261E] font-bold mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sentient text-sm font-medium text-[#111111] tracking-wide truncate">
                      {work.title}
                    </h4>
                    <span className="font-mono text-[10px] text-black/50 truncate block mt-0.5">
                      {work.docName}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ============================================================ */}
        {/* CENTER COLUMN: Flipbook Document Viewer                      */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-[#FFFFFF] rounded-[10px] border border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
            {/* Book Header Bar */}
            <div className="px-4 py-3 bg-[#F8F9FA] border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D7261E]" />
                <span className="font-mono text-xs text-black/80 tracking-wide font-medium">
                  {activeWork.docName}
                </span>
              </div>
              <span className="font-mono text-xs text-black/50 tabular-nums">
                Page {pageIndex + 1} / {maxPages}
              </span>
            </div>

            {/* Book Pages Stage (Flipbook Spread) */}
            <div className="relative w-full aspect-[4/3] bg-[#EFEFEF] p-4 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeWork.id}-page-${pageIndex}`}
                  initial={{ opacity: 0, rotateY: 12, scale: 0.98 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -12, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex items-center justify-center gap-2"
                >
                  {/* Left Page of Spread */}
                  <div className="relative flex-1 h-full rounded-[4px] overflow-hidden bg-white border border-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <img
                      src={activeWork.pages[pageIndex] || activeWork.pages[0]}
                      alt={`${activeWork.title} page ${pageIndex + 1}`}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm border border-black/10 font-mono text-[9px] text-black/70">
                      {pageIndex + 1}
                    </div>
                  </div>

                  {/* Right Page of Spread (if spread layout and available) */}
                  {isSpread && pageIndex + 1 < maxPages && (
                    <div className="relative flex-1 h-full rounded-[4px] overflow-hidden bg-white border border-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                      <img
                        src={activeWork.pages[pageIndex + 1]}
                        alt={`${activeWork.title} page ${pageIndex + 2}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-sm border border-black/10 font-mono text-[9px] text-black/70">
                        {pageIndex + 2}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Book Navigation Controls */}
            <div className="p-3 bg-[#F8F9FA] border-t border-black/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={pageIndex === 0}
                data-cursor="PREV"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-black/5 hover:bg-[#D7261E] hover:text-white text-black/80 text-xs font-poppins uppercase tracking-wider transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="font-mono text-xs text-black/60">
                Interactive Document Spread
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={pageIndex + step >= maxPages}
                data-cursor="NEXT"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-black/5 hover:bg-[#D7261E] hover:text-white text-black/80 text-xs font-poppins uppercase tracking-wider transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Project Details (Overview, Responsibilities)   */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 bg-[#F8F9FA] p-6 sm:p-8 rounded-[8px] border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-6">
          <div>
            <span className="font-mono text-micro text-[#D7261E] uppercase tracking-[0.2em] block mb-1">
              Project Details
            </span>
            <h3 className="font-sentient text-2xl sm:text-3xl font-medium text-[#111111] tracking-tight">
              {activeWork.title}
            </h3>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs text-black/50 uppercase tracking-widest">
              Overview
            </h4>
            <p className="font-poppins text-xs sm:text-sm text-black/80 leading-relaxed font-normal">
              {activeWork.overview || activeWork.penjelasan}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-black/10">
            <h4 className="font-mono text-xs text-black/50 uppercase tracking-widest">
              Responsibilities
            </h4>
            <ul className="space-y-2">
              {activeWork.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2.5 font-poppins text-xs text-black/80 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D7261E] shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectCampusGallery;
