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
                        + voice (Sprachsynthese) + clip (hinterlegte Aufnahmen)
                        + music (Hintergrund-Loop, eigener Knopf)
    ui.js               Hilfen: Toast, Modal, Balken, JSON-Hervorhebung, Konfetti
    screens.js          Router + alle Bildschirme + Level-Host
    app.js              Start / Verkabelung
    data/voice.js       benannte Aufnahmen (nur „intro") + Musik-Pfad & Credits
                        VORLESEN nutzt immer die Browser-Stimme
    data/datasets.js    Beispiel-Open-Data + Avatar-Definitionen
    levels/
      registry.js       Level-Liste + Freischalt-Logik
      level1.js …4.js    die 4 Level-Aufgaben
  media/                Bilder (Avatare, Hintergründe, Logos ODON + Mimikama),
                        Musik und die vertonte Einleitung
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
  accent: 'purple',         // green | purple | yellow | cyan | blue
  story: '…',
  tasks: ['…', '…'],        // Checkliste (Aufgaben)
  quality: 80,              // Startwert Datenqualitäts-Balken (oder null = aus)
  scoreUnits: 6,            // Zahl bewerteter Teilaufgaben (js/score.js)
  tips: ['…', '…'],         // 💡 Tipps (je −30 Punkte, Abzug im Level-Host)
  info: { title: 'INFO …', html: '…' },   // ℹ Fallback, falls kein Eintrag in js/data/infos.js

  mount(container, ctx) {
    // Aufgabe in `container` aufbauen.
    // Wenn gelöst: ctx.complete(punkte)  ← schließt das Level ab
  },
  unmount() { /* optional: aufräumen */ }
});
```

`ctx` stellt bereit:

- `ctx.complete({units, firstTry, wrong})` – Level abschließen; Punkte inkl.
  Zeit-Bonus und Tipp-Abzug rechnet der Host (`js/score.js`)
- `ctx.markTask(i)` – Aufgabe *i* in der Checkliste abhaken
- `ctx.setQuality(pct)` – Datenqualitäts-Balken setzen
- `ctx.info()` – Info-System dieses Levels öffnen (avatar-spezifisch, 0 Punkte)
- `ctx.ui`, `ctx.el`, `ctx.data`, `ctx.audio`, `ctx.state` – Hilfen & Daten

Die Missionskarte, Freischaltung, HUD, Punkte und das Zertifikat lesen alles
aus dieser Registrierung – zum Anpassen eines Levels genügt es, die jeweilige
`mount()`-Funktion zu bearbeiten. Beispiel-Daten liegen in `js/data/datasets.js`,
die Info-Inhalte (ℹ) in `js/data/infos.js`.

## Status (MVP)

Spielbar von Start bis Zertifikat mit je einer kleinen, echten Aufgabe pro Level:

1. **Die Cyber-Tauben** – Intro-Sequenz (Taube + Pergamentrolle), API-Anfrage bauen
   (URL + Methode + Token) → Flug über die Stadtkarte → Fehler-Matrix 404/401/405 →
   Rohdaten-Strom scannen → JSON + Dashboard
2. **Das Schattenarchiv** – Open-Data-Portal öffnen, 5 gehackte Werte am echten Datensatz
   abgleichen, dazu ein unplausibler Wert ohne Vergleichsquelle → als **NULL** markieren
   statt zu raten; danach Real-Life-Break
3. **Das Labyrinth der Lügen** – dreistufiges Urteil (**belegt / unklar / widerlegt**) über
   6 Meldungen mit 4-teiligem Fakten-Check; der Avatar läuft durch das Labyrinth
   (Mini-Map + Korridor) bis zum Golden Record
4. **Die Daten-Metropole** – Bürger-Dashboard: für drei Datensätze den passenden
   Diagrammtyp **wählen** (bewertet) und den Daten-Chip per **Drag & Drop** ins
   freigeschaltete Feld ziehen (Chart.js, mit CSS-Fallback offline); danach die
   **360°-Stadt** – 10 Szenarien je [🟢 FREIGEBEN] / [🔴 SPERREN] bewerten
   (Open Data vs. DSGVO) → **Open-Data-Hero-Award**

Übergreifend: **ℹ Info** (kostenlos, avatar-spezifisch: Mindmap / Funk-Kanal mit
Sprachausgabe / Terminal, mit Bonusfrage) und **💡 Tipp** (−10 Punkte).
Am Ende: **Zeremonie** (`#screen-finale`, überspringbar) → **Zertifikat** mit Pokal,
Badge und Level-Übersicht.

Die Aufgaben sind bewusst kompakt gehalten und können nach obigem Muster
vertieft werden.
