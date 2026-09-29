import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Grain } from './Grain';
import { CustomCursor } from './CustomCursor';
import { SiteFooter } from './SiteFooter';
import { TocButton } from './TocButton';
import { TocOverlay } from './TocOverlay';
import { PageTransition } from './PageTransition';
import { useLenis } from '../lib/useLenis';

export interface LayoutProps {
  children: React.ReactNode;
  tocPosition?: 'top-right' | 'bottom-right' | 'hidden';
  footerRight?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  tocPosition,
  footerRight,
}) => {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const location = useLocation();

  // Initialize smooth scrolling with Lenis on non-touch devices
  useLenis();

  // Listen for open-toc custom events from page components
  useEffect(() => {
    const handleOpenToc = () => setIsTocOpen(true);
    window.addEventListener('open-toc', handleOpenToc);
    return () => window.removeEventListener('open-toc', handleOpenToc);
  }, []);

  // Determine default TOC button position: top-right fixed for instant access
  const resolveTocPosition = (): 'top-right' | 'bottom-right' | 'hidden' => {
    if (tocPosition) return tocPosition;
    return 'top-right';
  };

  const currentTocPosition = resolveTocPosition();

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0A0A0A] text-[#EFE8D8] flex flex-col justify-between selection:bg-[#D7261E] selection:text-[#FFFFFF]">
      {/* Subtle film grain texture overlay */}
      <Grain />

      {/* Custom micro cursor for desktop */}
      <CustomCursor />

      {/* Index (Daftar Isi) Trigger Button */}
      <TocButton
        position={currentTocPosition}
        onClick={() => setIsTocOpen(true)}
        isOpen={isTocOpen}
      />

      {/* Fullscreen Table of Contents Overlay */}
      <TocOverlay
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
      />

      {/* Route Content with Cinematic Wipe Transition */}
      <main className="flex-1 w-full relative z-10">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      {/* Fixed bottom footer metadata line (Opening, Archive, and Contact render their custom integrated footers) */}
      {location.pathname !== '/' && location.pathname !== '/archive' && location.pathname !== '/contact' && (
        <SiteFooter rightText={footerRight} />
      )}
    </div>
  );
};
