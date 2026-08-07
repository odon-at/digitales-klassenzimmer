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

## [0.12.0] – 2026-08-07 – Vorlesen vereinheitlicht, Einleitung vertont, oranger Info-Knopf

Snapshot: [`releases/v0.12.0/`](releases/v0.12.0/). Setzt die Spec-Commits
`93fdc8c` … `7d930ed „Version 12.0"` um (`allgemein.md`, `avatar.md`, `einleitung.md`,
`levels/level-1-…`, `levels/level-4-…`, `levels/musik.md`).

### Spec (`story/`)
- **`allgemein.md`** – „VORLESEN" nutzt **immer** die Browser-Stimme, nie eine MP3 ·
  Info-Knopf in allen Leveln orange, leuchtend, pulsierend · Musik-Status.
- **`einleitung.md`** – der Einleitungstext soll **laut vorgelesen** werden,
  unabhängig vom Avatar.
- **`avatar.md`** – der separate „AUSWÄHLEN"-Knopf entfällt.
- **`level-1-…`** – Schritt 3 aufräumen: Aufgaben-Box weg, neue Hinweiszeile.
- **`level-4-…`** – 360°-Stadt: reines Maus-Verhalten · die Frage fett und orange.
- **`musik.md`** – Musik-Spezifikation.
- Ergänzt: Umsetzungsvermerke in allen sechs Dateien; `stimme.md` und
  `audio/stimme.md` **beschrieben das Gegenteil** und sind umgeschrieben;
  `avatar.md` widersprach sich selbst (Knopf gleichzeitig „vorhanden ✅" und
  „entfernt") – bereinigt; `ctx.showTasks` in `levels/README.md`.

### Game (`game/`)
- **VORLESEN spricht ausnahmslos die Browser-Stimme.** Die MP3-Vorrangschaltung aus
  v0.10.0 ist samt `clipKey` und Zuordnungstabelle entfernt – aus `ui.js`,
  `screens.js`, `infosystem.js`, `level1.js`, `level3.js`. Am Erlebnis ändert das
  nichts (die Tabelle war leer, es sprach ohnehin immer die Browser-Stimme); entfernt
  wurde toter Code und eine irreführende Beschreibung.
- **Die Einleitung wird vorgelesen.** Die gelieferte Aufnahme vertont laut Spec den
  Einleitungstext – damit ist der seit v0.10.0 offene Punkt „Was sagt die Aufnahme?"
  beantwortet. Sie liegt jetzt als `media/einleitung.mp3` (vorher der nach der
  Klärung falsche Name `buerger-ki-stimme.mp3`) und startet automatisch mit dem
  Einleitungs-Bildschirm, **unabhängig vom Avatar**; ein Knopf stoppt und wiederholt.
  Bildschirmwechsel, Stummschaltung und fehlende Datei enden jeweils sauber.
- **Oranger Info-Knopf** (`.btn-info`) in allen Leveln: kräftiger Rahmen, warmer
  Grund, Puls zwischen `--orange #ff8c1a` und `--orange-hot #ff5e1a` mit wachsendem
  und schrumpfendem Lichtschein. Der Schein läuft über `filter: drop-shadow()` –
  ein `box-shadow` würde vom `clip-path` auf `.btn` abgeschnitten. Bei
  `prefers-reduced-motion` bleibt ein statischer Schein.
- **Avatar-Karte ohne „AUSWÄHLEN"-Knopf**: ein Klick auf die Karte genügt. Damit der
  Bildschirm ohne Maus bedienbar bleibt, ist die Karte selbst zum Bedienelement
  geworden (`role="button"`, `tabindex`, `aria-pressed`, Enter/Leertaste, sichtbarer
  Fokusring); die Panels „FÄHIGKEITEN"/„INFO" folgen jetzt auch dem Tastatur-Fokus.
- **Level 1, Schritt 3 aufgeräumt**: Aufgaben-Box, Checkliste, Tipp-Knopf und Banner
  verschwinden; stattdessen die Zeile „📖 Aufmerksam durchlesen – nur für dein
  Verständnis, keine Aufgabe." Neu im Level-Contract: `ctx.showTasks(bool)`, beim
  Betreten eines Levels immer zurückgesetzt.
- **Level 4, 360°-Stadt: reines Maus-Verhalten** – die Pfeiltasten-Drehung ist
  entfernt, gedreht wird per Maus-Ziehen und über die ‹ ›-Knöpfe. Die Frage nach dem
  Klick steht jetzt in **1,25 rem, fett und orange** mit ❓-Symbol und wird in der
  Screenreader-Ansage mitgesprochen.
- **Hintergrundmusik komprimiert**: Die gelieferte Datei ist trotz `.mp3`-Endung eine
  unkomprimierte **WAV** (13,3 s, 2,2 MB). Ausgeliefert wird die daraus erzeugte
  AAC-Fassung `media/musik-loop.m4a` (**214 KB**, gleiche Länge, Rate und Kanäle);
  das Original bleibt im Repo.

### Bewusste Abweichungen von der Spec
- **Tabulator und Enter bleiben in der 360°-Stadt.** Die Spec verlangt „Tastatur-
  Shortcuts komplett deaktiviert"; Tabulator und Enter sind aber keine Kürzel, sondern
  die normale Browserbedienung – und der einzige Zugang ohne Maus. Ohne sie wäre
  Level 4 nicht abschließbar und damit Finale, Award und Zertifikat unerreichbar.
- **Der INFO-Knopf überlebt in Level 1, Schritt 3.** Streng nach Spec wäre er mit der
  Aufgaben-Box verschwunden – dann käme aber niemand mehr an die 150 Bonuspunkte, denn
  Schritt 3 ist der letzte Bildschirm des Levels. Er steht jetzt in der neuen
  Hinweiszeile.
- **Die Avatar-Karte hat einen Tastaturweg bekommen**, obwohl die Spec nur vom
  Entfernen des Knopfes spricht: Der Knopf war der einzige Weg zur Auswahl ohne Maus.
- **Die Musik wird als AAC ausgeliefert**, nicht als gelieferte WAV – ein Zehntel der
  Größe bei gleicher Länge. Ein Encoder für echtes MP3 stand nicht zur Verfügung.
- **Der Puls des Info-Knopfes nutzt `drop-shadow` statt `box-shadow`** – anders wäre
  der geforderte „Lichtschein um den Button" wegen des `clip-path` kaum sichtbar.
- **Nicht betroffen vom Orange:** die Stations-Hilfe-Knöpfe in Level 1 und der
  ⓘ-Knopf auf der Avatar-Auswahl. Die Spec spricht vom Info-Knopf „in allen Leveln";
  mehrere pulsierende Orangetöne nebeneinander wären Lärm statt Hinweis.

---

## [0.11.0] – 2026-08-06 – Die pH-Frage, ehrliche Tastenkürzel & Hintergrundmusik

Snapshot: [`releases/v0.11.0/`](releases/v0.11.0/). Setzt den Merge-Commit
„Konflikt in Level 4 behoben" um (`levels/level-2-schatten-archiv.md`,
`levels/level-4-prisma-der-stadt.md`, `allgemein.md`).

