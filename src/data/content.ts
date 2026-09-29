// ---------------------------------------------------------------------------
// Helper path ke folder public/. Nama file mengandung spasi, jadi di-encode
// otomatis supaya URL-nya valid di browser.
// ---------------------------------------------------------------------------
const img = (file: string) => `/images/${encodeURIComponent(file)}`;
const vid = (file: string) => `/videos/${encodeURIComponent(file)}`;
const doc = (file: string) => `/document/${encodeURIComponent(file)}`;

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
  aspect: string;
}

export interface DocumentItem {
  title: string;
  src: string;
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

// Foto pribadi Jassinta
export const personPhotos = {
  front: img("FOTO JASSINTA TAMPAK DEPAN.png"),
  aesthetic: img("FOTO JASSINTA ROID TRINITI ESTETIK.png"),
  sitting: img("foto_jassinta_duduk.png"),
  halfBody: img("foto_jassinta_setengah_badan.png"),
};

// Logo-logo (logo_1 ... logo_10)
export const logos: string[] = [
  "logo_1.png",
  "logo_2.png",
  "logo_3.png",
  "logo_4.png",
  "logo_5.png",
  "logo_6.png",
  "logo_7.png",
  "logo_8.png",
  "logo_9.png",
  "logo_10.png",
].map(img);

// Foto dokumentasi Lassiewear
export const fotografiLassiewear: string[] = [
  "Fotografi Lassiewear 1.jpg",
  "Fotografi Lassiewear 2.jpg",
  "Fotografi Lassiewear 3.jpg",
].map(img);

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
  heroVideo: {
    src: vid("Video HERO.webm"),
  },
  introVideo: {
    src: vid("VIDEO PERKENALAN JASSINTA ROID TRINITI.mp4"),
  },
  flyers: [
    { src: img("Flyer Hari Besar 1_Lassiewear.png"), aspect: "1080/1350", alt: "Flyer Hari Besar 1 — Lassiewear" },
    { src: img("Flyer Hari Besar 3_Lassiewear.png"), aspect: "1080/1350", alt: "Flyer Hari Besar 3 — Lassiewear" },
  ],
};

