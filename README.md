# Guitarena.at (v3.0 — "Omniscient Core")

**"Less Noise. Nice Data. No Bloat."**

Guitarena is a premium cultural initiative based in Spittal an der Drau, Austria. Since 1998, it has brought world-class acoustic and fingerstyle guitarists to the historic atmosphere of the Ortenburgerkeller (Schloss Porcia). Version 3.0 represents a complete modernization from legacy WordPress to a high-performance, design-first Astro application.

## 🎯 Project Mission
The goal was to create a "zero-maintenance" frontend that feels like a high-end digital magazine. The application focuses on speed, accessibility, and an immersive user experience that reflects the intimacy of the physical venue.

## 🚀 Tech Stack
- **Framework:** [Astro 6+](https://astro.build/) (Static Site Generation with Server-Side capabilities).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Using the latest CSS-variable-first engine).
- **Icons:** [Astro Icon](https://github.com/natemoo-re/astro-icon) with Iconify integration.
- **Validation:** [Zod](https://zod.dev/) for strictly typed content schema.
- **Animation:** Native View Transitions API, CSS-only marquees, and IntersectionObserver-driven header logic.

## ✨ Key Features
- **Dual-Theme System:**
  - **Atmospheric Dark Mode:** The signature "cellar" vibe with deep tones and amber accents.
  - **Premium Light Mode:** A warm, "parchment paper" aesthetic designed for high readability and a classic print-magazine feel.
  - **Intelligent Header:** Dynamically detects background brightness to flip text colors for maximum contrast.
- **Cinematic Hero:** High-impact video headers that remain atmospheric and dark regardless of the site theme.
- **Infinite Guestbook:** A massive digital archive of artist entries since 1998, featuring infinite scrolling and a custom-built **Cinematic Lightbox** with keyboard navigation.
- **Editorial Content:** High-quality typography using curated serif and mono fonts.
- **Partner Marquee:** A smooth, hardware-accelerated logo loop for supporters and sponsors.
- **WP Migration Core:** Python-based scripts to transform legacy WordPress XML exports into clean, structured Markdown content.

## 📂 Project Structure
```text
/
├── frontend/               # Astro 6 Source Code
│   ├── src/
│   │   ├── components/     # Reusable UI blocks (.astro only)
│   │   ├── content/        # Markdown-based event data (Upcoming & Archiv)
│   │   ├── layouts/        # BaseLayout with theme switching logic
│   │   ├── pages/          # Routing (Home, Programm, Archiv, Guestbook)
│   │   └── styles/         # Global Tailwind v4 configuration
│   └── public/             # Optimized WebP assets & images
├── drafts & content/       # Migration source (WordPress XML & drafts)
├── MASTER_CONCEPT.md       # The architectural blueprint
├── parse_xml.py            # WordPress to Markdown transformation script
└── download_images.py      # Automated media recovery script
```

## 🛠 Installation & Development

### Prerequisites
- Node.js (v20 or higher)
- npm or pnpm

### Setup
1. Clone the repository.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏛 Migration Logic
The project includes specialized Python tools to migrate 30+ years of history:
- `parse_xml.py`: Parses WordPress exports, extracts metadata (dates, artists, locations), and generates clean Frontmatter-heavy Markdown.
- `update_archiv_webp.py`: Batch processes legacy JPG/PNG images into modern WebP format for optimal performance.

---

**Guitarena.at — Music that remains.**
© 2026 Kulturinitiative Spittal a. d. Drau.