### Spec (`story/`)
- **Level 2** – die pH-Frage muss „besonders dick, auffällig und gut sichtbar" sein,
  die Optionen A und B **gleich gut sichtbar**.
- **Level 4** – 360°-Drehung mit den Pfeiltasten, Klick auf die Kreis-Marker; andere
  Tastenbefehle zur Objektanwahl deaktiviert.
- **`allgemein.md`** – Hintergrundmusik „Loopix" (CC BY 4.0) in Endlosschleife, leise,
  mit **eigenem Knopf oben** und Credits im Abspann.
- Aufgeräumt: **zwei Konfliktmarker** (`=======`, `>>>>>>> 9fe7f02…`), die der Merge
  mitten in der Level-4-Spec hinterlassen hatte – der Inhalt dazwischen blieb
  vollständig erhalten. `levels/musik.md` war 0 Byte und beschreibt jetzt die
  Musik-Umsetzung samt offenem Punkt.

### Game (`game/`)
- **Level 2 verriet die Lösung – behoben.** Die Button-Klasse hing am Richtig-Flag
  (`o.ok ? 'btn-neon' : 'btn-ghost'`): Die **richtige** Antwort leuchtete als
  Hauptknopf, die falsche war blass ausgegraut. Jetzt tragen beide dieselbe Klasse
  `.choice-btn` – gleiche Farbe, Größe und Rahmen, unterschieden nur durch das Badge
  **(A)** / **(B)** und den Text. Das Flag wertet ausschließlich der Klick-Handler aus.
