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

---

## ✅ Umsetzung v0.12.0 (Datei geliefert)

Die Musik ist da und spielt. Zwei Anmerkungen zur gelieferten Datei:

* **Es ist keine MP3.** `game/media/musik-loop.mp3` ist eine unkomprimierte
  **WAV-Datei** (RIFF/PCM, 44,1 kHz, Stereo, 16 Bit) mit falscher Endung. Browser
  erkennen das am Inhalt und spielen sie ab – sie ist aber **2,2 MB** groß.
* **Sie ist 13,3 Sekunden lang**, nicht 11 (Abschnitt 1 oben).

Ausgeliefert wird deshalb die daraus erzeugte AAC-Fassung **`media/musik-loop.m4a`**
(214 KB, gleiche Länge und Abtastrate, Stereo erhalten) – rund ein Zehntel der Größe,
was in einer Schulklasse mit vielen Geräten am selben WLAN spürbar ist. Der Pfad steht
in `game/js/data/voice.js` (`NX.musicTrack`). **Die Originaldatei bleibt unangetastet
im Repo**; wer lieber sie ausliefern möchte, ändert dort eine Zeile.

Alles andere läuft wie in Abschnitt 2 beschrieben: `<audio loop>`, Lautstärke 0,22,
Absenken auf 0,07 während der Sprachausgabe, Start erst nach der ersten Nutzeraktion,
eigener 🎵-Knopf oben, `🔊` als Hauptschalter darüber.

> **Nicht automatisiert prüfbar:** wie die Umwandlung klingt. Dauer, Abtastrate und
> Kanalzahl stimmen nachweislich überein, und die Datei spielt fehlerfrei ab – ob sie
> gut klingt, muss einmal jemand hören.
