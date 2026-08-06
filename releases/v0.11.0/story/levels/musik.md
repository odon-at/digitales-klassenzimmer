# Hintergrundmusik

Die inhaltliche Vorgabe steht in [../allgemein.md](../allgemein.md) →
„Hintergrundmusik & Sound-Anforderungen". Diese Datei beschreibt, **wie** sie im Spiel
umgesetzt ist und was noch fehlt.

---

## ⚠ Offener Punkt: die Musikdatei fehlt

Der Track **„Loopix"** (fonoskop, Freesound ID 849265, CC BY 4.0) ist in der Spec
benannt, aber **nicht im Repo**. Die dort referenzierte `Music_Musik.md` existiert
nicht, und in `game/media/` liegt keine Musik. Herunterladen von Freesound war hier
nicht möglich (das verlangt ein Konto).

**Die Technik ist trotzdem vollständig gebaut.** Solange keine Datei da ist, bleibt der
Musik-Knopf ausgeblendet, es erscheint keine Namensnennung, und am Spiel ändert sich
nichts.

## So wird die Musik aktiv

1. Die Datei nach **`game/media/musik-loop.mp3`** legen.

Das war's. Kein Code-Eingriff, kein Build. Der Pfad steht in
`game/js/data/voice.js` (`NX.musicTrack`) und lässt sich dort ändern; `null` schaltet
die Musik dauerhaft ab.

## Was die Technik tut

| Anforderung (allgemein.md) | Umsetzung |
|---|---|
| Endlosschleife | `<audio loop>` in `NX.audio.music` |
| Leise, übertönt nichts | Lautstärke **0,22**; die Effekte liegen bei 0,08–0,18. Während vorgelesen wird, sinkt die Musik zusätzlich auf 0,07 und steigt danach wieder |
| Eigener Knopf **ganz oben** | 🎵 links neben dem Ton-Knopf, fest oben rechts, auf **allen** Bildschirmen sichtbar |
| Sichtbarer An/Aus-Zustand | Ausgeschaltet: gedimmt, gestrichelter Rand, Schrägstrich – dazu `aria-pressed`, damit der Zustand nicht allein am Symbol hängt |
| Credits im Abspann | Erscheinen im Finale **und** auf der Startseite |

**Der Ton-Knopf 🔊 bleibt der Hauptschalter:** Er schaltet Effekte, Sprachausgabe
**und** Musik gemeinsam stumm – im Klassenzimmer muss ein Griff genügen. Der
Musik-Knopf ist dann sichtbar wirkungslos. Die Einstellung liegt in
`localStorage` unter `nexusdata.music`.

**Autoplay:** Browser lassen Ton erst nach einer Nutzeraktion zu. Die Musik startet
deshalb beim ersten Klick im Spiel, nie vorher.

## Namensnennung (CC BY 4.0)

> ♪ „Loopix" by fonoskop (freesound.org/s/849265) · CC BY 4.0

Der Text steht in `game/js/data/voice.js` (`NX.musicCredit`) und wird **nur angezeigt,
wenn die Datei wirklich vorhanden ist** – eine Namensnennung für einen nicht
ausgelieferten Track wäre schlicht falsch. Angezeigt an zwei Stellen: im Abspann
(`#screen-finale`, wie von der Spec verlangt) und klein auf der Startseite, weil der
Abspann überspringbar ist.

## Bewusste Abweichung

Ein **völlig lückenloser** Loop bräuchte WebAudio-Buffer – und dafür `fetch()`, das
unter `file://` scheitert. Das Spiel muss aber auch per Doppelklick auf `index.html`
laufen. Deshalb der `<audio loop>`-Weg; je nach Browser kann dabei eine winzige Lücke
am Schleifenende hörbar sein. Für eine leise Untermalung vertretbar.
