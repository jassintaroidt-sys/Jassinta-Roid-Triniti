import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Opening } from './Opening';
import { PersonalBrand } from './personal-brand/PersonalBrand';
import { WritingPortfolio } from './WritingPortfolio';
import { ContentMarketing } from './ContentMarketing';
import { ExampleStrategy } from './ExampleStrategy';
import { ProjectCampus } from './ProjectCampus';
import { Podcast } from './Podcast';
import { Archive } from './Archive';
import { Contact } from './Contact';

const SECTIONS = [
  { id: 'opening', num: '01', label: 'OPENING', path: '/' },
  { id: 'personal-brand', num: '02', label: 'PERSONAL BRAND', path: '/personal-brand' },
  { id: 'writing-portfolio', num: '03', label: 'WRITING PORTFOLIO', path: '/writing-portfolio' },
  { id: 'content-marketing-specialist', num: '04', label: 'CONTENT MARKETING SPECIALIST', path: '/content-marketing-specialist' },
  { id: 'example-strategy', num: '05', label: 'EXAMPLE STRATEGY', path: '/example-strategy' },
  { id: 'project-campus', num: '06', label: 'PROJECT CAMPUS', path: '/project-campus' },
  { id: 'podcast', num: '07', label: 'PODCAST', path: '/podcast' },
  { id: 'archive', num: '08', label: 'ARCHIVE', path: '/archive' },
  { id: 'contact', num: '09', label: 'CONTACT', path: '/contact' },
];

