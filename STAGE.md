# Guitarena – Stage / Session-Protokoll

Dieses Dokument hält den technischen Projektstand, wichtige Entscheidungen und erledigte Agent-Sessions fest.

## Aktueller Stand

- Branch: `main`
- Letzter GitHub-Commit: `28dcf15` — `feat(content): refine landing copy and Michael Fix event`
- Build: erfolgreich, 29 statische Seiten
- Lokaler Dev-Server: zuletzt auf `http://localhost:4322/`
- Nächstes Konzert: Michael Fix, 16.10.2026, 19:30 Uhr
- Orbiter: noch nicht integriert; Umbau laut Roadmap für Ende 2026/Anfang 2027 vorgesehen

## Session 2026-10-12

### Erledigt

- Michael-Fix-Veranstaltungstext erweitert und redaktionell strukturiert.
- Landingpage-Intro poetischer formuliert und visuell verfeinert:
  - kleinere Typografie
  - dezenter Amber-Glow
  - Einblendeanimation
  - Unterstützung für `prefers-reduced-motion`
- About-Text auf einen präziseren, kulturjournalistischen Ton umgestellt.
- SEO-Prüfung der gebauten Seiten durchgeführt.
- Drei historische Archivtexte von zusätzlichem `<h1>` auf `<h2>` korrigiert.
- Alle 29 gebauten HTML-Seiten auf genau ein `<h1>` geprüft.
- GitHub aktualisiert.
- Anleitung für SSH-Key und Plesk-Zugang in notectl unter `Projects/Guitarena` abgelegt.

### Prüfungen

- `git diff --check`: erfolgreich
- `npm run build`: erfolgreich
- Sitemap vorhanden und mit `robots.txt` verknüpft
- Canonical-, Meta-Description- und Structured-Data-Ausgabe geprüft

### Offen

- Production-Push auf Plesk war zuletzt wegen fehlender SSH-Authentifizierung nicht möglich.
- SSH-Key für den Benutzer `wolf359` in Plesk hinterlegen.
- Danach `git push production main` testen.
- Plesk-Cron für nächtliche Rebuilds ist laut Roadmap noch offen.
- Orbiter-Umbau bleibt ein späterer Arbeitsschritt; Markdown ist aktuell die Source of Truth.

## Änderungsprotokoll

| Datum | Änderung | Status |
|---|---|---|
| 2026-10-12 | Michael-Fix-Text, Landingpage-Texte und Intro-Design aktualisiert | erledigt |
| 2026-10-12 | H1-Struktur alter Archivseiten bereinigt | erledigt |
| 2026-10-12 | GitHub auf Commit `28dcf15` gepusht | erledigt |
| 2026-10-12 | Plesk-Deploy wegen SSH-Zugriff offen | offen |

## Richtlinie für neue Einträge

Nach jeder relevanten Session kurz ergänzen:

1. Datum und Ziel
2. Erledigte Änderungen
3. Ausgeführte Prüfungen
4. Offene Punkte oder Risiken
5. Commit und Deploy-Status
