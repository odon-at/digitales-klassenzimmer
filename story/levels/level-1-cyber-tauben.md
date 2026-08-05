# Level 1 – Flug der Cyber-Tauben

**Untertitel:** Die lautlosen Boten
**Akzentfarbe:** Violett (#8A2BE2)
**Lernfokus:** API-Abfrage, API-Token, JSON-Datenformat

---

## 1. Visuelles Konzept: Das Flughafen-Kontrollzentrum (Tower-Ansicht)

Das gesamte Interface verwandelt sich in ein authentisches **Fluglotsen-Kontrollzentrum (Control Tower)**:
**Die Umgebung:** Dunkle, matte Bedienpulte im schicken Dark-Mode mit glühenden violetten Neon-Akzenten, leuchtenden Status-Displays und großen Panoramafenstern mit Blick auf das digitale Stadtnetz.
**Das Hauptterminal (Links):** Der API-Request-Builder ist nahtlos in ein futuristisches Steuerpult eingebettet.
**Der Ausrüstungs-Hangar (Rechts):** Rechts neben den Konsolen befindet sich eine große Andockstation. Hier sitzt die Cyber-Taube in Übergröße bereit. Vor dem Absenden sieht der Spieler live, wie die Pergamentrolle mit dem API-Token in den Schnabel der Taube geladen und fixiert wird.

---

## 2. Story (Vorlage) & Intro-Ablauf ✅

 Die Glasfaserkabel der Stadt sind vom Hacker besetzt. Jedes Bit, das wir senden, wird abgefangen. Es gibt nur einen Weg vorbei an der Firewall: Die **Cyber-Tauben**. Diese mechanischen Boten fliegen über die Funklöcher hinweg. Du musst sie programmieren, damit sie die Rettungspakete direkt ins Herz der Stadtverwaltung tragen.

### Animierter Intro-Ablauf:
1. **Ausstattungs-Phase:** Die Pergamentrolle mit dem freigeschalteten Token gleitet animiert in den Schnabel der großen Cyber-Taube im rechten Hangar.
2. **Anflug der Taube:** Eine sehr große Cyber-Taube (Cybertaube.png) hebt ab und fliegt von rechts nach links über den Bildschirm, um volle Aufmerksamkeit zu erzeugen.
3. **Landung & Interaktion:** Die Taube landet zentriert auf dem Kontrollpult. Der Spieler klickt auf die Taube oder die Rolle (Pergamentrolle.png), um fortzufahren.
4. **Token-Reveal:** Die Taube fliegt in Richtung des Stadtpanoramas ab, während sich die Pergamentrolle zentriert öffnet und den API-Token (NX-TOKEN-7F3A-9K2D) preisgibt.
5. **Token-Übertragung:** Der API-Code fliegt animiert direkt in das vorgesehene Eingabefeld des Request-Builders.

---

## 3. Lernziel & Aufgaben (Checkliste) ✅

Verstehen, wie man Daten über eine **API** abfragt: **Endpunkt** wählen, **API-Token** einsetzen, Antwort als **JSON** empfangen.

**Boten programmieren:** API-Abfrage im Tower-Terminal konfigurieren.
**API-Token nutzen:** Den freigeschalteten Schlüssel korrekt einbinden.
**Paket empfangen:** Strukturierte Daten im JSON-Format einlesen.

---

## 4. Die detaillierte Stadtkarte & Flug-Animation

Nach dem Klick auf „🕊 Anfrage senden“ verlagert sich das Geschehen auf die interaktive **Vektor-Stadtkarte (Live-Karten-Monitor)**:
**Die Stadtlandschaft:** Eine isometrische 2D-Ansicht im Cyber-Look mit detailreichen Elementen wie markanten Towers/Hochhäusern, Brücken über Flüsse, leuchtenden Straßenschluchten, Server-Knotenpunkten und kleinen Parkanlagen (Bäume).
**Der Flugweg:** Die voll ausgestattete Cyber-Taube startet aus dem rechten Hangar und fliegt quer über die echte Stadtkarte, zieht eine digitale Daten-Spur hinter sich her und manövriert vorbei an den Gebäuden und Brücken direkt zum Ziel.

---


### 1. Linkes Panel: Das Ausrüstungs-Regal (Schritt-für-Schritt Freischaltung)
**Ebene 1 (URL / Zieladresse):** Von Beginn an freigeschaltet.
**Ebene 2 (HTTP-Methode - GET/POST):** Gesperrt, bis eine URL in Ebene 1 gewählt wurde.
**Ebene 3 (API Token / Passierschein):** Gesperrt, bis eine Methode in Ebene 2 gewählt wurde.
**Hilfestellung-Tooltips (Kontext ohne Spoiler):**
  * [URL]: "Navigations-Modul: Zeigt der Cyber-Taube die genaue Internet-Adresse des Daten-Nests."
  * [METHODE]: "Handlungs-Befehl: Bestimmt, ob die Taube etwas abholen (GET) oder überbringen (POST) soll."
  * [API TOKEN]: "Passierschein: Ein digitaler Sicherheitsschlüssel, der dem Server zeigt, ob die Taube Zutritt hat."

### 2. Mittleres Panel: Tauben-Missionsstation
Zeigt die interaktive Cybertaube (Cybertaube.png).
Spielt Koppelungs-Animationen ab, wenn Items ausgewählt werden.
Enthält den Haupt-Aktionsbutton: [ TAUBE LOSSCHICKEN! ] (Deaktiviert, bis Ebene 1, 2 und 3 ausgefüllt sind).

### 3. Rechtes Panel: Code-Vorschau Terminal
Zeigt in Echtzeit den generierten HTTP-Request-Code in Computersprache an.

---

## 🕹️ ABLAUFLOGIK & GAMEPLAY-FLOW
1. Spieler wählt URL $\rightarrow$ Ebene 2 schaltet frei.
2. Spieler wählt Methode (GET) $\rightarrow$ Ebene 3 schaltet frei.
3. Spieler wählt API Token $\rightarrow$ Button [ TAUBE LOSSCHICKEN! ] leuchtet lila auf.
4. Klick auf den Start-Button löst STATE_MAP_TRANSITION aus.
5. Landkarte öffnet sich; Cybertaube.png startet den animierten Flug (STATE_IN_FLIGHT) über der Karte.

---

## ⚠️ FEHLERHANDHABUNG & VALIDIERUNG MATRIX

Sobald die Taube den Ziel-Server auf der Landkarte erreicht, wird die Auswahl geprüft:

| Fehler-Szenario | Ursache | Visuelles Feedback / Animation | Status-Code & Meldung |
| :--- | :--- | :--- | :--- |
| **Falsche URL** | Falsche Adresse gewählt | Taube fliegt vom Kurs ab und landet auf einem toten Masten (STATE_FAIL_FLIGHT). | 404 Not Found<br>"Adresse existiert nicht im Netzwerk!" |
| **Kein / Falsches Token** | Falscher Sicherheitsschlüssel | Ein Türsteher-Falke (Security-Bot) blockiert den Server-Eingang. | 401 Unauthorized<br>"Zugriff verweigert! Kein gültiger Sicherheitsschlüssel." |
| **Falsche Methode** | POST statt GET gewählt | Server-Knoten verweigert die Herausgabe der Daten. | 405 Method Not Allowed<br>"Falsche Methode! Erwarte Daten-Abholung (GET)." |

---

## 📦 DATEN-ABRUF & TRANSFORMATION

1. **Erfolgs-Pfad:**
   * Der Türsteher-Falke winkt die Taube durch.
   * Das Paket (Zylinder) wird dynamisch an die Krallen von Cybertaube.png gekoppelt.
   * Spielt STATE_RETURN_FLIGHT zurück ins Terminal ab.
2. **Das Papierrollen-Chaos:**
   * Die Taube klinkt das Paket im Terminal aus.
   * Ein unleserlicher, endloser Rohdaten-Papierstreifen rollt sich über den Bildschirm aus.
   * Das Terminal blinkt rot: ERR_UNREADABLE_STREAM.
3. **Der Scan-Vorgang:**
   * Spieler klickt auf den Button **[ SCAN & IN JSON UMWANDELN ]**.
   * Ein lila Laser-Strahl fährt über den Papierstreifen.
4. **Zwei Ansichten entstehen:**
   * **Maschinen-Ansicht:** Sauber strukturiertes JSON-Format.
   * **Menschen-Ansicht (Human Dashboard):** Übersichtliche Interface-Karten mit den übersetzten Stadt-Daten.

---

## 💡 ERKLÄR-TEXT IM SPIEL (SPRECHBLASE / MODAL)

Nach dem Scan erscheint folgender Text als Info-Box im Spiel:

 💬 **SYSTEM-MESSAGE:**
 * ❌ **Das Problem (Papierstreifen):** Ein Computer kann nicht raten! In einer ununterbrochenen Textwurst (Tagesverbrauch1Notrufzentrale0) weiß das System nicht, wo eine Zahl anfängt und ein Begriff aufhört.
 * ✅ **Die Lösung (JSON-Format):** JSON beschriftet jede Info mit einem festen Etikett: "Schlüssel": Wert (z. B. "Tagesverbrauch": 1). Durch die Ordnung in geschweiften Klammern { } liest der Computer die Daten in Millisekunden fehlerfrei aus!

---

## 📊 DATENSATZ (JSON & DASHBOARD)

### JSON-Ausgabe (Maschinen-Code):
json{
  "energie": {
    "kennzahl": "Tagesverbrauch_kWh",
    "wert": 1
  },
  "sicherheit_und_standort": {
    "kennzahl": "Notrufzentrale",
    "status": 0
  },
  "demografie": {
    "kennzahl": "Einwohnerzahl",
    "wert": 15
  },
  "verkehr_und_lichtsignale": {
    "kennzahl": "Ampelsteuerung",
    "status": "manuell / ausfall"
  },
  "trinkwasser": {
    "kennzahl": "Zustand",
    "status": "gefaehrliche_chemikalien"
  }
}

## Wichtige Verbesserung zu Beginn des Level 1:

 Story & Vorbereitung im Tower (Kein Intro-Einflug)

Die Glasfaserkabel der Stadt sind vom Hacker besetzt. Jedes Bit, das wir senden, wird abgefangen. Es gibt nur einen Weg vorbei an der Firewall: Die **Cyber-Tauben**. Diese mechanischen Boten fliegen über die Funklöcher hinweg. Du musst sie programmieren, damit sie die Rettungspakete direkt ins Herz der Stadtverwaltung tragen.

**Ausstattung & Ablauf im Kontrollzentrum:**
**Kein automatisches Start-Intro:** Die Taube fliegt zu Beginn **nicht** unaufgefordert mit dem API-Token über den Bildschirm. 
**Ausstattung am Hangar:** Das Tower-Panorama mit Blick auf die Stadt ist sofort da. Der Spieler wählt Schritt für Schritt die URL, die Methode und das API-Token aus. Dabei sieht man, wie die Pergamentrolle mit dem Token in den Schnabel der Cyber-Taube geladen und sie im Hangar **ausgestattet** wird.
**Der echte Missions-Flug:** Erst wenn alles bereit ist und der Spieler auf den Button **[ TAUBE LOSSCHICKEN! ]** klickt, hebt die fertig ausgestattete Taube ab und fliegt animiert über die Vektor-Stadtkarte zum Ziel!

## 🖼️ ÄNDERUNG: BILD-AKTUALISIERUNG

* Das Bild der Cyber-Taube in Level 1 (`cybertaube.png`) wird durch die neue Version der cybertaube.png ersetzt.

> **Umsetzung v0.8.0:** Der Code lädt die Taube unverändert aus
> `game/media/cybertaube.png`. Eine **neue Bilddatei lag nicht bei** – sobald sie
> unter demselben Namen abgelegt wird, greift sie automatisch (Level 1 Hangar,
> Kartenflug). Es ist keine Code-Änderung nötig.

---

## ✅ Umsetzung v0.8.0 (Kein Intro-Einflug)

* Das automatische Start-Intro ist **entfernt**: kein Einflug, kein Token-Reveal-Overlay.
* Der Tower mit dem **Ausrüstungs-Hangar** steht ab dem ersten Frame.
* Die Taube wird **schrittweise ausgerüstet**: Mit der Token-Wahl gleitet die
  Pergamentrolle animiert in den Schnabel, der Token-Speicher füllt sich, und die
  Statuszeile im Hangar führt durch die drei Schritte.
* Der Flug über die Vektor-Stadtkarte startet **ausschließlich** über
  **[ TAUBE LOSSCHICKEN! ]**.

  Verbesserung für Userbility:

  ## 📋 Aufgabenübersicht für Level 1

Arbeite die folgenden 3 Aufgaben exakt in dieser Reihenfolge von oben nach unten ab: Die Aufgaben sollten übersichtlicher und klarer strukturiert werden, damit die Spieler sofort wissen, was nacheinander zu tun ist. 

---

### 1️⃣ Aufgabe 1: Ziel-URL / Adresse auswählen
**Was zu tun ist:** Wähle unter der Kategorie **(1) URL / Zieladresse** die korrekte Ziel-Adresse aus.
**Mögliche Optionen:**
  - opendata.nexus.city/v1/stadtsystem (Empfohlen)
  - intranet.nexus.local/system (internes, gehacktes Netz)
  - daten-download.fog/paket (verdächtig)
**Ziel:** Die Zieladresse im HTTP-Request-Feld festlegen.

---

### 2️⃣ Aufgabe 2: HTTP-Methode festlegen
(Erst durchführen, wenn Aufgabe 1 erledigt ist)

**Was zu tun ist:** Wähle unter der Kategorie **(2) HTTP-Methode** die passende Aktion aus.
**Mögliche Optionen:**
  - GET (zum Abrufen und Holen von Daten)
  - POST (zum Senden von Daten)
**Ziel:** Die Methode GET aktivieren, um Daten aus dem Daten-Nest abzufragen.

---

### 3️⃣ Aufgabe 3: API-Token / Passierschein einsetzen & Taube losschicken
(Erst durchführen, wenn Aufgabe 1 & 2 erledigt sind)

**Was zu tun ist:** 1. Wähle aus dem **Token-Speicher (3)** einen gültigen Passierschein aus (z. B. NX-TOKEN-7F3A-9K2D).
  2. Überprüfe die Vorschau im **HTTP-REQUEST (Vorschau)**.
  3. Klicke auf den Button **TAUBE LOSSCHICKEN!**.
**Ziel:** Das Datenpaket abrufen und den unlesbaren Rohdaten-Strom erfolgreich in sauberes **JSON** umwandeln.

---

## ✅ Checkliste für Spieler

[ ] **Schritt 1:** URL opendata.nexus.city/v1/stadtsystem ausgewählt
[ ] **Schritt 2:** HTTP-Methode GET gewählt
[ ] **Schritt 3:** Gültiges API-Token zugewiesen & Button **"TAUBE LOSSCHICKEN!"** gedrückt

## Info-Button und Tipp-Button

Info-Button und Tipp-Button sollte neben der Aufgabenstellung stehen, damit es direkt sichtbar ist. 

### Hinweis auf der Hauptseite (vor dem Oeffnen der Info)

Hinweis fuer Extrapunkte:
Klicke auf INFO und gehe die 5 Knoten nacheinander durch! Sobald du alle Knoten der Reihe nach angeklickt hast, wird eine Bonusfrage freigeschaltet, mit der du dir zusaetzliche Punkte sichern kannst.

---

# Info-Fenster: Was ist eine API?

## HOLOGRAMM - DER WEG EINER DATEN-ANFRAGE

Folge dem Pfad der Reihe nach: Tippe immer den aktuell hervorgehobenen Knoten an.

[ 1. Programm ] - (Klick mich an!)
  (Nach dem Klick schaltet sich der naechste Knoten frei)

[ 2. Anfrage ] - (Gesperrt -> wird zu: Klick mich an!)
  (Nach dem Klick schaltet sich der naechste Knoten frei)

[ 3. API ] - (Gesperrt -> wird zu: Klick mich an!)
  (Nach dem Klick schaltet sich der naechste Knoten frei)

[ 4. JSON ] - (Gesperrt -> wird zu: Klick mich an!)
  (Nach dem Klick schaltet sich der naechste Knoten frei)

[ 5. Server ] - (Gesperrt -> wird zu: Klick mich an!)
  (Nach dem Klick wird die Bonusfrage freigeschaltet)

---

## Bonusfrage (Freigeschaltet nach dem 5. Knoten)

Super! Du hast den gesamten Weg schrittweise erkundet. Beantworte jetzt die Bonusfrage fuer deine Extra-Punkte:

Frage: Welche Aufgabe hat die API bei einer Daten-Anfrage?

[ ] Antwort A: Sie dient als Schnittstelle/Schalter, nimmt die Anfrage vom Programm entgegen und leitet sie an den Server weiter.
[ ] Antwort B: Sie schaltet den Computer aus.
[ ] Antwort C: Sie speichert dauerhaft das gesamte Internet.
