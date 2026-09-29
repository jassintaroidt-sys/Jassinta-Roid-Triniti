export interface Person {
  name: string;
  year: number;
  tagline: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappUrl: string;
}

export interface TocItem {
  label: string;
  path: string;
}

export interface SignSegment {
  text: string;
  face: "regular" | "italic" | "bold" | "boldItalic";
  accent?: string;
}

export interface WritingWork {
  id: string;
  short: string;
  title: string;
  author: string;
  date: string;
  media: string;
  type: string;
  image: string;
  url: string | null;
}

export interface EditorialStats {
  views?: number;
  likes?: number;
  comments?: number;
  saves?: number;
  shared?: number;
}

export interface EditorialItem {
  id: string;
  title: string;
  iso: string;
  platform: string;
  contentType: string;
  kind: "video" | "image";
  src: string;
  poster?: string;
  aspect: string;
  company: string;
  account: string;
  accountUrl: string;
  info: string[];
  stats: EditorialStats;
}

export interface StrategyItem {
  slug: string;
  label: string;
  video: string;
  poster: string;
  about: string;
  best: string;
  reference: { image: string; by: string };
  credit: [string, string][];
  results: { views: string; likes: string; shared: string };
  seeMore: string;
  footage: string[];
}

export interface ArchiveExtra {
  title: string;
  company: string;
  format: string;
  type: string;
  kind: "image" | "video";
  src: string;
  poster?: string;
  aspect: string;
}

export const person: Person = {
  name: "Jassinta Roid Triniti",
  year: 2026,
  tagline: "Creative Portfolio",
  email: "jassintaroidt@gmail.com",
  instagram: "@jassinta.roid",
  instagramUrl: "https://www.instagram.com/jassinta.roid",
  phoneDisplay: "+62 81919 0325 18",
  phoneTel: "+6281919032518",
  whatsappUrl: "https://wa.me/6281919032518",
};

export const toc: TocItem[] = [
  { label: "OPENING", path: "/" },
  { label: "PERSONAL BRAND", path: "/personal-brand" },
  { label: "WRITING PORTFOLIO", path: "/writing-portfolio" },
  { label: "CONTENT MARKETING SPECIALIST", path: "/content-marketing-specialist" },
  { label: "EXAMPLE STRATEGY", path: "/example-strategy" },
  { label: "PROJECT CAMPUS", path: "/project-campus" },
  { label: "PODCAST", path: "/podcast" },
  { label: "ARCHIVE", path: "/archive" },
  { label: "CONTACT", path: "/contact" },
];

export const opening = {
  sign: [
    { text: "Content that", face: "regular" as const },
    { text: "is Felt,", face: "boldItalic" as const, accent: "Felt," },
    { text: "Shared,", face: "italic" as const },
    { text: "Remembered.", face: "bold" as const },
  ],
  help: {
    title: "I Can Help You With:",
    items: [
      "Social Media Manager",
      "Social Media Strategy",
      "SEO Writing",
      "Video Content",
      "Graphic Designer",
      "Editorial Planning",
      "Copywriting",
    ],
    footnote: "etc",
  },
  platforms: {
    title: "Platform I Am Proficient In:",
    items: [
      "Instagram",
      "TikTok",
      "Facebook",
      "Google Business Profile",
      "Canva",
      "CapCut",
      "Adobe Suites",
    ],
  },
  introVideo: {
    src: "/assets/opening/intro.mp4",
    poster: "/assets/opening/intro.webp",
  },
  flyers: [
    { src: "/assets/media/hari-besar-1.webp", aspect: "1080/1350", alt: "Flyer Hari Besar 1 — Lassiewear" },
    { src: "/assets/media/hari-besar-3.webp", aspect: "1080/1350", alt: "Flyer Hari Besar 3 — Lassiewear" },
  ],
};

export const writingHero = {
  lines: [
    { text: "Storytelling", face: "italic" as const, color: "#D7261E" },
    { text: "Through Screens", face: "regular" as const, color: "#FFFFFF" },
  ],
  narration:
    "We used to flip through newspapers and magazines; now, we scroll through mobile screens. Over the past five years, I have studied this transformation and become an online news writer, adapting to the ever-changing landscape of digital media.",
  media: ["imn-1", "imn-2", "innalar-1", "innalar-2", "ikapunija-1", "ikapunija-2"].map((n) => ({
    kind: "image" as const,
    src: `/assets/writing/${n}.webp`,
    aspect: "1/1",
  })),
};

