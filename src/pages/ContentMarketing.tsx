import React from 'react';
import { Link } from 'react-router-dom';
import { HeroReveal } from '../components/HeroReveal';
import { EditorialGallery } from './content-marketing/EditorialGallery';
import { contentHero } from '../data/content';

export const ContentMarketing: React.FC = () => {
  return (
    <div className="relative w-full bg-[#0A0A0A] text-[#EFE8D8] overflow-x-clip">
      {/* SECTION 1: Reusable HeroReveal Section */}
      <HeroReveal
        lines={contentHero.lines}
        narration={contentHero.narration}
        media={contentHero.media}
        tocPosition="top-right"
      />

      {/* SECTION 2: Editorial Horizontal Scroll-Driven Gallery */}
      <EditorialGallery />
    </div>
  );
};

export default ContentMarketing;
