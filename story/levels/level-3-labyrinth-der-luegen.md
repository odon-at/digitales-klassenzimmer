# Level 3 – Das Labyrinth der Lügen

**Untertitel:** Daten prüfen & hinterfragen · **Akzent:** Gelb · **Lernfokus:** Quelle, Lizenz, Metadaten, Plausibilität

**Design-Vorgabe (Mockup):**
![Labyrinth-Mockup](../images/Labyrinth.jpeg)

**Aktueller Ist-Zustand (Umsetzung):**
![Level 3 im Spiel](../images/screens/level-3.png)

> Vorlage: PDF-Folien „Das Labyrith der Lügen“ (Story) und „Level 3: Das Labyrinth der Lügen“
> (Aufgabe). Das Mockup zeigt den Weg der Daten (Raw Data → … → „Golden Record: The Right Data“).

---

## Story (Vorlage) ✅

> Der Hacker ist verzweifelt. Er flutet das Netzwerk mit Tausenden falschen Signalen. Er
> behauptet, das Wasser sei vergiftet und die Brücken unsicher. Die Bürger geraten in
> Panik. In diesem Labyrinth aus Spiegeln müssen wir den kühlen Kopf bewahren. Wir müssen
> beweisen, welche Daten das Siegel der Wahrheit tragen.

## Lernziel

Datenkompetenz: Vertrauenswürdige Daten an **Quelle**, **Lizenz**, **Metadaten** und
**Plausibilität** erkennen.

## Aufgaben (Checkliste) ✅ (aus der Vorlage)

1. Quellen-Check: Fake-Server erkennen
2. Lizenz-Prüfung (Regeln nach CC-BY)
3. Metadaten-Analyse
4. Plausibilitätstest (unmögliche Werte)

## MVP-Aufgabe (umgesetzt) 🟡

Vier Datensatz-Karten behaupten, dieselbe Wahrheit zu kennen – **nur eine ist
vertrauenswürdig**. Jede Karte zeigt Quelle, Lizenz, Aktualisierung (Metadaten) und einen
Wert, jeweils mit ✔/✘. Spieler:in wählt die echte Karte und bestätigt. Bei falscher Wahl
erklärt ein Popup den Mangel; erneuter Versuch möglich.

### Karten & Mängel (`NX.data.level3`)

| Karte | Quelle | Lizenz | Wert | Bewertung |
|-------|--------|--------|------|-----------|
| **A** | `daten.nexus.gv.at` ✔ | CC-BY 4.0 ✔ | Nitrat 12 mg/l ✔ | **echt ✅** |
| B | `free-data-download.ru` ✘ | CC-BY 4.0 | Nitrat 11 mg/l | Fake-Quelle |
| C | `daten.nexus.gv.at` | © Alle Rechte vorbehalten ✘ | Nitrat 13 mg/l | keine offene Lizenz |
| D | `daten.nexus.gv.at` | CC-BY 4.0 | **Nitrat 9999 mg/l ✘** | unplausibel |

## Punkte 🟡

`100 − (Fehlversuche × 20)`, Untergrenze **40**.

## Info-Popup (ℹ) 🟡

Erklärt die vier Prüfsteine: **Quelle** (offiziell?), **Lizenz** (CC-BY?),
**Metadaten** (vollständig/aktuell?), **Plausibilität** (realistische Werte?).

## Angenommene Entscheidungen (MVP)

- Vier Karten mit je genau **einem** typischen Mangel, damit jeder Prüfstein sichtbar wird. 🟡
- Auswahl-Mechanik (klicken + bestätigen) statt freier Recherche. 🟡

## Umsetzung im MVP

- Logik: `game/js/levels/level3.js` · Daten: `game/js/data/datasets.js` → `level3`

## Iterationsideen 💡

- Mehrstufig: erst Quelle prüfen, dann Lizenz, dann Werte (echte Labyrinth-Metapher).
- Mehr Karten / Mischformen (mehrere Mängel), Zeitdruck oder „Panik-Meter“ der Bürger.
- Kurze Begründung von der Spieler:in verlangen (warum echt/falsch) → tieferes Lernen.
- Anlehnung an echte Lizenz-/Quellenbeispiele (data.gv.at, CC-Lizenzfamilie).