export const writingWorks: WritingWork[] = [
  {
    id: "imn-1",
    short: "Jan Miskovic",
    title: "Inilah Sosok Jan Miskovic, Pemegang Rekor Mata Minus Tertinggi di Dunia yang Mengejutkan",
    author: "Jassinta Roid Triniti",
    date: "20/01/2025",
    media: "Independen Media",
    type: "News",
    image: "/assets/writing/imn-1.webp",
    url: "https://www.independenmedia.id/sosok/27614379267/inilah-sosok-jan-miskovic-pemegang-rekor-mata-minus-tertinggi-di-dunia-yang-mengejutkan?page=2",
  },
  {
    id: "imn-2",
    short: "Carmen H2H",
    title: "Carmen H2H Lolos Audisi di SM Entertainment Tanpa Sepengetahuan Orang Tuanya, Ini Cerita Lengkapnya",
    author: "Jassinta Roid Triniti",
    date: "20/04/2025",
    media: "Independen Media",
    type: "Entertainment",
    image: "/assets/writing/imn-2.webp",
    url: "https://www.independenmedia.id/various/27614883156/carmen-h2h-lolos-audisi-di-sm-entertainment-tanpa-sepengetahuan-orang-tuanya-ini-cerita-lengkapnya?page=3",
  },
  {
    id: "imn-3",
    short: "Good Bad Fortune",
    title: "Keren! Komik Digital Indonesia Good Bad Fortune Laris Manis di Korea, Ini Sinopsisnya",
    author: "Jassinta Roid Triniti",
    date: "11/01/2025",
    media: "Independen Media",
    type: "News",
    image: "/assets/writing/imn-3.webp",
    url: "https://www.independenmedia.id/various/27614320657/keren-komik-digital-indonesia-good-bad-fortune-laris-manis-di-korea-ini-sinopsisnya",
  },
  {
    id: "imn-4",
    short: "Mata Uang Tertinggi",
    title: "Kuwait Kuasai Posisi, Inilah Mata Uang Tertinggi di Dunia Saat Ini",
    author: "Jassinta Roid Triniti",
    date: "01/02/2025",
    media: "Independen Media",
    type: "News",
    image: "/assets/writing/imn-4.webp",
    url: "https://www.independenmedia.id/ekbis/27614462608/kuwait-kuasai-posisi-inilah-mata-uang-tertinggi-di-dunia-saat-ini?page=2",
  },
  {
    id: "innalar-1",
    short: "Uang Rusak",
    title: "Uang Rusak Jangan Dibuang, 2 Kondisi Cacat Ini Tetap Bisa Jadi Cuan Mahal Jika Dibeli Kolektor",
    author: "Jassinta Roid Triniti",
    date: "19/12/2024",
    media: "innalar.com",
    type: "Article",
    image: "/assets/writing/innalar-1.webp",
    url: "https://www.innalar.com/uang-rusak-jangan-dibuang-2-kondisi-cacat-ini-tetap-bisa-jadi-cuan-mahal-jika-dibeli-kolektor/",
  },
  {
    id: "innalar-2",
    short: "100 Rupiah Pinisi",
    title: "Segini Harga Terkini Uang Kertas 100 Rupiah Gambar Perahu Layar Pinisi",
    author: "Jassinta Roid Triniti",
    date: "20/12/2024",
    media: "innalar.com",
    type: "News",
    image: "/assets/writing/innalar-2.webp",
    url: "https://www.innalar.com/segini-harga-terkini-uang-kertas-100-rupiah-gambar-perahu-layar-pinisi/",
  },
  {
    id: "innalar-3",
    short: "Pelebaran Jalan Sawangan",
    title: "Butuh Dana Rp 2,2 Triliun, Proyek Pelebaran Jalan Raya Sawangan Kota Depok Belum Juga Direalisasikan",
    author: "Jassinta Roid Triniti",
    date: "20/11/2024",
    media: "innalar.com",
    type: "Opinion",
    image: "/assets/writing/innalar-3.webp",
    url: "https://www.innalar.com/butuh-dana-rp-22-triliun-proyek-pelebaran-jalan-raya-sawangan-kota-depok-belum-juga-direalisasikan/",
  },
  {
    id: "innalar-4",
    short: "Sosok Junalies",
    title: "Sosok Junalies, Seorang Desainer Uang Kuno Indonesia yang Karyanya Mendunia, Salah Satunya Uang Seri Barong yang Legendaris",
    author: "Jassinta Roid Triniti",
    date: "11/12/2024",
    media: "innalar.com",
    type: "Article",
    image: "/assets/writing/innalar-4.webp",
    url: "https://www.innalar.com/sosok-junalies-seorang-desainer-uang-kuno-indonesia-yang-karyanya-mendunia-salah-satunya-uang-seri-barong-yang-legendaris/",
  },
  {
    id: "ikapunija-1",
    short: "Personal Branding",
    title: "Membangun Personal Branding di Era Digital",
    author: "Jassinta Roid Triniti",
    date: "2024",
    media: "Ikapunija Media",
    type: "Article",
    image: "/assets/writing/ikapunija-1.webp",
    url: null,
  },
  {
    id: "ikapunija-2",
    short: "Konsep Brand Kopi",
    title: "Konsep Brand Kopi Kreatif Mahasiswa Desain Grafis",
    author: "Jassinta Roid Triniti",
    date: "2024",
    media: "Ikapunija Media",
    type: "News",
    image: "/assets/writing/ikapunija-2.webp",
    url: null,
  },
  {
    id: "ikapunija-3",
    short: "Kunjungan Industri",
    title: "Kunjungan Industri Alumni IJTM ke Toyota & Mitsubishi",
    author: "Jassinta Roid Triniti",
    date: "2024",
    media: "Ikapunija Media",
    type: "News",
    image: "/assets/writing/ikapunija-3.webp",
    url: null,
  },
];