export const writingHero = {
  lines: [
    { text: "Storytelling", face: "italic" as const, color: "#D7261E" },
    { text: "Through Screens", face: "regular" as const, color: "#FFFFFF" },
  ],
  narration:
    "We used to flip through newspapers and magazines; now, we scroll through mobile screens. Over the past five years, I have studied this transformation and become an online news writer, adapting to the ever-changing landscape of digital media.",
  media: ["IMN_1", "IMN_2", "innalar_1", "innalar_2", "Ikapunija_1", "Ikapunija_2"].map((n) => ({
    kind: "image" as const,
    src: img(`${n}.png`),
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
    image: img("IMN_1.png"),
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
    image: img("IMN_2.png"),
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
    image: img("IMN_3.png"),
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
    image: img("IMN_4.png"),
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
    image: img("innalar_1.png"),
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
    image: img("innalar_2.png"),
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
    image: img("innalar_3.png"),
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
    image: img("innalar_4.png"),
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
    image: img("Ikapunija_1.png"),
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
    image: img("Ikapunija_2.png"),
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
    image: img("Ikapunija_3.png"),
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
    { kind: "video" as const, src: vid("Hasil Konten Hardselling Lassiewear.mp4"), aspect: "9/16" },
    { kind: "video" as const, src: vid("kecantikan_2.mp4"), aspect: "9/16" },
    { kind: "video" as const, src: vid("Hasil Konten Education Lassiewear.mp4"), aspect: "9/16" },
    { kind: "video" as const, src: vid("kuliner_2.mp4"), aspect: "9/16" },
    { kind: "video" as const, src: vid("travel_1.mp4"), aspect: "9/16" },
    { kind: "video" as const, src: vid("travel_2.mp4"), aspect: "9/16" },
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
    src: vid("kecantikan_1.mp4"),
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
    src: vid("kecantikan_2.mp4"),
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
    src: vid("kecantikan_3.mp4"),
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
    src: img("flyer_kecantikan_1.jpg"),
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
    src: img("flyer_kecantikan_2.jpg"),
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
    src: img("flyer_kecantikan_3.jpg"),
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
    src: img("flyer_kecantikan_4.jpg"),
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
    src: img("flyer_kecantikan_5.jpg"),
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
    src: img("flyer_kecantikan_6.jpg"),
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
    src: vid("travel_1.mp4"),
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
    src: vid("travel_2.mp4"),
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
    src: vid("travel_3.mp4"),
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
    src: vid("kuliner_1.mp4"),
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
    src: vid("kuliner_2.mp4"),
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
    src: vid("kuliner_3.mp4"),
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
  media: [
    "Hasil Konten Education Lassiewear.mp4",
    "Hasil Konten Hardselling Lassiewear.mp4",
    "Hasil Konten Entertainment Lassiewear.mp4",
    "Hasil Konten Fun Lassiewear.mp4",
  ].map((f) => ({
    kind: "video" as const,
    src: vid(f),
    aspect: "9/16",
  })),
};

// Order = left to right in the immersive strip.
export const strategy: StrategyItem[] = [
  {
    slug: "hard-selling",
    label: "Hard Selling",
    video: vid("Hasil Konten Hardselling Lassiewear.mp4"),
    about:
      "Content designed to introduce products more exclusively, typically through premium content, corporate storytelling, and product advertisements.",
    best:
      "One of the best hard-selling contents I created was a video titled “Selamat Siang Nyonya,” which showcased the boutique atmosphere through storytelling and a vintage aesthetic.",
    reference: {
      image: img("Inspirasi Konten Hardselling_Lassiwear.jpg"),
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
    footage: [1, 2, 3, 4, 5].map((n) => img(`Footage Konten Hardselling ${n}_Lassiewear.jpg`)),
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    video: vid("Hasil Konten Entertainment Lassiewear.mp4"),
    about:
      "Content designed to introduce products by leveraging current social media trends and viral topics.",
    best:
      "One of the best entertainment contents I created was “Office Look vs Campus Look,” featuring office and campus outfit inspirations based on a trending format using the song “Suzanne.”",
    reference: {
      image: img("Inspirasi Konten Entertainment_Lassiewear.jpg"),
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
    footage: [1, 2, 3, 4, 5].map((n) => img(`Footage Konten Entertainment ${n}_Lassiewear.jpg`)),
  },
  {
    slug: "education",
    label: "Education",
    video: vid("Hasil Konten Education Lassiewear.mp4"),
    about:
      "Content designed to provide explanations and valuable information with the goal of educating the audience.",
    best:
      "One of the best educational contents I created was a video explaining how to place an online order through Lassiewear's Instagram Direct Messages (DM) titled “Tata Cara Order via DM”.",
    reference: {
      image: img("Inspirasi Konten Education_Lassiewear.jpg"),
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
    footage: [1, 2, 3, 4, 5].map((n) => img(`Footage Konten Education ${n}_Lassiewear.jpg`)),
  },
  {
    slug: "fun",
    label: "Fun",
    video: vid("Hasil Konten Fun Lassiewear.mp4"),
    about:
      "Content designed to entertain audiences and increase social media engagement through humor and relatable trends.",
    best:
      "One of the best fun contents I created was a video titled “No No Ya Dek,” inspired by a social media trend that was popular at the time.",
    reference: {
      image: img("Inspirasi Konten Fun_Lassiewear.jpg"),
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
    footage: [
      "Footage Konten Fun 2_Lassiewear 1.jpg",
      "Footage Konten Fun 2_Lassiewear.jpg",
      "Footage Konten Fun 3_Lassiewear.jpg",
      "Footage Konten Fun 4_Lassiewear.jpg",
    ].map(img),
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
    src: img("Flyer Hari Besar 1_Lassiewear.png"),
    aspect: "1080/1350",
  },
  {
    title: "Hari Kartini",
    company: "Lassiewear",
    format: "Photo",
    type: "Greetings for special occasions",
    kind: "image",
    src: img("Flyer Hari Besar 2_Lassiewear.png"),
    aspect: "1080/1350",
  },
  {
    title: "Hari Bumi Sedunia",
    company: "Lassiewear",
    format: "Photo",
    type: "Greetings for special occasions",
    kind: "image",
    src: img("Flyer Hari Besar 3_Lassiewear.png"),
    aspect: "1080/1350",
  },
  {
    title: "Hari Pendidikan Nasional",
    company: "Lassiewear",
    format: "Photo",
    type: "Greetings for special occasions",
    kind: "image",
    src: img("Flyer Hari Besar 4_Lassiewear.png"),
    aspect: "1080/1350",
  },
  {
    title: "Pelatihan 1",
    company: "—",
    format: "Photo",
    type: "Training flyer",
    kind: "image",
    src: img("flyer_pelatihan_1.png"),
    aspect: "1080/1350",
  },
  {
    title: "Pelatihan 2",
    company: "—",
    format: "Photo",
    type: "Training flyer",
    kind: "image",
    src: img("flyer_pelatihan_2.png"),
    aspect: "1080/1350",
  },
  {
    title: "Bumper Al-Karamina Islamic School",
    company: "Al-Karamina Islamic School",
    format: "Video",
    type: "Bumper",
    kind: "video",
    src: vid("SCHOOL_BUMPER.mp4"),
    aspect: "1920/1080",
  },
  {
    title: "Bumper Karamina Tour",
    company: "Karamina Tour",
    format: "Video",
    type: "Bumper",
    kind: "video",
    src: vid("KARAMINA_TOUR_BUMPER.mp4"),
    aspect: "1920/1080",
  },
  {
    title: "Bumper Elsthetic",
    company: "Elsthetic",
    format: "Video",
    type: "Bumper",
    kind: "video",
    src: vid("ELSTHETIC_BUMPER.mp4"),
    aspect: "1920/1080",
  },
  {
    title: "Bumper ELS",
    company: "ELS Corp",
    format: "Video",
    type: "Bumper",
    kind: "video",
    src: vid("ELS_BUMPER.mp4"),
    aspect: "1920/1080",
  },
  {
    title: "Bumper Aishi Aesthetic",
    company: "Aishi Aesthetic",
    format: "Video",
    type: "Bumper",
    kind: "video",
    src: vid("AISHI AESTHETIC_BUMPER.mp4"),
    aspect: "1920/1080",
  },
  {
    title: "Trailer Buku Smart Entrepreneur Muslim",
    company: "—",
    format: "Video",
    type: "Book Trailer",
    kind: "video",
    src: vid("BOOK.mp4"),
    aspect: "1920/1080",
  },
];

// Dokumen PDF (Project Campus)
export const documents: DocumentItem[] = [
  { title: "Layout Comic Rush", src: doc("LAYOUT COMIC RUSH.pdf") },
  { title: "Project Surat Kabar", src: doc("PROJECT SURAT KABAR.pdf") },
];
