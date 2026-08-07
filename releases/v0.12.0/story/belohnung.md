# Belohnung – Zeremonie & Aura-Master-Zertifikat

Abschluss nach allen vier Levels, seit **v0.7.0 zweistufig**:
zuerst die **Zeremonie** (`#screen-finale`), danach das **Zertifikat** (`#screen-reward`).

**Aktueller Ist-Zustand (Umsetzung):**
![Belohnung im Spiel](images/screens/belohnung.png)

> Vorlage: PDF-Folie „Belohnung“ (Aura-Master-Zertifikat, Halle der Chronisten,
> Ranking, Bewertung/Anregungen; Bild „3/3 Schlüssel gefunden“).

---

## Zweck

Erfolgserlebnis, Zusammenfassung der Leistung, Feedback einsammeln, Wiederspielanreiz.

## Layout & Elemente

- **Zertifikat** (goldgerahmt): ✅
  - Siegel „NEXUS DATA“, Titel „AURA-MASTER-ZERTIFIKAT“, Zeile „Halle der Chronisten“.
  - Avatar-Portrait, „verliehen an“ + **Codename** (oder Avatar-Name).
  - **Kennzahlen:** `Schlüssel X/4` · `Punkte` · `Rang (S/A/B/C)`.
  - **Rang-Spruch** (je nach Punktezahl), Fußzeile mit Klassen-Code + Datum.
