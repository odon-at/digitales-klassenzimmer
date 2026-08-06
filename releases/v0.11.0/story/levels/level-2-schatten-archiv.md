# Level 2 – Das Schattenarchiv

## **1. Kopfbereich & Einleitung**
 **Tief im Schatten-Archiv liegen die ersten Datenfragmente. Auch der Nebel hat Datensätze beschädigt. Prüfe die offenen Datensätze, finde die unmöglichen Werte, korrigiere sie, nur saubere Daten öffnen das Schloss.**

**Checkliste (Fortschritt):**
  * [ ] Verständnis: Open Data
  * [ ] Datensatz prüfen
  * [ ] Falschen Wert korrigieren
  * [ ] Schlüssel finden
**Anleitung ganz oben:**
  * "Das Problem: Alle geschützten, internen Systemdaten wurden vom Hacker verändert – sie sind nicht mehr vertrauenswürdig!
 Die einzige Rettung: Öffentlich zugängliche Daten (Open Data). Da Open-Data-Archive unabhängig und frei zugänglich gespeichert sind, konnte der Hacker sie nicht verfälschen.
 Deine Mission: > Begib dich sofort zur öffentlichen Datenbehörde. Suche dort im Schattenarchiv nach den unverfälschten Open-Data-Datensätzen. Nur mit diesen echten, öffentlichen Daten kannst du die gefälschten Angaben abgleichen, die Stadt retten und die Kontrolle zurückholen!
 [ MISSION STARTEN → ]"

---



---

## 🎨 2. DESIGN-SYSTEM & VISUELLER STIL