export const contentHero = {
  lines: [
    { text: "From Ordinary Content to", face: "italic" as const, color: "#FFFFFF" },
    { text: "Memorable Stories", face: "regular" as const, color: "#D7261E" },
  ],
  narration:
    "I used to wonder: Why does one post go viral while another fades unnoticed? That curiosity led me deeper into understanding algorithms, content psychology, and audience behavior. It was there that I realized that creating content is not just about publishing; it is about understanding people.",
  media: [
    { kind: "video" as const, src: "/assets/strategy/hard-selling/video.mp4", poster: "/assets/strategy/hard-selling/poster.webp", aspect: "9/16" },
    { kind: "video" as const, src: "/assets/media/kecantikan-2.mp4", poster: "/assets/media/kecantikan-2.webp", aspect: "9/16" },
    { kind: "video" as const, src: "/assets/strategy/education/video.mp4", poster: "/assets/strategy/education/poster.webp", aspect: "9/16" },
    { kind: "video" as const, src: "/assets/media/kuliner-2.mp4", poster: "/assets/media/kuliner-2.webp", aspect: "9/16" },
    { kind: "video" as const, src: "/assets/media/travel-1.mp4", poster: "/assets/media/travel-1.webp", aspect: "9/16" },
    { kind: "video" as const, src: "/assets/media/travel-2.mp4", poster: "/assets/media/travel-2.webp", aspect: "9/16" },
  ],
};

