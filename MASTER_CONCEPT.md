# MASTER_CONCEPT: Guitarena.at (v3.0 - "Omniscient Core")

## 1. Core-Mission & Leitgedanken
* **Status Quo:** WordPress + Oxygen Builder (Legacy, Bloat, Maintenance-Overhead).
* **Target:** Astro + Orbiter CMS (Custom SQLite).
* **Ziel:** "Less Noise. Nice Data. No Bloat." Maximale Performance, Zero-Maintenance Frontend, einfache Verwaltung für 4-5 Events im Jahr.
* **Fokus:** Eine blitzschnelle Landingpage, klare Event-Kommunikation und ein sauberes Archiv vergangener Veranstaltungen.

## 2. Architektur & Tech-Stack
* **Frontend:** Astro 5. Wir nutzen zwingend `output: 'server'` in der `astro.config.mjs`, da die injizierten Orbiter-Admin-Routen Server-Side-Rendering benötigen. Das Frontend selbst wird wo möglich durch Caching/Prerendering optimiert.
* **Styling:** Tailwind CSS v4 (ohne `tailwind.config.js`, Nutzung von `@theme` und CSS Variablen).
* **Backend / Headless CMS:** Orbiter (`@orbiter/core` + `@orbiter/integration`). Single-File SQLite (`.pod`), direkt in Astro integriert. Keine externe DB, kein separater Container nötig.
* **Validation:** Zod. Jede Payload aus dem Orbiter-CMS wird via Zod validiert, bevor sie ins Astro-Frontend fließt.

## 3. Daten-Modellierung (Astro 5 Loader & Zod)
Wir trennen nicht zwingend zwischen "Aktiven Events" und "Archiv" auf Datenbankebene. Wir steuern das elegant über das Datum. Die Brücke zwischen Orbiter und Astro schlagen wir über die `src/content/config.ts`.

### Collection: `Events` & Orbiter Loader
```typescript
// Dateipfad: frontend/src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { getCollection } from 'orbiter:collections'; // Orbiters virtuelles Modul

const eventSchema = z.object({
  title: z.string().min(3, "Titel muss mindestens 3 Zeichen lang sein"),
  date: z.coerce.date(), // Wandelt Orbiters YYYY-MM-DD HH:MM:SS nativ in JS Date um
  location: z.string().default('Schloss Porcia, Spittal/Drau'),
  body: z.string().optional(), // Richtext/Markdown aus Orbiter
  image: z.string().nullable().optional(), // Media ID aus der .pod
  ticketLink: z.string().url().optional(),
});

export type GuitarenaEvent = z.infer<typeof eventSchema>;

const events = defineCollection({
  loader: async () => {
    const orbiterEvents = await getCollection('events');
    return orbiterEvents.map((event: any) => ({
      id: event.slug, // Slug aus der _entries Tabelle als eindeutige Astro-ID
      ...event.data
    }));
  },
  schema: eventSchema,
});

export const collections = { events };
```

## 4. Frontend & Routing-Strategie (Astro)
* `/` -> **Home:** Hero-Section mit dem *nächsten* anstehenden Event. Kurze Info zur Initiative.
* `/events` -> **Programm:** Liste aller zukünftigen Events (`event.date >= today`).
* `/archiv` -> **History:** Kachel-Grid aller vergangenen Events (`event.date < today`), absteigend sortiert.
* `/about` -> **Über Uns:** Statische Seite über die Kulturinitiative.

*Performance-Regel:* Keine fetten JavaScript-Karussells. Wir nutzen CSS-Grid und natives Scrolling. Keine `div`-Suppe, nur semantisches HTML (`<article>` für Events, `<time>` für Daten).

## 5. Migrations-Strategie (WordPress -> Orbiter)
1. **Export:** Die WP-Daten (Titel, Datum, Text, Bilder) via WP REST API oder JSON-Export abgreifen.
2. **Transform (Script):** Ein Node-Script liest den WP-Dump, bereinigt den HTML-Müll aus Oxygen und transformiert ihn in das saubere JSON-Format.
3. **Import:** Direkte Injection via `better-sqlite3` in die `_entries` Tabelle der Orbiter `.pod` Datei.

---

## 6. SYSTEM CONTEXT FÜR AI-ASSISTENTEN (Gemini CLI / Claude CLI)
**CRITICAL PROTOCOL:** Du bist ein Code-Assistent unter der Führung des A83 Lead Architects. Deine Lösung muss "Less Noise. Nice Data. No Bloat." entsprechen. Ignorierst du diese Regeln, wird dein Code verworfen.

