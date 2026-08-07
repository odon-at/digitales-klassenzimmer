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

---

## ✅ Umsetzung v0.9.0 (Aufgabenübersicht, Hilfe daneben, geordnete Knoten)

**Aufgabenübersicht** – umgesetzt in der **gemeinsamen Level-Hülle**, damit alle vier
Level gleich bedient werden (`game/index.html` → `.level-taskcard`,
`game/js/screens.js` → `renderTasks()` / `syncCurrent()`):

* Nummerierte Schritte **1 · 2 · 3** statt einer Aufzählung; die Liste ist jetzt ein
  `<ol>`.
* Genau **ein Schritt ist hervorgehoben** – der erste noch offene. Erledigte tragen
  einen grünen Haken statt der Nummer.
* Der vierte Eintrag ist das **Ziel** („🎯 Rohdaten-Strom in sauberes JSON
  umwandeln") und trägt bewusst keine Nummer: die Spec-Checkliste hat drei Schritte,
  Schritt 3 nennt die JSON-Umwandlung als sein Ziel. Gewertet wird er weiterhin als
  vierte Teilaufgabe – an den Punkten ändert sich nichts.
* **Info- und Tipp-Knopf stehen jetzt direkt neben der Aufgabenstellung** (vorher im
  Footer unter dem ganzen Level).

**Instruktions-Banner** über der Bühne (`.instr-banner`, Texte in
`game/js/data/datasets.js → level1.banner`): sagt in großer Schrift immer genau den
Schritt an, der jetzt dran ist – „Aufgabe 1: Wähle unter (1) URL / Zieladresse …" →
„Aufgabe 2 …" → „Aufgabe 3 …" → „Alles bereit – drücke jetzt auf
[ TAUBE LOSSCHICKEN! ]" → beim Rohdaten-Strom „🎯 Ziel: … in sauberes JSON
umwandeln". `role="status"`, also auch für Screenreader.

**Hinweis auf die Extrapunkte** – steht auf der Hauptseite unter den Aufgaben,
**bevor** man die Info öffnet: „💡 Extrapunkte: Klicke auf ℹ INFO und arbeite alle
Stationen der Reihe nach durch – danach schaltet sich eine Bonusfrage frei
(+150 Punkte)." Nach dem Beantworten wechselt er auf „✓ Wissens-Bonus gesichert".

*Formulierung leicht abweichend:* Die Spec sagt „die 5 Knoten". Fünf Knoten hat nur
die **Lyra**-Variante des Info-Fensters; Lennox hört acht Funk-Zeilen, Zen liest drei
Terminal-Seiten. Der Hinweis spricht deshalb von „Stationen" und stimmt so für alle
drei Avatare.

**Info-Fenster: Knoten der Reihe nach** (`game/js/infosystem.js → renderLyra`):
Nur der aktuell hervorgehobene Knoten ist anklickbar („Klick mich an!"), spätere sind
sichtbar **gesperrt** und auch für die Tastatur gesperrt. Bereits erkundete bleiben
offen zum Nachlesen. Die Verbindungslinien leuchten Schritt für Schritt auf. Nach dem
fünften Knoten öffnet die Bonusfrage.

> **Bewusste Abweichung von der Nummerierung:** Die Spec listet oben
> „4. JSON, 5. Server". Umgesetzt ist **Programm → Anfrage → API → Server → JSON**,
> denn das JSON ist die **Antwort**, die vom Server zurückkommt – genau so sind die
> Verbindungslinien im Hologramm seit jeher gezeichnet. Mit dem Auftraggeber
> abgestimmt.

**Vorlesen:** Tipps und Info-Texte haben einen 🔊-Knopf und werden per
Browser-Sprachausgabe gesprochen; dazu meldet sich einmal je Sitzung die Aufnahme der
Bürger-KI. Siehe [../audio/stimme.md](../audio/stimme.md).

### Usability & Story Refactoring: Level "Datenübertragung & Open Data"

Dieses Dokument beschreibt die Anpassungen an UI, Metaphern, Erklärungen und Interaktionskonzepten zur Verbesserung der Verständlichkeit und Benutzerfreundlichkeit (Usability) des Lernspiels.

---

## 1. Story & Context Update (Hintergrundgeschichte)

### Problem
Die bisherigen Bezeichnungen (wie "Ausrüstung") passten nicht optimal zur Metapher der Datenübertragung in der modernen Welt.

### Neue Story-Einbindung
 **Hintergrund:** > Die zentralen, privaten Datenbanken der Stadt wurden gehackt und sind blockiert oder unsicher. Um die städtische Infrastruktur aufrechtzuerhalten, müssen wir auf **Open Data (offene Daten)** zurückgreifen, die öffentlich und sicher bereitgestellt werden. 
 
 Da die normalen Netzwerke gestört sind, nutzen wir digitale **Cyber-Tauben**, um Datenanfragen (HTTP-Requests) sicher zu transportieren. Die Spieler schicken die Taube mit genauen Befehlen los, damit sie die gewünschten Open-Data-Pakete abholt.

---

## 2. Anpassung der Metaphern & Begriffe

| Alter Begriff | Neuer Begriff | Begründung / Ziel |
| :--- | :--- | :--- |
| **Ausrüstung / Ausrüstungs-Hangard** | **Request-Konfigurator** / **Anfrage-Befehle** | "Ausrüstung" klingt nach Videospiel-Inventar (Schwert/Rüstung). "Anfrage-Befehle" macht klar, dass hier ein technischer Request aufgebaut wird. |
| **Passierschein** (API-Token) | **Zugangsschlüssel** (API-Schlüssel / Token) | "Schlüssel" ist ein vertrauterer Begriff aus dem Alltag und erklärt die Schutzfunktion eines Tokens besser. |

---

## 3. UI/UX-Änderungen für Hilfe-Texte (Info-System)

### Problem
Das aktuelle **Tooltip-Hover-System** (Fahren über das (i)-Icon) ist auf Mobilgeräten/Touchscreens schwer nutzbar und wird von Schülern oft übersehen oder versehentlich ausgelöst.
Unklarheit bezüglich Punkteabzug.

### Neues Konzept
1. **Button statt Hover:** Neben jedem Schritt (1. URL/Zieladresse, 2. HTTP-Methode, 3. API-Token) befindet sich ein gut sichtbarer Klick-Button: **[ ? Info ]** oder **[ Was bedeutet das? ]**.
2. **Klick-Verhalten:** Ein Klick öffnet ein klares Infofeld / Modal direkt neben der Aufgabe oder klappt einen Erklärungstext aus.
3. **Punkte-Transparenz:** Im UI wird explizit hervorgehoben:  
   "Das Lesen der Hilfe kostet dich KEINE Punkte!"

---

## 4. Inhaltliche Überarbeitung der Stationen & Erklärungen

### Station 1: URL / Zieladresse
**Konzept:** Die Web-Adresse der Open-Data-Schnittstelle.
**Erklärung im Spiel (Info-Button):** > "Eine URL ist wie die Postadresse eines Servers. Damit die Cyber-Taube weiß, wo genau sie die offenen Daten abholen soll, muss die korrekte Zieladresse ausgewählt werden."

---

### Station 2: HTTP-Methode (Aktion festlegen)
**Konzept:** Verständliche Differenzierung der HTTP-Methoden.
**Erklärung im Spiel (Info-Button):** > **Was ist eine HTTP-Methode?** > Die HTTP-Methode bestimmt die **Art der Aktion**, die die Taube am Zielserver ausführen soll:  
  > * **GET (Abholen):** Du möchtest Daten vom Server anfordern und lesen (z. B. aktuelle Busfahrpläne oder Wetterdaten).  
  > * **POST (Senden):** Du möchtest neue Daten an den Server übertragen und dort speichern (z. B. ein Formular abschicken).  
  >  
  > In diesem Level nutzen wir **GET**, um die freien Daten aus dem Stadt-System abzurufen.

---

### Station 3: API-Token / Zugangsschlüssel
**Konzept:** Autorisierung bei Schnittstellen.
**Erklärung im Spiel (Info-Button):** > **Was ist ein API-Token (Zugangsschlüssel)?** > Ein API-Token ist ein digitaler **Schlüssel**. Viele Open-Data-Server sind zwar öffentlich, verlangen aber einen Schlüssel, damit sie nachvollziehen können, wer Daten anfordert, und um Überlastung durch Missbrauch zu verhindern.  
  > Wähle den gültigen Schlüssel aus, damit der Server der Taube die Daten anvertraut.

---

### Station 4: Rohdaten-Strom in sauberes JSON umwandeln
**Konzept:** Datenformatierung verstehen.
**Erklärung im Spiel (Info-Button):** > **Warum JSON?** > Die Taube bringt die Daten als unstrukturierte Text-Kette (Rohdaten) zurück. Damit Computer die Daten weiterverarbeiten und anzeigen können, wandeln wir sie in das Format **JSON** um. JSON ordnet die Daten übersichtlich in Schlüssel-Wert-Paare (z. B. Stadt: "Nexus City").

---

## 5. Zusamenfassung des Gameplay-Ablaufs (Workflow)

1. **Kontext verstehen:** Die Stadt-Datenbank wurde gehackt $\rightarrow$ Open Data nutzen.
2. **Zieladresse (URL) wählen:** Wo liegen die offenen Daten?
3. **HTTP-Methode festlegen:** Aktion wählen (hier: GET zum Abrufen).
4. **Zugangsschlüssel (API-Token) beilegen:** Authentifizierung anfügen.
5. **Taube losschicken:** Den HTTP-Request absenden.
6. **JSON verarbeiten:** Empfangene Rohdaten in lesbares JSON konvertieren.

### ## 7. Erweiterung des Info-Systems (Begriffs-Glossar)

### Grundprinzip
Die Schüler können **jederzeit** auf den Info-Button [ ? Info / Glossar ] klicken.
Das Aufrufen von Informationen kostet **keine Punkte**.
Neben den spezifischen Aufgaben werden hier alle Kernbegriffe rund um Schnittstellen (APIs) und Datenübertragung kurz, knackig und verständlich erklärt.

---

### Inhalts-Spezifikation für das Info-Fenster

#### 1. Was ist eine URL?
 **URL (Uniform Resource Locator):** > Die URL ist die **Webadresse** einer Datenquelle im Internet (z. B. `https://opendata.nexus.city/v1/stadtsystem`). Sie funktioniert wie die Straßenadresse eines Hauses: Sie sagt der Cyber-Taube genau, wo auf der Welt sie die Daten suchen muss.

---

#### 2. Was ist eine HTTP-Methode?
 **HTTP-Methode (Aktions-Befehl):** > Die HTTP-Methode bestimmt, **was** die Taube am Zielort tun soll.  
 * **GET:** "Hole mir Daten von dort ab!" (z. B. Fahrpläne lesen)  
 * **POST:** "Bringe diese neuen Daten dorthin und speichere sie!" (z. B. Formular abschicken)

---

#### 3. Was ist eine API?
 **API (Schnittstelle):** > Eine API (Application Programming Interface) ist wie ein **digitaler Schalter** oder Restaurant-Kellner. Sie nimmt deine Anfrage entgegen, bringt sie zum Server, holt die passenden Daten und liefert sie dir zurück – ohne dass du direkt im Bauplan des Servers suchen musst.

---

#### 4. Was ist ein API-Token (Zugangsschlüssel)?
 **API-Token (Zugangsschlüssel):** > Ein digitaler **Schlüssel**, den du deiner Anfrage beilegst. Er zeigt dem Server, wer die Daten anfordert. So stellt der Server sicher, dass nur berechtigte Personen zugreifen und das System nicht durch zu viele Anfragen überlastet wird.

---

#### 5. Was ist JSON?
 **JSON (JavaScript Object Notation):** > Ein einfaches **Textformat zum Datenaustausch**. Wenn die Taube die Rohdaten zurückbringt, sind diese oft ungeordnet. JSON strukturiert die Daten übersichtlich in Schlüssel-Wert-Paaren (z. B. "Temperatur": "21°C"), damit Computer sie leicht lesen und anzeigen können.

---

#### 6. Was ist ein HTTP-Status-Code?
 **HTTP-Status-Code (Antwort-Signal):** > Eine dreistellige Zahl, die der Server der Taube als **Rückmeldung** mitgibt, damit du weißt, ob die Anfrage erfolgreich war:  
 * **200 OK:** "Alles super! Hier sind deine Daten." > * **404 Not Found:** "Zieladresse nicht gefunden – die URL stimmt nicht." > * **401 / 403 Unauthorized:** "Fehler! Du hast keinen gültigen Zugangsschlüssel (API-Token) mitgeschickt." > * **500 Internal Server Error:** "Der Server hat gerade ein technisches Problem."

---

#### 7. Was ist die Checkliste?
 **Die API-Checkliste (Schritt-für-Schritt-Anleitung):** > Deine Kontrollliste vor dem Absenden der Taube! Ein funktionierender HTTP-Request braucht immer:  
 1. [x] **URL:** Wo soll es hingehen?  
 2. [x] **HTTP-Methode:** GET oder POST?  
 3. [x] **API-Token:** Schlüssel beigelegt?  
 4. [x] **Antwort verarbeiten:** Status-Code prüfen & Rohdaten in JSON umwandeln.

##### Spezifikation: Maschinenansicht (JSON) vs. Menschenansicht (Dashboard)

## 1. Übersicht & Lernziel

Nachdem die Cyber-Taube ihre Anforderung erfolgreich erledigt hat, bringt sie die Daten vom Server zurück. 
An dieser Stelle im Spiel lernen die Schüler den Unterschied zwischen der **technischen Rohstruktur für Computer** (JSON) und der **grafischen Aufbereitung für Menschen** (Dashboard) kennen.

---

## 2. Inhalts-Spezifikation für den Info-Bereich [ ? Info ]

Dieser Info-Text kann von den Schülern jederzeit **ohne Punkteabzug** aufgerufen werden.

### A) Warum JSON? (Maschinenansicht)
 **Maschinenansicht (JSON):**
 Computer und Server sprechen eine eigene Sprache. Das Format **JSON** ordnet Daten so an, dass Programme sie extrem schnell lesen, durchsuchen und verarbeiten können. 
 
 * **Vorteil:** Es verbraucht sehr wenig Speicherplatz und ist universell von allen Programmiersprachen nutzbar.
 * **Nachteil:** Für Menschen ist es unübersichtlich, wenn es viele verschachtelte Daten sind.

---

### B) Warum ein Dashboard? (Menschenansicht)
 **Menschenansicht (Dashboard):**
 Ein Dashboard übersetzt die "unleserlichen" JSON-Daten in eine grafische Oberfläche mit Diagrammen, Icons, bunten Anzeigetafeln oder Tabellen.
 
 * **Warum brauchen wir das?** Menschen können lange Text- und Zahlenreihen nur schwer auf einen Blick erfassen. Ein Dashboard bereitet die Informationen so auf, dass wir sofort erkennen, was wichtig ist (z. B. eine rote Warnleuchte bei Systemausfall oder eine grüne Temperaturanzeige).
 * **Vorteil:** Schnell verständlich, übersichtlich und benutzerfreundlich.

---

## 3. Gegenüberstellung im Spiel (Vergleichstabelle)

Um den Unterschied im Spiel visuell und inhaltlich klar zu unterstreichen, wird folgende Übersicht eingebunden:

| Kriterium | JSON (Maschinenansicht) | Dashboard (Menschenansicht) |
| :--- | :--- | :--- |
| **Zielgruppe** | Computer, Server, Programme | Menschen, Anwender, Schüler |
| **Darstellung** | Text, Klammern { }, Schlüssel-Wert-Paare | Grafiken, Buttons, Farben, Diagramme |
| **Hauptaufgabe** | Sichere & schnelle Datenübertragung | Schnelle & einfache Informationsaufnahme |
| **Beispiel** | "status": "aktiv", "temperatur": 22.5 | 🟢 System aktiv \| 🌡️ 22.5 °C |

---

## 4. Ablauf im Spiel (Gameplay-Logik)

1. **Taube kommt an:** Der Server sendet das Ergebnis im **JSON-Format** zurück (Maschinenansicht).
2. **Datenumwandlung:** Der Spieler wandelt die empfangenen Rohdaten per Klick/Befehl um.
3. **Ergebnis visualisieren:** Das Spiel schaltet auf die **Dashboard-Ansicht** um. Die Schüler sehen sofort, wie aus abstracten Code-Zeilen eine fertige, nutzbare App-Oberfläche entsteht.

---

## ✅ Umsetzung v0.10.0 (Begriffe, Hilfe-Knöpfe, Glossar)

### Story
Neu gefasst nach §1: Die zentralen, **privaten** Datenbanken der Stadt sind gehackt
und unsicher – deshalb greifen wir auf **Open Data** zurück, und weil auch die
Netzwerke gestört sind, transportieren die Cyber-Tauben die Datenanfragen.

### Begriffe (§2)
| alt | neu |
|---|---|
| Panel-Titel „AUSRÜSTUNG" | **REQUEST-KONFIGURATOR** |
| Panel-Titel „AUSRÜSTUNGS-HANGAR" | **TAUBEN-STATION** |
| „Passierschein" (überall sichtbar) | **Zugangsschlüssel** |
| „TOKEN-SPEICHER" | **SCHLÜSSEL-SPEICHER** |

Geändert sind ausschließlich **sichtbare Texte**. CSS-Klassen und interne Bezeichner
(`ct-hangar`, `hangarText`, `d.hangar`) behalten ihre Namen – sie sieht niemand, und
ein Umbenennen erzeugte nur Änderungsrauschen quer durch CSS, JS und Testsuiten.

### Hilfe-Knöpfe statt Hover-Tooltips (§3)
Das kleine `ⓘ` mit `title`-Tooltip ist weg. An jeder Station steht jetzt ein echter
Knopf **[ ? Was bedeutet das? ]** (`.ct-help`) – treffbar auf Touchgeräten,
fokussierbar per Tastatur, nicht zu übersehen. Vier Stück: URL · HTTP-Methode ·
API-Token · Rohdaten→JSON (der vierte beim Rohdaten-Strom).

Jedes Fenster endet mit **„Das Lesen der Hilfe kostet dich KEINE Punkte!"** und
lässt sich vorlesen. Texte: `game/js/data/datasets.js → level1.help`, Wortlaut
aus §4.

### Glossar & Vergleichstabelle
Beides steht – auf ausdrücklichen Wunsch – **im Ergebnis-Bildschirm nach dem Klick
auf „SCAN & IN JSON UMWANDELN"**, direkt neben Maschinen- und Menschen-Ansicht,
nicht im Info-Fenster:

* **📖 Glossar (0 Punkte)** als dritte Spalte neben den beiden Ansichten, mit den
  **sieben** Begriffen aus §7: URL · HTTP-Methode · API · API-Token · JSON ·
  HTTP-Status-Code · Checkliste. Aufklappbar, damit die Ansichten daneben Platz
  behalten. Auf schmalen Bildschirmen rutscht es unter die beiden Ansichten.
* **Vergleichstabelle JSON ⇄ Dashboard** darunter, mit den vier Kriterien
  Zielgruppe · Darstellung · Hauptaufgabe · Beispiel.

> **Korrektur am URL-Beispiel:** §7 nennt als Beispiel-URL
> `https://opendata.nexus.city/v1/stadtsystem` – das ist die **Lösung dieses Levels**
> und steht in der Spoiler-Sperrliste `infos[1].forbidden`. Im Glossar steht deshalb
> eine neutrale Adresse (`https://opendata.beispielstadt.at/v1/verkehr`).
> Regel: Die Info erklärt den Begriff, nie den Lösungsweg (story/info.md §1).

### Vorlesen
Tipps, Hilfe-Fenster und Info-Fenster haben **einen** Vorlese-Knopf, der nur auf
Knopfdruck startet – siehe [../stimme.md](../stimme.md).

## Anforderung: UI-Anpassung für Level 1 - Schritt 3 (Daten-Auswertung und Infoseite)

## 1. Problembeschreibung
Der dritte Schritt von Level 1 wirkt auf den Spieler überladen und unübersichtlich. Aktuell werden im dritten Schritt weiterhin die obere Aufgabenstellung, die Checkliste und der Punktestand aus den ersten beiden Schritten angezeigt. 

Da im dritten Schritt jedoch keine aktiven Konfigurationsaufgaben mehr stattfinden, sondern die Auswertung und der Vergleich der Daten im Vordergrund stehen, lenken diese Elemente ab und überfordern die visuelle Wahrnehmung (Cognitive Load).

## 2. Zielsetzung
Im dritten Schritt soll das Layout klar strukturiert werden:
Entfernung aller nicht mehr benötigten Aufgaben- und Checklisten-Elemente.
Einbau eines klaren Hinweistextes, dass es sich nur noch um eine Informationsansicht handelt.
Fokus auf den Vergleich zwischen der Maschinen-Ansicht (JSON) und der Menschen-Ansicht (Dashboard).

## 3. Konkrete Änderungen im Detail

### A. Entfernen alter Elemente
Obere Aufgaben-Box ("AUFGABEN - der Reihe nach") inklusive Checkliste komplett ausblenden.
Visuelle Elemente, die auf eine aktive Aufgabe hinweisen (wie Punktestand-Abzüge oder Aufgaben-Tipps), entfernen.

### B. Neuer Hinweistext / Überschrift
Ganz oben an der Stelle der vorherigen Aufgaben-Box wird eine neue Info-Zeile platziert mit folgendem Wortlaut:

 Aufmerksam durchlesen - nur für dein Verständnis, keine Aufgabe.

### C. Inhaltlicher Fokus
Der restliche Seiteninhalt rückt weiter nach oben und wird strukturiert dargestellt:
1. Gegenüberstellung von Maschinen-Ansicht (JSON) und Menschen-Ansicht (Dashboard).
2. Vergleichstabelle zwischen JSON und Dashboard (Kriterium, JSON, Dashboard).
3. Erklärungsabschnitt "Warum JSON?".
4. Abschließender Aktions-Button: "DATEN GESICHERT" / "LEVEL ABSCHLIESSEN".

## 4. Akzeptanzkriterien
Schritt 1 und Schritt 2 behalten ihre bisherige Aufgaben-Box und Checkliste unverändert bei.
In Schritt 3 ist die Aufgaben-Box nicht mehr sichtbar.
In Schritt 3 ist der neue Hinweistext gut lesbar als zentrale Überschrift platziert.
Das Gesamtbild im dritten Schritt wirkt aufgeräumt, übersichtlich und ohne ablenkende Spielelemente.

---

## ✅ Umsetzung v0.12.0 (Schritt 3 aufgeräumt)

Nach dem Klick auf „SCAN & IN JSON UMWANDELN" verschwinden **Aufgaben-Box, Checkliste,
Tipp-Knopf, Bonus-Hinweis und Instruktions-Banner**. An ihre Stelle tritt eine ruhige
Hinweiszeile (`.instr-note`):

> 📖 **Aufmerksam durchlesen – nur für dein Verständnis, keine Aufgabe.**

Darunter unverändert: Maschinen-Ansicht (JSON) · Menschen-Ansicht (Dashboard) · Glossar
→ Vergleichstabelle → „Warum JSON?" → **[ Daten gesichert ✓ ]**.

Technisch neu ist `ctx.showTasks(bool)` im Level-Contract (siehe
[README.md](README.md)); `openLevel()` blendet die Karte beim Betreten jedes Levels
wieder ein, damit ein Ausblenden nicht hängen bleibt. In Schritt 1 und 2 ändert sich
nichts.

> **Bewusste Abweichung:** Der **INFO-Knopf bleibt** – er steht jetzt rechts in der
> neuen Hinweiszeile. Streng nach Spec wäre er mit der Box verschwunden; dann käme
> aber niemand mehr an die **150 Bonuspunkte** aus dem Info-Fenster, denn Schritt 3
> ist der letzte Bildschirm des Levels. Solange die Bonusfrage offen ist, steht der
> Hinweis „💡 In der Info wartet noch eine Bonusfrage (+150 Punkte)" daneben.
> Der Knopf ist ab v0.12.0 orange und pulsiert (siehe [../allgemein.md](../allgemein.md)).
