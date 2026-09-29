export interface PodcastEpisode {
  id: string;
  title: string;
  spotifyEmbedUrl: string;
  spotifyOriginalUrl: string;
  description: string;
}

export const podcastHero = {
  lines: [
    [
      { text: "Behind the " },
      { text: "Microphone", face: "italic" as const, color: "#D7261E" },
    ],
  ],
  narration:
    "Being a producer is not simply about taking control. It is about becoming the most attentive listener before anyone else is ready to listen.",
};

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "episode-1",
    title: "Kartini Podcast Episode 1",
    spotifyEmbedUrl: "https://open.spotify.com/embed/episode/5v0J711J5xyWvYZn8JWC76?utm_source=generator",
    spotifyOriginalUrl: "https://open.spotify.com/episode/5v0J711J5xyWvYZn8JWC76?si=kGHzLsvHRm6-ZtS7U1vWMw&utm_source=copy-link",
    description: "An inspiring discussion exploring contemporary issues, creative journeys, and empowerment.",
  },
  {
    id: "episode-2",
    title: "Kartini Podcast Episode 2",
    spotifyEmbedUrl: "https://open.spotify.com/embed/episode/4dfqcKbGRCaxuoztDsqu0d?utm_source=generator",
    spotifyOriginalUrl: "https://open.spotify.com/episode/4dfqcKbGRCaxuoztDsqu0d?si=xF0eRVqpTjypn3SVmI497Q&utm_source=copy-link",
    description: "Deep dive conversations focusing on leadership, personal growth, and stories from campus pioneers.",
  },
];

export const podcastCredits = [
  ["Script", "Jassinta Roid Triniti"],
  ["Hosts", "Tataq, Aqilah"],
  ["Platform", "Kartini Podcast (Spotify)"],
];
