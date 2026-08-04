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
4. **Prisma der Stadt** – die geretteten Daten sichtbar machen und veröffentlichen.

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
  | Level 1 / 2 / 3 / 4 | Violett / Grün / Gelb / Grün |
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
- **Punkte:** je Level max. **100**, gesamt **400**. Abzüge bei Fehlversuchen und Tipps (−10 je Tipp, mit Untergrenze).
- **Wissens-Bonus:** je Level **15** Punkte für eine richtig beantwortete Bonusfrage im
  Info-System (ℹ, kostenlos) → **60** zusätzlich, Maximum also **460**. Siehe [info.md](info.md).
- **Ränge** (Anteil an der erreichbaren Gesamtpunktzahl): **S** ≥ 90 % · **A** ≥ 70 % · **B** ≥ 50 % · sonst **C**.
  Prozentual gerechnet, damit zusätzliche Boni die Ränge nicht entwerten.
- **Halle der Chronisten:** lokale Bestenliste (Name · Punkte · Schlüssel).

## 8. Barrierefreiheit & Geräte

- Responsiv für Laptop/Beamer und Tablet; Hoch-/Querformat abgefangen.
- Ton ist optional und stummschaltbar (🔊/🔇), nichts ist rein auf Audio angewiesen.
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
- Persistenz (localStorage): `nexusdata.save`, `nexusdata.hall`, `nexusdata.muted`.

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
