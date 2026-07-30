# Versionierung – NEXUS DATA

Eine **einfache** Versionierung, mit der sich **Spec-Änderungen** (`story/`) und die daraus
gebauten **Game-Änderungen** (`game/`) je Iteration vergleichen und leicht zwischen Versionen
springen lassen – **ohne Spezialwerkzeug**.

## Grundidee

- **Eine Version = ein zusammengehöriger Stand aus `story/` UND `game/`.**
- Jede Version wird als **Snapshot-Ordner** unter [`releases/`](releases/) abgelegt:
  `releases/vX.Y.Z/` enthält eine vollständige Kopie von `story/` und `game/`.
- Der [CHANGELOG.md](CHANGELOG.md) beschreibt pro Version, **was sich in der Spec** und
  **was sich im Game** geändert hat (getrennte Abschnitte) – so ist der Zusammenhang sofort lesbar.
- Das Spiel zeigt seine Version an (Startseite unten, Zertifikat-Fußzeile). Quelle:
  [`game/js/version.js`](game/js/version.js) → `NX.build = { version, date }`.

**Versionsschema:** `MAJOR.MINOR.PATCH`
- **MINOR** erhöhen bei einem normalen Build-Loop / neuen Feature (z. B. 0.1.0 → 0.2.0).
- **PATCH** für kleine Korrekturen ohne Spec-Änderung (0.2.0 → 0.2.1).
- **MAJOR** für große Umbrüche (Spielstruktur/Format).
- Alternative, falls lieber: datumsbasiert (`2026-07-30`). Wichtig ist nur: **konsequent gleich** in
  `version.js`, `CHANGELOG.md` und im Ordnernamen unter `releases/`.

---

## Der Build-Loop (Schritt für Schritt, manuell)

1. **Spec bearbeiten** – Änderungen in `story/…` vornehmen (z. B. ein Level neu beschreiben).
2. **Bauen** – Game in `game/` an die neue Spec anpassen (Build-Loop, ggf. mit KI).
3. **Version festlegen** – neue Nummer wählen (z. B. `0.2.0`) und in
   [`game/js/version.js`](game/js/version.js) eintragen (`version` **und** `date`).
4. **Snapshot anlegen** – aktuellen Stand einfrieren:
   ```bash
   cd digitales-klassenzimmer
   mkdir -p releases/v0.2.0
   cp -R story game releases/v0.2.0/
   ```
5. **Changelog ergänzen** – in [CHANGELOG.md](CHANGELOG.md) oben einen neuen Block einfügen
   (Vorlage steht am Ende der Datei) mit den Abschnitten **Spec** und **Game**.
6. **Sichern (optional, empfohlen)** – mit Git festhalten und auf GitHub sichern:
   ```bash
   git add -A
   git commit -m "v0.2.0: Level 3 als Swipe-Karten (Spec+Game)"
   git push
   ```

> Tipp: Erst committen, **dann** den `cp -R`-Snapshot – oder umgekehrt; beides ist ok.
> Der Snapshot ist der Anker fürs Öffnen/Vergleichen ohne Git.

---

## Zwischen Versionen springen

- **Version spielen:** die Datei `releases/vX.Y.Z/game/index.html` im Browser öffnen
  (Doppelklick genügt; für Diagramme/Konfetti ist Internet nötig – siehe `game/README.md`).
- Die aktuelle Arbeitsfassung liegt immer direkt in `game/` bzw. `story/`.
- Welche Version man gerade spielt, steht **auf der Startseite unten** und **auf dem Zertifikat**.

## Änderungen vergleichen (Spec ↔ Game)

**Ohne Git – Ordner vergleichen:**
```bash
# Was hat sich zwischen zwei Versionen in der Spec bzw. im Game geändert?
diff -r releases/v0.1.0/story releases/v0.2.0/story
diff -r releases/v0.1.0/game  releases/v0.2.0/game
```
(grafische Tools wie *Meld*, *Beyond Compare* oder der Ordnervergleich in VS Code funktionieren genauso).

**Mit Git (Bonus, komfortabler):**
```bash
git diff v0.1.0 v0.2.0 -- story/   # nur Spec-Änderungen
git diff v0.1.0 v0.2.0 -- game/    # nur Game-Änderungen
```
(setzt voraus, dass pro Version zusätzlich ein Tag gesetzt wurde: `git tag v0.2.0`).

Am schnellsten lesbar bleibt aber der **[CHANGELOG.md](CHANGELOG.md)** – dort steht die
Zuordnung „diese Spec-Änderung → diese Game-Änderung" in Worten.

---

## Speicherplatz-Hinweis

Jeder Snapshot kopiert `story/` + `game/` inkl. Bilder/Screenshots (~9 MB/Version). Für ein
Schulprojekt mit wenigen Versionen unproblematisch. Falls das Repo zu groß wird:

- die **unveränderten Mockups** (`story/images/*.jpeg|png`) aus Snapshots weglassen –
  z. B. nur `story/` (Markdown) + `story/images/screens/` + `game/` kopieren, **oder**
- `releases/` per `.gitignore` nur **lokal** halten (dann keine GitHub-Sicherung der Snapshots).

---

## Wo liegt was?

| Zweck | Ort |
|---|---|
| Angezeigte Version (im Spiel) | `game/js/version.js` (`NX.build`) |
| Was sich je Version geändert hat | `CHANGELOG.md` |
| Eingefrorene, spielbare Versionen | `releases/vX.Y.Z/` |
| Design-Quelle (aktuell) | `story/` |
| Umsetzung (aktuell) | `game/` |