- **Seitenspalte** (nicht im Druck): 🟡
  - **KLASSEN-RANKING** (ab v0.8.0) – nach Klassencode gefiltert, Spalten
    Rang (🥇🥈🥉) · Name · Punkte Gesamt · Gefundene Open Data Sets; die eigene Zeile ist
    hervorgehoben („Du belegst Platz X von Y!"). Das Ergebnis wird beim Betreten
    **automatisch** eingetragen (kein Absende-Button).
    **Export/Import**: Da es keinen Server gibt, liegt die Liste lokal im Browser;
    über die beiden Buttons lassen sich Ergebnisse mehrerer Geräte auf einem
    Rechner zusammenführen.
  - **BEWERTUNG & ANREGUNGEN** – Freitextfeld + „Feedback speichern“.
  - Buttons **„🖨 Zertifikat drucken“** und **„Nochmal spielen“**.
- **Konfetti** beim Betreten. 🟡
- **Auszeichnung** (nur wenn in der 360°-Stadt verdient): 🏆-Symbol + Badge
  „Open-Data-Hero & Datenschutz-Experte“ sowie eine **Level-Übersicht mit Punkten**.
  Beides wird **mitgedruckt** (Teil des Zertifikats, nicht der Seitenspalte).

## Vorgeschaltete Zeremonie (`#screen-finale`) – ab v0.7.0

Spec-Quelle: [levels/level-4-prisma-der-stadt.md](levels/level-4-prisma-der-stadt.md),
Abschnitt „Großes Finale“.

Ablauf in Beats: Stadt erstrahlt in Neon-Blau → Avatar betritt die Bühne →
**Ansprache der Bürger-KI** → **Level-Übersicht mit Punkten** → rotierender
**Cyber-Pokal** → **Badge** → Schlusssatz „Transparenz schafft Vertrauen …“.

- **Überspringbar** („Überspringen »“) und **beliebig wiederholbar** – sowohl über
  „ZUM FINALE →“ nach dem letzten Level als auch über die Missionskarte.
- Der Halle-Eintrag bleibt dabei **einmalig** (`hallSaved`-Guard im Zertifikat).
- Bei `prefers-reduced-motion` erscheinen alle Beats sofort.
- Die Level-Übersicht nutzt die **tatsächliche** Zuordnung (L1 API/JSON, L2 Open Data,
  L3 Quellenprüfung, L4 Diagramme + 360°) – die Spec nannte noch die Reihenfolge vor v0.5.0.

## Inhalte aus der Vorlage ✅

- Aura-Master-Zertifikat · Eintrag in der Halle der Chronisten · Bewertung & Probleme,
  Schwierigkeiten sowie Anregungen · Ranking mit erreichter Punkteanzahl.

## Ränge (nach Gesamtpunkten) ✅

Die Schwellen sind **prozentual** (`screens.js → rankFor()`), damit zusätzliche
Bonuspunkte die Ränge nicht entwerten. Seit v0.8.0 sind **5800** Punkte erreichbar
(5200 aus den Leveln + 600 Wissens-Bonus, siehe [allgemein.md](allgemein.md)).

| Rang | ab % | entspricht heute | Titel |
|------|------|------------------|-------|
| **S** | 90 % | 5220 | Legendäre:r Chronist:in |
| **A** | 70 % | 4060 | Meister-Archivar:in |
| **B** | 50 % | 2900 | Daten-Detektiv:in |
| **C** | 0    | 0    | Aura-Lehrling |

## Verhalten / Interaktion

- Beim ersten Betreten wird der Lauf **einmalig** in die Halle der Chronisten eingetragen. 🟡
- **Drucken** öffnet den Druckdialog; nur das Zertifikat wird gedruckt (Druck-Layout). 🟡
- **Nochmal spielen** setzt den Spielstand zurück → Startseite. 🟡
- **Feedback speichern** legt den Text lokal ab (`nexusdata.save.feedback`). 🟡

## Angenommene Entscheidungen (MVP)

- **Schlüssel „X/4“** statt „3/3“ (Bild in der Vorlage): im MVP 1 Schlüssel pro Level.
  🟡 *Änderbar*, siehe [allgemein.md](allgemein.md) §7.
- Rangstufen, Rang-Sprüche, Konfetti und das druckbare Zertifikat sind ergänzt. 🟡
- **Halle der Chronisten = lokale** Bestenliste (nur dieses Gerät/Browser). 🟡

## Umsetzung im MVP

- Markup: `game/index.html` → `section#screen-reward`
- Style: `game/css/style.css` → Abschnitt „REWARD / certificate“ + `@media print`
- Logik: `game/js/screens.js` → `renderReward()`, `rankFor()`, `renderHall()`, `saveFeedback()`
- Bestenliste: `game/js/state.js` → `getHall()`, `addToHall()`

## Offene Punkte & Iterationsideen

- 💡 **Klassenweite Bestenliste** (Backend) statt nur lokal.
- 💡 Zertifikat als PDF/Bild zum Download + personalisiertes Design.
- 💡 Feedback strukturierter erfassen (Skala + Kategorien) und exportierbar machen.
- 💡 Detail-Auswertung je Level (Fehlversuche, genutzte Tipps) auf dem Zertifikat/Bericht.

## Anweisung zur Korrektur: „Zum Finale“-Button & Zertifikats-Weiterleitung

### Ziel
Der „Zum Finale“-Button (#screen-finale) im Reward-Screen muss funktionsfähig gemacht, korrekt positioniert und visuell auffällig gestaltet werden, damit Nutzer problemlos zur finalen Zeremonie und dem anschließenden **Aura-Master-Zertifikat** weitergeleitet werden.

### Technische Änderung!!
1. **Klickbarkeit & Event-Listener sicherstellen:**
   - Der Button muss im DOM aktiv sein und darf nicht durch andere CSS-Ebenen (z. B. fehlerhaftes z-index oder verdeckende Elemente wie auf dem Screenshot) blockiert werden.
   - Beim Klick muss die Logik greifen, die den Übergang zum Finale und zur Belohnungs-Ansicht (#screen-reward mit Zertifikat, Rängen und Halle der Chronisten) auslöst.

2. **Visuelles Redesign & Positionierung:**
   - Den Button aus dem Textbereich des Open-Data-Hero-Awards herausnehmen.
   - Den Button stattdessen klar sichtbar – beispielsweise **rechts neben dem Avatar** oder in einem separaten Aktionsbereich – platzieren.
   - Einen **pulsierenden Neon-Blink-Effekt** hinzufügen, damit sofort ersichtlich ist, dass man hier klicken kann.

---

## ✅ Umsetzung v0.9.0 (Finale-Button)

### Die Ursache: der Knopf war wirklich tot, nicht bloß unauffällig

Der Knopf gehört nicht zum Level 4, sondern zum **gemeinsamen Erfolgs-Overlay**
(`.level-success`, `screens.js → completeLevel()`). Nach dem letzten Level lagen zwei
deckende Overlays übereinander:

| Element | z-index | wo |
|---|---|---|
| `.city-finale` (Open-Data-Hero-Award) | **12** | in der 360°-Stadt |
| `.level-success` (Schlüssel + Weiter-Knopf) | 5 | im Level-Rahmen |

Beide lagen im **selben** Stacking-Context, weil keiner ihrer Vorfahren einen
eigenen erzeugte – also gewann 12 gegen 5 und das Award-Panel deckte den Knopf zu.
Bei sehr hohen oder sehr flachen Fenstern rutschte er darunter hervor: daher das
„manchmal geht es doch". Level 3 war nie betroffen, weil sein `.lb-corridor` einen
eigenen Stacking-Context hat.

**Behoben an drei Stellen:**

1. **Ursachen-Fix:** `.level-body` bekommt `position: relative; z-index: 0` und damit
   einen eigenen Stacking-Context. Alles, was ein Level intern übereinanderlegt, ist
   jetzt garantiert unter dem Erfolgs-Overlay – auch für künftige Level.
   `.level-success` liegt zusätzlich auf `z-index: 20`.
2. **Aufräumen:** `level4.js → cityFinale()` entfernt das Award-Panel, **bevor**
   `ctx.complete()` das Erfolgs-Overlay setzt. Zwei Overlays treffen nie mehr
   aufeinander.
3. **Regressionsschutz:** eine Testprüfung stellt sicher, dass die Stacking-Regel
   nicht wieder verloren geht.

### Redesign & Position

* Der Knopf steht in einem **eigenen Aktionsbereich** (`.level-success-actions`) –
  abgesetzt, mit Rahmen, außerhalb des Fließtextes.
* **Links das Porträt des gewählten Avatars, rechts daneben der Knopf** – wie in der
  Anweisung beschrieben; darunter eine Zeile „Zeremonie & Aura-Master-Zertifikat".
* **Pulsierender Neon-Blink** über die gemeinsame Klasse `.btn-cta` (akzentgefärbt,
  passt in jedem Level). Bei `prefers-reduced-motion` bleibt ein statischer Glanz.
  Dieselbe Klasse trägt jetzt auch „ZUM FINALE →" auf der Missionskarte.
* Der Knopf bekommt beim Einblenden den **Fokus** – der Tastaturweg ist so kurz wie
  der Mausweg.

### Zusätzlich: der Rückweg

Vom Zertifikat führte bisher **kein** Weg zurück in die Zeremonie – erneut erreichbar
war sie nur über „Nochmal spielen", das den Spielstand löscht. Neu:
**„‹ Zurück zur Zeremonie"** in der Aktionszeile (nicht im Druck). Der
`hallSaved`-Guard sorgt weiterhin dafür, dass der Halle-Eintrag einmalig bleibt.

### Sprachausgabe

Tipps und Info-Texte lassen sich vorlesen, die Bürger-KI meldet sich mit ihrer
Aufnahme – siehe [audio/stimme.md](audio/stimme.md).