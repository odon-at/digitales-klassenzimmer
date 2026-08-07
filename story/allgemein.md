# NEXUS DATA – Spielbibel (Allgemein)

> **Zweck dieses Ordners:** Die Dateien in `story/` sind die **zentrale Design-Quelle**
> für *NEXUS DATA / Open Data Classroom*. Sie beschreiben, *was* das Spiel ist und
> *wie* sich jeder Bildschirm verhalten soll. Sie sind der **Haupt-Input für die
> Weiterentwicklung – auch gemeinsam mit einer KI**. Der Code im Ordner `game/` ist
> die aktuelle Umsetzung dieser Spezifikation (MVP).

*Ein Lernspiel von Sarah & Chiara Hamedinger.*

---

## 1. Kurzbeschreibung

**NEXUS DATA** ist ein browserbasiertes Lernspiel im Cyberpunk-Look. Die Spielenden
retten die Stadt „Nexus“ aus einem digitalen Koma, indem sie in **vier Levels** die
verlorenen **Open-Data-Fragmente** zurückholen. Dabei lernen sie spielerisch, was
offene Daten sind, wie man sie findet, abfragt, auf Vertrauenswürdigkeit prüft und
sichtbar macht.

- **Titel:** NEXUS DATA (Projekttitel: *Open Data Classroom*)
- **Zielgruppe:** Schulklassen (digitales Klassenzimmer)
- **Lernziel:** Grundverständnis von **Open Data** – Suchen, Korrigieren, Abfragen (API/JSON),
  Prüfen (Quelle/Lizenz/Plausibilität) und Visualisieren von Daten
- **Format:** Einzelne Web-Anwendung, im Browser spielbar, einfach weiterzugeben

## 2. Story-Prämisse (Kanon)

> Es passierte um Punkt 03:00 Uhr nachts. Ein mysteriöser Cyber-Angriff – bekannt als
> **„Der große Nebel“** – hat die Kontrolle über die digitale Infrastruktur der Stadt
> übernommen. Die städtischen Datenbanken wurden gesperrt, Ampeln spielen verrückt, und
> die offiziellen Systeme sind tot. Die Stadt ist im digitalen Koma. Eine alte,
> vergessene Backup-Meldung taucht auf den Bildschirmen der Stadt auf:
>
> *„Wenn das System fällt, vertraut den Open Data Archiven. Sie liegen außerhalb der
> Kontrolle des Hackers. Holt die Fragmente zurück.“*

Roter Faden über die Levels:
1. **Cyber-Tauben** – Nachrichten am gekaperten Netz vorbeischmuggeln (API).
2. **Schattenarchiv** – die ersten Fragmente bergen und säubern (Open Data).
3. **Labyrinth der Lügen** – der Hacker flutet das Netz mit Falschdaten; Wahrheit beweisen.
4. **Daten-Metropole** – die geretteten Daten richtig visualisieren und die Stadt auf
   Open Data vs. Datenschutz (DSGVO) prüfen.

## 3. Setting, Ton & Look

- **Setting:** Neon-Cyberpunk-Stadt „Nexus“, nachts, Systeme im Ausfall.
- **Ton:** spannend, aber ermutigend; Fehler sind erlaubt und werden erklärt.
- **Look (siehe Mockups in `images/`):** dunkler Hintergrund, Neon-Akzente, HUD-/Terminal-Optik,
  Monospace für „technische“ Texte, Grid-/Scanline-Overlays, sanftes Leuchten (Glow).
- **Akzentfarben (Kanon):**
  | Kontext | Farbe |
  |---|---|
  | Startseite / Marke | Violett + Cyan |
  | Login | Cyan |
  | Avatar Lyra / Lennox / Zen | Pink / Gelb / Grün |
  | Level 1 / 2 / 3 / 4 | Violett / Grün / Gelb / Neon-Blau |
  | Belohnung / Zertifikat | Gold/Gelb |

## 4. Spielprinzip (Loop)

`Startseite → Login (Klassen-Code) → Avatar-Auswahl → Einleitung → Missionskarte →
Level 1–4 → Belohnung / Zertifikat`

Pro Level: kurze Story + Aufgaben-Checkliste + eine kleine, echte Aufgabe. Bei Erfolg
gibt es einen **Schlüssel** (Fragment) und **Punkte**; das nächste Level wird
freigeschaltet. Details siehe [overview.md](overview.md).

## 5. Sprache & Schreibweise

- **Sprache: Deutsch.** Alle Spieltexte auf Deutsch. Technische Bezeichner (IDs,
  Feldnamen, Funktionsnamen) bleiben in ihrer Originalform.
- Anrede: neutral/geschlechtergerecht (z. B. „Chronist:in“, „Visionär*in“) – wie in den Mockups.
- Ton: kurze, klare Sätze; Fachbegriffe werden über **Info-Popups** erklärt (siehe Glossar).