export const OnePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('opening');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isAutoScrollingRef = useRef(false);

  // Global Page Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Smooth scroll to a section by element ID
  const scrollToSection = (id: string, updateUrl = true) => {
    const el = document.getElementById(id);
    if (!el) return;

    isAutoScrollingRef.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (updateUrl) {
      const match = SECTIONS.find((s) => s.id === id);
      if (match && window.location.pathname !== match.path) {
        window.history.replaceState(null, '', match.path);
      }
    }

    setTimeout(() => {
      isAutoScrollingRef.current = false;
      setActiveSection(id);
    }, 800);
  };

  // Scroll to section on initial mount if path or hash is given
  useEffect(() => {
    const path = location.pathname;
    const hash = window.location.hash.replace('#', '');
    const targetId = hash || SECTIONS.find((s) => s.path === path && s.path !== '/')?.id;

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(targetId);
        }
      }, 300);
    }
  }, [location.pathname]);

  // Listen to custom TOC navigation events
  useEffect(() => {
    const handleTocNavigate = (e: CustomEvent<{ path: string }>) => {
      const targetPath = e.detail?.path;
      const match = SECTIONS.find((s) => s.path === targetPath);
      if (match) {
        scrollToSection(match.id, true);
      }
    };

    window.addEventListener('toc-navigate' as any, handleTocNavigate as any);
    return () => window.removeEventListener('toc-navigate' as any, handleTocNavigate as any);
  }, []);

  // IntersectionObserver to update active section tracker while scrolling
  useEffect(() => {
    const sectionElements = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAutoScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const currentId = entry.target.id;
            setActiveSection(currentId);

            // Update document title dynamically based on active section
            const current = SECTIONS.find((s) => s.id === currentId);
            if (current) {
              document.title = `${current.label} | Jassinta Roid Triniti`;
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0.25, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // Show / hide back to top button
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowBackToTop(window.scrollY > 800);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const currentSectionMeta = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="relative w-full bg-[#0A0A0A] text-[#EFE8D8] selection:bg-[#D7261E] selection:text-[#FFFFFF] overflow-x-hidden">
      {/* ============================================================ */}
      {/* TOP SCROLL PROGRESS BAR                                      */}
      {/* ============================================================ */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D7261E] via-[#FF5733] to-[#EFE8D8] z-50 pointer-events-none shadow-[0_0_12px_rgba(215,38,30,0.8)]"
      />

      {/* ============================================================ */}
      {/* FLOATING SECTION HUD / PROGRESS TRACKER                      */}
      {/* ============================================================ */}
      <aside
        aria-label="Active Section Indicator"
        className="fixed top-6 left-6 sm:left-10 z-40 hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#0E0E0E]/80 backdrop-blur-md border border-[rgba(239,232,216,0.12)] shadow-[0_8px_24px_rgba(0,0,0,0.6)] select-none pointer-events-auto transition-all"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#D7261E] animate-pulse" />
        <span className="font-mono text-micro text-[#EFE8D8]/50 tabular-nums">
          {currentSectionMeta.num} / {String(SECTIONS.length).padStart(2, '0')}
        </span>
        <span className="text-[rgba(239,232,216,0.2)]">|</span>
        <span className="font-poppins text-micro text-[#EFE8D8]/90 font-medium tracking-wider">
          {currentSectionMeta.label}
        </span>
      </aside>

      {/* ============================================================ */}
      {/* SECTION 01: OPENING HERO & LOCKER STAGE                      */}
      {/* ============================================================ */}
      <section id="opening" className="relative w-full min-h-[100dvh]">
        <Opening />
      </section>

      {/* ============================================================ */}
      {/* SECTION 02: PERSONAL BRAND (EDITORIAL COLLAGE / 10 DOCUMENTS) */}
      {/* ============================================================ */}
      <section id="personal-brand" className="relative w-full">
        <PersonalBrand />
      </section>

      {/* ============================================================ */}
      {/* SECTION 03: WRITING PORTFOLIO (3D DISC CAROUSEL)             */}
      {/* ============================================================ */}
      <section id="writing-portfolio" className="relative w-full min-h-[100dvh]">
        <WritingPortfolio />
      </section>

      {/* ============================================================ */}
      {/* SECTION 04: CONTENT MARKETING SPECIALIST (EDITORIAL GALLERY) */}
      {/* ============================================================ */}
      <section id="content-marketing-specialist" className="relative w-full min-h-[100dvh]">
        <ContentMarketing />
      </section>

      {/* ============================================================ */}
      {/* SECTION 05: EXAMPLE STRATEGY (IMMERSIVE 3D VIDEO STRIP)      */}
      {/* ============================================================ */}
      <section id="example-strategy" className="relative w-full">
        <ExampleStrategy />
      </section>

      {/* ============================================================ */}
      {/* SECTION 06: PROJECT CAMPUS (PUBLICATION SHELF & FLIPBOOK)    */}
      {/* ============================================================ */}
      <section id="project-campus" className="relative w-full min-h-[100dvh]">
        <ProjectCampus />
      </section>

      {/* ============================================================ */}
      {/* SECTION 07: PODCAST (SPOTIFY REALTIME PLAYERS & CREDITS)     */}
      {/* ============================================================ */}
      <section id="podcast" className="relative w-full min-h-[100dvh]">
        <Podcast />
      </section>

      {/* ============================================================ */}
      {/* SECTION 08: THE MASTER ARCHIVE (34 WORKS & LIVE REVEAL)      */}
      {/* ============================================================ */}
      <section id="archive" className="relative w-full min-h-[100dvh]">
        <Archive />
      </section>

      {/* ============================================================ */}
      {/* SECTION 09: CONTACT (GRAND FINALE)                           */}
      {/* ============================================================ */}
      <section id="contact" className="relative w-full min-h-[100dvh]">
        <Contact />
      </section>

      {/* ============================================================ */}
      {/* FLOATING BACK TO TOP BUTTON                                  */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={() => scrollToSection('opening', true)}
            aria-label="Back to top"
            data-cursor="TOP"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#141414]/90 hover:bg-[#1f1f1f] text-[#EFE8D8] border border-[rgba(239,232,216,0.18)] hover:border-[#D7261E] shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors cursor-pointer group"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#EFE8D8]/70 group-hover:text-[#D7261E] transition-colors" />
            <span className="font-poppins text-micro uppercase tracking-widest text-[#EFE8D8]/80 group-hover:text-white transition-colors">
              Top
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnePage;
