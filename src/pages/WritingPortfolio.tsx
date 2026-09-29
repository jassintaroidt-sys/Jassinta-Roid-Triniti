import React from 'react';
import { Link } from 'react-router-dom';
import { HeroReveal } from '../components/HeroReveal';
import { DiscCarousel } from './writing/DiscCarousel';
import { writingHero } from '../data/content';

export const WritingPortfolio: React.FC = () => {
  return (
    <div className="relative w-full bg-[#0A0A0A] text-[#EFE8D8] overflow-x-clip">
      {/* SECTION 1: Reusable HeroReveal Section */}
      <HeroReveal
        lines={writingHero.lines}
        narration={writingHero.narration}
        media={writingHero.media}
        tocPosition="top-right"
      />

      {/* SECTION 2: 3D Scroll-Driven Cassette / Disc Carousel */}
      <DiscCarousel />
    </div>
  );
};

export default WritingPortfolio;