## 6. Design-Prinzipien

1. **Lernen durch Tun** – jedes Level vermittelt genau einen Open-Data-Kernbegriff.
2. **Fehler sind Feedback** – falsche Eingaben werden erklärt, nicht bestraft (nur kleine Punktabzüge).
3. **Niederschwellig** – ohne Anmeldung/Server spielbar; Fortschritt lokal gespeichert.
4. **Erweiterbar** – Levels sind austauschbare Bausteine (siehe [levels/README.md](levels/README.md)).
5. **Einfache Weitergabe** – Ordner kopieren genügt; keine Build-Tools.

## 7. Punkte-, Schlüssel- & Rangmodell

- **Schlüssel/Fragmente:** 1 pro Level → **4 insgesamt** (Anzeige „X/4“).
  🟡 *Annahme:* Im PDF-Mockup steht „3/3“. Für den MVP ist pro Level ein Schlüssel gesetzt (4/4).
  Falls 3 Schlüssel gewünscht sind, kann die Zuordnung angepasst werden.
- **Punkte (ab v0.8.0):** einheitlich über `game/js/score.js` –
  **+100** je richtig gelöster Teilaufgabe, **+50** wenn sie im Erstversuch saß,
  **−30** je Fehlversuch, dazu ein **Zeit-Bonus** bis **+100** pro Level.
  Nie unter 0. Ein **Tipp** kostet **−30** (zentral im Level-Host).
  Erreichbar: L1 700 · L2 1000 · L3 1000 · L4 2500 = **5200**.
- **Wissens-Bonus:** je Level **150** Punkte für eine richtig beantwortete Bonusfrage im
  Info-System (ℹ, kostenlos) → **600** zusätzlich, Maximum also **5800**. Siehe [info.md](info.md).
- **Ränge** (Anteil an der erreichbaren Gesamtpunktzahl): **S** ≥ 90 % · **A** ≥ 70 % · **B** ≥ 50 % · sonst **C**.
  Prozentual gerechnet, damit zusätzliche Boni die Ränge nicht entwerten.
- **Halle der Chronisten:** lokale Bestenliste (Name · Punkte · Schlüssel).

## 8. Barrierefreiheit & Geräte

- Responsiv für Laptop/Beamer und Tablet; Hoch-/Querformat abgefangen.
- Ton ist optional und stummschaltbar (🔊/🔇), nichts ist rein auf Audio angewiesen.
  Umgekehrt gilt auch: nichts hängt allein am Lesen – Tipps, Hilfe- und Info-Texte
  lassen sich über **einen** Knopf **vorlesen** (siehe [stimme.md](stimme.md)).
  Fällt die Sprachausgabe aus, bleibt der Text sichtbar; bei Lennox führt
  „Transkript gelesen ✓" auch ohne Ton zur Bonusfrage.
- 🟡 *Offen:* Kontrast/Tastaturbedienung/Screenreader für spätere Iteration prüfen.

## 9. Glossar (wird in Info-Popups verwendet)

| Begriff | Kurzdefinition (spielintern) |
|---|---|
| **Open Data** | Frei zugängliche Daten, die jede:r nutzen, teilen und weiterverwenden darf – oft von Städten/Behörden. |
| **API** | Schnittstelle, über die Programme Daten anfordern. |
| **API-Token** | „Schlüssel“, der beweist, dass man Daten abfragen darf (sonst Fehler 401). |
| **JSON** | Textformat aus *Schlüssel: Wert*-Paaren; von Mensch und Maschine lesbar. |
| **Lizenz / CC-BY** | Nutzungsregeln; **CC-BY** erlaubt Nutzung mit Namensnennung. |
| **Metadaten** | Daten über die Daten (z. B. Quelle, Aktualisierungsdatum). |
| **Plausibilität** | Ist ein Wert realistisch? (z. B. pH nur 0–14). |
| **Golden Record** | Der „richtige“, bereinigte Datensatz (Bild „Labyrinth“). |

## 10. Namens- & Datei-Konventionen

- Bilder liegen in `story/images/`. **Mockups** (Design-Vorgabe) und **Screens**
  (`images/screens/`, aktueller Ist-Zustand) sind getrennt abgelegt.
- Umsetzung: `game/` – siehe `game/README.md` (Struktur & Erweiterung).
- Persistenz (localStorage): `nexusdata.save`, `nexusdata.hall`, `nexusdata.muted`,
  `nexusdata.music`.

## 11. Tech-Stack (Kurz)

Einzelne Web-App · HTML + CSS + Vanilla-JS · Bibliotheken via CDN (Google Fonts
*Orbitron/Rajdhani*, *Chart.js*, *canvas-confetti*) · Medien relativ aus `media/`.
Details: `game/techstack.md` und `game/README.md`.