// Editorial items. Creator is always "Jassinta Roid Triniti". Feed items are images (aspect 1080/1072), videos are 1080/1920. Display date under the media as dd/mm derived from iso; year is shown in the title like "Facial Messo (2025)".
// stats keys: views, likes, comments, saves, shared (show only keys that exist). Labels: Views, Likes, Comments, Saves, Shares.
export const editorial: EditorialItem[] = [
  {
    id: "facial-messo",
    title: "Facial Messo",
    iso: "2025-06-22",
    platform: "TikTok",
    contentType: "Video Animation",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-cream-41618-large.mp4",
    poster: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Elsthetic, Aishi Beauty",
    account: "@ELSthetic Official",
    accountUrl: "https://vt.tiktok.com/ZS94wSVfA/",
    info: [
      "I was involved in developing educational and promotional animated content about facial mesotherapy treatments for dull skin, enlarged pores, and signs of aging.",
      "The most unique aspect of this project was the inclusion of engaging “before-and-after” facial animations.",
    ],
    stats: { views: 179, likes: 2, shared: 2 },
  },
  {
    id: "ceramide",
    title: "Ceramide",
    iso: "2025-07-09",
    platform: "TikTok",
    contentType: "Video Education",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-skin-care-treatment-of-a-woman-42407-large.mp4",
    poster: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Elsthetic, Aishi Beauty",
    account: "@ELSthetic Official",
    accountUrl: "https://vt.tiktok.com/ZS94w5vFE/",
    info: [
      "This is arguably the best product-focused educational, or “soft sell,” video I created during my time at Elsthetic, thanks to its crisp visuals and clear animation.",
      "However, despite the high quality of the animation and imagery, it fell short on engagement: the video underperformed in views, likes, and shares.",
    ],
    stats: { views: 155, likes: 0, shared: 2 },
  },
  {
    id: "pico-glow-laser",
    title: "Pico Glow Laser",
    iso: "2025-07-13",
    platform: "TikTok",
    contentType: "Video Promotion",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-hands-applying-moisturizer-on-face-41616-large.mp4",
    poster: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Elsthetic, Aishi Beauty",
    account: "@ELSthetic Official",
    accountUrl: "https://vt.tiktok.com/ZS94wfGX9/",
    info: [
      "During my time at Elsthetic, I also tried creating promotional, or “hard-sell,” videos, as I believed such promotions were crucial for boosting company engagement.",
      "However, engagement turned out to be very low. I realized that people don't really care about what I am selling, but about how important it is to them.",
    ],
    stats: { views: 230, likes: 1, shared: 2 },
  },
  {
    id: "glow-max",
    title: "Glow Max With Triple Geneo",
    iso: "2025-09-15",
    platform: "Instagram",
    contentType: "Feed",
    kind: "image",
    src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1072",
    company: "Elsthetic, Aishi Beauty",
    account: "@elsthetic_pesona",
    accountUrl: "https://www.instagram.com/p/DOmonNPj2By/?stkn=MWN1YjZpaWZqZnQ4bQ==",
    info: [
      "During my time at both Elsthetic and Aishi Beauty, I was also actively involved in creating and designing promotional price flyers on a weekly basis.",
      "The purpose of these promotional flyers was to boost sales.",
    ],
    stats: {},
  },
  {
    id: "mega-sale-99",
    title: "Mega Sale 9.9 Booster Facial",
    iso: "2025-09-09",
    platform: "Instagram",
    contentType: "Feed",
    kind: "image",
    src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1072",
    company: "Elsthetic, Aishi Beauty",
    account: "@elsthetic_pesona",
    accountUrl: "https://www.instagram.com/p/DOXRYsuD4ze/?stkn=d3YwdWo1cGx5enJ2",
    info: [
      "I also create promotional flyers for special dates, such as 9.9, 7.7, and so on.",
      "Just like the weekly promotions, the goal of these special-date promotions is to boost interest and sales.",
    ],
    stats: {},
  },
  {
    id: "vit-c-therapy",
    title: "Promo Vit C Therapy",
    iso: "2025-09-08",
    platform: "Instagram",
    contentType: "Feed",
    kind: "image",
    src: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1072",
    company: "Elsthetic, Aishi Beauty",
    account: "@elsthetic_pesona",
    accountUrl: "https://www.instagram.com/p/DOUnEKHDxW1/?stkn=MWZ5d2J1ZTl1aXJlcw==",
    info: [
      "When tasked with designing weekly flyers, the challenge often lies in creating designs that are cohesive yet distinct.",
      "This approach ensures that promotions look appealing while remaining aligned with the company's design pillars and overall style.",
    ],
    stats: {},
  },
  {
    id: "luxury-facial",
    title: "Luxury Facial",
    iso: "2025-09-02",
    platform: "Instagram",
    contentType: "Feed",
    kind: "image",
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1072",
    company: "Elsthetic, Aishi Beauty",
    account: "@elsthetic_pesona",
    accountUrl: "https://www.instagram.com/p/DOFf4gCj9kA/?stkn=MTFxcHV1YzBkNjF1cQ==",
    info: [
      "Beyond the weekly and “special date” promotions, there is another offer: the limited-slot promotion.",
      "The purpose of this promotion is to encourage customers to quickly purchase or book beauty services at our clinic.",
    ],
    stats: {},
  },
  {
    id: "promo-17-agustus",
    title: "Promo 17 Agustus",
    iso: "2025-08-15",
    platform: "Instagram",
    contentType: "Feed",
    kind: "image",
    src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1072",
    company: "Elsthetic, Aishi Beauty",
    account: "@elsthetic_pesona",
    accountUrl: "https://www.instagram.com/p/DNWtJsYPp9L/?stkn=MXZrOG90b25rbjRldQ==",
    info: [
      "Our beauty clinic company also runs promotions for major national holidays.",
      "Naturally, these promotional campaigns are designed to boost engagement and attract new clientele during peak holiday seasons.",
    ],
    stats: {},
  },
  {
    id: "luxury-glow-liposome",
    title: "Luxury Glow Free Liposome",
    iso: "2025-07-22",
    platform: "Instagram",
    contentType: "Feed",
    kind: "image",
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1072",
    company: "Elsthetic, Aishi Beauty",
    account: "@elsthetic_pesona",
    accountUrl: "https://www.instagram.com/p/DMZA7DIPlso/?stkn=MTJ3NzZzOHJtcTRpMw==",
    info: [
      "Working as a designer requires both creative instinct and strategic clarity.",
      "I designed promotional flyers that incorporate educational elements, ensuring potential customers understand key dermatological benefits.",
    ],
    stats: {},
  },
  {
    id: "umroh-bareng",
    title: "Umroh Bareng Keluarga",
    iso: "2025-08-06",
    platform: "TikTok",
    contentType: "Video Promotion",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-camera-in-a-spa-42408-large.mp4",
    poster: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Karamina Tour",
    account: "@KARAMINA TOUR",
    accountUrl: "https://vt.tiktok.com/ZS94wBUV5/",
    info: [
      "While working at Karamina Tour, I created animated TikTok promotional content using authentic footage from Umrah pilgrimages.",
      "Engagement and conversion rates for this campaign grew significantly, driving measurable travel package inquiries.",
    ],
    stats: { views: 179, likes: 75, comments: 1, saves: 7, shared: 3 },
  },
  {
    id: "umroh-mahal",
    title: "Umroh Itu Mahal Gak Sih?",
    iso: "2025-08-03",
    platform: "TikTok",
    contentType: "Video Education Animation",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-cream-41618-large.mp4",
    poster: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Karamina Tour",
    account: "@KARAMINA TOUR",
    accountUrl: "https://vt.tiktok.com/ZS94K1qgA/",
    info: [
      "During my time at Karamina Tour, I produced animated educational videos that delivered strong results in audience retention and conversion on TikTok.",
      "These videos utilized a soft-sell narrative at the climax, accelerating subscriber acquisition.",
    ],
    stats: { views: 179, likes: 32, saves: 1, shared: 3 },
  },
  {
    id: "rindu-kabah",
    title: "Rindu Melihat Ka'bah?",
    iso: "2025-08-09",
    platform: "TikTok",
    contentType: "Video Promotion",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-skin-care-treatment-of-a-woman-42407-large.mp4",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Karamina Tour",
    account: "@KARAMINA TOUR",
    accountUrl: "https://vt.tiktok.com/ZS94wW7Ja/",
    info: [
      "Publishing this video to TikTok generated widespread promotional reach, with viral views climbing rapidly past 914 views.",
    ],
    stats: { views: 914, likes: 98, comments: 2, saves: 10, shared: 3 },
  },
  {
    id: "elspresso-gofood",
    title: "Elspresso Kini Tersedia di GoFood",
    iso: "2025-07-20",
    platform: "Instagram",
    contentType: "Video Education",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-hands-applying-moisturizer-on-face-41616-large.mp4",
    poster: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Elspresso",
    account: "@elspresso_coffepastry",
    accountUrl: "https://www.instagram.com/reel/DMUwp8qBd5J/?igsh=czBnc3A3YXJlcW54",
    info: [
      "During my time at ELS Corp, I directed content creation and video management for its subsidiary, Elspresso.",
      "This broadened my experience in digital marketing for the culinary and specialty coffee sector.",
    ],
    stats: { views: 24, likes: 1 },
  },
  {
    id: "mood-menu",
    title: "Mood Menu",
    iso: "2025-07-26",
    platform: "Instagram",
    contentType: "Video Soft Selling",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-camera-in-a-spa-42408-large.mp4",
    poster: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Elspresso",
    account: "@elsthetic_pesona",
    accountUrl: "https://www.instagram.com/reel/DMkb0mKhkus/?igsh=MXNuZjVndzd5d200Nw==",
    info: [
      "While at Elspresso, I also created a soft-selling video produced almost entirely with animation, although its engagement and conversion rates were very low.",
    ],
    stats: { views: 38, likes: 0 },
  },
  {
    id: "meeting-package",
    title: "Meeting Package FullDay",
    iso: "2025-07-22",
    platform: "Instagram",
    contentType: "Video Promotion",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-cream-41618-large.mp4",
    poster: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1920",
    company: "Elspresso",
    account: "@elsthetic_pesona",
    accountUrl: "https://www.instagram.com/reel/DMaBAg8B0tG/?igsh=MXA0dGpkanZlamd4MQ==",
    info: [
      "Promotional video content was also produced during my time at Elspresso, although engagement and conversion rates remained low.",
      "This is understandable, as Elspresso is a newly established culinary business.",
    ],
    stats: { views: 42, likes: 1 },
  },
];

