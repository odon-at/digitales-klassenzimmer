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

## [0.3.0] – 2026-07-31 – Story-Feinschliff: Level 1, Level 2 & UI-Politur

Snapshot: [`releases/v0.3.0/`](releases/v0.3.0/).

### Spec (`story/`)
- **Level 1** neu konzipiert: 5 individuelle Neon-Brunnen je Bezirk, Messen per Klick,
  **Temperatur**-Fehler (2000 °C / -300 °C) statt pH, Vergleichen-und-Korrigieren-Ablauf.
- **Level 2** um eine Intro-Sequenz erweitert: Cyber-Taube bringt eine Pergamentrolle
  mit dem API-Token (Assets `cybertaube.png`, `pergamentrolle.png`).
- **Startseite**: Bugfix „doppelter Titel", neue Reihenfolge (Titel → Icon → Credits →
  Story → Button), Credit „Ein Spiel von Sarah und Chiara", Neon-Flackern für den Verbindungsstatus.
- **Avatar**: „BEN" → **„LENNOX"** (Datenschutz-Experte); „AUSGEWÄHLT"-Banner korrigiert.
- **Missionskarte**: Avatar links neben der Karte, kompaktere Kacheln, größere farbige
  Unterüberschriften, Status „bereit" → **„Start"**.
- **Einleitung**: Zitat-Wortlaut „Hole die Fragmente zurück."

### Game (`game/`)
- **Level 1** neu gebaut: 5 klickbare Neon-Brunnen (Mess-Animation → wahrer Wert),
  Datentabelle mit zwei unmöglichen Temperaturen; erst messen, dann vergleichen und in der
  Tabelle korrigieren; Datenqualität 80 % → 100 %. Daten in `datasets.js` → `level1`.
- **Level 2**: Intro-Animation – große Cyber-Taube fliegt herein, Klick → Rolle öffnet sich,
  der Token wandert animiert ins Token-Feld; danach normale API-Anfrage. Assets in `media/`.
- **Startseite**: Hintergrund so behandelt, dass der eingebrannte Mockup-Titel nicht mehr
  durchscheint (nur noch ein sauberer HTML-Titel); Reihenfolge/Texte/Flacker-Status angepasst.
- **Avatar**: Datensatz `ben` → `lennox` (Bild `avatar-lennox.png`); breiteres Auswahl-Banner.
- **Missionskarte**: neues Layout `map-body` mit Avatar-Panel links; Kachel-Styles kompakter,
  farbige Unterüberschriften, „Start"-Badge; `renderMapAvatar()` in `screens.js`.

### Hinweise / Annahmen
- Die in der Level-1-Spec beschriebenen individuellen Brunnen-Illustrationen sind als
  **thematische Neon-Karten mit Emoji** umgesetzt (keine Einzel-Grafiken vorhanden).
- Wegen der Umbenennung `ben` → `lennox` fällt ein alter Spielstand mit `avatarId: "ben"`
  auf den ersten Avatar zurück (kein Migrationspfad im MVP).

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
