import React from 'react';
import { useLocation } from 'react-router-dom';
import { person } from '../data/content';

export interface SiteFooterProps {
  rightText?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ rightText }) => {
  const location = useLocation();

  const getPageIdentifier = () => {
    if (rightText) return rightText;
    const path = location.pathname;
    if (path === '/') return '01 / 09';
    if (path.startsWith('/personal-brand')) return 'BRAND / 02';
    if (path.startsWith('/writing-portfolio')) return 'WRITING / 03';
    if (path.startsWith('/content-marketing-specialist')) return 'CONTENT / 04';
    if (path.startsWith('/example-strategy')) return 'STRATEGY / 05';
    if (path.startsWith('/project-campus')) return 'CAMPUS / 06';
    if (path.startsWith('/podcast')) return 'PODCAST / 07';
    if (path.startsWith('/archive')) return 'ARCHIVE / 08';
    if (path.startsWith('/contact')) return 'CONTACT / 09';
    return 'INDEX';
  };

  return (
    <footer
      role="contentinfo"
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 text-micro text-[#EFE8D8] pointer-events-none select-none"
      style={{
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'calc(1.5rem + env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(1.5rem + env(safe-area-inset-right, 0px))',
      }}
    >
      <span className="tracking-widest tabular-nums opacity-80">{person.year}</span>
      <span className="tracking-widest font-medium opacity-90">{person.name}</span>
      <span className="tracking-widest opacity-80">{getPageIdentifier()}</span>
    </footer>
  );
};
