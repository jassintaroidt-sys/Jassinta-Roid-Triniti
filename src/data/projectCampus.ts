// Path ke folder public/document (spasi di nama file di-encode otomatis).
const doc = (file: string) => `/document/${encodeURIComponent(file)}`;
const img = (file: string) => `/images/${encodeURIComponent(file)}`;
const pageList = (prefix: string, total: number) =>
  Array.from({ length: total }, (_, i) => img(`${prefix}_${i + 1}.jpg`));

export interface CampusWork {
  id: string;
  title: string;
  docName: string;
  pdf: string;
  pages: string[];
  overview: string;
  penjelasan?: string;
  responsibilities: string[];
  spreadLayout?: boolean;
}

export const campusHero = {
  lines: [
    [
      { text: "From " },
      { text: "The Campus", face: "italic" as const, color: "#D7261E" },
      { text: " For " },
      { text: "The Story", face: "italic" as const, color: "#D7261E" },
    ],
  ],
  narration:
    "Jakarta State Polytechnic was not only where I pursued my education it was also the stage where I first began creating meaningful work. It was here that I started building my identity as a creator, long before my name became recognized beyond the university environment.",
};

export const campusWorks: CampusWork[] = [
  {
    id: "rush-07",
    title: "RUSH 07",
    docName: "LAYOUT COMIC RUSH.pdf",
    pdf: doc("LAYOUT COMIC RUSH.pdf"),
    // 89 halaman: rush_07_1.jpg ... rush_07_89.jpg (halaman 1 = sampul spread)
    pages: pageList("rush_07", 89),
    overview:
      "Comic Rush is a comic magazine published by KSM Comic Club as part of the Karya Karsa program—a platform for young creators on campus to transform their imagination into tangible works. Behind every carefully arranged page and every comic panel brought to life, there was a long creative process that I experienced as the Magazine Layout Designer for this publication.",
    responsibilities: [
      "Managing the magazine layout and overall visual composition.",
      "Designing magazine pages and visual assets.",
      "Revising designs whenever necessary.",
      "Collecting all comic submissions and compiling them into a complete magazine publication.",
      "Reporting project outcomes to the Head of the KSM Comic Club.",
    ],
    spreadLayout: true,
  },
  {
    id: "pandora",
    title: "Pandora",
    docName: "PROJECT SURAT KABAR.pdf",
    pdf: doc("PROJECT SURAT KABAR.pdf"),
    // 8 halaman: pandora_1.jpg ... pandora_8.jpg
    pages: pageList("pandora", 8),
    overview:
      "Pandora was a newspaper developed as a team project for an academic course. However, for me, it represented much more than simply fulfilling an assignment requirement. Pandora was my first real experience leading an editorial team.",
    responsibilities: [
      "Leading the editorial workflow of the Pandora newspaper.",
      "Writing news articles.",
      "Creating a news coverage wishlist and editorial agenda.",
      "Reviewing and revising newspaper content.",
      "Designing and managing the newspaper layout.",
    ],
    spreadLayout: true,
  },
];
