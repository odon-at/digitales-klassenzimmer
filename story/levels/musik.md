# Spezifikation: Hintergrundmusik & Audio

## 1. Allgemeine Anforderungen
**Wiedergabe:** Die Musik soll während des gesamten Spielverlaufs kontinuierlich im Hintergrund laufen.
**Loop (Schleife):** Die Audio-Datei wird als Endlosschleife (loop) abgespielt, sodass nach Ende des 11-Sekunden-Clips ein nahtloser Übergang ohne spürbare Unterbrechung erfolgt.
**Lautstärke:** Die Hintergrundmusik wird leise und dezent eingestellt (Standardwert: **22% / 0.22**), damit Dialoge, Sprachausgaben und Soundeffekte gut verständlich bleiben.

## 2. Technische Umsetzung
**Audio-Element:** <audio loop>
**Standard-Lautstärke:** 0.22 (22%)
**Dateipfad:** game/media/musik-loop.mp3
**Verhalten bei Sprachausgabe:** Die Lautstärke wird während aktiver Sprachausgaben automatisch abgesenkt und danach wieder angehoben (Dipping).
**Steuerung:** Das Audio startet erst nach der ersten Benutzerinteraktion. Ein Mute-Button ermöglicht das Stummschalten.

## 3. Verwendete Audio-Datei
**Dateiname im Repo:** musik-loop.mp3
**Speicherort:** game/media/