### A. Architektur & Orbiter CMS Brücke
* **Astro Config:** Das Projekt MUSS mit `output: 'server'` konfiguriert sein, da Orbiter dies für die `/orbiter` Admin-Routen verlangt. Die Integration wird via `orbiter({ pod: './content.pod' })` in der `astro.config.mjs` geladen.
* **Source of Truth:** Die Orbiter API (via `orbiter:collections` virtuellem Modul).
* **Validation:** Zod-first Policy. Falsche Daten aus dem CMS = Build Crash.
* **Domain Knowledge:** Guitarena bringt hochkarätige Akustik/Fingerstyle-Gitarristen in den Ortenburgerkeller (Schloss Porcia, Spittal a. d. Drau).

### B. Das Projekt-Skelett (File Tree)
Nutze exakt diese Struktur. Generiere keine Dateien außerhalb dieser Konvention.

```text
/guitarena-v3
├── astro.config.mjs          # output: 'server', Orbiter Integration, Tailwind v4
├── package.json              
├── content.pod               # Die Orbiter SQLite Datenbank (Single Source of Truth)
├── public/                   # Statische Assets (Favicon, Logos)
└── src/
    ├── components/           # UI-Bausteine (Strictly .astro, kein .tsx)
    │   ├── EventCard.astro   # List-Item für Programm & Archiv
    │   └── Header.astro      # Minimalistisches Nav (Home, Programm, Archiv)
    ├── content/              
    │   └── config.ts         # Zod-Schemas & Orbiter API Loader (siehe oben)
    ├── layouts/              
    │   └── BaseLayout.astro  # <html lang="de">, <head>, Semantic HTML-Wrapper
    ├── pages/                
    │   ├── index.astro       # Home: Hero + Nächstes Event
    │   ├── programm/         
    │   │   ├── index.astro   # Upcoming Events
    │   │   └── [slug].astro  # Event-Detail
    │   └── archiv/           
    │       └── index.astro   # Past Events
    ├── styles/               
    │   └── global.css        # Tailwind v4 @theme CSS-Variablen & Base
    └── utils/                
        └── date.ts           # Date-Formatter (Intl.DateTimeFormat für AT)
```

### C. Ausführungs-Regeln für CLI LLMs (Zero-Tolerance)
1.  **Frontend-Isolation:** Prüfe den Pfad. Wir haben hier (anders als bei typischen Headless-Setups) ein Monorepo-artiges Feeling, da die `.pod` im Root liegt. Astro-Befehle werden im Projekt-Root ausgeführt.
2.  **Kein JS-Bloat:** Nutze **niemals** React, Vue oder Svelte. Die Seite ist read-only.
3.  **Tailwind v4 Strictness:** Keine `tailwind.config.js`. Setze globale Werte in `src/styles/global.css` via `@theme`.
4.  **Content Rendering:** Wenn Orbiter HTML/Markdown liefert, nutze `set:html` in Astro, aber *nur* nach Schema-Validierung.
5.  **Semantik:** Eine Event-Karte ist ein `<article>`. Ein Datum ist ein `<time datetime="...">`. Ein Grid ist `class="grid"`. Sei präzise.

### D. Zod-First Policy ("Zero Trust")
**Das ist die wichtigste Code-Regel des gesamten Projekts:** Vertraue keinen Daten.
1.  **Kein Fetch ohne Schema:** Jeder Daten-Stream aus Orbiter (auch via `getCollection`) MUSS in der `config.ts` durch Zod validiert werden.
2.  **Fail Fast:** Wenn Orbiter ein Pflichtfeld vergisst, crasht der Build (`z.ZodError`).
3.  **Coercion:** Nutze `z.coerce.date()`, um eingehende Datums-Strings (`YYYY-MM-DD HH:MM:SS`) in native JS-Date-Objekte umzuwandeln.

---

## 7. UI & UX Guidelines (The "Aha" Experience)
Wir nutzen keine schweren JS-Libraries. Aha-Effekte entstehen durch native Web-APIs und exzellentes CSS.

* **View Transitions:** Nahtlose Navigation zwischen Listen- und Detailansichten. Morphing von Event-Cards zum Hero-Cover (via nativer View Transitions API in Astro).
* **Scroll-Driven Animations:** Sanftes Einfaden von Archiv-Einträgen gekoppelt an die Scroll-Position (via CSS `animation-timeline: view()`, Tailwind v4).
* **Color Theming ("Ortenburgerkeller"):** Dark-Mode-First. Tiefes Anthrazit/Ebenholz mit satten Amber/Gold-Akzenten und subtilem SVG-Noise für analoge Textur. Konfiguriert via `@theme` in Tailwind v4.
* **Bento Box Archiv:** Asymmetrisches CSS-Grid für vergangene Events, um der Historie (seit 1993) einen Magazin-Charakter zu geben.
* **Micro-Tension:** Physisch wirkende Hover-States an Buttons (federnde `cubic-bezier` Transitions auf `transform: scale()`).
* **Astro Server Islands:** Statisch gerenderte Seiten mit isolierten, asynchron ladenden Server-Komponenten (z.B. `<TicketButton server:defer />`) für Echtzeit-Verfügbarkeiten ohne Performance-Hit.


