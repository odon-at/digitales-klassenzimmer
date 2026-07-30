# Level 2 – Flug der Cyber-Tauben

**Untertitel:** Die lautlosen Boten · **Akzent:** Violett · **Lernfokus:** API-Abfrage, API-Token, JSON

**Aktueller Ist-Zustand (Umsetzung):**
![Level 2 im Spiel](../images/screens/level-2.png)

> Vorlage: PDF-Folien „Die lautlosen Boten“ (Story) und „Level 2: Flug der Cyber-Tauben“ (Aufgabe).

---

## Story (Vorlage) ✅

> Die Glasfaserkabel der Stadt sind vom Feind besetzt. Jedes Bit, das wir senden, wird
> abgefangen. Es gibt nur einen Weg vorbei an der Firewall: Die Cyber-Tauben. Diese
> mechanischen Boten fliegen über die Funklöcher hinweg. Wir müssen sie programmieren,
> damit sie die Rettungspakete direkt ins Herz der Stadtverwaltung tragen.

## Lernziel

Verstehen, wie man Daten über eine **API** abfragt: **Endpunkt** wählen, **API-Token**
einsetzen, Antwort als **JSON** empfangen.

## Aufgaben (Checkliste) ✅ (aus der Vorlage)

1. Boten programmieren (API-Abfrage)
2. API-Token nutzen
3. Paket empfangen im JSON-Format

## MVP-Aufgabe (umgesetzt) 🟡

Ein **API-Request-Builder**:

- **Methode:** GET (fest). **Endpunkt:** Dropdown mit einer korrekten und zwei falschen/unsicheren URLs.
- **Authorization:** der bereitgestellte **API-Token** muss eingesetzt werden.
- **„🕊 Anfrage senden“** startet eine **simulierte** Abfrage (Tauben-Flug-Animation):
  - falscher Endpunkt → `404`, unsicher/verdächtig.
  - fehlender/falscher Token → `401 Unauthorized`.
  - korrekt → `200` + **JSON-Datenpaket** (syntaxhervorgehoben).
- Läuft **offline** (kein echter Netzwerkaufruf – Antwort ist eingebettet).

### Beispieldaten (`NX.data.level2`)

- Gültiger Endpunkt: `https://opendata.nexus.city/v1/luftqualitaet`
- Gültiger Token: `NX-TOKEN-7F3A-9K2D`
- Antwort (200): Luftqualität (PM10 je Bezirk), inkl. `lizenz: CC-BY 4.0`, `aktualisiert`, `einheit`.

## Punkte 🟡

`100 − (Fehlversuche × 15)`, Untergrenze **50**.

## Info-Popup (ℹ) 🟡

Erklärt **API**, **API-Token** (Fehler 401 ohne gültigen Token) und **JSON** (Schlüssel:Wert-Paare).

## Angenommene Entscheidungen (MVP)

- **Simulierte** API (keine echte Verbindung), damit das Level offline und stabil läuft. 🟡
- Konkreter Endpunkt/Token/JSON als Beispiel; Fehlercodes 401/404 als Lernmoment. 🟡

## Umsetzung im MVP

- Logik: `game/js/levels/level2.js` · Daten: `game/js/data/datasets.js` → `level2`

## Iterationsideen 💡

- Optionaler Abruf **echter** Open-Data-APIs (online), inkl. Rate-Limit/Token-Handling.
- Query-Parameter zusammenbauen (Filter/Bezirk), Antwort abhängig von Parametern.
- JSON-Felder gezielt auslesen lassen („Welcher Bezirk hat PM10 = 57?“).
- Mehrere Tauben/Pakete, Reihenfolge/Timing als kleines Geschicklichkeitselement.
