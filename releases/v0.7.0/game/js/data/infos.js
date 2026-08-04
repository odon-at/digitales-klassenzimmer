/* =========================================================================
   infos.js — Inhalte für den ℹ-Info-Button (0 Punkte).

   REGEL (story/info.md §1): Hier steht AUSSCHLIESSLICH Begriffs- und
   Konzeptwissen. Keine Lösungswege, keine Hinweise zur aktuellen Aufgabe,
   keine konkreten Werte aus den Auswahllisten des Levels (siehe `forbidden`).
   Konkrete Hilfen gehören in `tips` des Level-Moduls (💡 Tipp, kostet Punkte).

   Je Level drei Darstellungen nach Lerntyp des gewählten Avatars:
     lyra   – visuell   : interaktive Hologramm-Mindmap
     lennox – auditiv   : Funk-Kanal mit Sprachausgabe + Transkript
     zen    – kognitiv  : Hacker-Terminal, seitenweise
   Dazu je eine Bonusfrage (einmalig Punkte, siehe NX.state.awardBonus).

   ACHTUNG Level-Nummerierung: seit v0.5.0 ist Level 1 = Cyber-Tauben (API)
   und Level 2 = Schattenarchiv (Open Data). Geschlüsselt wird nach Level-ID.
   Exposes: window.NX.infos
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  var infos = {};

  /* ---------------- Level 1 · API · Token · JSON ---------------- */
  infos[1] = {
    id: 1,
    title: 'INFO · WAS IST EINE API?',
    term: 'API · ENDPOINT · TOKEN · JSON',
    bonusPoints: 15,
    forbidden: ['opendata.nexus.city', 'intranet.nexus.local', 'daten-download.fog',
                'NX-TOKEN-7F3A-9K2D', 'GAST-0000'],

    lyra: {
      headline: 'HOLOGRAMM · DER WEG EINER DATEN-ANFRAGE',
      caption: 'Tippe jeden Knoten an – das Hologramm baut sich Stück für Stück auf.',
      nodes: [
        { id: 'app',  x: 14, y: 31, icon: '💻', label: 'Programm', color: '#ff2fb0',
          text: 'Hier startet die Frage: „Gib mir bitte diese Daten."' },
        { id: 'req',  x: 34, y: 12, icon: '📨', label: 'Anfrage', color: '#00f3ff',
          text: 'Drei Teile: Adresse (Endpoint) + Auftrag (Methode) + Passierschein (Token).' },
        { id: 'api',  x: 52, y: 31, icon: '🔌', label: 'API', color: '#b25cff',
          text: 'Die Übergabestelle. Sie nimmt die Anfrage an und prüft den Passierschein.' },
        { id: 'srv',  x: 78, y: 31, icon: '🗄️', label: 'Server', color: '#00f3ff',
          text: 'Dort liegen die Daten. Er antwortet mit einem Statuscode.' },
        { id: 'json', x: 52, y: 52, icon: '🧾', label: 'JSON', color: '#39ff88',
          text: 'Die Antwort: jede Info trägt ein Etikett – „Schlüssel": Wert.' }
      ],
      edges: [['app', 'req'], ['req', 'api'], ['api', 'srv'], ['srv', 'json'], ['json', 'app']],
      analogy: {
        icon: '🏛️', title: 'Bild dazu',
        text: 'Die API ist der Schalter im Amt: du gibst einen Zettel (Anfrage) mit Ausweis (Token) ab ' +
              'und bekommst eine sauber beschriftete Mappe (JSON) zurück.'
      },
      bonus: {
        prompt: 'Klicke das Symbol, das eine API am besten darstellt.',
        options: [
          { id: 'a', icon: '🔒', label: 'Ein Tresor' },
          { id: 'b', icon: '🪟', label: 'Ein Schalter zwischen zwei Räumen' },
          { id: 'c', icon: '📊', label: 'Ein Säulendiagramm' },
          { id: 'd', icon: '🔍', label: 'Eine Lupe' }
        ],
        answer: 'b',
        okText: 'Genau – die API ist die Übergabestelle zwischen zwei Programmen.',
        failText: 'Nicht ganz: Eine API speichert nichts und zeigt nichts an – sie ist die Übergabestelle.'
      }
    },

    lennox: {
      headline: 'NEXUS-FUNK · KANAL 7.3 · LENNOX ERKLÄRT',
      channel: '7.3 MHz',
      // Eine Aussage pro Zeile = eine Sprech-Einheit (Chunking, siehe audio.voice)
      script: [
        { who: 'LENNOX', text: 'Hey, pass auf – ich erklär dir das kurz über Funk.' },
        { who: 'LENNOX', text: 'Eine API ist wie ein Schalter im Amt: du fragst dort Daten an, statt selbst ins Archiv zu laufen.' },
        { who: 'LENNOX', text: 'Damit dein Zettel ankommt, braucht er drei Sachen: eine Adresse, einen Auftrag und einen Ausweis.' },
        { who: 'LENNOX', text: 'Die Adresse heißt Endpoint. Der Auftrag heißt Methode: abholen oder hinbringen.' },
        { who: 'LENNOX', text: 'Der Ausweis ist der API-Token, ein digitaler Passierschein. Ohne gültigen Passierschein: kein Zutritt.' },
        { who: 'FUNK',   text: 'krrrz … Verbindung stabil …' },
        { who: 'LENNOX', text: 'Die Antwort kommt als JSON. Jede Information trägt dort ein Etikett: Schlüssel, Doppelpunkt, Wert.' },
        { who: 'LENNOX', text: 'Merk dir: Adresse, Auftrag, Ausweis – und eine Antwort mit Etiketten. Ende.' }
      ],
      bonus: {
        prompt: 'Funk-Check: Was war laut Lennox der „Ausweis"?',
        options: [
          { id: 'a', label: 'Der Endpoint – die Adresse' },
          { id: 'b', label: 'Der API-Token – der Passierschein' },
          { id: 'c', label: 'Das JSON – die Antwort' }
        ],
        answer: 'b',
        okText: 'Sauber zugehört! Der Token ist der Passierschein.',
        failText: 'Nochmal reinhören: Adresse = Endpoint, Auftrag = Methode, Ausweis = Token.'
      }
    },

    zen: {
      headline: 'nexus@terminal:~/glossar/api',
      pages: [
        [ { k: 'h',  v: 'API — Definition' },
          { k: 'p',  v: 'Schnittstelle, über die ein Programm Daten bei einem anderen Programm anfordert.' },
          { k: 'ul', v: ['Endpoint = genaue Zieladresse (URL)',
                         'Methode  = GET (holen) | POST (senden)',
                         'Token    = digitaler Passierschein'] } ],
        [ { k: 'h',    v: 'JSON — Aufbau' },
          { k: 'code', v: '{\n  "buch": {\n    "titel": "Datenkunde",\n    "seiten": 128\n  }\n}' },
          { k: 'p',    v: 'Jeder Wert trägt ein Etikett ("Schlüssel"). Geschweifte Klammern gruppieren, was zusammengehört.' } ],
        [ { k: 'h',  v: 'Statuscodes' },
          { k: 'kv', v: [['200', 'OK – Antwort folgt'],
                         ['401', 'Unauthorized – Passierschein fehlt oder ist ungültig'],
                         ['404', 'Not Found – Adresse unbekannt'],
                         ['405', 'Method Not Allowed – falscher Auftrag']] },
          { k: 'h',  v: 'Checkliste' },
          { k: 'ul', v: ['Adresse bekannt?', 'Auftrag klar (holen/senden)?',
                         'Passierschein gültig?', 'Antwort im Etiketten-Format?'] } ]
      ],
      bonus: {
        prompt: 'Logik-Check: Welche Zeile ist gültiges JSON?',
        options: [
          { id: 'a', label: 'kennzahl = "Einwohnerzahl"' },
          { id: 'b', label: '"kennzahl": "Einwohnerzahl"' },
          { id: 'c', label: '<kennzahl>Einwohnerzahl</kennzahl>' }
        ],
        answer: 'b',
        okText: 'Korrekt: "Schlüssel": Wert, beides in Anführungszeichen, getrennt durch Doppelpunkt.',
        failText: 'a ist eine Zuweisung, c ist XML. JSON schreibt "Schlüssel": Wert.'
      }
    }
  };

  /* ---------------- Level 2 · Open Data & Datenqualität ---------------- */
  infos[2] = {
    id: 2,
    title: 'INFO · WAS IST OPEN DATA?',
    term: 'OPEN DATA · LIZENZ · DATENQUALITÄT',
    bonusPoints: 15,
    forbidden: ['datenbehoerde-nexus', '48.500', '512.340', 'Einwandfrei', 'Automatisch'],

    lyra: {
      headline: 'HOLOGRAMM · DER OPEN-DATA-KREISLAUF',
      caption: 'Tippe jeden Knoten an – so schließt sich der Kreis.',
      nodes: [
        { id: 'amt',  x: 16, y: 30, icon: '🏛️', label: 'Behörde', color: '#00f3ff',
          text: 'Ämter erheben Daten – Verbrauch, Verkehr, Umwelt.' },
        { id: 'pub',  x: 38, y: 12, icon: '🌐', label: 'Veröffentlichung', color: '#ff2fb0',
          text: 'Die Daten werden offen ins Netz gestellt: für alle, kostenlos, maschinenlesbar.' },
        { id: 'use',  x: 62, y: 30, icon: '🧑‍🎓', label: 'Freie Nutzung', color: '#39ff88',
          text: 'Jede und jeder darf sie nutzen, prüfen und weiterverarbeiten – auch du.' },
        { id: 'back', x: 38, y: 52, icon: '🔁', label: 'Rückmeldung', color: '#b25cff',
          text: 'Fehler fallen auf, weil viele hinschauen. Die Daten werden dadurch besser.' }
      ],
      edges: [['amt', 'pub'], ['pub', 'use'], ['use', 'back'], ['back', 'amt']],
      analogy: {
        icon: '📚', title: 'Bild dazu',
        text: 'Open Data ist wie eine öffentliche Bibliothek: Die Bücher stehen für alle offen. ' +
              'Genau deshalb kann niemand heimlich eine Seite austauschen – es würde auffallen.'
      },
      bonus: {
        prompt: 'Klicke das Symbol, das den Open-Data-Kreislauf am besten darstellt.',
        options: [
          { id: 'a', icon: '🔒', label: 'Ein Vorhängeschloss' },
          { id: 'b', icon: '♻️', label: 'Ein Kreislauf' },
          { id: 'c', icon: '📄', label: 'Ein einzelnes Dokument' },
          { id: 'd', icon: '💰', label: 'Eine Geldbörse' }
        ],
        answer: 'b',
        okText: 'Richtig – veröffentlichen, nutzen, zurückmelden, verbessern: ein Kreislauf.',
        failText: 'Open Data ist weder verschlossen noch ein Einzeldokument – es ist ein offener Kreislauf.'
      }
    },

    lennox: {
      headline: 'NEXUS-FUNK · KANAL 4.1 · LENNOX ERKLÄRT',
      channel: '4.1 MHz',
      script: [
        { who: 'LENNOX', text: 'Hey, hörst du mich? Dann lass uns über offene Daten reden.' },
        { who: 'LENNOX', text: 'Open Data heißt: Daten, die alle frei nutzen dürfen. Kostenlos und ohne Anmeldung.' },
        { who: 'LENNOX', text: 'Meistens kommen sie von Behörden: Wasserwerte, Fahrpläne, Einwohnerzahlen.' },
        { who: 'FUNK',   text: 'krrrz … Signal stabil …' },
        { who: 'LENNOX', text: 'Und jetzt der wichtige Teil: Weil sie öffentlich und an vielen Orten gespiegelt liegen, kann sie kaum jemand heimlich fälschen.' },
        { who: 'LENNOX', text: 'Ein internes System kann ein Angreifer manipulieren. Tausend offene Kopien nicht.' },
        { who: 'LENNOX', text: 'Deshalb gilt: Einen falschen Wert korrigiert man nicht durch Raten, sondern mit einer vertrauenswürdigen Originalquelle.' },
        { who: 'LENNOX', text: 'Merk dir: offen, unabhängig, überprüfbar. Ende.' }
      ],
      bonus: {
        prompt: 'Funk-Check: Warum konnte der Hacker die offenen Archive nicht fälschen?',
        options: [
          { id: 'a', label: 'Weil sie verschlüsselt und geheim sind' },
          { id: 'b', label: 'Weil sie öffentlich und unabhängig gespeichert sind' },
          { id: 'c', label: 'Weil sie nur einmal im Jahr aktualisiert werden' }
        ],
        answer: 'b',
        okText: 'Genau – Offenheit ist hier der Schutz, nicht die Schwäche.',
        failText: 'Nicht Geheimhaltung schützt sie, sondern das Gegenteil: Sie liegen offen und vielfach kopiert.'
      }
    },

    zen: {
      headline: 'nexus@terminal:~/glossar/open-data',
      pages: [
        [ { k: 'h',  v: 'Open Data — Definition' },
          { k: 'p',  v: 'Frei zugängliche Daten, die alle ohne Einschränkung nutzen, weitergeben und weiterverarbeiten dürfen.' },
          { k: 'ul', v: ['zugänglich  = ohne Anmeldung abrufbar',
                         'maschinenlesbar = offenes Format (JSON, CSV)',
                         'lizenziert  = Weiterverwendung ausdrücklich erlaubt'] } ],
        [ { k: 'h',  v: 'Lizenzen' },
          { k: 'kv', v: [['CC0', 'Gemeinfrei – Nutzung ohne jede Auflage'],
                         ['CC-BY', 'Nutzung erlaubt, Urheber muss genannt werden'],
                         ['(keine)', 'Rechtlich unklar – Vorsicht bei der Weitergabe']] },
          { k: 'p',  v: 'Wichtig: Eine Lizenz regelt nur die Nutzung. Sie ist KEIN Wahrheitsstempel.' } ],
        [ { k: 'h',  v: 'Datenqualität' },
          { k: 'ul', v: ['vollständig – keine Lücken ohne Kennzeichnung',
                         'aktuell     – Stand ist angegeben',
                         'plausibel   – Werte liegen im möglichen Bereich',
                         'nachprüfbar – Herausgeber und Quelle sind genannt'] },
          { k: 'h',  v: 'Grundregel' },
          { k: 'p',  v: 'Fehlerhafte Werte werden nicht geraten. Entweder aus der Originalquelle übernehmen – oder ehrlich als fehlend (NULL) markieren.' } ]
      ],
      bonus: {
        prompt: 'Logik-Check: Ein Messwert ist offensichtlich unmöglich und es gibt keine Vergleichsquelle. Was ist fachlich korrekt?',
        options: [
          { id: 'a', label: 'Einen plausiblen Wert schätzen und eintragen' },
          { id: 'b', label: 'Als fehlend (NULL) markieren und Nachmessung anfordern' },
          { id: 'c', label: 'Den unmöglichen Wert unverändert stehen lassen' }
        ],
        answer: 'b',
        okText: 'Korrekt: Eine ehrliche Lücke ist besser als eine erfundene Zahl.',
        failText: 'Schätzen erfindet Daten, Stehenlassen behält den Fehler. Richtig ist: als fehlend kennzeichnen.'
      }
    }
  };

  /* ---------------- Level 3 · Quelle, Lizenz, Metadaten, Plausibilität ---------------- */
  infos[3] = {
    id: 3,
    title: 'INFO · DATEN PRÜFEN & HINTERFRAGEN',
    term: 'QUELLE · LIZENZ · METADATEN · PLAUSIBILITÄT',
    bonusPoints: 15,
    forbidden: ['Wasserwerk_Stadt_Nexus', 'DarkBridge_Leaks', 'Eltern-Initiative_Nexus',
                'Nexus_Energy', 'Verkehrsbetriebe_Nexus', 'Nexus_Watch'],

    lyra: {
      headline: 'HOLOGRAMM · DIE VIER PRÜF-MODULE',
      caption: 'Tippe jeden Knoten an – zusammen ergeben sie dein Urteil.',
      nodes: [
        { id: 'q', x: 20, y: 16, icon: '🌐', label: 'Quelle', color: '#00f3ff',
          text: 'Wer sagt das? Echte Domain, Impressum, nachvollziehbarer Herausgeber?' },
        { id: 'm', x: 62, y: 16, icon: '🏷️', label: 'Metadaten', color: '#ff2fb0',
          text: 'Wann entstanden die Daten? Passt der Berichtszeitraum zur Behauptung?' },
        { id: 'l', x: 20, y: 46, icon: '📜', label: 'Lizenz', color: '#ffd21f',
          text: 'Regelt nur die Nutzung (CC0, CC-BY). Sagt NICHTS über die Wahrheit aus!' },
        { id: 'p', x: 62, y: 46, icon: '🧠', label: 'Plausibilität', color: '#39ff88',
          text: 'Passt das zur Realität und zu unabhängigen Messungen?' },
        { id: 'u', x: 41, y: 31, icon: '⚖️', label: 'Urteil', color: '#b25cff',
          text: 'Belegt · Unklar · Widerlegt. Fehlende Belege sind noch kein Gegenbeweis!' }
      ],
      edges: [['q', 'u'], ['m', 'u'], ['l', 'u'], ['p', 'u']],
      analogy: {
        icon: '⚖️', title: 'Bild dazu',
        text: 'Wie vor Gericht: Ein schickes Auftreten ist kein Beweis, und fehlende Beweise ' +
              'bedeuten nicht automatisch „schuldig". Manchmal lautet das Urteil ehrlich: unklar.'
      },
      bonus: {
        prompt: 'Klicke das Symbol für die Stufe, die gilt, wenn Belege schlicht fehlen.',
        options: [
          { id: 'a', icon: '🟢', label: 'Belegt' },
          { id: 'b', icon: '🟡', label: 'Unklar' },
          { id: 'c', icon: '🔴', label: 'Widerlegt' }
        ],
        answer: 'b',
        okText: 'Genau – fehlende Belege machen eine These weder wahr noch falsch.',
        failText: 'Ohne Belege kannst du weder „belegt" noch „widerlegt" sagen. Dafür gibt es die mittlere Stufe.'
      }
    },

    lennox: {
      headline: 'NEXUS-FUNK · KANAL 9.6 · LENNOX ERKLÄRT',
      channel: '9.6 MHz',
      script: [
        { who: 'LENNOX', text: 'Hey, aufgepasst – jetzt wird es knifflig.' },
        { who: 'LENNOX', text: 'Vier Dinge prüfst du bei jeder Meldung: Quelle, Metadaten, Lizenz und Plausibilität.' },
        { who: 'LENNOX', text: 'Die Quelle: Wer steht dahinter? Eine echte Behörden-Adresse mit Impressum oder ein anonymer Uploader?' },
        { who: 'LENNOX', text: 'Die Metadaten: Wann wurden die Daten erhoben? Alte Zahlen mit neuer Überschrift sind ein beliebter Trick.' },
        { who: 'FUNK',   text: 'krrrz … Achtung, wichtig …' },
        { who: 'LENNOX', text: 'Die Lizenz regelt nur, wer die Daten nutzen darf. Sie ist kein Wahrheitsstempel. Merk dir das!' },
        { who: 'LENNOX', text: 'Und die Plausibilität: Passt das überhaupt zur Realität und zu unabhängigen Messungen?' },
        { who: 'LENNOX', text: 'Ganz wichtig zum Schluss: Wenn Belege fehlen, ist eine Behauptung nicht widerlegt, sondern einfach unklar. Ende.' }
      ],
      bonus: {
        prompt: 'Funk-Check: Was sagt eine offene Lizenz wie CC-BY über den Inhalt aus?',
        options: [
          { id: 'a', label: 'Dass die Daten geprüft und richtig sind' },
          { id: 'b', label: 'Nichts – sie regelt nur die Nutzung' },
          { id: 'c', label: 'Dass die Daten von einer Behörde stammen' }
        ],
        answer: 'b',
        okText: 'Genau zugehört – eine Lizenz ist kein Qualitätssiegel.',
        failText: 'Eine Lizenz sagt nur, wer die Daten wie verwenden darf – nie, ob sie stimmen.'
      }
    },

    zen: {
      headline: 'nexus@terminal:~/glossar/pruefung',
      pages: [
        [ { k: 'h',  v: 'Die vier Prüf-Module' },
          { k: 'kv', v: [['Quelle', 'Domain, Impressum, Herausgeber nachvollziehbar?'],
                         ['Metadaten', 'Erstellungsdatum / Berichtszeitraum vs. Behauptung'],
                         ['Lizenz', 'CC0 / CC-BY – regelt NUR die Nutzung'],
                         ['Plausibilität', 'Abgleich mit Realität & unabhängigen Sensoren']] } ],
        [ { k: 'h',  v: 'Die drei Urteilsstufen' },
          { k: 'kv', v: [['BELEGT', 'Alle vier Module halten der Prüfung stand'],
                         ['UNKLAR', 'Belege fehlen – weder Beweis noch Gegenbeweis'],
                         ['WIDERLEGT', 'Etwas Nachprüfbares spricht dagegen']] },
          { k: 'p',  v: 'Der häufigste Denkfehler: fehlende Belege mit einem Gegenbeweis zu verwechseln.' } ],
        [ { k: 'h',  v: 'Fachbegriffe' },
          { k: 'kv', v: [['Metadaten', 'Daten über Daten (Datum, Urheber, Format)'],
                         ['GTFS', 'Offenes Standardformat für Fahrpläne'],
                         ['Geoportal', 'Amtliche Plattform für Karten- und Satellitendaten'],
                         ['Quervergleich', 'Dieselbe Aussage aus zwei unabhängigen Quellen']] },
          { k: 'h',  v: 'Merksatz' },
          { k: 'p',  v: 'Offene Lizenz ≠ wahr. Schickes Profil ≠ Beweis. Fehlender Beleg ≠ Lüge.' } ]
      ],
      bonus: {
        prompt: 'Logik-Check: Ein echtes Foto von einer amtlichen Seite wird mit falscher Jahreszeit beschrieben. Wie lautet das Urteil?',
        options: [
          { id: 'a', label: 'Belegt – die Quelle ist schließlich echt' },
          { id: 'b', label: 'Unklar – man kann es nicht entscheiden' },
          { id: 'c', label: 'Widerlegt – die Metadaten sprechen gegen die Behauptung' }
        ],
        answer: 'c',
        okText: 'Korrekt: Echte Daten plus falsche Deutung ergeben eine widerlegte Behauptung.',
        failText: 'Die Datei ist echt – aber die Metadaten widersprechen der Behauptung nachprüfbar.'
      }
    }
  };

  /* ---------------- Level 4 · Visualisierung & Data-Storytelling ---------------- */
  infos[4] = {
    id: 4,
    title: 'INFO · VISUALISIEREN & ERZÄHLEN',
    term: 'DIAGRAMM · DATA-STORYTELLING · VERÖFFENTLICHEN',
    bonusPoints: 15,
    forbidden: ['Feinstaub', 'Restmüll', 'Jahresbudget', 'Nordpark', 'Industrie'],

    lyra: {
      headline: 'HOLOGRAMM · VON DER ZAHL ZUM BILD',
      caption: 'Tippe jeden Knoten an – so entsteht aus Daten Wissen.',
      nodes: [
        { id: 'dat', x: 16, y: 31, icon: '🔢', label: 'Rohdaten', color: '#00f3ff',
          text: 'Zahlenkolonnen. Korrekt, aber für Menschen schwer zu erfassen.' },
        { id: 'viz', x: 40, y: 14, icon: '📊', label: 'Diagramm', color: '#ff2fb0',
          text: 'Säulen vergleichen Kategorien, Linien zeigen Verläufe, Kreise zeigen Anteile.' },
        { id: 'sto', x: 64, y: 31, icon: '💬', label: 'Aussage', color: '#ffd21f',
          text: 'Ein Satz, der sagt, was man sieht. Ohne ihn bleibt das Bild stumm.' },
        { id: 'pub', x: 40, y: 52, icon: '🌐', label: 'Veröffentlichen', color: '#39ff88',
          text: 'Geteiltes Wissen wirkt. So wird aus deiner Analyse wieder Open Data.' }
      ],
      edges: [['dat', 'viz'], ['viz', 'sto'], ['sto', 'pub'], ['pub', 'dat']],
      analogy: {
        icon: '🔦', title: 'Bild dazu',
        text: 'Ein Prisma bündelt Licht. Eine Visualisierung bündelt Zahlen – ' +
              'plötzlich sieht man das Muster, das vorher in der Tabelle versteckt war.'
      },
      bonus: {
        prompt: 'Klicke das Diagramm, mit dem man Werte mehrerer Stadtteile am besten vergleicht.',
        options: [
          { id: 'a', icon: '📊', label: 'Säulendiagramm' },
          { id: 'b', icon: '🥧', label: 'Kreisdiagramm' },
          { id: 'c', icon: '🌡️', label: 'Einzelne Zahl' }
        ],
        answer: 'a',
        okText: 'Genau – Säulen nebeneinander machen Größenunterschiede sofort sichtbar.',
        failText: 'Der Kreis zeigt Anteile an einem Ganzen, eine Einzelzahl vergleicht gar nichts. Für Vergleiche nimmt man Säulen.'
      }
    },

    lennox: {
      headline: 'NEXUS-FUNK · KANAL 2.8 · LENNOX ERKLÄRT',
      channel: '2.8 MHz',
      script: [
        { who: 'LENNOX', text: 'Hey, letzter Funkspruch – es geht ums Sichtbarmachen.' },
        { who: 'LENNOX', text: 'Rohe Zahlen retten keine Stadt. Erst wenn Menschen sie verstehen, passiert etwas.' },
        { who: 'LENNOX', text: 'Ein Säulendiagramm vergleicht getrennte Kategorien. Eine Linie zeigt, wie sich etwas über die Zeit entwickelt.' },
        { who: 'LENNOX', text: 'Ein Kreisdiagramm zeigt Anteile an einem Ganzen – aber nur, wenn sich alles zu 100 Prozent ergänzt.' },
        { who: 'FUNK',   text: 'krrrz … fast geschafft …' },
        { who: 'LENNOX', text: 'Data-Storytelling heißt: Sag in einem Satz, was man im Bild sieht. Zum Beispiel welcher Bereich heraussticht.' },
        { who: 'LENNOX', text: 'Und dann veröffentlichst du es. Offen, für alle – so wird aus deiner Arbeit wieder Open Data.' },
        { who: 'LENNOX', text: 'Merk dir: zeigen, erklären, teilen. Ende der Übertragung.' }
      ],
      bonus: {
        prompt: 'Funk-Check: Was gehört laut Lennox zwingend zu einem guten Diagramm dazu?',
        options: [
          { id: 'a', label: 'Möglichst viele Farben' },
          { id: 'b', label: 'Eine klare Aussage in einem Satz' },
          { id: 'c', label: 'Eine dreidimensionale Darstellung' }
        ],
        answer: 'b',
        okText: 'Richtig – ohne Aussage bleibt auch das schönste Diagramm stumm.',
        failText: 'Farben und 3D sind Deko. Entscheidend ist die Aussage, die das Bild erklärt.'
      }
    },

    zen: {
      headline: 'nexus@terminal:~/glossar/visualisierung',
      pages: [
        [ { k: 'h',  v: 'Diagrammarten' },
          { k: 'kv', v: [['Liniendiagramm', 'zeitliche Verläufe und kontinuierliche Datenreihen'],
                         ['Säulendiagramm', 'direkter Mengenvergleich diskreter Kategorien'],
                         ['Kreisdiagramm', 'Prozent-Anteile an einem geschlossenen Ganzen (100 %)']] },
          { k: 'p',  v: 'Faustregel: erst die Frage, dann die Diagrammart – nie umgekehrt.' } ],
        [ { k: 'h',  v: 'Data-Storytelling' },
          { k: 'ul', v: ['Was sticht heraus? (größter / kleinster Wert)',
                         'Warum ist das relevant?',
                         'Was folgt daraus?'] },
          { k: 'p',  v: 'Eine gute Aussage ist ein Satz, den man ohne das Diagramm versteht.' } ],
        [ { k: 'h',  v: 'Veröffentlichen' },
          { k: 'ul', v: ['Quelle nennen', 'Lizenz angeben (z. B. CC-BY)',
                         'Stand / Datum angeben', 'Rohdaten mitliefern'] },
          { k: 'h',  v: 'Merksatz' },
          { k: 'p',  v: 'Wer veröffentlicht, macht seine Arbeit überprüfbar – der Kreis zu Open Data schließt sich.' } ]
      ],
      bonus: {
        prompt: 'Logik-Check: Du willst zeigen, wie sich ein Messwert über zwölf Monate entwickelt hat. Was passt?',
        options: [
          { id: 'a', label: 'Kreisdiagramm' },
          { id: 'b', label: 'Liniendiagramm' },
          { id: 'c', label: 'Eine einzelne große Zahl' }
        ],
        answer: 'b',
        okText: 'Korrekt: Für Verläufe über die Zeit ist die Linie die richtige Wahl.',
        failText: 'Ein Kreis zeigt Anteile, eine Einzelzahl keinen Verlauf. Zeitreihen gehören auf eine Linie.'
      }
    }
  };

  NX.infos = infos;
})(window.NX);
