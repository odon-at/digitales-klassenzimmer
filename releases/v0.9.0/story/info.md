# Info-System & Begriffs-Glossar (Avatar-spezifisch & Bonus-System)

**Untertitel:** Strikte Trennung von Wissensvermittlung und Notfall-Hilfe
**Akzentfarbe:** Neon-Violett (#8A2BE2) & Cyber-Cyan (#00FFFF)
**Lernfokus:** Reine Begriffs- und Konzept-Erklärung je Level, angepasst an den gewählten Avatar und kombiniert mit einem fairen Bonus-Anreiz.

---

## 1. Die strikte Trennung: Info vs. Tipp

Um das Spiel fair, motivierend und lehrreich zu gestalten, sind die beiden Hilfe-Buttons im Interface strikt voneinander getrennt:

**Der Info-Button (Der Wissens-Tresor):**
  * **Kosten:** **0 Punkte** (absolut straffrei).
  * **Inhalt:** Erklärt **rein den Fachbegriff des jeweiligen Levels** (z. B. in Level 1: Was ist Open Data? oder in Level 2: Was ist eine API?). Er enthält **niemals** Lösungswege, Hinweise zur aktuellen Aufgabe oder Tipps, wie man Werte korrigiert. Er dient ausschließlich dem Verstehen des theoretischen Konzepts.
  * **Der Clou (Bonus-System):** Wer sich die Info vollständig durchsieht bzw. durchliest und am Ende eine kurze, spielerische Avatar-Mini-Frage richtig beantwortet, erhält **extra Bonuspunkte** fürs Konto!

**Der Tipp-Button (Die Notfall-Hilfe):**
  * **Kosten:** **Minuspunkte** – umgesetzt sind einheitlich **−30 Punkte** je Tipp
    (ab v0.8.0 auf der größeren Punkteskala, entspricht genau einem Fehlversuch).
  * **Inhalt:** Das ist der einzige Ort, an dem konkrete Hinweise, Lösungsansätze oder Korrektur-Tipps für die aktuelle Aufgabe gegeben werden. Wer hier klickt, zahlt einen Punktpreis.

---

## 2. Avatar-abhängige Info-Formate (Lern-Typen)

Je nachdem, welchen Avatar der Spieler zu Beginn ausgewählt hat, präsentiert sich der reine Theorieteil im Infobutton in einem völlig unterschiedlichen Stil:

### 👩‍💻 Lyra – Der visuelle Lerntyp
**Darstellung:** Interaktive Hologramm-Mindmaps, bunte Schemata, Symbole und visuelle Vergleiche.
**Inhalt:** Statt Fließtexten sieht man bildliche Analogien oder Strukturdiagramme, die komplexe Fachbegriffe sofort greifbar machen (z. B. eine Schemazeichnung, wie offene Daten fließen).
**Bonusfrage:** Ein visueller Check (z. B. „Klicke auf das Symbol, das den Open-Data-Kreislauf am besten darstellt!“).

### 🎧 Lennox – Der auditive Lerntyp
**Darstellung:** Ein akustischer Funk-Kanal mit integriertem Audio-Player.
**Inhalt:** Ein kurzer, vertonter Sprach-Log oder ein Dialog, in dem der Avatar den Fachbegriff wie eine spannende Geschichte oder ein Gespräch erklärt („Hey, pass auf...“).
**Bonusfrage:** Eine kurze Quiz-Frage zum Gehörten.

### 🧠 Zen – Der kognitive / textbasierte Lerntyp
**Darstellung:** Ein klassisches Hacker-Terminal mit sauber gegliedertem Markdown, Code-Schnipseln und Fakten.
**Inhalt:** Logische Strukturen, präzise Definitionen und klare Checklisten für alle, die Informationen am liebsten strukturiert und sachlich lesen.
**Bonusfrage:** Eine kleine Logik- oder Text-Knobelaufgabe zur Verifizierung des Gelesenen.

---

## 3. Level-Beispiele für die reine Begriffs-Erklärung

> **Achtung Nummerierung:** Seit **v0.5.0** sind Level 1 und 2 getauscht.
> Level 1 = Cyber-Tauben (API), Level 2 = Schattenarchiv (Open Data).

**Level 1 (API & JSON):** Der Infobutton erklärt rein den Aufbau und die Funktion einer API (Schnittstelle) und des JSON-Formats. Es gibt hier absolut keine Hinweise darauf, welcher Endpunkt im Level der richtige ist.
**Level 2 (Open Data):** Der Infobutton erklärt rein die Definition von Open Data (freie, für alle zugängliche Verwaltungsdaten). Es gibt hier absolut keine Hinweise darauf, wie man im Spiel die Daten korrigiert.
**Level 3 (Quellen & Lizenzen):** Der Infobutton erklärt die vier Prüf-Module und die drei Belegstufen – aber nie, wie eine konkrete Meldung zu bewerten ist.
**Level 4 (Visualisierung):** Der Infobutton erklärt Diagrammarten und Data-Storytelling, nicht die Auswertung des konkreten Datensatzes.

---

## 4. Umsetzung im Spiel (ab v0.6.0)

**Inhalte:** `game/js/data/infos.js` – je Level ein Eintrag mit den drei Avatar-Varianten
(`lyra` / `lennox` / `zen`), je einer Bonusfrage und `bonusPoints` (150).
Das Feld `forbidden` listet die Lösungswerte des Levels; sie dürfen im Info-Text **nicht**
vorkommen. So ist die strikte Trennung maschinell prüfbar.

**Logik:** `game/js/infosystem.js` → `NX.infoSystem.open(levelId)`. Eigenes Overlay
(`#infoscreen`), weil das gemeinsame Modal nur einen HTML-String annimmt und hier
klickbare Knoten, Transport-Buttons und Antwort-Optionen nötig sind.

**Sprachausgabe für ALLE (ab v0.9.0):** Jeder Tipp, jede Info und jede Seite des
Info-Fensters trägt einen **🔊-Knopf**; gesprochen wird per Browser-Sprachsynthese
(`NX.ui.voiceBar`). Zusätzlich meldet sich **einmal je Sitzung** die echte Aufnahme
der Bürger-KI (`game/media/buerger-ki-stimme.mp3`) – siehe
[audio/stimme.md](audio/stimme.md). Beide Quellen teilen sich den Stumm-Schalter und
schließen sich gegenseitig aus.

**Knoten der Reihe nach (ab v0.9.0):** In der Lyra-Mindmap ist immer nur **ein**
Knoten offen („Klick mich an!"), spätere sind sichtbar gesperrt – auch für die
Tastatur. Die Verbindungslinien leuchten Schritt für Schritt auf. Erst nach dem
letzten Knoten öffnet die Bonusfrage. Die Reihenfolge folgt dem Weg der Anfrage:
**Programm → Anfrage → API → Server → JSON** (das JSON ist die Antwort des Servers;
die Level-1-Spec nummeriert Server und JSON vertauscht).

**Sprachausgabe (Lennox):** `NX.audio.voice` nutzt die Browser-API `speechSynthesis`
(`de-DE`) – **keine Audiodateien, kein CDN**. Ein Satz pro Utterance (umgeht Chromes
Abbruch langer Texte). Steht keine Stimme zur Verfügung, schaltet ein Watchdog nach
1,2 s automatisch auf das **Funk-Transkript** um. Das Transkript ist ohnehin immer
sichtbar – nichts hängt allein am Ton.

**Bonuspunkte:** `state.bonuses` (`{ levelId: Punkte }`), je **150** Punkte. Auch eine **falsche** Antwort
wird mit 0 gespeichert – damit ist die Frage verbraucht und lässt sich nicht durchprobieren.

**Tipp-Kosten:** zentral in `game/js/screens.js` (`TIP_COST = 30`), Abzug einmalig in
`completeLevel()`. Level 3 hat frageweise Hilfen und rechnet sie selbst ab; dort blendet
der Host seinen Tipp-Button aus, damit nichts doppelt zählt.

**Ränge:** Die Schwellen sind prozentual (90/70/50 % der erreichbaren Gesamtpunktzahl
inklusive Boni), damit zusätzliche Bonuspunkte die Ränge nicht entwerten.