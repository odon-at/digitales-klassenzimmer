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
| v0.2.0  | 2026-07-30 | Level 3 neu: Swipe-Karten über zoomendem Labyrinth (6 Meldungen) |
| v0.1.0  | 2026-07-29 | MVP-Baseline (Spiel Start→Zertifikat, Level 3 = Karten-Auswahl) |
