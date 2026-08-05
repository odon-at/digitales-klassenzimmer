# Changelog – NEXUS DATA

Alle nennenswerten Änderungen an **Spec (`story/`)** und **Spiel (`game/`)** je Version.
Eine Version = ein zusammengehöriger Stand aus Spec **und** Game. Ablauf & Regeln:
siehe [VERSIONING.md](VERSIONING.md).

Format angelehnt an *Keep a Changelog*; Versionsschema **MAJOR.MINOR.PATCH**
(MINOR = Build-Loop / neues Feature, PATCH = kleine Korrektur).

---

## [Unreleased]

_Noch keine Änderungen._

---

## [0.8.0] – 2026-08-05 – Punktesystem, Klassen-Leaderboard, Level-1-Umbau & Tag-Modus

Snapshot: [`releases/v0.8.0/`](releases/v0.8.0/). Setzt den Spec-Commit „Version 8.0" um
(nur `story/`: Level 1, Level 4 „Verbesserung", Startseite).

### Spec (`story/`)
- **Level 1** – „Wichtige Verbesserung zu Beginn": **kein** automatischer Intro-Einflug mehr;
  der Hangar steht von Anfang an, die Taube wird schrittweise ausgerüstet, der Flug startet
  erst per Knopfdruck. Dazu der Hinweis auf eine neue `cybertaube.png`.
- **Level 4** – neuer Abschnitt „Verbesserung": größeres Instruktions-Banner, Tageslicht-Modus,
  Direct-Click, barrierefreie Buttons, Erledigt-Status, 44-px-Trefferflächen, Leaderboard mit
  automatischem Login und eine neue Punkte-Mechanik.
- **Startseite** – der Hintergrund soll sichtbar das Stadtbild zeigen, keinen schwarzen Grund.
- Ergänzt: Umsetzungsvermerke in allen drei Dateien, neuer Level-Contract in
  `levels/README.md`, Punktemodell in `allgemein.md`, Zustandsmodell in `overview.md`,
  Leaderboard in `belohnung.md`, Tipp-Kosten in `info.md`.

### Game (`game/`)
- **Neues Punktesystem für ALLE Level** (neu: `js/score.js`): **+100** je richtig gelöster
  Teilaufgabe, **+50** wenn sie im Erstversuch saß, **−30** je Fehlversuch, dazu ein
  **Zeit-Bonus** bis **+100** pro Level. Nie unter 0. Ein Tipp kostet jetzt **−30**.
  Erreichbar: L1 700 · L2 1000 · L3 1000 · L4 2500 = **5200**, plus **600** Wissens-Bonus
  (je Bonusfrage 150 statt 15) → **5800**. Die Rang-Schwellen sind weiterhin prozentual und
  rechnen automatisch mit.
- **Level-Contract erweitert:** Level melden `ctx.complete({ units, firstTry, wrong })`;
  Zeit-Bonus und Tipp-Abzug rechnet der Host. Eine blanke Zahl wird weiter akzeptiert.
- **Level 1 ohne Start-Intro** (`level1.js`): Die Intro-Sequenz ist entfernt. Stattdessen ein
  **Ausrüstungs-Hangar**, der sich mit jeder Wahl sichtbar füllt – beim Token gleitet die
  Pergamentrolle in den Schnabel, der Token-Speicher füllt sich, eine Statuszeile führt durch
  die drei Schritte. Der Flug startet ausschließlich über **[ TAUBE LOSSCHICKEN! ]**.
- **Level 4 · Bedienbarkeit:** großes **Instruktions-Banner** mit drei Zuständen statt der
  kleinen Hinweiszeile; **Tageslicht-Modus** für die 360°-Stadt (heller Himmel, helle Gebäude
  mit dunkler Kontur, grüne Wiese, HUD auf dunklem Grund); Entscheidungs-Buttons mit
  **✓/✖-Symbol** in Grün/Blau statt Grün/Rot; **Erledigt-Status** (ausgegraut + grünes
  Haken-Badge + „Bereits entschieden"); **48-px-Trefferflächen** für die Hotspots.
- **Klassen-Leaderboard** (`state.js`, `screens.js`): Klassencode **und** Name sind beim Start
  Pflicht (max. 15 Zeichen, Button „JETZT STARTEN 🚀"). Das Ergebnis wird beim Betreten des
  Endscreens **automatisch** eingetragen – kein Absende-Button. Die Tabelle zeigt
  Rang (🥇🥈🥉), Name, Punkte und **Gefundene Open Data Sets**, gefiltert nach Klassencode,
  eigene Zeile hervorgehoben („Du belegst Platz X von Y!"). Neu im Spielstand: `openDataSets`.
- **Startseite:** `media/startseite.jpeg` ist jetzt deutlich sichtbar – Skyline links und
  rechts, nasse Straße unten, nur leicht abgedunkelt statt stark weichgezeichnet.
- Kleinigkeiten: Zertifikat mit Abschluss-Nachricht; `.level-help`-Tipp-Label auf −30.

### Bewusste Abweichungen von der Spec
- **Punkte gelten für alle Level, nicht nur Level 4.** Die Spec nennt +100/+50/−30 nur für
  Level 4; allein dort angewandt hätte Level 4 rund 80 % der Gesamtwertung gestellt und die
  Ränge faktisch bestimmt. Jetzt zählt dieselbe Mechanik überall; Level 4 kommt über seine
  16 Teilaufgaben auf 43 % der erreichbaren Punkte.
- **Leaderboard ohne Server.** Die Spec spricht von einer „Datenbank". Das Spiel ist eine
  Statik-Seite ohne Backend – das Ranking liegt lokal im Browser und ist nach Klassencode
  gefiltert. Für mehrere Geräte gibt es **Export/Import** auf dem Endscreen. Ein echtes
  Backend bräuchte Hosting und ein Datenschutzkonzept für Schülerdaten.
- **Zeit-Bonus großzügig ausgelegt** (voll bis 2:30 min, linear fallend bis 10:00 min).
  Scharfer Zeitdruck widerspricht dem Lernziel – Info-Texte, Fakten-Checks und Tipps sollen
  gelesen werden.
- **Startseite: Zielkonflikt in der Spec selbst.** Im Bild sind Titel, Zielring, Button und
  alle vier HUD-Ecktexte fest eingebrannt, Abschnitt 1 derselben Spec verbietet aber doppelte
  Titel. Gelöst über Bildausschnitt plus weiche Abdunklung der Mittelspalte: Stadt sichtbar,
  eingebrannte Mitte verdeckt, echte HTML-Elemente nur einmal. Ein Bild **ohne** eingebrannte
  UI wäre die sauberere Lösung.
- **Neue `cybertaube.png` lag nicht bei.** Der Code lädt unverändert
  `game/media/cybertaube.png`; eine neue Datei gleichen Namens greift automatisch.

---

## [0.7.0] – 2026-08-04 – Level 4 „Die Daten-Metropole", 360°-Stadt & Großes Finale

Snapshot: [`releases/v0.7.0/`](releases/v0.7.0/). Holt erneut einen **Spec-Rückstand** nach:
Commit „Version 8.0" hatte ausschließlich `story/levels/level-4-prisma-der-stadt.md` geändert
(+145/−35), während das Spiel auf v0.6.0 stand.

### Spec (`story/`)
- **Level 4 komplett neu konzipiert** (`level-4-prisma-der-stadt.md`, aus „Version 8.0"):
  Bürger-Portal mit Diagramm-Auswahl und Drag & Drop, anschließend ein **360°-Erkundungs-Modul**
  mit 10 Szenarien (5× Open Data / 5× DSGVO) und ein **Großes Finale** mit Zeremonie,
  Cyber-Pokal und „Open-Data-Hero-Award". Primärfarbe **Neon-Blau (#00BFFF)**.
- **Doku-Korrekturen:** Kopfzeile („Akzent: Grün" → Neon-Blau), Tippfehler „Datenkompetentz",
  Tipp-Kosten (−10 statt „–10 oder –15"), sowie die **Level-Zuordnung im Finale**
  (die Liste nannte noch die Reihenfolge vor v0.5.0). Ergänzt: `levels/README.md`,
  `allgemein.md` (Farbtabelle, roter Faden), `overview.md` (Bildschirm-Tabelle + `awards`),
  `belohnung.md` (vorgeschaltete Zeremonie, Pokal, Badge), `game/README.md`.

### Game (`game/`)
- **Level 4 komplett neu gebaut** (`level4.js`, `datasets.js` → `level4`). Das alte Dropdown +
  Textfeld ist ersetzt durch zwei Phasen:
  - **Phase 1 · Bürger-Dashboard:** drei Datensätze (Feinstaub 24 h → Linie · Restmüll
    5 Stadtteile → Säule · Budget 100 % → Kreis). Erst den Typ **wählen** (bewertet, −6 je
    Fehlversuch, blauer Glitch + Bürger-KI-Hinweis), dann den Daten-Chip per **Drag & Drop**
    ins freigeschaltete Feld ziehen. Pointer Events (Maus **und** Touch) mit gleichwertigem
    Klick-/Tastaturpfad. Chart.js im neuen Blau, offline ersetzt eine **CSS-Mini-Grafik** das Chart.
  - **Phase 2 · Die lebendige Cyber-Stadt:** nahtlos drehbares 360°-Panorama aus vier
    Parallax-Ebenen (Streifen-Technik, Inhalt mehrfach gerendert), generierte Kulisse als
    Inline-SVG, animierte Bienen/Vögel/Bürger, Kompass und ‹›-Steuerung. 10 Hotspots, je eine
    Entscheidung **[🟢 FREIGEBEN] / [🔴 SPERREN]** (−5 je Fehlentscheidung). **Jedes** Objekt
    wird erklärt – bei den privaten erscheint der DSGVO-Bezug auch bei richtiger Sperrung.
    Alle 10 entschieden → **Open-Data-Hero-Award**.
- **Großes Finale** (neuer Bildschirm `#screen-finale`): Zeremonie mit Bürger-KI-Ansprache,
  Level-Übersicht mit Punkten, rotierendem Cyber-Pokal, Badge und Schlusssatz.
  **Überspringbar und beliebig wiederholbar**; der Halle-Eintrag bleibt einmalig.
  Danach wie bisher das **druckbare Zertifikat** – jetzt ergänzt um Pokal, Badge und
  Level-Übersicht (alles wird mitgedruckt, die Zeremonie nicht).
- **Neuer Akzent** `blue` (#00BFFF) in `registry.js`; neues Feld `awards: []` in `state.js`
  (migrationssicher über den bestehenden `Object.assign`-Merge).
- **Terminologie vereinheitlicht:** das Info-Glossar sagte „Balken"/„Torte", das Level sagt
  „Säule"/„Kreis" – jetzt durchgehend **Linien- / Säulen- / Kreisdiagramm** (`infos.js`,
  Level-4-`tips`, UI). Die Zen-Definitionen folgen dem Wortlaut der Spec.
- Kleinigkeit: `.level-help` (seit v0.6.0 im Markup, aber ungestylt) hat jetzt CSS.

### Bewusste Abweichungen von der Spec
- **Der Drag wird nicht bewertet, die Typ-Wahl schon.** Wäre der Drag die eigentliche Prüfung,
  ließe sich die Antwort durch Herüberziehen erraten (die Hover-Hervorhebung verrät das
  passende Feld vor dem Loslassen) – und ein Drag hat kein Tastatur-Äquivalent. So sind
  Maus- und Tastaturpfad punktgleich; ein Drop ins gesperrte Feld kostet nichts.
- **Diagrammfarben:** `#00BFFF` bleibt UI-Akzent und Farbe der einreihigen Linien-/Säulen-
  Diagramme. Für das **Kreisdiagramm** (5 Kategorien) wäre es zu hell und eine Blau-Rampe
  würde Rangfolge statt Identität kodieren – dort kommt eine gegen den dunklen Hintergrund
  geprüfte kategoriale Palette zum Einsatz, erstes Segment weiterhin blau.
- **„Medienkompetenz" hakt bei *bewerteten*, nicht bei *fehlerfrei* bewerteten Open-Data-
  Szenarien ab.** Sonst wäre der Checklisten-Punkt nach einem einzigen Fehler dauerhaft
  unerreichbar; die anderen Level markieren ebenfalls Fortschritt, nicht Fehlerfreiheit.
- **Level-Zuordnung im Finale korrigiert** (L1 API/JSON, L2 Open Data, L3 Quellenprüfung) –
  die Spec listete noch die Reihenfolge vor dem Level-Tausch in v0.5.0.

---

## [0.6.0] – 2026-08-04 – Level-3-Umbau, Info-/Tipp-System & Level-1-Intro

Snapshot: [`releases/v0.6.0/`](releases/v0.6.0/). Diese Version holt den **Spec-Rückstand**
nach: Die Commits „Version 6.0" und „Version 7.0" hatten ausschließlich `story/` geändert –
das Spiel stand weiterhin auf v0.5.0. Löst außerdem den unter v0.5.0 offen gelassenen Punkt
**„Großer Level-3-Umbau"**.

### Spec (`story/`)
- **Level 3** (`level-3-labyrinth-der-luegen.md`, +302 Zeilen, aus „Version 7.0"): dreistufiger
  Belegstand **BELEGT / UNKLAR / WIDERLEGT**, 6 neue Meldungen mit vierteiligem Fakten-Check
  (Quelle · Metadaten · Lizenz/Rohdaten · Plausibilität), 2-stufiges Hilfesystem,
  Avatar-Navigation durchs Labyrinth, Schatztruhen-Finale.
- **`info.md`** (neu, aus „Version 7.0"): strikte Trennung ℹ Info (0 Punkte, nur Fachbegriff)
  vs. 💡 Tipp (kostet Punkte), avatar-spezifische Info-Formate, Bonusfrage.
  Jetzt ergänzt um Abschnitt 4 (Umsetzung) und die korrigierte Level-Nummerierung.
- **Level 1** (`level-1-cyber-tauben.md`, aus „Version 6.0"): fünfstufige Intro-Sequenz mit
  Pergamentrolle und Token-Reveal, isometrische Vektor-Stadtkarte.
- **Doku-Korrekturen:** `levels/README.md` (defekte Links auf die vor v0.5.0 benannten Dateien),
  `overview.md`, `allgemein.md`, `missionskarte.md` (überall noch die alte Level-Reihenfolge
  1 = Schatten-Archiv / 2 = Cyber-Tauben), `game/README.md`. `info.md` ist jetzt verlinkt.

### Game (`game/`)
- **Level 3 komplett neu gebaut** (`level3.js`, `datasets.js` → `level3`): Das binäre
  Swipe-Deck ist ersetzt. Drei Urteils-Buttons, vierteiliger Fakten-Check je Meldung,
  frageweise **ℹ Info** (0 Pkt.) und **💡 Tipp**. Der gewählte Avatar läuft durch eine
  generierte **7×7-Mini-Map** (Laser-Spur als SVG-Polyline über `stroke-dashoffset`) und eine
  **CSS-3D-Korridor-Ansicht**; im Zentrum öffnet sich die **Schatztruhe** mit dem Golden Record.
  Tastatur: `1/2/3` Urteil, `i` Info, `t` Tipp, `Enter` weiter. Keine neuen Assets.
- **Info-/Tipp-System** (neu: `js/data/infos.js`, `js/infosystem.js`, `#infoscreen` in
  `index.html`): eigenes Overlay mit drei Darstellungen je nach Avatar –
  **Lyra** interaktive Hologramm-Mindmap · **Lennox** Funk-Kanal mit **Sprachausgabe über
  `speechSynthesis`** (de-DE, ohne Audiodateien; Watchdog schaltet nach 1,2 s auf das
  Funk-Transkript um) · **Zen** seitenweises Hacker-Terminal. Wer den Inhalt vollständig
  durchgesehen hat, bekommt eine **Bonusfrage** (+15). `lv.info` bleibt als Fallback.
- **Level 1 Intro-Sequenz** (`level1.js`): Rolle → Schnabel, Anflug rechts→links, Landung +
  Klick, Token-Reveal, Token fliegt in den neuen **Token-Speicher**. Der bislang tote CSS-Block
  aus einer früheren Fassung wurde dafür wiederbelebt statt neu geschrieben; das seit v0.3.0
  verwaiste `media/pergamentrolle.png` ist wieder in Gebrauch. Dazu eine **isometrische
  Vektor-Stadtkarte** (Inline-SVG: Türme, Brücken, Flüsse, Straßen, Server-Knoten, Parks)
  statt des Verlaufskastens mit 🛰️-Emoji. Token laut Spec jetzt `NX-TOKEN-7F3A-9K2D`.
- **Level 2** (`level2.js`): neuer **Plausibilitäts-Zusatzfall** (pH-Wert ohne Vergleichsquelle) –
  als ungültig markieren, dann **[A]** raten (falsch) oder **[B]** als „Fehlend (NULL)"
  markieren und Nachmessung anfordern (richtig). Der lokale Tipp-Button entfällt zugunsten
  des zentralen.
- **Punkte & Ränge** (`state.js`, `screens.js`): neues Feld `bonuses` im Spielstand
  (migrationssicher über den bestehenden `Object.assign`-Merge). Tipp-Kosten liegen jetzt
  **zentral** im Level-Host (`TIP_COST = 10`), Abzug an genau einer Stelle. HUD zeigt `✨ Bonus`.

### Bewusste Abweichungen von der Spec
- **Tipp-Abzug −10 statt −50** (Level-3-Spec): Die −50 beziehen sich auf ein Budget von
  6 × 100 = 600 Punkten (≈ 8,3 %). Das Spiel rechnet mit 100 Punkten je Level – verhältnisgleich
  sind das ≈ −10. Wörtlich −50 hätte den Tipp-Button nach zwei Klicks unbrauchbar gemacht.
  Ein bereits bezahlter Tipp ist erneut kostenlos.
- **Token-Übergabe** (Level-1-Spec): Der Token fliegt nicht in ein Eingabefeld, sondern in einen
  **Token-Speicher** über den Auswahl-Buttons. Ein Vorauswählen der richtigen Option hätte
  Ebene 3 entwertet und die **401-Zeile der Fehler-Matrix derselben Spec unerreichbar** gemacht.
- **Rang-Schwellen jetzt prozentual** (90/70/50 % statt fix 360/280/200). Nötig, weil die
  erreichbare Gesamtpunktzahl mit den Boni von 400 auf 460 steigt – feste Schwellen hätten
  Rang S verschenkt. *Nebeneffekt:* Ein fehlerfreier Durchlauf **ohne** Info-Bonusfragen ergibt
  400/460 = 87 % und damit Rang A. Rang S setzt jetzt voraus, dass man die (kostenlosen)
  Info-Inhalte nutzt – genau der Anreiz, den `info.md` beschreibt.

---

## [0.5.0] – 2026-08-03 – Level-Umbau: Cyber-Tauben (neu L1) ↔ Schattenarchiv (L2) + Pause

Snapshot: [`releases/v0.5.0/`](releases/v0.5.0/). **Level 1 und 2 wurden getauscht.**

### Spec (`story/`)
- **Level 1 = „Die Cyber Tauben"** (`level-1-cyber-tauben.md`, stark ausgebaut): Terminal mit
  3-stufigem Ausrüstungs-Regal (URL → Methode → Token), Live-Code-Vorschau, Tauben-Kartenflug,
  Fehler-Matrix (404/401/405), Papierrollen-Chaos → SCAN → JSON + Human-Dashboard.
- **Level 2 = „Das Schattenarchiv"** (`level-2-schatten-archiv.md`): Open-Data-Portal-Korrekturspiel
  (bisher Level 1) **+ 10-Minuten-„Real-Life-Break"** am Ende.
- Level 3 & 4: Spec unverändert.

### Game (`game/`)
- **Level 1 (Cyber-Tauben) neu gebaut** (`level1.js`, `datasets.js` → `level1`): progressive
  Freischaltung URL→Methode→Token (+ Tooltips), Live-HTTP-Vorschau, Start → Kartenflug → Fehler-
  Matrix **404** (falsche URL) / **401** (falscher/kein Token) / **405** (POST) → bei Erfolg
  Papierrollen-Stream → **[SCAN → JSON]** → Maschinen-JSON (`ui.highlightJSON`) + Human-Dashboard +
  „Warum JSON?"-Erklärung. Punkte 100 − 10 je Fehlversuch. Nutzt `cybertaube.png`.
- **Level 2 (Schattenarchiv)** = bisheriges Portal-Level, jetzt `id 2`; bei Lösung ein
  **überspringbarer Real-Life-Break** (Countdown 10:00 + Pausen-Vorschläge + „Weiter").
- Datentausch in `datasets.js` (`level1` = Cyber-Tauben inkl. Stadt-JSON + Dashboard, `level2` =
  Portal-Daten). Neuer Terminal-/Karten-/Scan-/Dashboard-Look + Break-Overlay in `style.css`.
- Level 3 & 4: Code unverändert. *(Missionskarten-Kachelfarben folgen jetzt: L1 Lila, L2 Grün.)*

### Offen (aus Experten-Feedback, nicht Teil dieses Schritts)
- Großer **Level-3-Umbau** (dreistufiger Belegstand, getrennte Prüffragen, echter Quellencheck) –
  Level-3-Spec wurde nicht geändert.

---

## [0.4.0] – 2026-08-03 – Level 1 neu: Open-Data-Portal statt geratener Werte

Snapshot: [`releases/v0.4.0/`](releases/v0.4.0/). Setzt einen zentralen Punkt aus dem
Experten-Feedback um: fehlerhafte Daten werden **nicht geraten**, sondern aus einer
vertrauenswürdigen **Originalquelle** übernommen.

### Spec (`story/`)
- **Level 1** neu konzipiert (`story/levels/level-1-schatten-archiv.md`): interne Systemdaten
  wurden gehackt; die echten Werte kommen aus dem **Open-Data-Portal der Datenbehörde Nexus**
  (URL eingeben → senden → 7 Kategorien). Layout: URL oben, Portal (klappt auf), Datenqualitäts-
  Balken, internes Stadt-System unten (immer sichtbar). Eingaben ohne Autocomplete/gespeicherte Lösungen.

### Game (`game/`)
- **Level 1** komplett neu gebaut (`game/js/levels/level1.js`, `datasets.js` → `level1`):
  URL-Zeile (Klick füllt Portal-URL vor) → **SENDEN** öffnet das Open-Data-Portal mit 7 Kategorien;
  Kategorie anklicken zeigt den **echten Wert** inkl. Herausgeber/Lizenz/Stand. Das interne
  Stadt-System zeigt 5 gehackte Einträge (Strom 1 kWh, Notrufzentralen 0, Einwohner 15,
  Ampel „Manuell/Ausfall", Trinkwasser „Gefährliche Chemikalien"); Korrektur durch Übernahme des
  echten Werts. Datenqualität steigt 35 % → 100 %. Korrektur erst nach Öffnen des Portals möglich.
- Neuer „Data-Terminal"-Look (Cyan/Monospace) für Portal & System (`game/css/style.css`);
  alte Neon-Brunnen-Styles ersetzt.

### Umgesetztes Feedback
- **Kein „plausibler" Ersatzwert mehr** — der Wert wird aus der Open-Data-Originalquelle übernommen
  (Feedback-Punkt zu Level 1).
- Fiktive Stelle „**Datenbehörde Nexus**" statt realer Namen.

### Offen / nächste Schritte
- Der größere Level-3-Umbau (dreistufiger Belegstand, getrennte Prüffragen, echter Quellencheck)
  aus dem Feedback ist **noch nicht** umgesetzt — separate Entscheidung/Runde.

---

## [0.3.0] – 2026-07-31 – Story-Feinschliff: Level 1, Level 2 & UI-Politur

Snapshot: [`releases/v0.3.0/`](releases/v0.3.0/).

### Spec (`story/`)
- **Level 1** neu konzipiert: 5 individuelle Neon-Brunnen je Bezirk, Messen per Klick,
  **Temperatur**-Fehler (2000 °C / -300 °C) statt pH, Vergleichen-und-Korrigieren-Ablauf.
- **Level 2** um eine Intro-Sequenz erweitert: Cyber-Taube bringt eine Pergamentrolle
  mit dem API-Token (Assets `cybertaube.png`, `pergamentrolle.png`).
- **Startseite**: Bugfix „doppelter Titel", neue Reihenfolge (Titel → Icon → Credits →
  Story → Button), Credit „Ein Spiel von Sarah und Chiara", Neon-Flackern für den Verbindungsstatus.
- **Avatar**: „BEN" → **„LENNOX"** (Datenschutz-Experte); „AUSGEWÄHLT"-Banner korrigiert.
- **Missionskarte**: Avatar links neben der Karte, kompaktere Kacheln, größere farbige
  Unterüberschriften, Status „bereit" → **„Start"**.
- **Einleitung**: Zitat-Wortlaut „Hole die Fragmente zurück."

### Game (`game/`)
- **Level 1** neu gebaut: 5 klickbare Neon-Brunnen (Mess-Animation → wahrer Wert),
  Datentabelle mit zwei unmöglichen Temperaturen; erst messen, dann vergleichen und in der
  Tabelle korrigieren; Datenqualität 80 % → 100 %. Daten in `datasets.js` → `level1`.
- **Level 2**: Intro-Animation – große Cyber-Taube fliegt herein, Klick → Rolle öffnet sich,
  der Token wandert animiert ins Token-Feld; danach normale API-Anfrage. Assets in `media/`.
- **Startseite**: Hintergrund so behandelt, dass der eingebrannte Mockup-Titel nicht mehr
  durchscheint (nur noch ein sauberer HTML-Titel); Reihenfolge/Texte/Flacker-Status angepasst.
- **Avatar**: Datensatz `ben` → `lennox` (Bild `avatar-lennox.png`); breiteres Auswahl-Banner.
- **Missionskarte**: neues Layout `map-body` mit Avatar-Panel links; Kachel-Styles kompakter,
  farbige Unterüberschriften, „Start"-Badge; `renderMapAvatar()` in `screens.js`.

### Hinweise / Annahmen
- Die in der Level-1-Spec beschriebenen individuellen Brunnen-Illustrationen sind als
  **thematische Neon-Karten mit Emoji** umgesetzt (keine Einzel-Grafiken vorhanden).
- Wegen der Umbenennung `ben` → `lennox` fällt ein alter Spielstand mit `avatarId: "ben"`
  auf den ersten Avatar zurück (kein Migrationspfad im MVP).

---

## [0.2.0] – 2026-07-30 – Level 3: Swipe-Karten & Labyrinth-Zoom

Snapshot: [`releases/v0.2.0/`](releases/v0.2.0/).

### Spec (`story/`)
- **Level 3** grundlegend überarbeitet: neues **Swipe-Karten-System** (Social-Media-Karten,
  nach links = „richtig", nach rechts = „falsch"), Labyrinth-Zoom-Mechanik und ein
  Fragen-Katalog mit 6 Beispiel-Aussagen (Quelle/Lizenz/Metadaten/Plausibilität).
  Siehe `story/levels/level-3-labyrinth-der-luegen.md`. _(bereits in v0.1.0 → v0.2.0 gepflegt)_

### Game (`game/`)
- **Level 3 neu gebaut** gemäß Spec: zoomendes Labyrinth (`media/labyrinth.jpeg`) mit
  Swipe-Karten davor. Bedienung per **Drag (Maus/Touch)**, zusätzlich **Buttons** und
  **Pfeiltasten ←/→** (Barrierefreiheit). Richtig → Karte fliegt raus + Zoom tiefer +
  Erklärungs-Toast; falsch → Shake + Fehlerton, erneuter Versuch. Punkte: 100 − 10 je
  Fehlversuch (min. 40).
- Daten: `game/js/data/datasets.js` → `level3.questions` (6 Meldungen, Emoji-Avatare,
  `taskIndex`-Zuordnung zur Checkliste).
- Neue Stile in `game/css/style.css` (Abschnitt „Level 3 – Swipe-Karten …").

### Hinweise / Annahmen
- **Emoji-Avatare** ersetzen die in der Spec genannten `profile_image`-PNGs (nicht als Assets vorhanden).
- Verifizierungs-Badge aus `is_verified` (Hinweis, nicht allein entscheidend).

---

## [0.1.0] – 2026-07-29 – MVP-Baseline

Erster zusammenhängender Stand: spielbar von Start bis Zertifikat, mit ausgerichteter
Spec. Snapshot: [`releases/v0.1.0/`](releases/v0.1.0/).

### Spec (`story/`)
- Vollständige Design-Doku aufgebaut: `allgemein.md` (Spielbibel), `overview.md`
  (Ablauf/Architektur/Zustandsmodell), Bildschirm-Specs (`startseite`, `login`, `avatar`,
  `einleitung`, `missionskarte`, `belohnung`) und `levels/` (Framework + 4 Level-Specs).
- Legende ✅ Vorgabe / 🟡 Annahme / 💡 Iterationsidee eingeführt.
- Ist-Zustand-Screenshots je Bildschirm unter `story/images/screens/`.
- Level 3 als **Karten-Auswahl** spezifiziert (Quelle/Lizenz/Plausibilität prüfen).

### Game (`game/`)
- MVP als einzelne Web-App (HTML/CSS/Vanilla-JS, Bibliotheken via CDN):
  Startseite, Login (Klassen-Code), Avatar-Auswahl (Lyra/Ben/Zen), Einleitung,
  Missionskarte, 4 Levels mit je einer kleinen Aufgabe, Belohnung/Zertifikat.
- Punkte-/Schlüssel-/Rang-Modell, Halle der Chronisten, druckbares Zertifikat,
  Info-Popups, Fortschritts- & Datenqualitäts-Balken, Ton-Effekte, Konfetti.
- Einsteckbares Level-Framework (`game/js/levels/registry.js` + `levelN.js`).

---

<!--
Vorlage für einen neuen Eintrag (nach oben kopieren, über die vorige Version):

## [X.Y.Z] – JJJJ-MM-TT – Kurztitel

### Spec (`story/`)
- …

### Game (`game/`)
- …

### Hinweise
- …
-->
