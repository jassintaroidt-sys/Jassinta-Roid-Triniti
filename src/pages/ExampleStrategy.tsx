import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroReveal } from '../components/HeroReveal';
import { ImmersiveVideoStrip } from './example-strategy/ImmersiveVideoStrip';
import { strategyHero } from '../data/content';

export const ExampleStrategy: React.FC = () => {
  return (
    <div className="relative w-full bg-[#0A0A0A] text-[#EFE8D8] overflow-x-clip">
      {/* PART 1: Hero Reveal with 4-item slot presets & kinetic multi-face headline */}
      <HeroReveal
        lines={strategyHero.lines}
        narration={strategyHero.narration}
        media={strategyHero.media}
        tocPosition="top-right"
      />

      {/* PART 2: Immersive Video Reveal Strip with 3D Grid Floor & Curved Connected Panels */}
      <ImmersiveVideoStrip />
    </div>
  );
};

export default ExampleStrategy;
