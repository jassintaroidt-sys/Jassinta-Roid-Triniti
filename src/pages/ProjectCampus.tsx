import React, { useEffect } from 'react';
import { HeroReveal } from '../components/HeroReveal';
import { ProjectCampusGallery } from './project-campus/ProjectCampusGallery';
import { campusHero } from '../data/projectCampus';

export const ProjectCampus: React.FC = () => {
  useEffect(() => {
    document.title = 'Project Campus | Jassinta Roid Triniti';
  }, []);

  return (
    <div className="relative w-full bg-[#0A0A0A] text-[#EFE8D8] overflow-x-clip">
      {/* SECTION 1: Reusable HeroReveal Section (Text-only, no media cards) */}
      <HeroReveal
        lines={campusHero.lines}
        narration={campusHero.narration}
        media={[]}
        tocPosition="top-right"
      />

      {/* SECTION 2: Project Campus Rak Buku & Flipbook Viewer */}
      <ProjectCampusGallery />
    </div>
  );
};

export default ProjectCampus;
