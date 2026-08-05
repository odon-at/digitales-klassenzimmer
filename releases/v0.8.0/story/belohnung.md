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

## Ränge (nach Gesamtpunkten, max. 400) 🟡

| Rang | ab Punkten | Titel |
|------|-----------|-------|
| **S** | 360 | Legendäre:r Chronist:in |
| **A** | 280 | Meister-Archivar:in |
| **B** | 200 | Daten-Detektiv:in |
| **C** | 0   | Aura-Lehrling |

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
