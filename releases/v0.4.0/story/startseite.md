# Startseite

Erster Bildschirm des Spiels *NEXUS DATA*. Setzt Ton und Look und startet die Mission.

**Design-Vorgabe (Mockup):**
![Mockup der Startseite](images/startseite.jpeg)

**Aktueller Ist-Zustand (Umsetzung):**
![Startseite im Spiel](images/screens/startseite.png)

---

## Zweck

Neugier wecken, Atmosphäre („Stadt im digitalen Koma“) etablieren und ins Spiel führen.

## Layout & Elemente

- **Markenlogo** „**NEXUS**“ (violett) über „**DATA**“ (cyan, weit gesperrt), zentral, mit Glow. ✅
- Dahinter das Stadt-Hintergrundbild (`media/startseite.jpeg`), stark abgedunkelt. 🟡
- Dekorativer **Zielring** unter dem Logo. 🟡
- **Tagline:** „Die Stadt ist im digitalen Koma. Hol die Open-Data-Fragmente zurück.“ 🟡
- **Button „▶ SPIEL STARTEN“** (Primäraktion). ✅
- **HUD-Ecktexte** (Terminal-Flair, wie im Mockup): ✅
  - oben links (vertikal): `OPEN DATA`
  - oben rechts: `SYSTEM STATUS: OFFLINE` · `CITY: OFFLINE` · `TIME: 03:00`
  - unten links: `VERBINDUNG …` · `NETZWERK: INSTABIL`
  - unten rechts: `FEIND: UNBEKANNT` · `ZIEL: OPEN DATA ARCHIV` · `STATUS: MISSION AKTIV`
- **Credits:** „Open Data Classroom · von Sarah & Chiara Hamedinger“. 🟡

## Verhalten / Interaktion

- **SPIEL STARTEN** → Login. 
- Existiert bereits ein Spielstand (Avatar gewählt): 🟡
  - zusätzlicher Button **„⟳ WEITERSPIELEN“** → springt direkt zur Missionskarte.
  - der Startbutton heißt dann **„⟲ NEUES SPIEL“** und setzt nach Rückfrage den Fortschritt zurück.
- **Zeitanzeige `03:00`** ist bewusst an die Story angelehnt (Uhrzeit des Angriffs). 🟡

## Angenommene Entscheidungen (MVP)

- Das Mockup enthält bereits ein gerendertes „NEXUS DATA“. Im Spiel wird der Titel als
  **echter HTML-Text** über dem abgedunkelten Hintergrundbild dargestellt (scharf, skalierbar,
  animierbar) – nicht als Bild. 🟡
- Tagline, Zielring, Credits und die „Weiterspielen/Neues Spiel“-Logik sind ergänzt. 🟡

## Umsetzung im MVP

- Markup: `game/index.html` → `section#screen-start`
- Style: `game/css/style.css` → Abschnitt „START screen“
- Logik: `game/js/screens.js` → `renderStart()`, Button-Verkabelung in `init()`

## Offene Punkte & Iterationsideen

- 💡 Kleine Intro-Animation (Logo-Glitch, „Verbindung wird aufgebaut …“).
- 💡 Hintergrundmusik ab Startseite (mit Ton-Schalter).
- 🟡 Anzeige einer Sprach-/Klassenwahl, falls später mehrere Klassen/Sprachen nötig sind.

### Frontend-Spezifikation: Startseite "NEXUS DATA"

---

#### 1. Problemstellung & Bugfix (Titel-Überlappung)

**Fehler auf der aktuellen Webseite:** Der Titel **NEXUS DATA** überlappt sich unschön und wird doppelt gerendert (wirkt wie ein fehlerhafter Schatten/Klon).
**Soll-Zustand:** * Der Schriftzug NEXUS DATA darf **nur ein einziges Mal** sauber, scharf und exakt zentriert dargestellt werden.
  * Hinter der Überschrift muss die leuchtende Cyberpunk-Stadtansicht im Hintergrund klar und ohne störende Doppel-Texte sichtbar sein.

---

#### 2. Visueller Aufbau & Layout (Zentriert von oben nach unten)

1. **Hintergrund:**
   * Eine beeindruckende, leuchtende Cyberpunk-/Neon-Stadtansicht (gut ausgeleuchtet und als klarer Hintergrund sichtbar).

2. **Hauptüberschrift:**
   * **NEXUS DATA** (einzeln, klar lesbar, zentral platziert).

3. **Game-Icon / Symbol:**
   * Ein passendes Spiel-Icon direkt unter dem Haupttitel.

4. **Autoren-Credits:**
   * Text: Ein Spiel von Sarah und Chiara

5. **Story- & Einleitungstext:**
   * Text: > „Die Stadt ist im digitalen Koma. Hol die Open Data Fragmente zurück!“

6. **Haupt-Interaktion (Start-Button):**
   * Prominenter Button zum Spielstart: **[ Spiel starten ]**

---

#### 3. Neon-Effekte & Status-Animationen

**Status-Schriftzug:**
  * Text: VERBINDUNG / NETZWERK INSTABIL
**Visuelle Effekte:**
  * Der Schriftzug sowie die zugehörigen Netzwerk-Linien sind im knalligen **Neon-Look** gestaltet.
  * **Flacker- & Flicker-Animation:** Ein realistisches Cyberpunk-Blinken/Glitchen, das eine instabile Datenverbindung signalisiert.
