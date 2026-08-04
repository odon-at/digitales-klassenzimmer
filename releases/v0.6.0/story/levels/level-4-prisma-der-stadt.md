# Level 4 – Das Prisma der Stadt

**Untertitel:** Licht aus der Dunkelheit · **Akzent:** Grün · **Lernfokus:** Visualisieren, Data-Storytelling, Release

**Aktueller Ist-Zustand (Umsetzung):**
![Level 4 im Spiel](../images/screens/level-4.png)

> Vorlage: PDF-Folien „Licht aus der Dunkelheit“ (Story) und „Level 4: Das Prisma der Stadt“ (Aufgabe).

---

## Story (Vorlage) ✅

> Die Daten sind wahr. Die Boten sind zurückgekehrt. Doch rohe Zahlen retten keine Leben.
> Die Menschen brauchen Klarheit. Wir aktivieren das „Prisma“. Es bündelt die trockenen
> Zeilen Code und verwandelt sie in leuchtende Landkarten und Diagramme. Das Wissen wird
> für alle sichtbar.

## Lernziel

Daten **visualisieren**, eine **Aussage** dazu formulieren (Data-Storytelling) und das
Ergebnis **veröffentlichen** (Open Data für alle).

## Aufgaben (Checkliste) ✅ (aus der Vorlage)

1. Visualisieren der JSON-Daten
2. Dashboard-Entwicklung
3. Data-Storytelling
4. Projektdokumentation
5. Finaler Release (Wissen veröffentlichen)

## MVP-Aufgabe (umgesetzt) 🟡

Aus dem (in Level 2 empfangenen) Datensatz wird ein **echtes Diagramm** erzeugt:

- **Diagrammart** wählen (Balken/Linie/Torte) → Chart aktualisiert sich live (**Chart.js**).
- **Daten-Story** in einem Satz schreiben (Mindestlänge).
- **„🌐 Veröffentlichen“** schließt das Level ab („Dashboard veröffentlicht – das Wissen ist frei!“).

### Beispieldaten (`NX.data.level4`)

Luftqualität Nexus – PM10 je Bezirk (µg/m³): Zentrum 34 · Hafen 41 · Altstadt 28 ·
Nordpark 19 · Industrie 57.

## Punkte 🟡

**100** bei Veröffentlichung (keine Abzüge). Offline-Fallback: falls Chart.js (CDN) fehlt,
wird ein Hinweis gezeigt und die Veröffentlichung bleibt möglich.

## Info-Popup (ℹ) 🟡

Erklärt **Visualisierung** (Zahlen begreifbar machen), **Data-Storytelling** (klare Aussage)
und **Veröffentlichen** als Open Data.

## Angenommene Entscheidungen (MVP)

- Fokus auf **eine Visualisierung + eine Kernaussage** (statt vollem Dashboard + Doku). 🟡
- „Projektdokumentation“ und „Dashboard-Entwicklung“ sind auf Story-Satz + Chart-Auswahl verdichtet. 🟡

## Umsetzung im MVP

- Logik: `game/js/levels/level4.js` (Chart via **Chart.js**, `unmount()` zerstört das Chart)
- Daten: `game/js/data/datasets.js` → `level4`

## Iterationsideen 💡

- Mehrere Diagramme/Kacheln = echtes **Dashboard**; freie Auswahl der Datenfelder.
- Automatische Bewertung der Story (Bezug zum größten/kleinsten Wert?).
- „Projektdokumentation“ als kurzes Formular (Titel, Quelle, Lizenz, Erkenntnis) → Teil des Zertifikats.
- Export/Teilen des veröffentlichten Dashboards (Link/Bild).
- Verbindung zu echten geretteten Daten aus Level 1–3 (durchgängiger Datenfluss).
