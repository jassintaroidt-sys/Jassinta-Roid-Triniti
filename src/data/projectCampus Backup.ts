export interface CampusWork {
  id: string;
  title: string;
  docName: string;
  overview: string;
  penjelasan?: string;
  responsibilities: string[];
  pages: string[];
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
    overview:
      "Comic Rush is a comic magazine published by KSM Comic Club as part of the Karya Karsa program—a platform for young creators on campus to transform their imagination into tangible works. Behind every carefully arranged page and every comic panel brought to life, there was a long creative process that I experienced as the Magazine Layout Designer for this publication.",
    responsibilities: [
      "Managing the magazine layout and overall visual composition.",
      "Designing magazine pages and visual assets.",
      "Revising designs whenever necessary.",
      "Collecting all comic submissions and compiling them into a complete magazine publication.",
      "Reporting project outcomes to the Head of the KSM Comic Club.",
    ],
    pages: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
    ],
    spreadLayout: true,
  },
  {
    id: "pandora",
    title: "Pandora",
    docName: "PROJECT SURAT KABAR.pdf",
    overview:
      "Pandora was a newspaper developed as a team project for an academic course. However, for me, it represented much more than simply fulfilling an assignment requirement. Pandora was my first real experience leading an editorial team.",
    responsibilities: [
      "Leading the editorial workflow of the Pandora newspaper.",
      "Writing news articles.",
      "Creating a news coverage wishlist and editorial agenda.",
      "Reviewing and revising newspaper content.",
      "Designing and managing the newspaper layout.",
    ],
    pages: [
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=1200&auto=format&fit=crop",
    ],
    spreadLayout: true,
  },
];
