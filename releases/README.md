# releases/ – eingefrorene Versionen

Jeder Unterordner `vX.Y.Z/` ist ein **vollständiger, spielbarer Snapshot** einer Version:
eine Kopie von `story/` (Spec) und `game/` (Spiel) zum Zeitpunkt des Releases.

## Eine Version spielen

`vX.Y.Z/game/index.html` im Browser öffnen (Doppelklick).
Die angezeigte Version steht auf der Startseite unten und auf dem Zertifikat.

## Zwei Versionen vergleichen

```bash
diff -r v0.1.0/story v0.2.0/story   # Spec-Änderungen
diff -r v0.1.0/game  v0.2.0/game    # Game-Änderungen
```

## Neue Version anlegen

Siehe [../VERSIONING.md](../VERSIONING.md) (Build-Loop, Schritt 4).

## Vorhandene Versionen

| Version | Datum | Kurzbeschreibung |
|---------|-------|------------------|
| v0.5.0  | 2026-08-03 | Level 1↔2 getauscht: Cyber-Tauben (Terminal/Flug/JSON) als L1, Schattenarchiv + Pause als L2 |
| v0.6.0  | 2026-08-04 | Level 3 neu (belegt/unklar/widerlegt + Labyrinth-Navigation), Info-/Tipp-System mit Bonusfragen, Level-1-Intro-Sequenz |
| v0.7.0  | 2026-08-04 | Level 4 neu (Diagrammwahl + Drag & Drop, 360°-Stadt mit Open Data vs. DSGVO), Großes Finale mit Zeremonie, Pokal und Badge |
| v0.12.0 | 2026-08-07 | VORLESEN immer per Browser-Stimme (MP3-Vorrang entfernt), Einleitung wird vertont vorgelesen, oranger pulsierender Info-Knopf, Avatar-Karte ohne „AUSWÄHLEN"-Knopf (mit Tastaturweg), Level 1 Schritt 3 aufgeräumt, Cyber-Stadt nur noch mit der Maus, Musik als AAC (214 KB statt 2,2 MB) |
| v0.11.0 | 2026-08-06 | pH-Frage in Level 2 groß und mit gleichwertigen Optionen (die richtige leuchtete vorher), Phantom-Tastenkürzel in Level 4 entfernt und „Taste 1/2/3" wirklich gebaut, Hintergrundmusik mit eigenem Knopf und CC-BY-Credits |
| v0.10.0 | 2026-08-06 | Ein Vorlese-Knopf für alle (Zuordnungstabelle Text→MP3, nichts startet automatisch), Avatar-Lerntypen mit ⓘ-Erklärung, Band „AUSGEWÄHLT" repariert, Level-1-Begriffe + Hilfe-Knöpfe + Glossar, Level-2-Ansage |
| v0.9.0  | 2026-08-05 | Stimme der Bürger-KI (MP3 + Vorlesen per Sprachsynthese), nummerierte Aufgabenübersicht mit Hilfe daneben, Info-Knoten der Reihe nach, Finale-Button repariert (Stacking-Context) und hervorgehoben |
| v0.8.0  | 2026-08-05 | Neues Punktesystem für alle Level (+100/+50/−30 + Zeit-Bonus), Klassen-Leaderboard mit Export/Import, Level 1 ohne Start-Intro, Tag-Modus in der 360°-Stadt, sichtbare Startseite |
| v0.4.0  | 2026-08-03 | Level 1 neu: Open-Data-Portal (Datenbehörde Nexus) statt geratener Werte (Feedback-Umsetzung) |
| v0.3.0  | 2026-07-31 | Level 1 (Neon-Brunnen + Temperatur-Fehler), Level 2 (Cyber-Tauben-Intro), UI-Politur (Startseite/Avatar/Karte) |
| v0.2.0  | 2026-07-30 | Level 3 neu: Swipe-Karten über zoomendem Labyrinth (6 Meldungen) |
| v0.1.0  | 2026-07-29 | MVP-Baseline (Spiel Start→Zertifikat, Level 3 = Karten-Auswahl) |
