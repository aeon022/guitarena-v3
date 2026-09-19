# Roadmap Guitarena 2026/27 — SEO, UX und Umbau auf Orbiter + Astro

Stand: 2026-09-19. Zeitangaben und Aufwände (S < 2 h, M ½–1 Tag, L mehrere Tage) sind **Schätzungen**.

Drei Spuren, die parallel laufen können:

| Spur | Inhalt | Zeitraum |
|---|---|---|
| **A — Quick Wins** | SEO, kleine UX-Verbesserungen, Betriebsthemen. Alles auf dem heutigen statischen Stand machbar | Okt – Nov 2026 |
| **B — Orbiter-Umbau** | Inhalte vom Markdown in den Orbiter-Pod, Admin, Publish-Kette | Nov 2026 – Jan 2027 |
| **C — Nach dem Umbau** | Funktionen, die erst mit Orbiter sinnvoll sind (Newsletter, Preise/Endzeit als Felder, …) | ab Feb 2027 |

## Erledigt (live bzw. lokal)

| Was | Stand |
|---|---|
| Kontakt: Google-Karte füllt Rahmen, Aktivieren-Button sichtbar, mobil geprüft | live (`27809fa`) |
| Programm: kommende Konzerte oben, vergangene darunter (neueste zuerst) | live |
| Teaser-Text auf Karten und Startseite (`body` wurde nicht durchgereicht), `stripMarkdown` behält Bindestriche | live |
| Kalender-Export: `.ics` pro Konzert (`/programm/<id>.ics`), Button „Kalender" auf der Detailseite | lokal fertig, noch nicht deployt |
| Teilen: Button „Teilen" (Share-Sheet am Handy, sonst Link kopieren) auf der Detailseite | lokal fertig, noch nicht deployt |

## Ausgangslage (geprüft)

| Thema | Heute |
|---|---|
| Frontend | Astro 6, **statisch** (kein `output: 'server'`, keine Orbiter-Integration), Tailwind v4 |
| Inhalte | 4 Events 2026 in `src/content/events/*.md` + 16 in `events/archiv/` (2022–2025), Zod-Schema in `src/content.config.ts` |
| Event-ID = URL | `programm/${event.id}/` — ID ist der Dateiname (Archiv: `archiv/2022-…`) |
| Bilder | `public/images/events/` (4 MB), Gästebuch `public/images/guestbook/` (11 MB, statisch). Responsive-Varianten in `utils/responsiveImages.ts` **fest verdrahtet** (4 Events) |
| Deploy | `git push production main` → Bare-Repo → `post-receive` → `docker compose up -d --build` (Node 22 → nginx) auf `m11.starbase11.com`, Plesk-nginx davor |
| Stichtag | „Kommend/Vergangen" wird **zur Build-Zeit** berechnet (`isUpcoming`) |
| SEO-Basis (Live-Check) | Titel, Description, Canonical, OG-Bild, Sitemap, robots.txt, JSON-LD (`Event` auf Detailseiten, `Organization`/`WebSite` auf Startseite), Alt-Texte, http→https und www→Hauptdomain vorhanden |

**MASTER_CONCEPT.md ist veraltet:** Orbiter hat heute (core 0.3.12 / integration 0.3.18 / admin 0.3.81) einen **eigenständigen Admin-Server** (Hono, Port 4322). Die Astro-Integration ist schlank, und `orbiter:collections` ist ein **Build-Zeit-Snapshot** (Runtime-Adapter steht im Orbiter-Backlog). `output: 'server'` bringt für Guitarena daher nichts.

---

## Spur A — Quick Wins (Okt – Nov 2026)

### A1 Betrieb & Sicherheit
| # | Aufgabe | Aufwand | Fertig, wenn |
|---|---|---|---|
| A1.1 | **Nächtlicher Rebuild** per Plesk-Cron (`cd …/guitarena-astro && docker compose up -d --build`, z. B. 03:00) | S | Ein vergangenes Konzert wechselt ohne Deploy von „Kommend" zu „Vergangen" |
| A1.2 | Tag `v3-static` setzen (Rückfallpunkt für Spur B) | S | `git tag` auf GitHub sichtbar |
| A1.3 | Passwort von `wolf359` ändern, SSH-Key (`ssh-copy-id`) | S | Push auf `production` ohne Passwortabfrage |
| A1.4 | **Jahres-Logik 2027 absichern:** `EventLineup` hat „2026" fest im Titel; `programm/index` und Startseite filtern hart auf das laufende Kalenderjahr. Am 01.01.2027 wären beide leer, solange kein 2027-Konzert eingetragen ist. Besser: „nächste Konzerte" unabhängig vom Jahr + Titel aus dem Jahr des nächsten Konzerts | S–M | Test mit gefaktem Datum 2027-01-01: Programm zeigt weder Leere noch „2026" |
| A1.5 | Programm-Leerzustand für die Winterpause (Nov → Programmstart): freundlicher Hinweis „Programm 2027 folgt", Link zum Archiv | S | Zustand lokal mit leerer Kommend-Liste geprüft |

