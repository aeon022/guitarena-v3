# Roadmap: Guitarena → Orbiter + Astro (Go-live Jan 2027)

Stand: 2026-09-19. Ziel: Konzerte werden im Orbiter-Admin gepflegt (kein Git, kein Markdown), die Seite baut sich daraus neu.

## Ausgangslage (geprüft)

| Thema | Heute |
|---|---|
| Frontend | Astro 6, **statisch** (`astro.config.mjs` ohne `output`/Orbiter), Tailwind v4 |
| Inhalte | 4 Events 2026 in `src/content/events/*.md` + 16 in `events/archiv/` (2022–2025), Zod-Schema in `src/content.config.ts` |
| Event-ID = URL | `programm/${event.id}/` — ID ist der Dateiname (Archiv: `archiv/2022-…`) |
| Bilder | `public/images/events/` (4 MB), Gästebuch `public/images/guestbook/` (11 MB, statisch). Responsive-Varianten sind in `utils/responsiveImages.ts` **fest verdrahtet** (4 Events) |
| Deploy | `git push production main` → Bare-Repo → `post-receive` → `docker compose up -d --build` (Node 22 → nginx) auf `m11.starbase11.com`, Plesk-nginx davor |
| Stichtag | „Kommend/Vergangen" wird **zur Build-Zeit** berechnet (`isUpcoming`) |

**MASTER_CONCEPT.md ist veraltet:** Orbiter hat heute (core 0.3.12 / integration 0.3.18 / admin 0.3.81) einen **eigenständigen Admin-Server** (Hono, Port 4322). Die Astro-Integration ist schlank, und `orbiter:collections` ist ein **Build-Zeit-Snapshot** (Runtime-Adapter steht im Orbiter-Backlog). `output: 'server'` bringt für Guitarena daher nichts.

## Zielarchitektur (Empfehlung)

```
Redakteur ──► admin.guitarena.at (Plesk-nginx, HTTPS) ──► Container "orbiter-admin" (Hono :4322)
                                                              │  liest/schreibt
                                                        content.pod (Volume, nicht in Git)
                                                              │  Publish → Webhook
                                                              ▼
                       Build: Astro (static) liest content.pod ──► nginx-Container ──► guitarena.at
```

- **Frontend bleibt statisch** (schnell, keine Laufzeit-Abhängigkeit vom Admin). Der Admin darf ausfallen, ohne dass die Seite ausfällt.
- **Ein Pod, zwei Container** (Admin + Site-Build). Keine externe DB.
- Vorbild im Bestand: `a83-blog/techblog` (Orbiter-Integration + Node-Adapter) und `~/orbiter.sh` auf dem Server.

## Phasen

### Phase 0 — Sofort, unabhängig von Orbiter (Okt 2026)
- [ ] **Nächtlicher Rebuild** (Plesk-Cron: `cd …/guitarena-astro && docker compose up -d --build`), sonst bleibt ein Konzert bis zum nächsten Deploy unter „Kommend", auch wenn es schon vorbei ist.
- [ ] Tag `v3-static` setzen (Rückfallpunkt, siehe Rollback).
- [ ] Passwort von `wolf359` ändern, SSH-Key einrichten (`ssh-copy-id`).
- [ ] Bekannt: `EventCard` liest `event.body`, das im Schema/Objekt fehlt → Karten zeigen keinen Teaser-Text. Beim Loader-Umbau (Phase 2) mit beheben.

### Phase 1 — Orbiter-Admin bereitstellen (Nov 2026, Konzert 20.11. als letzter Test auf dem alten Stand)
- [ ] `content.pod` anlegen (`npx @a83/orbiter-cli init` in Scratch-Ordner, dann Pod ins Guitarena-Projekt).
- [ ] Collection `events` modellieren: `title` (string), `date` (datetime), `location` (string), `image` (media), `video` (url), `ticketLink` (url/email), `body` (richtext). Deckt das bestehende Zod-Schema 1:1.
- [ ] Admin-Container (Node 22, **Debian-slim statt alpine** — `better-sqlite3` ist nativ), Volume für `content.pod`, Port 4322 nur auf `127.0.0.1`.
- [ ] Subdomain `admin.guitarena.at` in Plesk + Let's Encrypt, Proxy auf `127.0.0.1:4322`.
- [ ] **Default-Login `admin/admin` sofort ändern**, Redakteur-Account anlegen.
- [ ] Backup: täglicher Kopie-Job für `content.pod` (Pod = einzige Quelle der Wahrheit für Inhalte).