- **Die Frage ist jetzt das Auffälligste auf dem Bildschirm** (`.instr-question`:
  1,15 rem, fett, ⚠, Rahmen und Glow, `role="status"`); vorher stand sie in `.hint`,
  der kleinsten und blassesten Textklasse. Die Begründung darüber ebenfalls in
  Lesegröße. Eine falsch probierte Option wird markiert, die Frage bleibt bedienbar.
  **Punkte unverändert.**
- **Level 4 versprach Tasten, die es nicht gab – behoben.** Die Entscheidungs-Knöpfe
  trugen `aria-keyshortcuts="f"` / `"s"`, ohne dass je ein Handler existierte;
  Screenreader lasen sie vor, gedrückt passierte nichts. Entfernt, ebenso die
  undokumentierte `Home`-Taste. In der 360°-Ansicht wirken damit **nur noch die
  Pfeiltasten**.
- **„Taste 1/2/3" in Phase A wirkt jetzt wirklich** – die Beschriftung stand sichtbar
  an den Diagramm-Knöpfen, die Tasten taten nichts. Implementiert wie die Verdikte in
  Level 3; in der 360°-Ansicht bleiben Zifferntasten wirkungslos.
- Nebenbei: Die unsichtbare 48×48-Trefferfläche der Hotspots hing an der Oberkante und
  deckte das Label darunter nicht ab – jetzt zentriert.
- **Hintergrundmusik** (neu: `NX.audio.music`): `<audio loop>` bei Lautstärke **0,22**
  (Effekte liegen bei 0,08–0,18); während vorgelesen wird, sinkt die Musik auf 0,07 und
  steigt danach wieder. Eigener **🎵-Knopf** oben rechts neben dem Ton-Knopf, auf allen
  Bildschirmen; Zustand über Dimmung, Schrägstrich **und** `aria-pressed`. **🔊 bleibt
  Hauptschalter** und schaltet die Musik mit stumm. Einstellung in `nexusdata.music`.
  Start erst nach der ersten Nutzeraktion (Autoplay-Regel).
- **CC-BY-Namensnennung** im Abspann und auf der Startseite – **nur**, wenn die
  Musikdatei tatsächlich vorhanden ist.
- `app.js` ist gegen doppelte Verdrahtung abgesichert: Zwei Klick-Listener auf demselben
  Schalter hätten ihn zweimal umgelegt, also gar nicht.
- Der Ecktext der Startseite weicht jetzt bei allen Bildschirmbreiten an den beiden
  Knöpfen vorbei (vorher überdeckte der zweite Knopf „SYSTEM STATUS: OFFLINE").

### Bewusste Abweichungen von der Spec
- **Die Musikdatei liegt nicht bei.** „Loopix" ist benannt, aber weder im Repo noch
  über die genannte `Music_Musik.md` auffindbar; Freesound verlangt für den Download
  ein Konto. Gebaut ist die komplette Technik – Datei nach
  `game/media/musik-loop.mp3` legen genügt, kein Code-Eingriff. Bis dahin bleibt der
  Knopf aus und es erscheint keine Namensnennung.
- **Tabulator und Enter bleiben in der 360°-Stadt.** Wörtlich genommen würde „andere
  Tastenbefehle sind deaktiviert" auch sie treffen – dann wäre das Level nur noch mit
  der Maus spielbar und für Kinder ohne Maus gesperrt. Tabulator ist kein Kürzel zur
  Objektanwahl, sondern der normale Browser-Weg.
- **Der Loop kann eine winzige Lücke haben.** Ein lückenloser Loop bräuchte
  WebAudio-Buffer und damit `fetch()`, das unter `file://` scheitert – das Spiel muss
  aber auch per Doppelklick auf `index.html` laufen.
- **pH-Skala:** Die Spec schreibt „der Skalenbereich geht von 8 bis 14". Sie reicht von
  **0 bis 14**; der Spieltext nennt weiterhin den korrekten Bereich.

---

## [0.10.0] – 2026-08-06 – Ein Vorlese-Knopf, Lerntypen, Level-1-Begriffe & Level-2-Ansage

Snapshot: [`releases/v0.10.0/`](releases/v0.10.0/). Setzt den Spec-Commit
„Stimmme wurde verbessert bzw. Usability verbessert" um (`stimme.md` neu,
`avatar.md`, `levels/level-1-cyber-tauben.md`, `levels/level-2-schatten-archiv.md`).

