# Guitarena – Agent-Anweisungen

## Projektziel

Guitarena ist eine schnelle, statische Astro-Website für die Konzertreihe im Ortenburgerkeller von Schloss Porcia in Spittal an der Drau.

## Aktuelle Architektur

- Frontend: Astro 6, Tailwind CSS v4, TypeScript
- Ausgabe: statisch (`output: static`), kein Runtime-CMS
- Inhalte: Markdown-Dateien unter `frontend/src/content/events/`
- Schema: `frontend/src/content.config.ts` mit Zod
- Bilder: `frontend/public/images/`
- Build: `npm run build` im Projektroot
- Entwicklung: `npm run dev` im Projektroot; falls Port 4321 belegt ist, verwendet Astro den nächsten freien Port
- Deployment: `git push production main` löst laut Server-Setup den Docker-/Nginx-Deploy aus

Orbiter ist geplant, aber aktuell nicht integriert. Der geplante Umbau liegt in `ROADMAP_ORBITER_2027.md`.

## Arbeitsregeln

1. Vor Änderungen zuerst betroffene Dateien, Caller, Content-Dateien und Build-/Deploy-Konfiguration prüfen.
2. Bestehende Komponenten, Utilities und Tailwind-Konventionen wiederverwenden.
3. Keine neue Abhängigkeit oder Abstraktion für kleine Änderungen einführen.
4. Inhalte und UI-Texte auf Deutsch bearbeiten, sofern nicht anders gewünscht.
5. Content-Änderungen in der passenden Markdown-Datei vornehmen, nicht in generierten Dateien unter `frontend/dist/`.
6. Keine Passwörter, privaten Schlüssel oder `.env`-Werte in das Repository schreiben.
7. Bei visuellen Änderungen `git diff --check` und `npm run build` ausführen.
8. Vor einem Push `git status`, den Ziel-Remote und den aktuellen Commit prüfen.
9. Bei SEO-relevanten Änderungen mindestens Titel, Description, Canonical, Sitemap, Structured Data und H1-Struktur prüfen.
10. Bewegungen dezent halten und `prefers-reduced-motion` berücksichtigen.

## Deployment

- `origin`: GitHub-Repository
- `production`: Plesk-/Server-Remote
- Zielbranch: `main`
- Production-Push nur nach erfolgreichem Build und sauberem Diff.
- Wenn SSH-Zugriff fehlschlägt, keine Zugangsdaten im Projekt speichern; SSH-Key und macOS-Schlüsselbund verwenden.

## Wichtige aktuelle Entscheidungen

- Die Website bleibt bis zum geplanten Orbiter-Umbau statisch.
- Die Einteilung „kommend/vergangen“ wird beim Build berechnet.
- Michael Fix am 16.10.2026 ist das nächste Konzert.
- Historische Eventseiten behalten ihre bestehenden URLs.