### Phase 2 — Migration der Inhalte + Astro-Loader (Dez 2026)
- [ ] **Import-Skript** (Node, `@a83/orbiter-core`): 20 Markdown-Dateien → `_entries` der Collection `events`. **Slug = bisherige Event-ID**, damit alle URLs gleich bleiben.
- [ ] Bilder der 4 aktuellen + 16 Archiv-Events in die Media-Library (oder bewusst weiter in `public/`; Gästebuch bleibt **statisch**, 11 MB gehören nicht in den Pod).
- [ ] `src/content.config.ts`: `glob`-Loader → Loader über `orbiter:collections` (`getCollection('events')`), **Zod-Schema bleibt** (Fail-fast bei fehlenden Pflichtfeldern). `id = slug`. `orbiter({ pod })` in `astro.config.mjs`, `output` bleibt static.
- [ ] **Responsive Bilder:** die fest verdrahtete Liste in `responsiveImages.ts` durch Astros eingebaute Bildpipeline (`astro:assets`/sharp) ersetzen, sonst bekommen neue Events aus dem Admin keine Varianten.
- [ ] **Verifikation vor Umschaltung:** `sitemap.xml` und alle `programm/*`-URLs von alt/neu vergleichen (Diff muss leer sein); visuell prüfen: Programm, Archiv, Detailseite, Startseite.

### Phase 3 — Publish-Kette (Dez 2026)
- [ ] `build.webhook_url` im Orbiter-Admin → kleiner Endpoint auf dem Server, der `docker compose up -d --build` startet (Token-geschützt, nur intern erreichbar/nginx-Location). Alternativ: Orbiters GitHub-Deploy oder FTP-Deploy nutzen — **vor Entscheidung testen, was auf Plesk am wenigsten Wartung braucht.**
- [ ] Ablauf testen: Event im Admin anlegen → Publish → Seite aktualisiert sich (Ziel < 2 min).
- [ ] Nächtlicher Rebuild aus Phase 0 bleibt bestehen (Stichtag-Logik).
- [ ] Optional: `publish_at`/`unpublish_at` (Orbiter-Feature) nutzen, um Events zeitgesteuert einzublenden.

### Phase 4 — Go-live + Übergabe (Jan 2027)
- [ ] Redakteur einschulen (1 Seite Anleitung: Event anlegen, Bild hochladen, Publish).
- [ ] Erstes echtes 2027-Programm direkt im Admin eingeben (Test unter Realbedingungen).
- [ ] Umschalten: `git push production main` mit neuem Loader; Alt-Markdown bleibt im Git-Verlauf.
- [ ] Nach 2–4 Wochen stabil: `src/content/events/*.md` und Import-Skript entfernen, `MASTER_CONCEPT.md` auf den tatsächlichen Stand bringen.

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Orbiter ist 0.3.x, eigenes Projekt | Versionen im `package.json` **pinnen**; Upgrades nur bewusst, nach Testbuild |
| `content.pod` = Single Point of Failure | Tägliches Backup + Pod-Export vor jedem Update; Pod nie im Web-Root |
| Admin öffentlich erreichbar | HTTPS, starke Passwörter, Standard-Login ändern, optional IP-Beschränkung/Basic-Auth in Plesk-nginx |
| Native Abhängigkeit (`better-sqlite3`) im Docker-Build | Debian-slim-Image; Build lokal mit `docker build` testen, bevor es auf den Server geht |
| URL-Änderungen (SEO) | Slugs 1:1, Sitemap-Diff in Phase 2 |
| Bildqualität/Performance geht verloren | Responsive-Pipeline in Phase 2 ersetzen, Lighthouse vorher/nachher |

## Rollback
Tag `v3-static` (Markdown-Stand) bleibt deploybar: `git push production v3-static:main --force` stellt die statische Seite wieder her, unabhängig vom Pod/Admin.

## Offene Entscheidungen (bitte klären)
1. **Wer pflegt Inhalte?** (Nur du, oder Hartwig Weiher/Porcia-Team? — bestimmt Rollen, Schulung, Admin-Absicherung.)
2. **Rebuild-Trigger:** Webhook-Endpoint auf dem Server vs. GitHub-Deploy (Phase 3).
3. **Bilder:** in den Pod (portabel, ein File) oder weiter im Repo/`public/`?
