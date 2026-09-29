import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, ExternalLink, Radio } from 'lucide-react';
import { podcastEpisodes, podcastCredits, PodcastEpisode } from '../../data/podcast';
import { cn } from '../../lib/cn';

export const PodcastGallery: React.FC = () => {
  const [selectedEpId, setSelectedEpId] = useState<string>(podcastEpisodes[0].id);

  const activeEpisode = podcastEpisodes.find((ep) => ep.id === selectedEpId) || podcastEpisodes[0];

  return (
    <div className="w-full min-h-[90dvh] bg-[#FFFFFF] text-[#111111] py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center select-none relative overflow-hidden">
      {/* Subtle background grid pattern */}
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

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN: Spotify Live Stream & Episode Switcher          */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#D7261E] animate-pulse" />
              <span className="font-mono text-micro text-black/60 tracking-[0.2em] uppercase">
                Spotify Realtime Stream
              </span>
            </div>
            <div className="flex items-center gap-2">
              {podcastEpisodes.map((ep, idx) => (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => setSelectedEpId(ep.id)}
                  data-cursor="PLAY"
                  className={cn(
                    'px-3.5 py-1.5 rounded-[4px] font-mono text-xs transition-all cursor-pointer',
                    ep.id === selectedEpId
                      ? 'bg-[#D7261E] text-white font-bold shadow-[0_2px_8px_rgba(215,38,30,0.3)]'
                      : 'bg-black/5 text-black/70 hover:bg-black/10'
                  )}
                >
                  Episode {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Spotify Embed iframe */}
          <div className="w-full rounded-[12px] overflow-hidden bg-[#F8F9FA] border border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <iframe
              src={activeEpisode.spotifyEmbedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={activeEpisode.title}
              className="w-full bg-[#FFFFFF]"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-poppins text-black/60 px-1">
            <span>{activeEpisode.description}</span>
            <a
              href={activeEpisode.spotifyOriginalUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="SPOTIFY"
              className="inline-flex items-center gap-1.5 text-[#D7261E] hover:underline font-medium shrink-0"
            >
              <span>Listen on Spotify</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Production Credits & Background                */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 bg-[#F8F9FA] p-8 rounded-[10px] border border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D7261E]/10 border border-[#D7261E]/25 flex items-center justify-center text-[#D7261E]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-micro text-[#D7261E] uppercase tracking-[0.2em] block">
                Production Credits
              </span>
              <h3 className="font-sentient text-2xl font-medium text-[#111111] tracking-tight">
                Kartini Podcast
              </h3>
            </div>
          </div>

          <p className="font-poppins text-xs sm:text-sm text-black/80 leading-relaxed font-normal">
            As a producer, curating and shaping sonic narratives requires balancing meticulous scripting, talent direction, and audio editing to deliver compelling listening experiences.
          </p>

          <div className="space-y-3 pt-4 border-t border-black/10">
            <h4 className="font-mono text-xs text-black/50 uppercase tracking-widest">
              Credits & Team
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {podcastCredits.map(([role, name], idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-[6px] bg-white border border-black/10 font-poppins text-xs shadow-sm"
                >
                  <span className="text-black/50 uppercase tracking-wider text-[10px] font-mono">
                    {role}
                  </span>
                  <span className="text-[#111111] font-medium text-right">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PodcastGallery;
