# NEXUS DATA — Open Data Classroom (Spiel, MVP)

Ein Lernspiel rund um **Open Data** im Cyberpunk-Look. Nach der Geschichte
„Der große Nebel“ sammelt die Klasse in 4 Levels die Daten-Fragmente zurück
und erhält am Ende ein **Aura-Master-Zertifikat**.

Ablauf: **Start → Login (Klassen-Code) → Avatar → Einleitung → Missionskarte →
Level 1–4 → Belohnung / Zertifikat**.

## Starten

Das Spiel ist eine reine Web-Anwendung (HTML/CSS/JS, Bibliotheken via CDN).

- **Einfach:** `index.html` im Browser öffnen (Doppelklick). Für Level 4 (Diagramme)
  und die Konfetti-Animation wird eine Internetverbindung benötigt (CDN).
- **Empfohlen (lokaler Server):**
  ```bash
  cd game
  python3 -m http.server 8000
  # dann http://localhost:8000 öffnen
  ```

Weitergabe: einfach den gesamten Ordner `game/` weitergeben.

## Projektstruktur

```
game/
  index.html            Bildschirme (Sektionen) + CDN-Einbindungen
  css/style.css         gesamtes Design (inkl. Druck-Layout fürs Zertifikat)
  js/
    state.js            Spielstand + localStorage
    audio.js            Sound-Effekte (Web Audio) + Stummschaltung
    ui.js               Hilfen: Toast, Modal, Balken, JSON-Hervorhebung, Konfetti
    screens.js          Router + alle Bildschirme + Level-Host
    app.js              Start / Verkabelung
    data/datasets.js    Beispiel-Open-Data + Avatar-Definitionen
    levels/
      registry.js       Level-Liste + Freischalt-Logik
      level1.js …4.js    die 4 Level-Aufgaben
  media/                Bilder (Avatare, Hintergründe)
```

## Ein Level erweitern oder ändern (Erweiterungspunkt)

Die Level-Logik ist **einsteckbar**. Ein Level ist ein Objekt, das sich in
`NX.levelDefs` einträgt (siehe `js/levels/level1.js`):

```js
NX.levelDefs.push({
  id: 1,
  num: 'LEVEL 1',
  title: 'Das Schatten-Archiv',
  subtitle: 'Das Datenbank-Archiv',
  accent: 'green',          // green | purple | yellow | cyan
  story: '…',
  tasks: ['…', '…'],        // Checkliste (Aufgaben)
  quality: 80,              // Startwert Datenqualitäts-Balken (oder null = aus)
  maxScore: 100,
  info: { title: 'INFO …', html: '…' },   // Info-Popup (ℹ-Button)

  mount(container, ctx) {
    // Aufgabe in `container` aufbauen.
    // Wenn gelöst: ctx.complete(punkte)  ← schließt das Level ab
  },
  unmount() { /* optional: aufräumen */ }
});
```

`ctx` stellt bereit:

- `ctx.complete(score)` – Level abschließen (Schlüssel + Punkte)
- `ctx.markTask(i)` – Aufgabe *i* in der Checkliste abhaken
- `ctx.setQuality(pct)` – Datenqualitäts-Balken setzen
- `ctx.info()` – Info-Popup dieses Levels öffnen
- `ctx.ui`, `ctx.el`, `ctx.data`, `ctx.audio`, `ctx.state` – Hilfen & Daten

Die Missionskarte, Freischaltung, HUD, Punkte und das Zertifikat lesen alles
aus dieser Registrierung – zum Anpassen eines Levels genügt es, die jeweilige
`mount()`-Funktion zu bearbeiten. Beispiel-Daten liegen in `js/data/datasets.js`.

## Status (MVP)

Spielbar von Start bis Zertifikat mit je einer kleinen, echten Aufgabe pro Level:

1. **Schatten-Archiv** – falschen Wert im Datensatz finden & korrigieren
2. **Cyber-Tauben** – API-Anfrage bauen (Endpunkt + Token) → JSON empfangen (simuliert)
3. **Labyrinth der Lügen** – vertrauenswürdigen Datensatz erkennen (Quelle/Lizenz/Plausibilität)
4. **Prisma der Stadt** – Daten visualisieren (Chart.js) + Daten-Story → veröffentlichen

Die Aufgaben sind bewusst kompakt gehalten und können nach obigem Muster
vertieft werden.
