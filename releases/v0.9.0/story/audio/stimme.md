## Integration der Bürger-KI-Stimme bei den Tipps und Infos

### 1. Datei-Vorbereitung
Die heruntergeladene MP3-Datei mit dem Namen Luvvoice.com-20260805-MomwB7.mp3 liegt im Ordner audio/ des Projekts.
Optional: Die Datei kann in buerger-ki-stimme.mp3 umbenannt werden, damit sie im Ordner leichter wiederzufinden ist.

### 2. Einbindung im Spiel
Die Audiodatei wird als offizielles Sprach-Audio für die Bürger-KI definiert.
Sie soll bei den Hinweisen, Tipps und im Info-Bereich abgespielt werden, damit Spielerinnen und Spieler (wie deine Freundin) die echte KI-Stimme hören können, anstatt den Text nur zu lesen.

---

## ✅ Umsetzung v0.9.0

**Datei:** Kopie als `game/media/buerger-ki-stimme.mp3` (die in Abschnitt 1 erlaubte
Umbenennung). Das Original bleibt in `story/audio/` als Quelle. 35 Sekunden, mono,
24 kHz, 207 KB.

**Zwei Stimmen, eine Aufgabenteilung.** Eine einzelne Aufnahme kann die über 30
Tipp- und Info-Texte des Spiels nicht sprechen. Deshalb greifen zwei Quellen
ineinander (`game/js/audio.js`):

| Quelle | Was sie kann | Wo sie spielt |
|---|---|---|
| `NX.audio.clip` – die **MP3** | immer derselbe Text: die **Erkennungsstimme** | Tipp-Modal und Info-Overlay, je Sitzung **einmal** von selbst, danach per Knopf |
| `NX.audio.voice` – **Browser-Sprachsynthese** (`speechSynthesis`, de-DE) | **beliebige** Texte | „🔊 Vorlesen" auf jedem Tipp, jeder Info und jedem Info-Fenster-Abschnitt |

Beide teilen sich den Stumm-Schalter (🔇 oben rechts) und **schließen sich
gegenseitig aus** – zwei Stimmen gleichzeitig versteht niemand. Die Leiste heißt im
Code `.voicebar` (`NX.ui.voiceBar`), gebaut aus `ui.plainText()` und `ui.toLines()`,
die HTML-Schnipsel in einzelne Sätze zerlegen (ein Utterance je Satz).

**Warum nicht jedes Mal automatisch?** 35 Sekunden bei jedem Öffnen wären ein
Hinterhalt. Einmal je Sitzung erfüllt „die echte KI-Stimme hören", ohne den
Spielfluss zu blockieren. Abbrechen geht jederzeit über denselben Knopf.

**Robustheit:** Geladen wird über ein `<audio>`-Element, also per URL wie die Bilder
auch – das funktioniert auch, wenn `index.html` direkt per `file://` geöffnet wird.
Fehlt die Datei, wird der Clip dauerhaft als nicht verfügbar vermerkt, der Knopf
verschwindet und alles andere läuft weiter.

> **Offener Punkt:** Der gesprochene **Text der Aufnahme ist im Repo nicht
> dokumentiert** (die Datei trägt keine Tags). Die Beschriftung im Spiel bleibt
> deshalb neutral („BÜRGER-KI · 📻 KI-Stimme"). Sobald das Transkript vorliegt,
> lässt sich die Platzierung schärfen – handelt es sich etwa um eine Ansprache,
> gehört sie eher in die Finale-Zeremonie (`#screen-finale`, siehe
> [../belohnung.md](../belohnung.md)).