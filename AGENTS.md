# Guitarena Orbiter – Agent-Anweisungen

Separates Entwicklungsrepository. Die statische Production-Basis liegt in `../guitarena-v3`.
Kein Production-Remote einrichten oder auf die bestehende Website deployen, ohne ausdrücklichen Auftrag.

## Architektur
- Node 22 (`nvm use`), Astro 6, Tailwind 4, statische Ausgabe.
- Orbiter Core 0.3.22 / Admin 0.3.105 aus mitgeführten Original-Paketarchiven in `vendor/`.
- Source of Truth nach Erstimport: `cms/content.pod` (privat, nicht in Git).
- Schemas: `frontend/cms/schema.mjs`; Exportvalidierung: `frontend/cms/validation.mjs`.
- `npm run cms:import`: einmaliger Import; verweigert Überschreiben eines vorhandenen Pods.
- `npm run build` und `npm run dev` exportieren zuvor CMS-Inhalte und Medien.
- `npm run cms:admin`: lokale Verwaltung auf 127.0.0.1:4332; Vorschau auf Port 4331.
- Nach CMS-Änderungen neu bauen oder Dev-Server neu starten. Noch kein automatischer Publish-Hook.
- Kalender, Archiv, Programm und Hero verwenden beide Konzert-Collections gemeinsam. Kommend/vergangen weiterhin zur Build-Zeit.

## Regeln
- Historische Slugs einschließlich `archiv/` nicht ändern; sie bestimmen die öffentlichen URLs.
- `archive` enthält beim Import alle 19 vergangenen Konzerte. Neue Konzerte in `concerts`; sie erscheinen nach ihrem Datum automatisch im öffentlichen Archiv, auch ohne Collection-Wechsel.
- Markdown-Dateien und `migration/content.json` sind nur die reproduzierbare Importquelle. Nach Import nicht als redaktionelle Quelle bearbeiten.
- Niemals Pods, Zugangsdaten, `.env` oder SQLite-Nebendateien committen.
- Bestehendes Layout und deutsche Inhalte erhalten; kein neuer Runtime-Adapter nötig.
- Vor Abschluss `git diff --check`, Build und URL-/Inhaltsprüfung ausführen.
- `README.md` und `STAGE.md` beschreiben den tatsächlichen Stand. Alte Konzept-/Roadmap-Dateien stammen aus dem statischen Ausgangsrepo.