### Spec (`story/`)
- **`stimme.md`** (neu) – Lennox' Info über die MP3 statt Live-Stimme · Vorlesen nur
  auf Knopfdruck · **nur ein** Vorlese-Knopf je Person · nur Tipps und Infos, **nicht**
  die Story.
- **`avatar.md`** – Lerntyp-Bezeichnung über jedem Avatarnamen (Visuell/Auditiv/
  Kognitiv) mit ⓘ-Knopf und Erklärung, in der Avatarfarbe.
- **`level-1-cyber-tauben.md`** – neue Story (private Datenbanken gehackt → Open Data)
  · Begriffe umbenennen · Hilfe-**Knöpfe** statt Hover-Tooltips · „kostet keine Punkte"
  sichtbar machen · Glossar mit 7 Begriffen · Vergleichstabelle JSON ⇄ Dashboard.
- **`level-2-schatten-archiv.md`** – große Ansage über der URL-Zeile, klarerer
  Kategorie-Hinweis.
- Ergänzt: Umsetzungsvermerke in allen vier Dateien; `audio/stimme.md` verweist als
  überholt auf `stimme.md`; `info.md`, `overview.md`, `allgemein.md`, `game/README.md`
  nachgezogen.

### Game (`game/`)
- **Ein einziger Vorlese-Knopf** (`js/ui.js → voiceBar`): „🔊 Vorlesen" ⇄ „⏹ Stopp",
  im Tipp-Fenster, in jedem Hilfe-Fenster und im Info-Fenster – bei **allen drei**
  Avataren. Lennox' Funk-Kanal verliert `▶ ABSPIELEN`, `⏸ PAUSE` und `⏹ STOPP`;
  **„Transkript gelesen ✓" bleibt**, weil es der einzige Weg zur Bonusfrage ist, wenn
  gar kein Ton verfügbar ist.