**Hintergrund:** Dunkles Midnight-Blue / Slate (#0a0e17) mit dezentem Cyber-Gitter (rgba(0, 243, 255, 0.05)) und sehr feinen Platinen-Linien (PCB Traces) im Hintergrund.
**Haupt-Farbe (Vordergrund & UI):** Neonblau / Cyan (#00f3ff).
**Akzent-Glow:** Äußeres Leuchten (box-shadow: 0 0 15px rgba(0, 243, 255, 0.4)).
**Schriftart:** Monospace (Fira Code, Roboto Mono, Courier New).

---

## 🔄 3. INTERAKTIONS-LOGIK & FEHLER-SPEZIFIKATION

### Zustand 1: Initialer Zustand (Spielstart)
**Oben:** Nur die zentrierte, weiße URL-Eingabezeile (URL: ...) ist sichtbar.
**Mitte:** Das Open-Data-Portal der **Datenbehörde Nexus** mit den 7 Kategorien ist noch **vollständig ausgeblendet / unsichtbar**.
**Unten:** Die untere Tabelle mit den gehackten Systemdaten ist bereits von Anfang an sichtbar und enthält folgende konkrete Manipulationen/Fehler:
  1. **Strom & Energie:** Der Wert ist fälschlicherweise auf 1 kWh manipuliert (Kritischer Unterverbrauch/Systemausfall).
  2. **Sicherheit & Standortdaten:** Die Notrufzentralen stehen fälschlicherweise auf 0 (Kritischer Sicherheitsausfall).
  3. **Demografie:** Die Einwohnerzahl steht fälschlicherweise auf 15 Einwohner (Falschwert).
  4. **Verkehrs- & Lichtsignale:** Die Ampelsteuerung steht auf Manuell / Ausfall statt Automatisch.
  5. **Trinkwasser:** Der Zustand ist auf Gefährliche Chemikalien manipuliert (Falschalarm).

### Zustand 2: Nach Klick auf "Abschicken"
1. Schülerin klickt auf die URL-Zeile ➔ Vorschlag `https://datenbehoerde-nexus.gv.at/stadt-open-data` erscheint.
2. Schülerin klickt auf den Button [ Senden ].
3. Das obere Open-Data-Behördenfenster der **Datenbehörde Nexus** **poppt/klappt unterhalb der URL-Zeile auf** und zeigt die 7 Kategorien.
4. **LAYOUT-REGEL:** Das Aufklappen geschieht oberhalb der unteren Tabelle. Die untere Tabelle wird **niemals verdeckt, verkleinert oder verschoben**!

---

### 📐 4. UI-LAYOUT & SCREEN-AUFBAU (ZUSTAND 2)

text+-----------------------------------------------------------------------------------+
|  URL: [ [https://datenbehoerde-nexus.gv.at/stadt-open-data](https://datenbehoerde-nexus.gv.at/stadt-open-data)      ]  [  SENDEN  ]   |  <-- Immer oben zentriert
+-----------------------------------------------------------------------------------+
|  🌐 OBERE HÄLFTE: Datenbehörde Nexus Portal (Ploppt erst nach "Senden" auf!)      |
|  * Fixed Height / Feste Höhe                                                      |
|  * Zeigt die 7 wählbaren Kategorien (Strom, Wasser, etc.)                         |
|  * Beim Klick auf eine Kategorie öffnet sich die Detail-Box im selben Bereich!     |
+-----------------------------------------------------------------------------------+
|  🌈 DATENQUALITÄT: [ Rosa ========= Gelb ========= Grün ] ( 35% )                 |  <-- Regenbogen-Balken
+-----------------------------------------------------------------------------------+
|  🖥️ UNTERE HÄLFTE: Internes Stadt-System (FORMULAR / TABELLE)                      |
|  * Von Anfang an dauerhaft sichtbar!                                              |
|  * Enthält gehackte Daten mit konkreten Systemfehlern/Abweichungen                |
|  * Eingabefelder STRENG OHNE Autocomplete & OHNE gespeicherte Lösungen!  
         |
+-----------------------------------------------------------------------------------+

### Ende vom Level 2 nach erfolgreicher Mission

 **System-Break: Chill-Out-Phase (10 Minuten)**

Die gehackten Daten wurden erfolgreich abgeglichen und korrigiert. Die Server laufen wieder stabil. Zeit für einen kurzen Reality-Check und eine Pause, um den Kopf freizukriegen.

text+---------------------------------------------------+
|               REAL-LIFE BREAK (10 MIN)            |
|                                                   |
|  [████████████░░░░░░░░] Bildschirm-Pause...        |
|                                                   |
|  Verbleibende Zeit: 10:00 Minuten                 |
|  Status: Offline-Modus aktiv                       |
|                                                   |
|  Was du in diesen Minuten machen kannst:          |
|  1. Lüften (Fenster auf, frische Luft reinlassen) |
|  2. Trinken (Schluck Wasser gegen den Durst)      |
|  3. Bewegung (Aufstehen, rumlaufen, strecken)     |
|  4. Kurzer Blick raus (Augen entspannen lassen)   |
|  5. Screen-Detox (Weg vom Monitor, Augenruhe)     |
|  6. Mini-Snack (Energiekick für den Kopf holen)   |
+---------------------------------------------------+

Verbesserung für Usability:

Statt dem Satz , lieber das oberhalb der URL-Adresse schreiben, es sollte offensichtlicher und klar von den Spieler erkennbar sein: Die internen Systemdaten wurden manipuliert. Öffne das Open-Data-Portal der Datenbehörde Nexus, vergleiche die echten Werte und korrigiere die gefälschten Einträge unten.

## DIE INTERNEN SYSTEMDATEN WURDEN MANIPULIERT!

# 1. Öffne das Open Data Portal der Datenbehörde Nexus
# 2. Vergleiche die echten Werte
# 3. Korrigiere die gefälschten Einträge unten

--------------------------------------------------
>> FOLGE DEN ANWEISUNGEN UND GIB DIE DATEN UNTEN EIN <<<
--------------------------------------------------

Statt Wähle eine Kategorie, um den echten Open-Data-Wert zu sehen. , sollte das stehen: Klicke oben auf eine Kategorie-Schaltfläche (zum Beispiel Strom und Energie), um den echten Open-Data-Wert anzuzeigen und mit den kompromittierten Systemdaten zu vergleichen.

---

## ✅ Umsetzung v0.10.0

Der kleine Hinweissatz ist durch einen **großen Ansage-Block** direkt über der
URL-Zeile ersetzt (`.instr-brief`, erstes Kind von `.l1-root`):

```
⚠ DIE INTERNEN SYSTEMDATEN WURDEN MANIPULIERT!
   1. Öffne das Open-Data-Portal der Datenbehörde Nexus
   2. Vergleiche die echten Werte
   3. Korrigiere die gefälschten Einträge unten
   ▸ FOLGE DEN ANWEISUNGEN UND GIB DIE DATEN UNTEN EIN
```

Der Platzhalter im Detail-Feld heißt jetzt: „Klicke oben auf eine
Kategorie-Schaltfläche (zum Beispiel Strom und Energie), um den echten
Open-Data-Wert anzuzeigen und mit den kompromittierten Systemdaten zu vergleichen."

Texte in `game/js/data/datasets.js → level2.brief` / `level2.detailHint`.
Schreibweise „Open-Data-Portal" wie im Fließtext der Spec (der ASCII-Block darüber
lässt die Bindestriche weg).

### Verbesserung  Level 2: Trinkwasser-Sensor (pH-Wert)

---

## 🚨 **Szenario & Problemstellung**
Am unteren Bildschirmrand wird der Trinkwasser-Sensor angezeigt.
Der gemessene **pH-Wert von 14** ist unmöglich (der Skalenbereich geht von 8 bis 14, bzw. der Wert ist fehlerhaft).
Im **Open Data Portal** gibt es für diesen Sensor **keinen Vergleichswert**.
Die Anweisung besagt: Muss alles als ungültig/fehlerhaft gemeldet werden.

---

# **Der Wert ist unplausibel und im Open Data Portal steht kein Vergleichswert, was tust du?**
(Hinweis: Diese Frage muss besonders dick, auffällig und gut sichtbar dargestellt werden!)

---

### **Wähle deine Option (Gleichwertig, beide Auswahlmöglichkeiten sind gelich gut sichtbar, also sowohl A, als auch B.):**

**[  ] A)** Wert durch eine plausible Vermutung ersetzen, z. B. auf 7,2 korrigieren.
**[  ] B)** Als fehlende Null markieren und Nachmessung beim Sensor anfordern.
---

## ✅ Umsetzung v0.11.0 (pH-Frage)

**Die Frage ist jetzt das Auffälligste auf dem Bildschirm.** Sie stand vorher in
`.hint` – der kleinsten und blassesten Textklasse des Spiels. Neu steht sie in einem
eigenen Kasten (`.instr-question`): 1,15 rem, fett, mit ⚠-Symbol, Rahmen und Glow, in
derselben Bildsprache wie die Ansage-Blöcke darüber. `role="status"`, also auch für
Screenreader. Die Begründung darüber („Die pH-Skala reicht nur von 0 bis 14 …") ist
von der kleinen `.hint` auf normale Lesegröße gewechselt.

**Beide Optionen sind wirklich gleich sichtbar – vorher war das ein Fehler.**
Der Code wählte die Button-Klasse anhand des Richtig-Flags:

```js
class: 'btn ' + (o.ok ? 'btn-neon' : 'btn-ghost')     // vorher
```

Die **richtige** Antwort leuchtete also als Hauptknopf, die falsche war blass
ausgegraut – die Lösung war zu sehen, bevor man nachdachte. Jetzt tragen beide
dieselbe Klasse `.choice-btn`: gleiche Farbe, gleiche Größe, gleicher Rahmen,
unterschieden nur durch das Badge **(A)** / **(B)** und den Text. Das Richtig-Flag
wertet ausschließlich der Klick-Handler aus – so, wie es die Verdikte in Level 3 und
die Entscheidungen in Level 4 längst tun.

Eine falsch probierte Option wird sichtbar markiert (gestrichelt, ✖ am Badge) und die
Frage bleibt bedienbar; jeder Fehlversuch kostet weiterhin 30 Punkte. **An den Punkten
ändert sich nichts** (6 Teilaufgaben, 1000 erreichbar).

> **Sachliche Korrektur:** Die Spec oben schreibt „der Skalenbereich geht von 8 bis 14".
> Die pH-Skala reicht von **0 bis 14** – so steht es auch im Glossar in
> [../allgemein.md](../allgemein.md). Der Spieltext nennt weiterhin den korrekten
> Bereich. Unplausibel ist der Wert 14 nicht, weil er außerhalb der Skala läge, sondern
> weil Trinkwasser mit pH 14 Natronlauge wäre.
