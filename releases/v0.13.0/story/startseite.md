# Startseite – NEXUS DATA (Cyberpunk Tower Edition)

**Untertitel:** Der erste Bildschirm des Spiels (Ton, Look & Einstieg)
**Akzentfarbe:** Neon-Violett (#8A2BE2) & Cyber-Cyan (#00FFFF)
**Design-Vorgabe:** Nahtlose Integration der Cyberpunk-Nachtansicht der Stadt (images/startseite.jpeg) als vollflächiger, abgedunkelter Hintergrund mit leuchtenden Towern und tiefschwarzem Nachthimmel.

---

## 1. Visuelles Konzept & Hintergrund (Fixierung des Layouts)

**Der Hintergrund:** Die Datei images/startseite.jpeg zeigt eine detailreiche Cyberpunk-Nachtansicht der Stadt mit markanten, leuchtenden Towern und Neon-Akzenten vor einem satten, schwarzen Nachthimmel. Das Bild ist so eingebunden, dass alle UI-Elemente und HUD-Texte gestochen scharf darüber liegen.
**Keine Doppel-Text-Überlappung:** Der Haupttitel „NEXUS DATA“ wird als **rechter HTML-Text** exakt ein einziges Mal scharf und zentriert gerendert (kein doppelter Schatten oder verpixelter Klon).

---

## 2. Layout & Elemente (Von oben nach unten)

1. **HUD-Ecktexte (Terminal-Flair):**
   * **Oben links (vertikal):** OPEN DATA
   * **Oben rechts:** SYSTEM STATUS: OFFLINE · CITY: OFFLINE · TIME: 03:00
   * **Unten links:** VERBINDUNG … · NETZWERK: INSTABIL
   * **Unten rechts:** FEIND: UNBEKANNT · ZIEL: OPEN DATA ARCHIV · STATUS: MISSION AKTIV

2. **Markenlogo (Zentral):**
   * **NEXUS** (in leuchtendem Violett)
   * **DATA** (in Cyan, weit gesperrt, mit starkem Glow-Effekt)

3. **Spiel-Icon & Zielring:**
   * Dekorativer **Zielring** direkt unter dem Logo.

4. **Autoren-Credits:**
   * „Open Data Classroom · Ein Spiel von Sarah & Chiara“

5. **Tagline / Story-Text:**
   * „Die Stadt ist im digitalen Koma. Hol die Open-Data-Fragmente zurück.“

6. **Haupt-Interaktion (Start-Button):**
   * **Button „▶ SPIEL STARTEN“** (bzw. bei vorhandenem Spielstand dynamisch: **„⟳ WEITERSPIELEN“** und **„⟲ NEUES SPIEL“**).

---

## 3. Verhalten & Logik (MVP)

**Klick auf Start / Weiterspielen:** Führt direkt zur Missionskarte oder zum Login.
**Zeitanzeige 03:00:** Bewusst an die Story des Cyber-Angriffs angelehnt.
**Netzwerk-Flackern:** Der Status-Schriftzug VERBINDUNG / NETZWERK INSTABIL besitzt eine dezente Cyberpunk-Flicker-Animation vor dem dunklen Nachthimmel der Stadt.

---

## 4. Technische Umsetzung (index.html)

**Markup:** game/index.html → section#screen-start (mit eingebundenem Cyberpunk-Stadt-Hintergrundbild images/startseite.jpeg und fixer Flexbox-Zentrierung ohne Text-Duplikate).
**Logik:** game/js/screens.js → renderStart(), Button-Verkabelung in init().

## 🎨 ÄNDERUNG: HINTERGRUND DER STARTSEITE

Als Hintergrund für die Startseite wird ab sofort exakt das Bild aus Startseite.jpeg verwendet (kein leerer, schwarzer Hintergrund).

> **Umsetzung v0.8.0:** `media/startseite.jpeg` ist jetzt deutlich sichtbar –
> leuchtende Skyline links und rechts, nasse Straße unten, nur noch leicht
> abgedunkelt statt stark weichgezeichnet.
>
> **Zielkonflikt:** In der Bilddatei sind Titel, Zielring, „SPIEL STARTEN“-Button
> **und alle vier HUD-Ecktexte fest eingebrannt.** Abschnitt 1 dieser Spec verbietet
> aber ausdrücklich doppelte Titel. Gelöst durch einen Bildausschnitt plus eine
> weiche Abdunklung genau über der Mittelspalte: Die Stadt bleibt sichtbar, die
> eingebrannte Mitte verschwindet, und die echten HTML-Elemente (mit Flacker-
> Animation, Tastaturbedienung und Screenreader-Text) erscheinen nur einmal.
> Ein Bild **ohne** eingebrannte UI wäre die sauberere Lösung.


##  Beschreibung für das Über uns Fenster im Spiel Nexus Data

## Übersicht
Diese Beschreibung erklärt den Aufbau, die Gestaltung und die Funktionsweise des neuen Elements für die Startseite.

---



## 1. Der Über uns Knopf auf der Startseite

### Positionierung
Der Knopf für Über uns befindet sich zentriert direkt oberhalb der beiden Hauptschaltflächen Neues Spiel und Weiterspielen.

### Visuelles Erscheinungsbild
Der Knopf ist bewusst dezent gestaltet, damit er den Hauptfokus nicht vom Spiel ablenkt:
Transparenter Hintergrund ohne auffällige Füllung.
Ein schmaler, leicht leuchtender Rahmen.
Eine zurückhaltende graue Schriftfarbe.
Abgerundete Ecken für ein modernes Design.

### Interaktion beim Drüberfahren mit der Maus
Sobald der Mauszeiger über den Knopf bewegt wird, reagiert dieser sanft:
Die Schriftfarbe und der Rahmen wechseln zu einem hellen Blauton.
Ein feiner Leuchteffekt erscheint um den Knopf herum.

---

## 2. Das Pop-up Fenster

### Erscheinungsbild und Platzierung
Wenn der Knopf angeklickt wird, öffnet sich ein Fenster genau in der Mitte des Bildschirms:
Der gesamte Hintergrund hinter dem Fenster wird abgedunkelt und leicht unscharf gemacht.
Das Fenster hat einen dunklen Hintergrund, der zum Design des Spiels passt.
Der Rand des Fensters ist mit einer hellen, leuchtenden Linie hervorgehoben.

### Inhalt des Fensters
Das Fenster ist übersichtlich strukturiert und enthält folgende Elemente von oben nach unten:
X (oben rechts): Schließen Knopf: Ein Zeichen in der oberen rechten Ecke zum Schließen des Fensters.
X (zentriert): Hauptüberschrift: Hinter den Kulissen: Wer steckt hinter dem Spiel?
X (zentriert) ---> HIER STEHT EUER TEXT <--- :
  Dieses Spiel ist im Rahmen eines 3-wöchigen Praktikums bei ODON (Offene Daten für Offene Nutzung) entstanden.
  Die Schwestern Sarah und Chiara Hamedinger hatten ein klares Ziel: Komplexe Open Data greifbar zu machen und in ein spannendes, interaktives Spielerlebnis zu verwandeln.
  „Wir wollten zeigen, dass offene Daten alles andere als trocken sind – sondern richtig Spaß machen können, wenn man sie spielerisch entdeckt!“ — Sarah & Chiara

  Link: https://www.linkedin.com/company/odon-at/

  Außerdem haben sie fachliches Feedback von Mimikama und wertvolle Tipps erhalten, um die Inhalte noch präziser und lehrreicher zu gestalten.

  Tauche ein und erlebe, wie viel Spaß der Umgang mit Daten machen kann!
  [ Jetzt spielen! ]

Logobereich :
! [ODON Logo] (odon.png)
! [Mimikama Logo] (mimikama.png)


Das Mimikama Logo, als auch das Odon Logo befindet sich unter story/images.

## 3. Funktionsweise im Spiel

### Öffnen des Fensters
Ein Klick auf den Knopf Über uns lässt das Fenster auf dem Bildschirm erscheinen.

### Schließen des Fensters
Das Fenster kann auf zwei Arten wieder geschlossen werden:
Durch einen Klick auf das Schließen Symbol oben rechts im Fenster.
Durch einen Klick auf den abgedunkelten Bereich außerhalb des Fensters.

---

## ✅ Umsetzung v0.13.0 – „Über uns"

**Der Knopf** (`#btn-about`) steht zentriert zwischen der Tagline und den beiden
Hauptschaltflächen: transparenter Grund, schmaler, schwach leuchtender Rahmen,
zurückhaltendes Grau, runde Ecken. Beim Überfahren wechseln Schrift und Rahmen auf
helles Blau und ein weicher Schein erscheint.

> **Technischer Hinweis:** Der Schein läuft über `filter: drop-shadow()`. Die
> allgemeine `.btn`-Klasse hat ein `clip-path`, das `box-shadow` abschneidet –
> dieselbe Falle wie beim orangen Info-Knopf in v0.12.0. `.btn-about` ist deshalb
> bewusst **keine** `.btn`-Variante, sondern eine eigenständige Klasse.

**Das Fenster** ist ein eigenes Overlay `#aboutscreen` nach dem Vorbild des
Info-Fensters (das allgemeine `ui.showModal` kennt weder ✕ noch Bilder noch einen
eigenen Aktionsknopf): abgedunkelter, weichgezeichneter Hintergrund, dunkles Panel mit
leuchtendem Rahmen, ✕ oben rechts, die Überschrift „Hinter den Kulissen: Wer steckt
hinter dem Spiel?", der Text aus dieser Spec samt Zitat als eigener Block, der
LinkedIn-Link, der Mimikama-Hinweis, **[ Jetzt spielen! ]** und darunter die Logos.

Geschlossen wird über **✕**, einen Klick auf den abgedunkelten Rand **und** über
**Escape**; danach kehrt der Fokus auf den „Über uns"-Knopf zurück. Das Overlay trägt
`.no-print`, damit es auf dem Zertifikat nicht mitgedruckt wird.

**„Jetzt spielen!"** schließt das Fenster und nimmt exakt denselben Weg wie
„▶ SPIEL STARTEN" – dafür ist der bis dahin anonyme Klick-Handler in die benannte
Funktion `startNewGame()` gewandert. Es gibt also weiterhin nur **einen** Startweg,
inklusive der Rückfrage, wenn ein Spielstand existiert.

**Die Logos** liegen als `game/media/odon.png` und `game/media/mimikama.png` – der
Ordner `game/` muss für sich allein weitergebbar bleiben, deshalb Kopien statt Verweise
auf `story/images/`.

> **Gestalterische Ergänzung:** Beide Logos sind dunkel getönt und für **helle**
> Untergründe gezeichnet; auf dem dunklen Panel verlieren sie ihre Kontur. Sie stehen
> deshalb auf einem hellen Streifen – so erscheinen beide Marken in ihren echten
> Farben, statt umgefärbt zu werden. Die sehr unterschiedlichen Seitenverhältnisse
> (ODON 1:1 mit breitem Leerrand, Mimikama 4,7:1 randlos) bekommen unterschiedliche
> Höhen plus `object-fit: contain`, damit nichts verzerrt und beide gleich groß wirken.

**Der externe Link** ist der erste im ganzen Spiel und trägt deshalb
`target="_blank" rel="noopener noreferrer"`.
