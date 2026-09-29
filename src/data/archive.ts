import { writingWorks, editorial, archiveExtras } from './content';

export interface ArchiveWorkItem {
  id: string;
  title: string;
  company: string;
  format: 'Writing' | 'Video' | 'Photo';
  type: string;
  kind: 'image' | 'video';
  src: string;
  poster?: string;
  aspect?: string;
  url: string | null;
}

// Build 34 works from existing data without retyping:
// 11 from writingWorks + 15 from editorial + 8 from archiveExtras = 34 works
export const rawArchiveWorks: ArchiveWorkItem[] = [
  // 11 from writingWorks:
  ...writingWorks.map((w) => ({
    id: `writing-${w.id}`,
    title: w.title,
    company: w.media,
    format: 'Writing' as const,
    type: w.type,
    kind: 'image' as const,
    src: w.image,
    aspect: '1/1',
    url: w.url,
  })),

  // 15 from editorial:
  ...editorial.map((e) => ({
    id: `editorial-${e.id}`,
    title: e.title,
    company: e.company,
    format: (e.kind === 'video' ? 'Video' : 'Photo') as 'Video' | 'Photo',
    type: e.kind === 'video' ? e.contentType : 'Promotion',
    kind: e.kind,
    src: e.src,
    poster: e.poster,
    aspect: e.aspect,
    url: e.accountUrl,
  })),

  // 8 from archiveExtras:
  ...archiveExtras.map((x, idx) => ({
    id: `extra-${idx}`,
    title: x.title,
    company: x.company,
    format: x.format as 'Video' | 'Photo',
    type: x.type,
    kind: x.kind,
    src: x.src,
    poster: x.poster,
    aspect: x.aspect,
    url: null,
  })),
];

// Fisher–Yates shuffle algorithm
export function shuffleArchiveWorks(items: ArchiveWorkItem[]): ArchiveWorkItem[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
