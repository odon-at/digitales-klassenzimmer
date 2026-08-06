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