export const strategyHero = {
  lines: [
    [
      { text: "from", face: "regular" as const, color: "#FFFFFF" },
      { text: "Scrolling", face: "italic" as const, color: "#D7261E" },
    ],
    [
      { text: "to", face: "regular" as const, color: "#FFFFFF" },
      { text: "Strategy", face: "italic" as const, color: "#D7261E" },
    ],
  ],
  narration:
    "I found the perfect canvas when I joined a fashion brand that did not merely sell clothing; it sold lifestyle and confidence. This was where I began building content strategies with genuine purpose and personality.",
  media: ["education", "hard-selling", "entertainment", "fun"].map((s) => ({
    kind: "video" as const,
    src: `/assets/strategy/${s}/video.mp4`,
    poster: `/assets/strategy/${s}/poster.webp`,
    aspect: "9/16",
  })),
};

// Order = left to right in the immersive strip.
export const strategy: StrategyItem[] = [
  {
    slug: "hard-selling",
    label: "Hard Selling",
    video: "/assets/strategy/hard-selling/video.mp4",
    poster: "/assets/strategy/hard-selling/poster.webp",
    about:
      "Content designed to introduce products more exclusively, typically through premium content, corporate storytelling, and product advertisements.",
    best:
      "One of the best hard-selling contents I created was a video titled “Selamat Siang Nyonya,” which showcased the boutique atmosphere through storytelling and a vintage aesthetic.",
    reference: {
      image: "/assets/strategy/hard-selling/reference.webp",
      by: "@willamazing (Instagram)",
    },
    credit: [
      ["Reference", "@willamazing (Instagram)"],
      ["Script", "Jassinta Roid Triniti"],
      ["Talent", "Siti Nur Azizah (@owshuary)"],
      ["Videographer", "Jassinta Roid Triniti"],
      ["Editing", "Jassinta Roid Triniti"],
    ],
    results: { views: "4000+", likes: "22", shared: "3" },
    seeMore: "https://www.instagram.com/reel/DW3TxpyDaFQ/?igsh=MThucG96MmNyZmU2YQ==",
    footage: [1, 2, 3, 4, 5].map((n) => `/assets/strategy/hard-selling/footage-${n}.webp`),
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    video: "/assets/strategy/entertainment/video.mp4",
    poster: "/assets/strategy/entertainment/poster.webp",
    about:
      "Content designed to introduce products by leveraging current social media trends and viral topics.",
    best:
      "One of the best entertainment contents I created was “Office Look vs Campus Look,” featuring office and campus outfit inspirations based on a trending format using the song “Suzanne.”",
    reference: {
      image: "/assets/strategy/entertainment/reference.webp",
      by: "@nicholas linadi (TikTok)",
    },
    credit: [
      ["Reference", "@nicholas linadi (TikTok)"],
      ["Script", "Jassinta Roid Triniti"],
      ["Talent", "Chindy"],
      ["Videographer", "Jassinta Roid Triniti"],
      ["Editing", "Jassinta Roid Triniti"],
    ],
    results: { views: "2000+", likes: "3", shared: "2" },
    seeMore: "https://www.instagram.com/reel/DXlt8YhDfvy/?igsh=NGJqYTBueHI3emRi",
    footage: [1, 2, 3, 4, 5].map((n) => `/assets/strategy/entertainment/footage-${n}.webp`),
  },
  {
    slug: "education",
    label: "Education",
    video: "/assets/strategy/education/video.mp4",
    poster: "/assets/strategy/education/poster.webp",
    about:
      "Content designed to provide explanations and valuable information with the goal of educating the audience.",
    best:
      "One of the best educational contents I created was a video explaining how to place an online order through Lassiewear's Instagram Direct Messages (DM) titled “Tata Cara Order via DM”.",
    reference: {
      image: "/assets/strategy/education/reference.webp",
      by: "@Nadhera Luxury Indonesia",
    },
    credit: [
      ["Reference", "@Nadhera Luxury Indonesia"],
      ["Script", "Jassinta Roid Triniti"],
      ["Talent", "Siti Nur Azizah (@owshuary)"],
      ["Videographer", "Jassinta Roid Triniti"],
      ["Editing", "Jassinta Roid Triniti"],
    ],
    results: { views: "2000+", likes: "10", shared: "3" },
    seeMore: "https://www.instagram.com/reel/DXTAK0IDe-y/?igsh=MWpobWVvMHFnZmtiMw==",
    footage: [1, 2, 3, 4, 5].map((n) => `/assets/strategy/education/footage-${n}.webp`),
  },
  {
    slug: "fun",
    label: "Fun",
    video: "/assets/strategy/fun/video.mp4",
    poster: "/assets/strategy/fun/poster.webp",
    about:
      "Content designed to entertain audiences and increase social media engagement through humor and relatable trends.",
    best:
      "One of the best fun contents I created was a video titled “No No Ya Dek,” inspired by a social media trend that was popular at the time.",
    reference: {
      image: "/assets/strategy/fun/reference.webp",
      by: "@diary._secondbranded",
    },
    credit: [
      ["Reference", "@diary._secondbranded"],
      ["Talent", "Siti Nur Azizah (@owshuary)"],
      ["Talent", "Bella Damayanti"],
      ["Talent", "Vira Ananda"],
      ["Videographer", "Jassinta Roid Triniti"],
      ["Editing", "Jassinta Roid Triniti"],
    ],
    results: { views: "30K+", likes: "223", shared: "24" },
    seeMore: "https://www.instagram.com/reel/DW3o0-UjfMG/?igsh=d2Q3cWk0NzQ1YzMz",
    footage: [1, 2, 3, 4, 5].map((n) => `/assets/strategy/fun/footage-${n}.webp`),
  },
];