- **Nichts startet mehr von selbst.** Die Automatik aus v0.9.0 („die KI meldet sich
  einmal je Sitzung") ist ersatzlos entfallen.
- **Zuordnungstabelle Text → Aufnahme** (neu: `js/data/voice.js`). Beim Vorlesen gilt:
  Eintrag vorhanden → die **MP3** spielt; kein Eintrag → die **Browser-Stimme** liest
  vor; Eintrag da, Datei fehlt → stiller Rückfall auf die Stimme. Eine Aufnahme
  nachliefern heißt: Datei ablegen, **eine Zeile** eintragen – kein Code, kein
  Neustart. Schlüssel: `tip-<level>-<index>`, `info-<level>-<avatar>`,
  `help-<level>-<station>`, `avatar-learn-<avatar>`, `l3-tip-…`/`l3-info-…`.
- **Avatar-Lerntypen**: Plakette **VISUELL** · **AUDITIV** · **KOGNITIV** zwischen
  Porträt und Name, in der Farbe des Avatars, daneben ein ⓘ-Knopf mit der Erklärung.
  Der Knopf stoppt den Klick, sonst hätte er nebenbei den Avatar ausgewählt.
- **Band „AUSGEWÄHLT ✓" repariert**: Das 190 px breite Band schwang durch die
  35°-Drehung mit dem linken Ende über die obere Kartenkante – die Karte hat
  `overflow: hidden`, also fehlte das „AUS". Es sitzt jetzt tiefer, weiter innen und
  ist größer gesetzt; ein Test prüft die Geometrie.
- **Level 1 · Begriffe**: „AUSRÜSTUNG" → **REQUEST-KONFIGURATOR**,
  „AUSRÜSTUNGS-HANGAR" → **TAUBEN-STATION**, „Passierschein" → **Zugangsschlüssel**,
  „TOKEN-SPEICHER" → **SCHLÜSSEL-SPEICHER**. Dazu die neue Story.
- **Level 1 · Hilfe-Knöpfe** statt Hover-Tooltips: an jeder Station ein echter Knopf
  **[ ? Was bedeutet das? ]** – auf Touchgeräten treffbar, per Tastatur erreichbar.
  Vier Fenster (URL · Methode · Token · JSON), jedes mit dem Satz „Das Lesen der Hilfe
  kostet dich **KEINE Punkte!**".
- **Level 1 · Glossar & Vergleich** im Ergebnis-Bildschirm nach dem Scan, **neben**
  Maschinen- und Menschen-Ansicht: sieben Begriffe zum Aufklappen (0 Punkte) sowie die
  Tabelle JSON ⇄ Dashboard mit Zielgruppe, Darstellung, Hauptaufgabe und Beispiel.
- **Level 2 · Ansage** über der URL-Zeile: „DIE INTERNEN SYSTEMDATEN WURDEN
  MANIPULIERT!" mit drei nummerierten Schritten und der Zeile „FOLGE DEN ANWEISUNGEN
  UND GIB DIE DATEN UNTEN EIN". Der Kategorie-Platzhalter sagt jetzt konkret, was zu
  tun ist.

### Bewusste Abweichungen von der Spec
- **Die eine Aufnahme kann nicht alle Texte sprechen.** Die Spec verlangt, dass Tipps
  „bei allen Personen zwingend über die jeweils hinterlegte MP3-Datei" vorgelesen
  werden – geliefert wurde aber genau **eine** 35-Sekunden-Datei für über 30 Textstellen.
  Umgesetzt ist deshalb die Zuordnungstabelle: Sie erfüllt „die **jeweils hinterlegte**
  MP3" wörtlich und lässt die Browser-Stimme nur dort einspringen, wo noch keine
  Aufnahme existiert.
- **Die gelieferte Aufnahme ist noch nicht zugeordnet.** Ihr gesprochener Text ist
  nirgends dokumentiert und war hier nicht feststellbar; an der falschen Stelle würde
  sie etwas anderes sagen, als auf dem Bildschirm steht. Sie liegt weiterhin unter
  `game/media/buerger-ki-stimme.mp3` und wird mit **einer Zeile** aktiv, sobald der
  Text bekannt ist (für Abschnitt 1 wäre das der Schlüssel `info-1-lennox`).
- **„Transkript gelesen ✓" ist geblieben**, obwohl die Spec nur einen Knopf nennt: Es
  ist kein Audio-Knopf, sondern der einzige Weg zur Bonusfrage ohne Ton – ihn zu
  streichen hätte stumme Geräte und Rechner ohne deutsche Stimme ausgesperrt.
- **Glossar in Level 1 statt im Info-Fenster** – so ausdrücklich gewünscht: es steht
  nach dem Scan neben Maschinen- und Menschen-Ansicht.
- **Das URL-Beispiel des Glossars wurde ausgetauscht.** Die Spec nennt
  `https://opendata.nexus.city/v1/stadtsystem` – das ist die **Lösung** dieses Levels
  und steht auf der Spoiler-Sperrliste. Im Spiel steht eine neutrale Beispiel-Adresse.
- **CSS-Klassen und interne Bezeichner behalten ihre alten Namen** (`ct-hangar`,
  `hangarText`): Umbenannt wurde nur, was Spielende zu sehen bekommen.
- **„nicht die Story vorlesen" war bereits erfüllt** – Einleitung, Level-Story und
  Finale-Ansprache hatten nie einen Vorlese-Knopf.

---

## [0.9.0] – 2026-08-05 – Stimme der Bürger-KI, Aufgabenübersicht & der tote Finale-Button

Snapshot: [`releases/v0.9.0/`](releases/v0.9.0/). Setzt die Spec-Commits „Version 9.0"
(`belohnung.md`, `levels/level-1-cyber-tauben.md`) und „Neue Stimme" (`audio/`) um.

### Spec (`story/`)
- **`audio/stimme.md`** (neu, mit MP3) – eine 35-Sekunden-Aufnahme soll die offizielle
  Stimme der Bürger-KI werden und bei Hinweisen, Tipps und im Info-Bereich spielen.
- **`belohnung.md`** – der „Zum Finale"-Button ist nicht klickbar, sitzt im Textblock
  des Open-Data-Hero-Awards und ist zu unauffällig.
- **`level-1-cyber-tauben.md`** – klar strukturierte, nummerierte Aufgabenübersicht;
  Info- und Tipp-Knopf neben der Aufgabenstellung; Hinweis auf die Extrapunkte; die
  fünf Info-Knoten sollen der Reihe nach freigeschaltet werden.
- Ergänzt: Umsetzungsvermerke in allen drei Dateien, `tasks`-Contract in
  `levels/README.md`, Sprachausgabe in `info.md` / `overview.md` / `allgemein.md`.
  **Korrigiert:** Die Rang-Tabelle in `belohnung.md` nannte noch „max. 400" – seit
  v0.8.0 sind es 5800 Punkte bei prozentualen Schwellen.

### Game (`game/`)
- **Die Bürger-KI hat eine Stimme** – zwei Quellen mit klarer Aufgabenteilung
  (`js/audio.js`, neues Untermodul `NX.audio.clip`):
  **(a)** die gelieferte Aufnahme als `media/buerger-ki-stimme.mp3` – sie meldet sich
  **einmal je Sitzung** beim ersten Tipp und beim ersten Info-Öffnen von selbst,
  danach auf Knopfdruck; **(b)** **„🔊 Vorlesen"** auf jedem Tipp, jeder Info und jeder
  Seite des Info-Fensters, gesprochen per Browser-Sprachsynthese (`de-DE`), die damit
  **beliebige** Texte lesen kann. Beide teilen sich den Stumm-Schalter und schließen
  sich gegenseitig aus. Fehlt die MP3, verschwindet der Knopf – sonst ändert sich nichts.
  Neu in `js/ui.js`: `plainText()`, `toLines()`, `voiceBar()`, `showModal(…, {speak})`.
- **Aufgabenübersicht für alle vier Level** (`index.html`, `js/screens.js`): nummerierte
  Schritte in einer eigenen Karte, der **erste offene Schritt ist hervorgehoben**,
  erledigte tragen einen grünen Haken. Ein Eintrag darf jetzt `{ text, goal: true }`
  sein – Ziel-Einträge bekommen 🎯 statt einer Nummer. **Info- und Tipp-Knopf stehen
  direkt daneben** statt im Footer unter dem ganzen Level.
- **Hinweis auf die Extrapunkte** unter den Aufgaben, **bevor** man die Info öffnet;
  nach dem Beantworten wechselt er auf „✓ Wissens-Bonus gesichert".
- **Level 1 führt Schritt für Schritt**: großes Instruktions-Banner (`.instr-banner`)
  über der Bühne, das immer genau die anstehende Aufgabe ansagt – von „Aufgabe 1:
  Wähle unter (1) URL / Zieladresse …" bis „🎯 Ziel: … in sauberes JSON umwandeln".
  Die vier Aufgaben heißen jetzt wie in der Spec-Checkliste.
- **Info-Knoten der Reihe nach** (`js/infosystem.js`): nur der hervorgehobene Knoten
  ist offen („Klick mich an!"), spätere sind sichtbar gesperrt – auch für die Tastatur.
  Bereits erkundete bleiben zum Nachlesen offen, die Verbindungslinien leuchten
  fortschreitend auf, die Bonusfrage öffnet erst nach dem letzten Knoten.
- **Der Finale-Button war wirklich tot.** `.city-finale` (z-index 12) und
  `.level-success` (5) lagen im **selben** Stacking-Context, weil keiner ihrer
  Vorfahren einen eigenen erzeugte – das Award-Panel deckte den Knopf zu. Behoben an
  der Wurzel: `.level-body` erzeugt jetzt einen eigenen Stacking-Context, damit **jedes**
  level-interne Overlay unter dem Erfolgs-Overlay bleibt; zusätzlich räumt
  `level4.js → cityFinale()` das Award-Panel ab, bevor der Abschluss feuert.
- **Der Knopf sieht jetzt aus wie ein Knopf**: eigener Aktionsbereich, links das
  Avatar-Porträt, rechts daneben der Knopf mit **pulsierendem Neon-Glühen**
  (`.btn-cta`, akzentgefärbt, mit `prefers-reduced-motion`-Ausnahme) und der Zeile
  „Zeremonie & Aura-Master-Zertifikat". Er bekommt beim Einblenden den Fokus.
  Dieselbe Klasse trägt auch „ZUM FINALE →" auf der Missionskarte.
- **Rückweg**: „‹ Zurück zur Zeremonie" auf dem Zertifikat – vorher war die Zeremonie
  eine Einbahnstraße, erneut erreichbar nur über „Nochmal spielen".
- Aufgeräumt: rund 90 Zeilen totes CSS des in v0.8.0 entfernten Level-1-Intros
  (`.ct-intro*`) und `game/shotmini.js`, ein Screenshot-Hilfsskript, das in v0.8.0
  versehentlich mitcommittet wurde.

### Bewusste Abweichungen von der Spec
- **Die Aufnahme ersetzt das Vorlesen nicht, sie ergänzt es.** Ein einzelnes
  35-Sekunden-Stück kann die über 30 Tipp- und Info-Texte des Spiels nicht sprechen.
  Deshalb spricht die Browser-Sprachsynthese die Inhalte und die MP3 ist die
  wiedererkennbare Stimme der Figur. **Der gesprochene Text der Aufnahme ist im Repo
  nicht dokumentiert** und ließ sich hier nicht abhören – die Beschriftung bleibt
  neutral („BÜRGER-KI · KI-Stimme"). Liegt das Transkript vor, lässt sich die
  Platzierung schärfen (z. B. als Finale-Ansprache, falls es eine Rede ist).
- **Nicht bei jedem Öffnen automatisch.** 35 Sekunden bei jedem Tipp wären ein
  Hinterhalt; einmal je Sitzung erfüllt „die echte KI-Stimme hören", ohne zu bremsen.
- **Die Aufgabenübersicht gilt für alle vier Level**, obwohl die Spec sie nur für
  Level 1 fordert: Sie ist gemeinsame Level-Hülle, und eine je Level unterschiedliche
  Bedienung wäre schlechter als die Einheitlichkeit.
- **„die 5 Knoten" heißt im Spiel „alle Stationen".** Fünf Knoten hat nur die
  Lyra-Variante des Info-Fensters; Lennox hört acht Funk-Zeilen, Zen liest drei
  Terminal-Seiten. Die neutrale Formulierung stimmt für alle drei Avatare.
- **Knoten-Reihenfolge sachlich statt wörtlich.** Die Spec nummeriert „4. JSON,
  5. Server"; umgesetzt ist **Programm → Anfrage → API → Server → JSON**, denn das
  JSON ist die Antwort, die vom Server zurückkommt – so sind die Verbindungslinien
  im Hologramm auch gezeichnet. Mit dem Auftraggeber abgestimmt.
- **Der Rückweg zum Finale stand nicht in der Spec**, ergänzt ihn aber sinngemäß: die
  Anweisung nennt als Ziel den reibungslosen Weg „zur finalen Zeremonie und dem
  anschließenden Zertifikat", und der war bisher nur in eine Richtung begehbar.

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
