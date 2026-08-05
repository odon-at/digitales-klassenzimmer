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