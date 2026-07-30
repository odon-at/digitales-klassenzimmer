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

# Level 3 – Das Labyrinth der Lügen (Spezifikation & Fragen-Katalog)

## 1. Spielmechanik & Navigation

**Zentriertes Hauptelement:**
  * In der Mitte des Bildschirms befindet sich ein zentriertes Bild eines **Labyrinths** (Image-Asset).
**Zoom-Mechanik:**
  * Wenn der Spieler auf das Labyrinth klickt, zoomt die Kamera sanft in die erste Station des Labyrinths hinein.
**Fortschritts-System:**
  * Mit jeder korrekt beantworteten Frage zoomt die Kamera ein Stück weiter entlang des Pfades tiefer in das Labyrinth hinein (Richtung Labyrinth-Zentrum / „Golden Record: The Right Data“).

---

## 2. UI-Komponenten (Swipe-Karten-System)

Jede Frage wird als **Karte im Social-Media-Stil** im Vordergrund dargestellt.

### Karten-Layout:
**Header:** Profilbild (avatar) + Profilname (username) + Verifizierungs-Badge (is_verified).
**Body:** Aussage / Textbeitrag (content) + Optionale Metadaten-Einblendung (metadata_hint).

### Interaktion (Swipe / Drag):
**Nach LINKS wischen/ziehen:** Aussage wird als **RICHTIG** eingestuft.
**Nach RECHTS wischen/ziehen:** Aussage wird als **FALSCH** eingestuft.

### Feedback-Schleife:
**Richtige Entscheidung:**
  * Die Karte wird mit einer Wisch-Animation ausgeblendet.
  * Die Kamera zoomt zur nächsten Station im Labyrinth.
  * Die nächste Frage erscheint.
**Falsche Entscheidung:**
  * Die Karte führt eine Schüttel-Animation (Shake-Effekt) aus.
  * Ein visuelles/akustisches Fehler-Feedback wird gegeben.
  * Der Spieler muss die Entscheidung korrigieren.

---

## 3. Daten-Array der Fragen (JSON / Game Data)

json[
  {
    "id": 1,
    "topic": "Wasserqualität (Quellcheck)",
    "profile_name": "Wasserwerk_Stadt_Wien",
    "profile_image": "wassertropfen_logo_offiziell.png",
    "is_verified": true,
    "statement": "Unser aktueller Prüfbericht bestätigt: Das Trinkwasser erfüllt alle Grenzwerte der Trinkwasserverordnung. Den vollständigen Laborbericht könnt ihr auf unserer offiziellen Website einsehen.",
    "correct_answer": "left",
    "status": "Richtig",
    "explanation": "Transparenter, offizieller Absender mit Verweis auf verifizierbare Prüfberichte."
  },
  {
    "id": 2,
    "topic": "Brückensicherheit (Quellcheck)",
    "profile_name": "DarkBridge_Leaks",
    "profile_image": "anonym_geheim_icon.png",
    "is_verified": false,
    "statement": "Achtung! Die Reichsbrücke bricht morgen ein! Ich habe geheime Daten von einem anonymen Insider bekommen. Ein Impressum habe ich nicht, aber glaubt mir einfach!",
    "correct_answer": "right",
    "status": "Falsch",
    "explanation": "Anonymer Panikmache-Account ohne Impressum oder nachvollziehbare Quelle."
  },
  {
    "id": 3,
    "topic": "Stromqualität (Lizenzprüfung)",
    "profile_name": "Elektro_Max_Fotos",
    "profile_image": "kamera_blitz_icon.png",
    "is_verified": false,
    "statement": "Ich habe dieses Diagramm zur Netzspannung und Stromqualität erstellt und unter 'CC BY' hochgeladen. Ihr könnt es in eure Präsentation einbauen, ohne meinen Namen zu nennen – das braucht man bei CC BY nicht!",
    "correct_answer": "right",
    "status": "Falsch",
    "explanation": "Inhaltlich falsch: Die Lizenz 'CC BY' verpflichtet ausdrücklich zur Namensnennung des Urhebers."
  },
  {
    "id": 4,
    "topic": "Ampelschaltungen (Lizenzprüfung)",
    "profile_name": "SmartCity_OpenData",
    "profile_image": "ampel_daten_icon.png",
    "is_verified": true,
    "statement": "Unser Datensatz zu den Ampelschaltzeiten der Innenstadt steht unter der Lizenz 'CC0'. Ihr dürft die Daten für eure Schulprojekte völlig frei nutzen, verändern und müsst niemanden als Urheber angeben.",
    "correct_answer": "left",
    "status": "Richtig",
    "explanation": "Korrekte Erklärung der CC0-Lizenz (Gemeinfreiheit)."
  },
  {
    "id": 5,
    "topic": "Flugverkehr (Metadatenanalyse)",
    "profile_name": "AeroData_2024",
    "profile_image": "flugzeug_icon.png",
    "is_verified": false,
    "statement": "Hier ist die brandneue Live-Auswertung des heutigen Flugverkehrs über dem Flughafen!",
    "metadata_hint": "Dateidetails / Metadaten: Erstellungsdatum 14.05.2011",
    "correct_answer": "right",
    "status": "Falsch",
    "explanation": "Widerspruch zwischen Behauptung ('heute') und den tatsächlichen Metadaten der Datei (Jahr 2011)."
  },
  {
    "id": 6,
    "topic": "Umwelt / Wasser (Plausibilitätstest)",
    "profile_name": "EcoMonitor_Online",
    "profile_image": "blatt_messgeraet_icon.png",
    "is_verified": false,
    "statement": "Sensoren-Rekord: Der pH-Wert unseres Trinkwassers liegt heute bei unschlagbaren 98,5! Das ist das sauberste Wasser aller Zeiten!",
    "correct_answer": "right",
    "status": "Falsch",
    "explanation": "Völlig unplausibel: Die pH-Skala reicht nur von 0 bis 14. Ein Wert von 98,5 ist wissenschaftlich unmöglich."
  }
]