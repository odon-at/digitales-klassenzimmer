# Levels – Framework & Übersicht

Dieser Ordner beschreibt die vier Levels **und** den gemeinsamen Baukasten, mit dem
Levels erstellt und iteriert werden. Levels sind der wichtigste Ort für die
Weiterentwicklung – die Aufgaben sind bewusst kompakt (MVP) und sollen vertieft werden.

Grundlagen: [../allgemein.md](../allgemein.md) · Ablauf: [../overview.md](../overview.md)

---

## Level-Übersicht

| # | Titel | Untertitel (Story) | Akzent | Lernfokus | Spec |
|---|-------|--------------------|--------|-----------|------|
| 1 | Das Schatten-Archiv | Das Datenbank-Archiv | Grün | Was ist Open Data? Daten korrigieren | [level-1-schatten-archiv.md](level-1-schatten-archiv.md) |
| 2 | Flug der Cyber-Tauben | Die lautlosen Boten | Violett | API-Abfrage, Token, JSON | [level-2-cyber-tauben.md](level-2-cyber-tauben.md) |
| 3 | Das Labyrinth der Lügen | Daten prüfen & hinterfragen | Gelb | Quelle, Lizenz, Metadaten, Plausibilität | [level-3-labyrinth-der-luegen.md](level-3-labyrinth-der-luegen.md) |
| 4 | Das Prisma der Stadt | Licht aus der Dunkelheit | Grün | Visualisieren, Storytelling, Release | [level-4-prisma-der-stadt.md](level-4-prisma-der-stadt.md) |

## Gemeinsamer Aufbau eines Levels (im Spiel)

Jedes Level läuft im selben **Level-Host** (`section#screen-level`):

1. **Kopf:** `LEVEL n · Titel` + Untertitel, in der Akzentfarbe.
2. **Story-Absatz** (kurze Einführung).
3. **Aufgaben-Checkliste** (`tasks`), die sich beim Lösen abhakt.
4. **Datenqualitäts-Balken** (optional, falls `quality` gesetzt).
5. **Aufgaben-Bereich** (`mount()` baut hier die eigentliche Interaktion auf).
6. **Fußzeile:** „‹ Zurück zur Karte“ und „ℹ Info“ (öffnet das Info-Popup des Levels).
7. Bei Erfolg: **„SCHLÜSSEL GEFUNDEN!“**-Overlay → zurück zur Karte (oder zum Finale).

## Der Level-Vertrag (Contract)

Ein Level registriert sich als Objekt in `NX.levelDefs`. Alle Metadaten sind Text/Zahlen;
die einzige Logik steckt in `mount()`.

```js
// game/js/levels/levelX.js
NX.levelDefs.push({
  id: 1,                     // eindeutige Nummer (Reihenfolge = Freischalt-Reihenfolge)
  num: 'LEVEL 1',            // Anzeige im Kopf
  title: 'Das Schatten-Archiv',
  subtitle: 'Das Datenbank-Archiv',
  accent: 'green',           // 'green' | 'purple' | 'yellow' | 'cyan'
  story: 'Kurzer Story-Absatz …',
  tasks: ['Aufgabe 1', 'Aufgabe 2', '…'],   // Checkliste
  quality: 80,               // Startwert Datenqualitäts-Balken in % (oder null = ausblenden)
  maxScore: 100,             // maximale Punkte des Levels
  info: {                    // Info-Popup (ℹ) – erklärt den Fachbegriff
    title: 'INFO · …',
    html: '<p>…</p>'
  },

  mount(container, ctx) {
    // Baue die Aufgabe in `container` (ein leeres DOM-Element) auf.
    // Nutze ctx.el(...) zum Erstellen von Elementen.
    // Wenn die Aufgabe gelöst ist:  ctx.complete(punkte)
  },

  unmount() { /* optional: Aufräumen, z. B. Chart zerstören */ }
});
```

### `ctx` – was der Level-Host bereitstellt

| Aufruf | Wirkung |
|---|---|
| `ctx.complete(score)` | Level abschließen: Schlüssel vergeben, Punkte gutschreiben, Overlay zeigen. |
| `ctx.markTask(i)` | Aufgabe *i* (0-basiert) in der Checkliste abhaken. |
| `ctx.setQuality(pct)` | Datenqualitäts-Balken auf `pct` % setzen (blendet ihn ein). |
| `ctx.info()` | Das Info-Popup dieses Levels öffnen. |
| `ctx.ui` / `ctx.el` | UI-Hilfen (Toast, Modal, JSON-Highlight …) bzw. Element-Builder. |
| `ctx.data` | Zugriff auf `NX.data` (Beispieldaten, siehe `game/js/data/datasets.js`). |
| `ctx.audio` | Sound-Effekte: `ctx.audio.play('click'|'success'|'key'|'error'|…)`. |
| `ctx.state` | Aktueller Spielstand (nur lesen). |

### Punkte-Konvention 🟡

`score` wird von `mount()` bestimmt, typischerweise:
`score = maxScore − (Fehlversuche × Abzug) − (Tipps × Abzug)` mit einer Untergrenze.
Konkrete Werte je Level stehen in der jeweiligen Spec.

## So fügt man ein Level hinzu / ändert es

1. Datei `game/js/levels/levelX.js` anlegen/bearbeiten (Muster oben).
2. In `game/index.html` als `<script>` einbinden (nach den anderen Levels, vor `registry.js`).
3. Fertig – Missionskarte, Freischaltung, HUD, Punkte und Zertifikat übernehmen den Rest.

Beispieldaten gehören nach `game/js/data/datasets.js` (nicht fest in die Level-Logik).

## Wiederkehrende Bausteine für Aufgaben (bereits vorhanden)

Datentabelle (klickbare Zellen), Formularzeilen (Dropdown/Eingabe), JSON-Ausgabe mit
Syntax-Highlighting, Auswahl-Karten (`choice-card`), einfache Animationen (z. B. Tauben-Flug),
Chart via **Chart.js**. Styles dafür stehen in `game/css/style.css` (Abschnitt
„generic mini-task widgets“).