## 12. Legende für alle Spec-Dateien

Damit die KI-Iteration weiß, was fix ist und was zur Diskussion steht:

- ✅ **Vorgabe** – stammt aus dem Original (PDF/Mockups), sollte erhalten bleiben.
- 🟡 **Annahme (MVP)** – von uns ergänzt, um das Spiel spielbar zu machen; **frei änderbar**.
- 💡 **Iterationsidee** – Vorschlag für eine spätere Ausbaustufe.

---

### Verweise

- Gesamter Ablauf & Architektur → [overview.md](overview.md)
- Einzelne Bildschirme → [startseite.md](startseite.md) · [login.md](login.md) ·
  [avatar.md](avatar.md) · [einleitung.md](einleitung.md) ·
  [missionskarte.md](missionskarte.md) · [belohnung.md](belohnung.md)
- Levels → [levels/README.md](levels/README.md)

### Hintergrundmusik & Sound-Anforderungen

### B. Lautstärke-Abstimmung
Die Musik darf angenehm leise sein und das Spiel **nicht übertönen**.
Andere Sounds (z. B. Effekte, Menü-Klicks, Geräusche) müssen immer klar und deutlich zu hören sein.

### C. Musik-Button (Ein- und Ausschalten)
**Platzierung:** Ein eigener Button befindet sich **ganz oben** im Spielbereich (Header/Kopfzeile).
**Funktion:** Der Button ermöglicht das einfache Ein- und Ausschalten (Stummschalten) der Hintergrundmusik.
**Visuelles Feedback:** Am Button muss zu erkennen sein, ob die Musik aktuell an oder aus ist (z. B. durch ein Ton-Symbol oder Text).

## Hintergrundmusik & Audio
**Status:** Aktiviert (Endlosschleife / Loop bei 22% Lautstärke).
**Musikdatei:** game/media/musik-loop.mp3
**Details:** Siehe vollständige Spezifikation in [musik.md](story/levels/musik.md).

## Anforderung: Nutzung der Browser-Stimme für die Vorlesefunktion (Text-to-Speech)

## Kurzbeschreibung
Beim Klick auf die Schaltfläche "VORLESEN" im Info-Fenster soll der Inhalt bei allen Avataren ausnahmslos über die native Browser-Stimme (Web Speech API) vorgelesen werden und nicht über eine hinterlegte MP3-Audiodatei.

## Detailbeschreibung und Verhalten
Kontext: Der Nutzer befindet sich im Info-Dialog eines Avatars.
Auslöser: Klick auf den Button "VORLESEN".
Erwartetes Verhalten:
  - Der jeweilige Info-Text wird dynamisch per Browser-Synthesizer (Web Speech API / native Browser-Stimme) ausgegeben.
  - Es wird keine vordefinierte MP3-Datei abgespielt.
  - Diese Anforderung gilt global und einheitlich für sämtliche Avatare im Spiel.

## Akzeptanzkriterien
1. Der Klick auf "VORLESEN" triggert bei jedem Avatar die native Browser-Text-to-Speech-Funktion.
2. MP3-Audiodateien sind für diese Funktion vollständig entfernt bzw. deaktiviert.
3. Die Ausgabe funktioniert zuverlässig auf allen gängigen Zielbrowsern (Chrome, Firefox, Safari, Edge).


## Anpassung des Info Buttons
 ### Ziel der Aenderung
 Der Info Button soll in allen Leveln des Spiels deutlich hervorgehoben werden. Da er derzeit leicht uebersehen wird, soll er durch ein auffaelliges oranges Leuchten und Blinken die Aufmerksamkeit der Spieler auf sich ziehen.

 ### Visuelle Gestaltung
 Der Button erhaelt eine kraeftige orangefarbene Grundtonelementierung. Der Rand und der Hintergrund leuchten in einem warmen Orangeton, was ihn sofort vom dunklen, gruenlich-blauen Design des Spiels abhebt.

###  Effekt und Animation
 Das Blinken erfolgt ueber einen stufenlosen, pulsierenden Uebergang. Dabei wechselt die Farbe periodisch zwischen einem normalen Dunkelorange und einem intensiveren, helleren Orangerot. Gleichzeitig dehnt sich ein orangefarbener Lichtschein um den Button aus und zieht sich wieder zusammen. Dieser Pulsieren-Effekt wiederholt sich endlos, solange das Level aktiv ist.
 ### Platzierung und Interaktion
 
 Der Button behaelt seine gewohnte Position in der Kopfzeile der Aufgabenstellung. Sobald der Spieler auf den Info Button klickt oder mit der Maus darueberfaehrt, bleibt die Sichtbarkeit durch das stetige Leuchten garantiert, sodass die Zusatzinformationen jederzeit leicht zugaenglich sind.