### A2 SEO
| # | Aufgabe | Aufwand | Fertig, wenn |
|---|---|---|---|
| A2.1 | **Redirects von alten WordPress-URLs** auf die neuen Seiten (301, in Plesk-nginx). Dafür alte URLs sammeln (Search Console → Seiten, Wayback, ggf. Backup der WP-Sitemap). **Braucht Input von dir** (Liste oder Search-Console-Zugriff) | M | Stichprobe von 10 alten URLs liefert 301 → richtige neue Seite |
| A2.2 | **Ort als strukturierte Daten** auf `/kontakt/` (`MusicVenue` / `LocalBusiness`: Adresse, Koordinaten, E-Mail, Telefon) | S | Google Rich-Results-Test ohne Fehler |
| A2.3 | **Programm-Seite:** `ItemList` der kommenden Events; in `Event`-Daten `offers` ergänzen (18 € / 10 €, Kontakt für Tickets) | S–M | Rich-Results-Test zeigt Event mit Preis. *Preise stehen heute nur im Fließtext („Gut zu wissen"); dauerhaft sauber erst mit Orbiter-Feldern (C2)* |
| A2.4 | **Sitemap:** `<lastmod>` (Event-Datum bzw. Build-Datum) | S | `sitemap.xml` enthält `lastmod` |
| A2.5 | Startseite: zwei `<h1>` auf eine reduzieren (die sr-only-Variante beibehalten oder das Hero-`h1` zur `h2` machen) | S | Genau ein `<h1>` pro Seite |
| A2.6 | **Archiv-Titel mit Jahr und Künstler** („Franco Morone – Konzert 2022 in Spittal"), Archiv-Detailseiten prüfen, ob der Text für die Suche taugt | S | Title/Description der Archivseiten neu, stichprobenhaft geprüft |
| A2.7 | **Google-Business-Profil** anlegen/beanspruchen (Adresse, Fotos, Link zur Seite, Öffnungs-/Konzertinfo) — organisatorisch, nicht im Code | S | Profil verifiziert |
| A2.8 | **Search Console + Bing Webmaster Tools**, Sitemap einreichen, Property für `guitarena.at` (Domain-Property) | S | Sitemap „Erfolgreich"; Abdeckungsbericht sichtbar |
| A2.9 | Lighthouse-Messung (Mobile) für Start, Programm, Detail, Kontakt als **Baseline** vor dem Umbau (Fonts, Bilder, JS prüfen) | S | Werte im Repo/Roadmap notiert; Ziel: nach Umbau nicht schlechter |

### A3 UX & Teilen
| # | Aufgabe | Aufwand | Fertig, wenn |
|---|---|---|---|
| A3.1 | **Kalender + Teilen live bringen** (siehe „Erledigt"): committen, `origin` + `production` pushen, live `.ics` in Google/Apple-Kalender testen | S | Konzert lässt sich aus der Live-Seite in Kalender übernehmen |
| A3.2 | **Pro-Konzert-Vorschaubild für Social Media** (Bild + Künstler + Datum + Ort, 1200×630). Heute wird schon das Event-Foto als OG-Bild genutzt; eine gestaltete Karte wirkt besser in WhatsApp/Facebook. Kann später aus Orbiter-Daten automatisch erzeugt werden (dann mit B/C zusammen) | M | Link-Vorschau in WhatsApp/Facebook-Debugger zeigt gestaltete Karte |
| A3.3 | Telefonnummer mit `tel:`-Link (04762 / 42020) neben der E-Mail bei „Tickets" (Detailseite, „Gut zu wissen", Kontakt) | S | Auf dem Handy führt Tippen auf die Nummer zum Anruf |
| A3.4 | Consent-Banner mobil prüfen: verdeckt auf kleinen Screens viel Inhalt (z. B. Kontakt-Seite). Kompakter machen oder unten fixieren mit weniger Höhe | S | Auf 390 px bleibt der Hauptinhalt lesbar, Auswahl trotzdem klar |
| A3.5 | „Zum Kalender" auch aus der Programm-Liste? — **nur wenn** Detailseite gut genutzt wird (Search Console/Nutzungsdaten abwarten) | – | Entscheidung nach 4 Wochen |

---

## Spur B — Orbiter-Umbau (Nov 2026 – Jan 2027)

### Zielarchitektur (Empfehlung)

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

### B1 Admin bereitstellen (Nov 2026; das Konzert am 20.11. läuft noch auf dem alten Stand)
| # | Aufgabe | Aufwand |
|---|---|---|
| B1.1 | `content.pod` anlegen (`npx @a83/orbiter-cli init` im Scratch-Ordner, Pod ins Projekt) | S |
| B1.2 | Collection `events` modellieren: `title` (string), `date` (datetime), `location` (string), `image` (media), `video` (url), `ticketLink` (url/email), `body` (richtext). Deckt das bestehende Zod-Schema 1:1 ab | S |
| B1.3 | Admin-Container (Node 22, **Debian-slim statt alpine**, weil `better-sqlite3` nativ ist), Volume für `content.pod`, Port 4322 nur auf `127.0.0.1` | M |
| B1.4 | Subdomain `admin.guitarena.at` in Plesk + Let's Encrypt, Proxy auf `127.0.0.1:4322` | S |
| B1.5 | **Default-Login `admin/admin` sofort ändern**, Redakteur-Account anlegen | S |
| B1.6 | Tägliches Backup von `content.pod` (Kopie + Aufbewahrung) und Restore einmal probeweise durchspielen | S–M |

### B2 Migration der Inhalte + Astro-Loader (Dez 2026)
| # | Aufgabe | Aufwand |
|---|---|---|
| B2.1 | **Import-Skript** (Node, `@a83/orbiter-core`): 20 Markdown-Dateien → `_entries`. **Slug = bisherige Event-ID**, damit alle URLs gleich bleiben | M |
| B2.2 | Bilder der 4 aktuellen + 16 Archiv-Events in die Media-Library (oder bewusst weiter in `public/`). Gästebuch bleibt **statisch** (11 MB gehören nicht in den Pod) | M |
| B2.3 | `src/content.config.ts`: `glob`-Loader → Loader über `orbiter:collections` (`getCollection('events')`), **Zod-Schema bleibt** (Fail-fast). `id = slug`. `orbiter({ pod })` in `astro.config.mjs`, `output` bleibt static | M |
| B2.4 | **Responsive Bilder:** fest verdrahtete Liste in `responsiveImages.ts` durch Astros Bildpipeline (`astro:assets`/sharp) ersetzen, sonst bekommen neue Events aus dem Admin keine Varianten | M |
| B2.5 | `.ics`-Endpoint (`programm/[...slug].ics.ts`) und Teilen-Button auf den neuen Loader prüfen (nutzen `event.data`/`event.body`) | S |
| B2.6 | **Verifikation vor Umschaltung:** `sitemap.xml` und alle `programm/*`-URLs alt/neu vergleichen (Diff leer); Programm, Archiv, Detail, Start, Kontakt visuell und mobil prüfen; Lighthouse gegen Baseline (A2.9) | M |

### B3 Publish-Kette (Dez 2026)
| # | Aufgabe | Aufwand |
|---|---|---|
| B3.1 | `build.webhook_url` im Orbiter-Admin → kleiner Endpoint auf dem Server, der `docker compose up -d --build` startet (Token-geschützt, nur intern erreichbar). Alternativ Orbiters GitHub- oder FTP-Deploy — **vorher testen, was auf Plesk am wenigsten Wartung braucht** | M |
| B3.2 | Ablauf testen: Event im Admin anlegen → Publish → Seite aktualisiert sich (Ziel < 2 min) | S |
| B3.3 | Nächtlicher Rebuild (A1.1) bleibt bestehen (Stichtag-Logik) | – |
| B3.4 | Optional: `publish_at`/`unpublish_at` nutzen, um Events zeitgesteuert einzublenden | S |

### B4 Go-live & Übergabe (Jan 2027)
| # | Aufgabe | Aufwand |
|---|---|---|
| B4.1 | Redakteur einschulen (1-Seiten-Anleitung: Event anlegen, Bild hochladen, Publish) | S |
| B4.2 | Erstes echtes 2027-Programm direkt im Admin eingeben (Test unter Realbedingungen) | S |
| B4.3 | Umschalten: `git push production main` mit neuem Loader; Alt-Markdown bleibt im Git-Verlauf | S |
| B4.4 | Nach 2–4 Wochen stabil: `src/content/events/*.md` + Import-Skript entfernen, `MASTER_CONCEPT.md` auf den tatsächlichen Stand bringen | S |

---

## Spur C — Nach dem Umbau, gemeinsam mit Orbiter (ab Feb 2027)

| # | Thema | Was / Warum | Entscheidung nötig |
|---|---|---|---|
| C1 | **Newsletter / „Neues Programm"-Erinnerung** | Anmeldeformular auf Start-/Programmseite, Double-Opt-in (DSGVO), Abmelde-Link, Versand nach Programmveröffentlichung. Datenschutzerklärung anpassen (Stand dort: 05.04.2026) | Speicherort & Versand: (a) Collection `subscribers` im Pod + Versand über Orbiters E-Mail-Modul (nodemailer), oder (b) externer Dienst. Die statische Seite braucht dafür einen Endpoint → im Admin-Server oder als Mini-Service. **Ob Orbiter dafür öffentliche Schreib-Endpunkte bietet, ist vorher zu prüfen** |
| C2 | **Strukturierte Felder am Event** | `doorsOpen`, `startTime`, `endTime`, `priceAdult`, `priceReduced`, `ticketContact`. Damit werden Kalender-Ende (heute fest +2 h), Preise in `Event`-JSON-LD (A2.3) und „Gut zu wissen" aus den Daten erzeugt statt fest im Code | Welche Felder wirklich pro Konzert variieren |
| C3 | **Künstler-Collection** | Ein Künstler kann mehrfach auftreten (z. B. Crossing Strings 2022 und 2026): eigene Seite je Künstler, Archiv verlinkt darauf, bessere Suchtreffer auf Künstlernamen | Lohnt sich ab ~30 Konzerten; früher nur, wenn Suchdaten es zeigen |
| C4 | **OG-Bilder automatisch** | Aus Event-Daten (Bild, Titel, Datum) beim Build erzeugen (A3.2 wird damit automatisiert) | – |
| C5 | **Programmvorschau-Workflow** | Entwurf-Status im Admin, Vorschau, geplante Veröffentlichung (`publish_at`) für Programmstart | – |
| C6 | **Mehrsprachigkeit (EN)** | Orbiter-i18n steht noch aus (Phase 3 Backlog dort). Erst sinnvoll, wenn internationale Besucher ein Ziel sind | Ja/Nein |
| C7 | **Gästebuch neu denken** | Aktuell statisch (Bilder seit 1998). Eigene Collection im Pod wäre möglich, ist aber kein Muss | Ja/Nein, eher später |

---

## Risiken & Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
|---|---|
| Orbiter ist 0.3.x, eigenes Projekt | Versionen im `package.json` **pinnen**; Upgrades nur bewusst, nach Testbuild |
| `content.pod` = Single Point of Failure | Tägliches Backup + Pod-Export vor jedem Update; Pod nie im Web-Root |
| Admin öffentlich erreichbar | HTTPS, starke Passwörter, Standard-Login ändern, optional IP-Beschränkung/Basic-Auth in Plesk-nginx |
| Native Abhängigkeit (`better-sqlite3`) im Docker-Build | Debian-slim-Image; Build lokal mit `docker build` testen, bevor es auf den Server geht |
| URL-Änderungen (SEO) | Slugs 1:1, Sitemap-Diff in B2.6, Redirects A2.1 |
| Jahreswechsel-Effekte (leere Seiten, „2026" im Titel) | A1.4/A1.5 vor Dezember erledigen |
| Bildqualität/Performance geht verloren | Responsive-Pipeline in B2.4, Lighthouse vorher/nachher |
| Personenbezogene Daten (Newsletter) im Pod | Nur mit DSGVO-Konzept (Double-Opt-in, Löschung, Datenschutztext), Pod-Backups entsprechend behandeln |

## Rollback
Tag `v3-static` (Markdown-Stand, A1.2) bleibt deploybar: `git push production v3-static:main --force` stellt die statische Seite wieder her, unabhängig vom Pod/Admin.

## Offene Entscheidungen (bitte klären)
1. **Wer pflegt Inhalte?** (Nur du, oder Hartwig Weiher/Porcia-Team? — bestimmt Rollen, Schulung, Admin-Absicherung.)
2. **Alte WordPress-URLs:** Liste oder Search-Console-Zugriff für A2.1?
3. **Rebuild-Trigger:** Webhook-Endpoint auf dem Server vs. GitHub-Deploy (B3.1).
4. **Bilder:** in den Pod (portabel, ein File) oder weiter im Repo/`public/` (B2.2)?
5. **Newsletter:** eigener Versand über Orbiter oder externer Dienst (C1)?
