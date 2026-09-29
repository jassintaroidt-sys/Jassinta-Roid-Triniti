import React from 'react';
import { Link } from 'react-router-dom';
import { HeroReveal } from '../components/HeroReveal';

export const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center px-6 py-20 text-center max-w-lg mx-auto">
      <span className="text-micro text-[#D7261E] tracking-[0.2em] mb-4">
        ERROR · 404
      </span>
      <HeroReveal as="h1" className="font-sentient text-headline font-bold text-[#EFE8D8] mb-4">
        Page Not Found
      </HeroReveal>
      <p className="text-narration text-[#EFE8D8]/60 mb-8">
        The archive page or path you requested does not exist in this catalog.
      </p>
      <Link
        to="/"
        data-cursor="HOME"
        className="inline-flex items-center gap-2 text-micro tracking-widest text-[#EFE8D8] hover:text-[#D7261E] transition-colors border-b border-[rgba(239,232,216,0.3)] pb-1"
      >
        <span>Return to Opening</span>
        <span className="font-mono">→</span>
      </Link>
    </div>
  );
};

export default NotFound;
