# Guitarena mit Orbiter

Separater lokaler Klon der statischen Guitarena-Website, Ausgangscommit `77ac4d8`.
Orbiter verwaltet die Inhalte; Astro erzeugt weiterhin statische Seiten mit den bisherigen URLs.

## Start

```sh
nvm use
npm ci --prefix frontend
npm run cms:import # nur bei frischem Klon ohne cms/content.pod
npm run dev        # http://localhost:4331
# zweites Terminal, ebenfalls Node 22:
npm run cms:admin  # http://localhost:4332
```

Login: Benutzer `admin`; zufällig erzeugtes Passwort in `cms/admin-login.txt` (nur lokal, Dateimodus 600).
Nach dem Bearbeiten und Veröffentlichen im Admin `npm run build` ausführen bzw. den Dev-Server neu starten.
Automatisches Publizieren auf einen Server ist noch nicht eingerichtet.

## Inhalte

| Bereich | Importierter Bestand |
|---|---:|
| Konzerte | 1 |
| Konzertarchiv | 19 |
| Gästebuch | 215 |
| Bisherige Künstler | 68 |
| Unterstützer | 6 |
| Seiten/SEO | 9 |
| Website-Texte, nach Quelldatei zugeordnet | 292 |
| Medien | 270 |

Die Textbausteine erhalten das vorhandene Layout. Komponenten und interaktive Funktionen bleiben im Code;
redaktionelle Texte, Konzertbeschreibungen, Seitenmetadaten, Künstler, Gästebuch und Partner kommen aus dem Pod.
Schema: `frontend/cms/schema.mjs`. Ursprungsdaten: `migration/content.json` und Event-Markdown.
Importbericht mit Quellprüfsummen und Bildersatz: `cms/import-report.json`.

`archive` und `concerts` liefern gemeinsam die Astro-Collection `events`; Slugs bleiben unverändert.
Der Import bewahrt Markdown einschließlich HTML und historische, teilweise unvollständige Gästebuchdaten.
Ein fehlendes Crossing-Strings-Archivbild wurde durch das vorhandene Duo-Bild ersetzt; `legacyImage` bewahrt den alten Namen.

## Betrieb

- `cms/content.pod` enthält Inhalte, Medien und Benutzer. Separat sichern; niemals committen.
- `npm run cms:export` validiert die veröffentlichten Daten, exportiert Medien und erzeugt den statischen Snapshot.
- Veröffentlichten Pflicht-Text oder benötigte Seiten nicht löschen: Der Build bricht bei fehlenden Einträgen ab.
- Neue Medien werden exportiert; bisherige responsive Varianten bleiben erhalten. Neue Uploads verwenden zunächst das Originalbild.
- `vendor/` enthält lokale Orbiter-Pakete, weil Admin und Core als geprüfte Archive mitgeführt werden.
- `fast-xml-parser` ist ausdrücklich installiert, da es in dieser Admin-Paketfassung als Laufzeitabhängigkeit fehlt.
- `docker compose up --build` baut eine lokale statische Vorschau auf Port 8081. Docker-Build noch nicht getestet.
- Kein Production-Remote, kein neues GitHub-Remote, keine Veröffentlichung. `upstream-static` verweist nur zum lokalen Ausgangsrepo.
- npm meldet bekannte Abhängigkeitslücken, darunter kritische; Admin deshalb nur lokal vorbereitet. Vor öffentlichem Betrieb Abhängigkeiten prüfen/aktualisieren.
