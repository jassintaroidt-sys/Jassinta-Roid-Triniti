import React, { useEffect } from 'react';
import { HeroReveal } from '../components/HeroReveal';
import { PodcastGallery } from './podcast/PodcastGallery';
import { podcastHero } from '../data/podcast';

export const Podcast: React.FC = () => {
  useEffect(() => {
    document.title = 'Podcast | Jassinta Roid Triniti';
  }, []);

  return (
    <div className="relative w-full bg-[#0A0A0A] text-[#EFE8D8] overflow-x-clip">
      {/* SECTION 1: Reusable HeroReveal Section (Text-only, no media cards) */}
      <HeroReveal
        lines={podcastHero.lines}
        narration={podcastHero.narration}
        media={[]}
        tocPosition="top-right"
      />

      {/* SECTION 2: Podcast Spotify Realtime Embeds & Credits */}
      <PodcastGallery />
    </div>
  );
};

export default Podcast;
