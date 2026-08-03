# Level 1: Die Cyber Tauben – Spielkonzept

## 📜 MISSION STORY & LERNZIELE

 ### 🛰️ Flug der Cybertauben
 Das digitale Hauptnetzwerk ist komplett blockiert – normale Internet-Leitungen oder direkte URLs sind für uns abgeschnitten. Der Hacker hat jede Verbindung überwacht.
 
 Um an die sicheren Open Data Archive heranzukommen, nutzen wir unsere geheimen Boten: die Cybertauben. Sie fliegen unbemerkt zu den externen Servern der Stadt, laden die sauberen JSON-Daten herunter und bringen sie direkt zu unserem Terminal zurück.
 
 System-Upload läuft... > Verbindung wird aufgebaut... Cybertauben gestartet! > Alles bereit. Mission Start!

---

### 🎓 Was die Schülerinnen & Schüler in diesem Spiel lernen:
**API (Application Programming Interface):** Verstehen, wie Schnittstellen genutzt werden, um Daten von externen Servern abzurufen.
**URL / Endpoint (Zieladresse):** Lernen, wie eine Internet-Adresse als genauer Zielort für Datenabfragen funktioniert.
**HTTP-Methoden (GET / POST):** Den Unterschied begreifen zwischen Daten anfordern (GET) und Daten senden (POST).
**API-Token (Authentifizierung):** Erkennen, warum man einen digitalen Passierschein/Schlüssel braucht, um geschützte Server zu betreten.
**JSON-Format (Daten-Transformation):** Verstehen, warum Computer strukturierte Schlüssel-Wert-Paare ("Schlüssel": Wert) brauchen, um unleserliche Datenströme blitzschnell zu verarbeiten.
**HTTP-Fehlercodes:** Fehler wie 404 Not Found, 401 Unauthorized und 405 Method Not Allowed spielerisch interpretieren und beheben.

---


## 🎨 DESIGN & VISUELLES SYSTEM (ASSETS)

**Stil:** Cyberpunk / Sci-Fi Terminal / Retro-Hacker-Konsole.
**Farbschema:**
  * Hauptakzent: Neon-Lila / Violett (#9D00FF)
  * Zweitakzent: Neon-Cyan / Türkis (#00F0FF)
  * Hintergrund: Midnight Black / Tiefschwarz (#0D0D11)
**Hauptfigur-Asset (Cybertaube.png):**
  * Verwendet wird die Bilddatei **Cybertaube.png**.
  * **Freistellung:** Nur die Cybertaube selbst wird aus dem Bild entnommen (ohne den schwarzen Hintergrund).
  * **Einsatz:** Die Taube wird als transparentes Sprite/Image-Element auf der Benutzeroberfläche und über der Vektor-Landkarte gerendert.
  * **Dynamisches Greif-System an den Krallen:**
    * In der Vorbereitungsphase im Terminal bleiben die Krallen leer/unbelegt.
    * Sobald am Ziel-Server Daten abgeholt werden, wird das Daten-Paket (Zylinder/Icon) dynamisch unter das Sprite an die Krallen geheftet.

---

## 🎬 ANIMATIONS-ZUSTÄNDE & MAP-FLUG (STATE MACHINE)

1. STATE_TERMINAL_IDLE (Ausrüstungs-Phase):
   * Das Tauben-Sprite (Cybertaube.png) schwebt/sitzt ruhig im Terminal-Dock.
   * Beim Auswählen der Regal-Items docken UI-Module animiert an der Taube an.
2. STATE_MAP_TRANSITION (Szenenwechsel):
   * Das Terminal-Interface klappt oder schiebt sich zur Seite.
   * Eine interaktive Vektor-Landkarte öffnet sich im Hintergrund.
3. STATE_IN_FLIGHT (Flug auf der Landkarte):
   * **Trigger:** Aktiviert sich erst, wenn alle 3 Regal-Ebenen gewählt wurden und der Start-Button gedrückt wird.
   * **Flug-Animation:** Das freigestellte Sprite Cybertaube.png bewegt sich programmatisch (z. B. via CSS/JS-Animation/Tweening) entlang einer Flugroute flüssig über die Landkarte zum Ziel-Server.
   * Ein leichter Schwebesystem-Effekt (sanftes Auf- und Ab-Wippen/Pulsieren der Neon-Schaltkreise) simuliert die Flugbewegung.
4. STATE_FAIL_FLIGHT (Fehler-Zustand):
   * Die Flugbahn gerät ins Stottern/Kippen. Die Taube landet ratlos auf einem toten Masten oder Baum auf der Karte.
5. STATE_RETURN_FLIGHT (Rückflug):
   * Das Cybertaube.png-Sprite bewegt sich mit dem untergehängten Daten-Paket in den Krallen über die Landkarte zurück ins Hauptterminal.

---

## 🖥️ INTERFACE-LAYOUT (DAS TERMINAL)

Der Startbildschirm besteht aus drei Hauptbereichen:

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