// Archive extras (items that are not already in writingWorks / editorial / strategy). "—" = company unknown.
export const archiveExtras: ArchiveExtra[] = [
  {
    title: "Hari Buruh",
    company: "Lassiewear",
    format: "Photo",
    type: "Greetings for special occasions",
    kind: "image",
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1350",
  },
  {
    title: "Hari Kartini",
    company: "Lassiewear",
    format: "Photo",
    type: "Greetings for special occasions",
    kind: "image",
    src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1350",
  },
  {
    title: "Hari Bumi Sedunia",
    company: "Lassiewear",
    format: "Photo",
    type: "Greetings for special occasions",
    kind: "image",
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1350",
  },
  {
    title: "Hari Pendidikan Nasional",
    company: "Lassiewear",
    format: "Photo",
    type: "Greetings for special occasions",
    kind: "image",
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1080&auto=format&fit=crop",
    aspect: "1080/1350",
  },
  {
    title: "Bumper Al-Karamina Islamic School",
    company: "Al-Karamina Islamic School",
    format: "Video",
    type: "Bumper",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-at-camera-in-a-spa-42408-large.mp4",
    poster: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1080&auto=format&fit=crop",
    aspect: "1920/1080",
  },
  {
    title: "Bumper Karamina Tour",
    company: "Karamina Tour",
    format: "Video",
    type: "Bumper",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-skin-care-treatment-of-a-woman-42407-large.mp4",
    poster: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1080&auto=format&fit=crop",
    aspect: "1920/1080",
  },
  {
    title: "Bumper Elsthetic",
    company: "Elsthetic",
    format: "Video",
    type: "Bumper",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-facial-cream-41618-large.mp4",
    poster: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1080&auto=format&fit=crop",
    aspect: "1920/1080",
  },
  {
    title: "Trailer Buku Smart Entrepreneur Muslim",
    company: "—",
    format: "Video",
    type: "Book Trailer",
    kind: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-hands-applying-moisturizer-on-face-41616-large.mp4",
    poster: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1080&auto=format&fit=crop",
    aspect: "1920/1080",
  },
];
