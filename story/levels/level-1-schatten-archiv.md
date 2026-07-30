# Level 1: Das Schatten-Archiv – Spielkonzept

### **1. Kopfbereich & Einleitung**
 **Tief im Schatten-Archiv liegen die ersten Datenfragmente. Auch der Nebel hat Datensätze beschädigt. Prüfe die offenen Datensätze, finde die unmöglichen Werte, korrigiere sie, nur saubere Daten öffnen das Schloss.**

**Checkliste (Fortschritt):**
  * [ ] Verständnis: Open Data
  * [ ] Datensatz prüfen
  * [ ] Falschen Wert korrigieren
  * [ ] Schlüssel finden
**Anleitung ganz oben:**
  * "Vergleiche die Daten in der Tabelle mit den Werten bei den Brunnen. Tippe die Brunnen an, um den wahren Wert zu sehen, und korrigiere die falschen Einträge in der Tabelle!"

---

### **2. Visuelle Bezirks-Stationen (Individuelle Neon-Brunnen)**
**5 einzigartige Brunnen:** Jeder Bezirk besitzt sein ganz eigenes, farbenfrohes Design im Neon-/Cyberpunk-Stil:
  * **Zentrum:** Futuristischer High-Tech-Brunnen.
  * **Hafen:** Maritimer Industriepumpen-Brunnen.
  * **Altstadt:** Historischer Steinbrunnen mit leuchtenden Neon-Adern.
  * **Nordpark:** Organischer Brunnen umgeben von Neon-Pflanzen.
  * **Industrie:** Robuster, mechanischer Mess-Brunnen mit Zahnrädern.
**Messen per Klick/Tipp:**
  1. Der Spieler **tippt den jeweiligen Brunnen an**.
  2. Es startet eine kurze Mess-Animation (z. B. mit der Pipette).
  3. Der **wahre Messwert** vor Ort wird enthüllt und angezeigt.

---

### **3. Datenqualitäts-Balken & Datentabelle**

#### **Datenqualitäts-Anzeige (Progress Bar)**
**Regenbogen-Balken:** Ein farbiger Verlaufsbalken (von Rot über Gelb nach Grün) zeigt den aktuellen Stand der Datenqualität visuell an.
**Prozent-Anzeige:** Startet bei **80 %** und steigt erst auf **100 %**, wenn alle unmöglichen Werte korrigiert wurden.

#### **Datentabelle (Stadt Nexus – Trinkbrunnen)**
**Unmögliche Werte:** Die Tabelle enthält extreme Ausreißer und Messfehler (z. B. **2000 °C** oder **-300 °C**, was unter dem absoluten Nullpunkt liegt).

| ID | Bezirk | pH-Wert | Temperatur °C | Status |
| :--- | :--- | :---: | :---: | :---: |
| **BR-01** | Zentrum | 7.2 | **2000.0** (Fehler) | aktiv |
| **BR-02** | Hafen | 7.5 | 12.1 | aktiv |
| **BR-03** | Altstadt | 6.9 | **-300.0** (Fehler) | aktiv |
| **BR-04** | Nordpark | 7.0 | 11.0 | aktiv |
| **BR-05** | Industrie | 7.1 | 12.6 | aktiv |

---

### **4. Interaktives Korrektur-System**
1. **Vergleichen:** Den wahren Messwert am Brunnen ablesen (z. B. per Pipette) und mit dem Eintrag in der Datentabelle vergleichen.
2. **Wert anklicken:** Direkt auf den fehlerhaften Temperaturwert in der Tabelle tippen.
3. **Eingabefeld (Pop-up):** Es öffnet sich ein Pop-up-Fenster mit der Beschriftung "Korrigierter Temperaturwert (°C):".
4. **Bestätigen:** Den echten Messwert eintippen und auf den Button **[ Korrigieren ]** drücken.
5. **Erfolg:** Bei korrekter Eingabe springt die Datenqualität auf **100 %**, der Regenbogen-Balken leuchtet voll grün, der Haken bei "Falschen Wert korrigieren" wird grün aktiviert und der Schlüssel schaltet sich frei.

---

### **5. Bottom-Bar (Rechts unten)**
**[ TIPP ]-Button:** Hilft mit konkreten Hinweisen zum aktuellen Spielschritt weiter, falls man feststeckt.
**[ INFO ]-Button:** Öffnet ein reines Fach-Lexikon zur Begriffs-Erklärung (z. B. Open Data, Datenqualität), **ohne** Spielhinweise oder Lösungen zu verraten.