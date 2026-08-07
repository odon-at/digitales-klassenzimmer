# Änderung der Audio-Ausgabe

## 1. Lennox - Info-Bereich (Spezifische MP3-Stimme)
Wenn der Charakter Lennox ausgewählt ist, wird für seine Info-Ausgabe direkt die von dir hochgeladene MP3-Datei abgespielt, nicht eine KI-Stimme.

**Charakter:** Lennox
**Ausgabe-Modus (Info):** Die Info wird über die hochgeladene MP3-Datei wiedergegeben (keine KI-Sprachgenerierung).
  * audio_source_lennox_info = "luvvoice.com-20260805-MomwB7.mp3" 

---

## 2. Tipps-Bereich für alle Personen (MP3-Vorlesefunktion)
Bei allen Personen im Spiel gibt es eine Option zum Vorlesen für die jeweiligen Tipps. Die Inhalte sollten nur vorgelesen werden, wenn auf den Button vorlesen gedrückt wird. Zudem soll es bei allen Personen nur einen Button für das Vorlesen geben und zwar soll nur die Tipps bzw. Infos vorgelesen werden, aber nicht die Story.

**Audio-Quelle für Tipps:** Wenn das Vorlesen aktiviert ist, wird der Tipp bei **allen Personen** zwingend über die jeweils hinterlegte MP3-Datei vorgelesen, statt eine Live-KI-Stimme zu nutzen.
  * audio_source_tips_all_characters = "luvvoice.com-20260805-MomwB7.mp3"

---

## ⚠ Überholt seit v0.12.0

Die Regel hat sich umgekehrt. Gültig ist jetzt `allgemein.md` →
„Nutzung der Browser-Stimme für die Vorlesefunktion":

---

## ✅ Umsetzung v0.12.0

**VORLESEN nutzt ausnahmslos die native Browser-Stimme** (Web Speech API) – für
**alle** Avatare, in Tipps, Hilfe-Fenstern und im Info-Fenster. Es wird dort keine
MP3 mehr abgespielt. Die Vorrangschaltung „Aufnahme schlägt Sprachsynthese" aus
v0.10.0 ist samt der Zuordnungstabelle für Vorlese-Texte **entfernt**; `clipKey`
existiert im Code nicht mehr.

*Praktisch änderte das nichts am Erlebnis:* Die Tabelle war seit v0.10.0 leer, es hat
also ohnehin immer die Browser-Stimme gesprochen. Entfernt wurde toter Code und eine
irreführende Beschreibung.

**Eine feste Aufnahme gibt es weiterhin – aber nur an einer Stelle:** Die gelieferte
Datei vertont laut `einleitung.md` den **Einleitungstext**. Damit ist der seit v0.10.0
offene Punkt („Was sagt die Aufnahme?") beantwortet. Sie liegt als
`game/media/einleitung.mp3` und ist in `game/js/data/voice.js` als `intro` eingetragen.
Der frühere, nach der Klärung falsche Name `buerger-ki-stimme.mp3` ist entfallen.

**Ein Knopf, kein Selbststart** gilt unverändert für Tipps und Infos. Die Einleitung
ist die begründete Ausnahme: Sie startet mit dem Bildschirm und lässt sich über einen
sichtbaren Knopf stoppen und wiederholen (siehe [einleitung.md](einleitung.md)).

---

## Umsetzung v0.10.0 (überholt)



### Ein Knopf, überall derselbe

Alle Audio-Bedienelemente sind zu **einem** Knopf zusammengefasst: **🔊 Vorlesen**
(im Betrieb **⏹ Stopp**). Er steht im Tipp-Fenster, in jedem Hilfe-Fenster und im
Info-Fenster – bei **allen drei Avataren**, auch bei Lennox.

* Vorher hatte Lennox vier Knöpfe (Abspielen · Pause · Stopp · Transkript gelesen),
  Lyra und Zen zwei. Jetzt: **ein** Vorlese-Knopf.
* **„Transkript gelesen ✓" bleibt** bei Lennox erhalten. Das ist kein Audio-Knopf,
  sondern der einzige Weg zur Bonusfrage, wenn gar kein Ton zur Verfügung steht
  (stumm geschaltet, kein Lautsprecher, Schul-Laptop ohne deutsche Stimme).
* **Nichts startet mehr von selbst.** Die frühere Automatik („die KI meldet sich
  einmal je Sitzung") ist ersatzlos entfallen.
* **Die Story wird nicht vorgelesen** – Einleitung, Level-Story und Finale-Ansprache
  haben keinen Vorlese-Knopf. (Das war schon vorher so und bleibt so.)

### Aufnahme vor Sprachsynthese: die Zuordnungstabelle

Eine einzelne Aufnahme kann die über 30 Tipp-, Hilfe- und Info-Texte des Spiels nicht
sprechen. Deshalb entscheidet eine Tabelle, **welcher Text welche Aufnahme hat**:

`game/js/data/voice.js`
```js
NX.voiceClips = {
  // 'tip-1-0': 'media/voice/tip-1-0.mp3',
};
```

Beim Druck auf **Vorlesen** gilt:

| Lage | Was passiert |
|---|---|
| Zum Schlüssel ist eine MP3 eingetragen | **Die Aufnahme** wird abgespielt |
| Kein Eintrag | Die **Browser-Sprachausgabe** liest den angezeigten Text vor |
| Eintrag da, Datei fehlt/blockiert | Stiller Rückfall auf die Sprachausgabe – der Knopf klickt nie ins Leere |

**Schlüssel-Schema:** `tip-<level>-<index>` · `info-<level>-<avatar>` ·
`help-<level>-<station>` · `avatar-learn-<avatar>` · `l3-tip-<frage>` / `l3-info-<frage>`.

Eine Aufnahme nachliefern heißt: Datei nach `game/media/voice/` legen und **eine
Zeile** eintragen. Kein Code-Eingriff, kein Neustart des Spiels.

> ### ⚠ Offener Punkt: der Text der vorhandenen Aufnahme
>
> `luvvoice.com-20260805-MomwB7.mp3` (35 s) liegt als
> `game/media/buerger-ki-stimme.mp3` bereit, ist aber **absichtlich noch nicht
> eingetragen**. Der gesprochene Text ist nirgends dokumentiert und die Datei trägt
> keine Tags – eine Aufnahme an der falschen Stelle sagt schlicht etwas anderes, als
> auf dem Bildschirm steht. **Sobald der Text bekannt ist, kommt sie in die passende
> Zeile.** Bis dahin liest überall die Browser-Stimme vor.
>
> Für Abschnitt 1 („Lennox' Info über die MP3") wäre das der Schlüssel
> `info-1-lennox` – vorausgesetzt, die Aufnahme spricht tatsächlich Lennox'
> Funk-Text zu Level 1.

**Mute:** Der Schalter 🔊/🔇 oben rechts schaltet Effekte, Sprachausgabe **und**
Aufnahmen gemeinsam stumm. Aufnahme und Sprachausgabe schließen sich gegenseitig
aus – zwei Stimmen gleichzeitig versteht niemand.

**Code:** `game/js/data/voice.js` (Tabelle) · `game/js/audio.js` (`NX.audio.clip`) ·
`game/js/ui.js` (`NX.ui.voiceBar`, `showModal(…, {speak, clipKey})`) ·
`game/js/infosystem.js` (gemeinsamer Sprech-Zustand für alle drei Varianten).