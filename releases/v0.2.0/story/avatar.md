# Avatar-Auswahl

Die Spielenden wählen ihre Spielfigur. Jeder Avatar hat einen eigenen Look, eine Rolle
und Fähigkeiten.

**Design-Vorgabe (Mockup):**
![Mockup der Avatarauswahl](images/avatar.png)

**Aktueller Ist-Zustand (Umsetzung):**
![Avatar-Auswahl im Spiel](images/screens/avatar.png)

---

## Zweck

Identifikation mit einer Figur; leichte Personalisierung des Spiels.

## Layout & Elemente

- **Titel:** „»»» WÄHLE DEINEN AVATAR «««“. ✅
- **Untertitel:** „Jeder Avatar hat einzigartige Fähigkeiten. Wähle weise. Beschütze Nexus.“ ✅
- **Drei Avatar-Karten** (Portrait, Name, Rolle, Skill-Liste, Button „AUSWÄHLEN“). ✅
- **Linkes Panel „FÄHIGKEITEN“**: zeigt die Fähigkeiten des gerade betrachteten Avatars. ✅
- **Rechtes Panel „INFO“**: Kurzbeschreibung des betrachteten Avatars. ✅
- **Fußzeile:** „‹ ZURÜCK“ (zum Login) und „BESTÄTIGEN ✓“. ✅

## Avatare (Kanon aus dem Mockup)

| ID | Name | Rolle | Akzent | Skills (Mockup) |
|----|------|-------|--------|-----------------|
| `lyra` | **LYRA** | Die Strategin | Pink | Hacking Expertin · Schnell & Schlau · System-Analyse |
| `ben`  | **BEN**  | Der Beschützer | Gelb | Nahkampf Experte · Stark & Ausdauernd · Team-Schild |
| `zen`  | **ZEN**  | Die Visionär*in | Grün | Support Spezialist*in · Heilung & Boosts · Team Optimierung |

**Info-Texte:**
- **Lyra:** „Lyra ist Expertin für digitale Infiltration und findet immer einen Weg.“ ✅ (aus Mockup)
- **Ben:** „Ben hält den Schild hoch, wenn die Firewall bricht. Nichts kommt an ihm vorbei.“ 🟡
- **Zen:** „Zen sieht Muster, wo andere nur Chaos sehen, und bringt das Team nach vorne.“ 🟡

**Fähigkeiten-Icons (Panel „FÄHIGKEITEN“):**
- Lyra: 📡 Datenping · 🛡 Tarnprotokoll · ⚙ Systembreach ✅ (aus Mockup)
- Ben: 🛡 Schildwall · 🧱 Datenpanzer · 👁 Overwatch 🟡
- Zen: ✚ Datenheilung · 🌊 Boost-Welle · 📈 Optimierung 🟡

## Verhalten / Interaktion

- **Überfahren/Antippen** einer Karte aktualisiert die Panels „FÄHIGKEITEN“ und „INFO“ (Vorschau). 🟡
- **Auswählen** markiert die Karte (Glow + „AUSGEWÄHLT ✓“) und aktiviert „BESTÄTIGEN“. ✅
- **BESTÄTIGEN** speichert `avatarId` und führt weiter:
  - Erstdurchlauf (noch keine Schlüssel) → **Einleitung**.
  - Rückkehr mit Fortschritt → direkt zur **Missionskarte**. 🟡
- **ZURÜCK** → Login.

## Angenommene Entscheidungen (MVP)

- Die **Portraits** werden aus dem Mockup `avatar.png` **freigestellt** und in `media/`
  als einzelne Bilder abgelegt (`avatar-lyra/ben/zen.png`). 🟡
- Für **Ben** und **Zen** waren im Mockup nur die Skills sichtbar; **Info-Texte und die
  Fähigkeiten-Icons wurden ergänzt** (Lyra war vollständig vorgegeben). 🟡
- Die Fähigkeiten sind im MVP **narrativ/dekorativ** und haben **keinen Spieleffekt**. 🟡

## Umsetzung im MVP

- Daten: `game/js/data/datasets.js` → `avatars`
- Markup: `game/index.html` → `section#screen-avatar`
- Style: `game/css/style.css` → Abschnitt „AVATAR screen“
- Logik: `game/js/screens.js` → `renderAvatar()`, `previewAvatar()`, `selectAvatar()`, `confirmAvatar()`

## Offene Punkte & Iterationsideen

- 💡 **Fähigkeiten mit echtem Effekt** (z. B. Lyra: ein Gratis-Tipp; Ben: ein Fehlversuch ohne
  Abzug; Zen: kleiner Punkte-Boost) – als sanfte Differenzierung.
- 💡 Avatar-Vorschau/„Emote“-Animation wie im Mockup unten angedeutet.
- 🟡 Diversere Avatar-Auswahl / Umbenennung, falls didaktisch gewünscht.
