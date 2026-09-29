# Jassinta Roid Triniti — Creative Portfolio (2026)

## Asset Checklist

The following assets are required for full production parity across fonts, opening sequence, writing portfolio, media archive, and strategy examples. Ensure files are placed in `public/` matching exact lowercase paths with hyphens.

### Fonts (`public/fonts/`)
- `sentient-regular.woff2` (WOFF2 font file)
- `sentient-italic.woff2` (WOFF2 font file)
- `sentient-bold.woff2` (WOFF2 font file)
- `sentient-bolditalic.woff2` (WOFF2 font file)

### Opening Sequence (`public/assets/opening/`)
- `intro.mp4` (H.264 MP4, 1920x1080 or optimized web resolution)
- `intro.webp` (WebP poster image)

### Writing Portfolio (`public/assets/writing/`)
- `imn-1.webp` through `imn-4.webp` (WebP images, ~1200x800)
- `innalar-1.webp` through `innalar-4.webp` (WebP images, ~1200x800)
- `ikapunija-1.webp` through `ikapunija-3.webp` (WebP images, ~1200x800)

### Media & Brand Work (`public/assets/media/`)
- `kecantikan-1.mp4`, `kecantikan-1.webp` through `kecantikan-3.mp4`, `kecantikan-3.webp`
- `flyer-kecantikan-1.webp` through `flyer-kecantikan-6.webp`
- `travel-1.mp4`, `travel-1.webp` through `travel-3.mp4`, `travel-3.webp`
- `kuliner-1.mp4`, `kuliner-1.webp` through `kuliner-3.mp4`, `kuliner-3.webp`
- `hari-besar-1.webp` through `hari-besar-4.webp`
- `school-bumper.mp4`, `school-bumper.webp`
- `karamina-tour-bumper.mp4`, `karamina-tour-bumper.webp`
- `elsthetic-bumper.mp4`, `elsthetic-bumper.webp`
- `book-trailer.mp4`, `book-trailer.webp`

### Strategy Examples (`public/assets/strategy/`)
For each category (`hard-selling`, `entertainment`, `education`, `fun`):
- `video.mp4` (H.264 MP4)
- `poster.webp` (WebP video poster)
- `reference.webp` (Reference image)
- `footage-1.webp` through `footage-5.webp` (B-roll footage gallery images)

---

## How to Run Locally and Deploy

### Local Development
1. Clone repository and install dependencies:
   ```bash
   npm install
   ```
   *(Note: Node.js >= 18 is required)*
2. Start development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` (or port specified by Vite).

### Production Build & Preview
1. Build static output:
   ```bash
   npm run build
   ```
2. Preview production build locally:
   ```bash
   npm run preview
   ```

### Vercel Deployment
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import project into Vercel.
3. Vercel automatically detects Vite and uses:
   - Build Command: `tsc && vite build`
   - Output Directory: `dist`
4. The included `vercel.json` ensures SPA client-side routing rewrites (`/*` -> `/index.html`) and immutable caching headers for static assets.
