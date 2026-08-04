# Levels – Framework & Übersicht

Dieser Ordner beschreibt die vier Levels **und** den gemeinsamen Baukasten, mit dem
Levels erstellt und iteriert werden. Levels sind der wichtigste Ort für die
Weiterentwicklung – die Aufgaben sind bewusst kompakt (MVP) und sollen vertieft werden.

Grundlagen: [../allgemein.md](../allgemein.md) · Ablauf: [../overview.md](../overview.md)

---

## Level-Übersicht

> **Hinweis zur Reihenfolge:** Seit **v0.5.0** sind Level 1 und 2 getauscht –
> Level 1 ist „Die Cyber-Tauben", Level 2 „Das Schattenarchiv".

| # | Titel | Untertitel (Story) | Akzent | Lernfokus | Spec |
|---|-------|--------------------|--------|-----------|------|
| 1 | Die Cyber-Tauben | Die lautlosen Boten | Violett | API-Abfrage, Token, JSON | [level-1-cyber-tauben.md](level-1-cyber-tauben.md) |
| 2 | Das Schattenarchiv | Das Datenbank-Archiv | Grün | Was ist Open Data? Daten korrigieren | [level-2-schatten-archiv.md](level-2-schatten-archiv.md) |
| 3 | Das Labyrinth der Lügen | Daten prüfen & hinterfragen | Gelb | Quelle, Lizenz, Metadaten, Plausibilität | [level-3-labyrinth-der-luegen.md](level-3-labyrinth-der-luegen.md) |
| 4 | Das Prisma der Stadt | Licht aus der Dunkelheit | Grün | Visualisieren, Storytelling, Release | [level-4-prisma-der-stadt.md](level-4-prisma-der-stadt.md) |

Level-übergreifendes Hilfesystem (ℹ Info / 💡 Tipp): [../info.md](../info.md)

## Gemeinsamer Aufbau eines Levels (im Spiel)

Jedes Level läuft im selben **Level-Host** (`section#screen-level`):

1. **Kopf:** `LEVEL n · Titel` + Untertitel, in der Akzentfarbe.
2. **Story-Absatz** (kurze Einführung).
3. **Aufgaben-Checkliste** (`tasks`), die sich beim Lösen abhakt.
4. **Datenqualitäts-Balken** (optional, falls `quality` gesetzt).
5. **Aufgaben-Bereich** (`mount()` baut hier die eigentliche Interaktion auf).
6. **Fußzeile:** „‹ Zurück zur Karte“, „ℹ INFO · 0 PKT“ und „💡 TIPP · −10“ (siehe [../info.md](../info.md)).
7. Bei Erfolg: **„SCHLÜSSEL GEFUNDEN!“**-Overlay → zurück zur Karte (oder zum Finale).

## Der Level-Vertrag (Contract)

Ein Level registriert sich als Objekt in `NX.levelDefs`. Alle Metadaten sind Text/Zahlen;
die einzige Logik steckt in `mount()`.

```js
// game/js/levels/levelX.js
NX.levelDefs.push({
  id: 1,                     // eindeutige Nummer (Reihenfolge = Freischalt-Reihenfolge)
  num: 'LEVEL 1',            // Anzeige im Kopf
  title: 'Die Cyber-Tauben',
  subtitle: 'Die lautlosen Boten',
  accent: 'purple',          // 'green' | 'purple' | 'yellow' | 'cyan'
  story: 'Kurzer Story-Absatz …',
  tasks: ['Aufgabe 1', 'Aufgabe 2', '…'],   // Checkliste
  quality: 80,               // Startwert Datenqualitäts-Balken in % (oder null = ausblenden)
  maxScore: 100,             // maximale Punkte des Levels
  tips: [                    // 💡 Tipps: konkrete Hinweise, kosten je −10 Punkte.
    'Hinweis 1 …',           // Der Level-Host zeigt sie der Reihe nach und zieht
    'Hinweis 2 …'            // die Punkte in completeLevel() ab (NICHT selbst abrechnen!).
  ],                         // null/weglassen = Host-Tipp-Button ausgeblendet.
  info: {                    // ℹ Fallback-Popup, falls für dieses Level kein
    title: 'INFO · …',       // avatar-spezifischer Inhalt in js/data/infos.js liegt.
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
| `ctx.info()` | Das Info-System dieses Levels öffnen (avatar-spezifisch, 0 Punkte). |
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
