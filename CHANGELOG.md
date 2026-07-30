# Changelog – NEXUS DATA

Alle nennenswerten Änderungen an **Spec (`story/`)** und **Spiel (`game/`)** je Version.
Eine Version = ein zusammengehöriger Stand aus Spec **und** Game. Ablauf & Regeln:
siehe [VERSIONING.md](VERSIONING.md).

Format angelehnt an *Keep a Changelog*; Versionsschema **MAJOR.MINOR.PATCH**
(MINOR = Build-Loop / neues Feature, PATCH = kleine Korrektur).

---

## [Unreleased]

_Noch keine Änderungen._

---

## [0.2.0] – 2026-07-30 – Level 3: Swipe-Karten & Labyrinth-Zoom

Snapshot: [`releases/v0.2.0/`](releases/v0.2.0/).

### Spec (`story/`)
- **Level 3** grundlegend überarbeitet: neues **Swipe-Karten-System** (Social-Media-Karten,
  nach links = „richtig", nach rechts = „falsch"), Labyrinth-Zoom-Mechanik und ein
  Fragen-Katalog mit 6 Beispiel-Aussagen (Quelle/Lizenz/Metadaten/Plausibilität).
  Siehe `story/levels/level-3-labyrinth-der-luegen.md`. _(bereits in v0.1.0 → v0.2.0 gepflegt)_

### Game (`game/`)
- **Level 3 neu gebaut** gemäß Spec: zoomendes Labyrinth (`media/labyrinth.jpeg`) mit
  Swipe-Karten davor. Bedienung per **Drag (Maus/Touch)**, zusätzlich **Buttons** und
  **Pfeiltasten ←/→** (Barrierefreiheit). Richtig → Karte fliegt raus + Zoom tiefer +
  Erklärungs-Toast; falsch → Shake + Fehlerton, erneuter Versuch. Punkte: 100 − 10 je
  Fehlversuch (min. 40).
- Daten: `game/js/data/datasets.js` → `level3.questions` (6 Meldungen, Emoji-Avatare,
  `taskIndex`-Zuordnung zur Checkliste).
- Neue Stile in `game/css/style.css` (Abschnitt „Level 3 – Swipe-Karten …").

### Hinweise / Annahmen
- **Emoji-Avatare** ersetzen die in der Spec genannten `profile_image`-PNGs (nicht als Assets vorhanden).
- Verifizierungs-Badge aus `is_verified` (Hinweis, nicht allein entscheidend).

---

## [0.1.0] – 2026-07-29 – MVP-Baseline

Erster zusammenhängender Stand: spielbar von Start bis Zertifikat, mit ausgerichteter
Spec. Snapshot: [`releases/v0.1.0/`](releases/v0.1.0/).

### Spec (`story/`)
- Vollständige Design-Doku aufgebaut: `allgemein.md` (Spielbibel), `overview.md`
  (Ablauf/Architektur/Zustandsmodell), Bildschirm-Specs (`startseite`, `login`, `avatar`,
  `einleitung`, `missionskarte`, `belohnung`) und `levels/` (Framework + 4 Level-Specs).
- Legende ✅ Vorgabe / 🟡 Annahme / 💡 Iterationsidee eingeführt.
- Ist-Zustand-Screenshots je Bildschirm unter `story/images/screens/`.
- Level 3 als **Karten-Auswahl** spezifiziert (Quelle/Lizenz/Plausibilität prüfen).

### Game (`game/`)
- MVP als einzelne Web-App (HTML/CSS/Vanilla-JS, Bibliotheken via CDN):
  Startseite, Login (Klassen-Code), Avatar-Auswahl (Lyra/Ben/Zen), Einleitung,
  Missionskarte, 4 Levels mit je einer kleinen Aufgabe, Belohnung/Zertifikat.
- Punkte-/Schlüssel-/Rang-Modell, Halle der Chronisten, druckbares Zertifikat,
  Info-Popups, Fortschritts- & Datenqualitäts-Balken, Ton-Effekte, Konfetti.
- Einsteckbares Level-Framework (`game/js/levels/registry.js` + `levelN.js`).

---

<!--
Vorlage für einen neuen Eintrag (nach oben kopieren, über die vorige Version):

## [X.Y.Z] – JJJJ-MM-TT – Kurztitel

### Spec (`story/`)
- …

### Game (`game/`)
- …

### Hinweise
- …
-->
