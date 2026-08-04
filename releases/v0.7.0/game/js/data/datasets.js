/* =========================================================================
   datasets.js — sample Open-Data content used by the level mini-tasks
   Exposes: window.NX.data
   All values are fictional demo data for the city of "Nexus".
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  var avatars = [
    {
      id: 'lyra', name: 'LYRA', role: 'DIE STRATEGIN', color: '#ff2fb0',
      img: 'media/avatar-lyra.png',
      skills: ['Hacking Expertin', 'Schnell & Schlau', 'System-Analyse'],
      abilities: ['📡 Datenping', '🛡 Tarnprotokoll', '⚙ Systembreach'],
      info: 'Lyra ist Expertin für digitale Infiltration und findet immer einen Weg.'
    },
    {
      id: 'lennox', name: 'LENNOX', role: 'DER BESCHÜTZER', color: '#ffd21f',
      img: 'media/avatar-lennox.png',
      skills: ['Datenschutz Experte', 'Stark & Ausdauernd', 'Team-Schild'],
      abilities: ['🛡 Schildwall', '🧱 Datenpanzer', '👁 Overwatch'],
      info: 'Lennox hält den Schild hoch, wenn die Firewall bricht. Nichts kommt an ihm vorbei.'
    },
    {
      id: 'zen', name: 'ZEN', role: 'DIE VISIONÄR*IN', color: '#39ff88',
      img: 'media/avatar-zen.png',
      skills: ['Support Spezialist*in', 'Heilung & Boosts', 'Team Optimierung'],
      abilities: ['✚ Datenheilung', '🌊 Boost-Welle', '📈 Optimierung'],
      info: 'Zen sieht Muster, wo andere nur Chaos sehen, und bringt das Team nach vorne.'
    }
  ];

  /* ---- Level 1: Die Cyber-Tauben (sicherer Datenabruf → JSON) ----
     Die Taube wird "programmiert": Endpunkt (URL) + Methode (GET) + API-Token.
     Fehler-Matrix: falsche URL → 404, falscher/kein Token → 401, POST statt GET → 405.
     Erfolg: unleserlicher Rohdatenstrom → SCAN → strukturiertes JSON + Human-Dashboard. */
  var level1 = {
    endpoints: [
      { url: 'https://opendata.nexus.city/v1/stadtsystem', label: 'opendata.nexus.city/v1/stadtsystem', ok: true },
      { url: 'https://intranet.nexus.local/system',        label: 'intranet.nexus.local/system  (internes, gehacktes Netz)', ok: false },
      { url: 'https://daten-download.fog/paket',           label: 'daten-download.fog/paket  ⚠ verdächtig', ok: false }
    ],
    validEndpoint: 'https://opendata.nexus.city/v1/stadtsystem',
    methods: ['GET', 'POST'],
    validMethod: 'GET',
    tokens: [
      { t: '',                    label: '— kein Token —',                                     ok: false },
      { t: 'NX-TOKEN-7F3A-9K2D',  label: 'NX-TOKEN-7F3A-9K2D  (von der Cyber-Taube geliefert)', ok: true },
      { t: 'GAST-0000',           label: 'GAST-0000  (abgelaufen)',                            ok: false }
    ],
    validToken: 'NX-TOKEN-7F3A-9K2D',
    // Intro-Sequenz (Spec: story/levels/level-1-cyber-tauben.md, Abschnitt 2)
    intro: {
      hangar:   'AUSRÜSTUNG · Pergamentrolle wird im Schnabel fixiert …',
      flight:   'ANFLUG · Cyber-Taube überquert den Sektor …',
      landing:  'LANDUNG · Bote auf dem Kontrollpult.',
      cta:      '🕊 Klicke auf die Taube oder die Rolle',
      reveal:   'PASSIERSCHEIN ENTSCHLÜSSELT',
      handover: 'Token im Speicher – wähle jetzt den passenden Passierschein in Ebene 3.'
    },
    tooltips: {
      url:    'Navigations-Modul: Zeigt der Cyber-Taube die genaue Internet-Adresse des Daten-Nests.',
      method: 'Handlungs-Befehl: Bestimmt, ob die Taube etwas abholen (GET) oder überbringen (POST) soll.',
      token:  'Passierschein: Ein digitaler Sicherheitsschlüssel, der dem Server zeigt, ob die Taube Zutritt hat.'
    },
    errors: {
      url:    { code: 404, title: '404 Not Found',          msg: 'Adresse existiert nicht im Netzwerk!' },
      token:  { code: 401, title: '401 Unauthorized',       msg: 'Zugriff verweigert! Kein gültiger Sicherheitsschlüssel.' },
      method: { code: 405, title: '405 Method Not Allowed', msg: 'Falsche Methode! Erwarte Daten-Abholung (GET).' }
    },
    // unleserlicher Rohdaten-Strom (vor dem Scan)
    rawStream: 'Tagesverbrauch1Notrufzentrale0Einwohnerzahl15Ampelsteuerungmanuell/ausfallTrinkwassergefaehrliche_chemikalien',
    // strukturiertes JSON nach dem Scan
    cityJson: {
      energie:                  { kennzahl: 'Tagesverbrauch_kWh', wert: 1 },
      sicherheit_und_standort:  { kennzahl: 'Notrufzentrale',     status: 0 },
      demografie:               { kennzahl: 'Einwohnerzahl',      wert: 15 },
      verkehr_und_lichtsignale: { kennzahl: 'Ampelsteuerung',     status: 'manuell / ausfall' },
      trinkwasser:              { kennzahl: 'Zustand',            status: 'gefaehrliche_chemikalien' }
    },
    // Menschen-Ansicht (Human Dashboard)
    dashboard: [
      { icon: '⚡', label: 'Strom & Energie',        value: 'Tagesverbrauch: 1 kWh' },
      { icon: '🚨', label: 'Sicherheit & Standort',  value: 'Notrufzentralen: 0' },
      { icon: '👥', label: 'Demografie',             value: 'Einwohnerzahl: 15' },
      { icon: '🚦', label: 'Verkehr & Lichtsignale', value: 'Ampelsteuerung: manuell / ausfall' },
      { icon: '💧', label: 'Trinkwasser',            value: 'Zustand: gefährliche Chemikalien' }
    ]
  };

  /* ---- Level 2: Das Schattenarchiv (Open-Data-Portal, Korrektur) ----
     Interne Systemdaten wurden manipuliert. Die echten Werte holt man aus dem unabhängigen
     Open-Data-Portal der (fiktiven) "Datenbehörde Nexus" und gleicht sie ab (nicht raten). */
  var level2 = {
    portalUrl: 'https://datenbehoerde-nexus.gv.at/stadt-open-data',
    urlSuggestion: 'https://datenbehoerde-nexus.gv.at/stadt-open-data',
    publisher: 'Datenbehörde Nexus',
    lizenz: 'CC BY 4.0',
    quality: 35, // Start-Datenqualität in %
    categories: [
      { key: 'strom',      icon: '⚡', name: 'Strom & Energie',        metric: 'Tagesverbrauch', trueValue: '48.500', unit: 'kWh', updated: '2026-07-30' },
      { key: 'sicherheit', icon: '🚨', name: 'Sicherheit & Standort',   metric: 'Notrufzentralen', trueValue: '12',    unit: '',    updated: '2026-07-28' },
      { key: 'demografie', icon: '👥', name: 'Demografie',              metric: 'Einwohnerzahl',  trueValue: '512.340', unit: '',   updated: '2026-06-30' },
      { key: 'verkehr',    icon: '🚦', name: 'Verkehr & Lichtsignale',  metric: 'Ampelsteuerung', trueValue: 'Automatisch', unit: '', updated: '2026-07-29' },
      { key: 'wasser',     icon: '💧', name: 'Trinkwasser',            metric: 'Zustand',        trueValue: 'Einwandfrei', unit: '', updated: '2026-07-31' },
      { key: 'abfall',     icon: '♻️', name: 'Abfall & Recycling',     metric: 'Recyclingquote', trueValue: '62',      unit: '%',   updated: '2026-07-15' },
      { key: 'gruen',      icon: '🌳', name: 'Grünflächen',            metric: 'Parkanlagen',    trueValue: '37',      unit: '',    updated: '2026-07-10' }
    ],
    system: [
      { key: 'strom',      field: 'Tagesverbrauch (kWh)', hacked: '1',                    type: 'number' },
      { key: 'sicherheit', field: 'Notrufzentralen',      hacked: '0',                    type: 'number' },
      { key: 'demografie', field: 'Einwohnerzahl',        hacked: '15',                   type: 'number' },
      { key: 'verkehr',    field: 'Ampelsteuerung',       hacked: 'Manuell / Ausfall',    type: 'text' },
      { key: 'wasser',     field: 'Zustand',              hacked: 'Gefährliche Chemikalien', type: 'text' }
    ],
    synonyms: {
      verkehr: ['automatisch', 'auto', 'automatik'],
      wasser: ['einwandfrei', 'ok', 'in ordnung', 'sauber', 'gut', 'trinkbar', 'unbedenklich']
    },
    /* Zusatzfall „NULL statt Raten" (Spec: level-3-Datei, Abschnitt 5).
       Für diesen Wert gibt es KEINEN Open-Data-Vergleichswert – er ist nur unplausibel.
       Didaktisches Ziel: Messwerte werden nicht erfunden, sondern als fehlend markiert
       und beim Sensor nachgefordert. */
    plausibility: {
      key: 'wasser', icon: '💧', name: 'Trinkwasser',
      field: 'pH-Wert (Sensor 4)',
      hacked: '14',
      reason: 'Die pH-Skala reicht nur von 0 bis 14 – ein Trinkwasser-pH von 14 ist unmöglich. ' +
              'Im Open-Data-Portal gibt es für diesen Sensor keinen Vergleichswert.',
      markLabel: '⚠ Als „Ungültig / Fehlerhaft" markieren',
      question: 'Der Wert ist unplausibel – und im Open-Data-Portal steht kein Vergleichswert. Was tust du?',
      options: [
        {
          id: 'a', ok: false,
          label: 'Wert durch eine plausible Vermutung ersetzen (z. B. 7.2)',
          feedback: 'Nein – wir erfinden keine Messwerte! Eine geratene Zahl sieht sauber aus, ' +
                    'ist aber frei erfunden. Damit wären die Daten wieder falsch, nur unauffälliger.'
        },
        {
          id: 'b', ok: true,
          label: 'Als „Fehlend (NULL)" markieren und Nachmessung beim Sensor anfordern',
          feedback: 'Richtig! Eine ehrliche Lücke ist besser als eine erfundene Zahl. ' +
                    'NULL sagt: „Hier fehlt ein Wert" – und die Nachmessung liefert den echten.'
        }
      ],
      resultValue: 'NULL · Nachmessung angefordert'
    },
    // Pausen-Vorschläge für den Real-Life-Break am Levelende
    breakTips: [
      '🪟 Lüften – Fenster auf, frische Luft reinlassen',
      '💧 Trinken – ein Schluck Wasser',
      '🤸 Bewegung – aufstehen, strecken, kurz umhergehen',
      '👀 Blick in die Ferne – Augen entspannen',
      '🌙 Screen-Detox – kurz weg vom Bildschirm',
      '🍎 Mini-Snack – Energie für den Kopf'
    ]
  };

  /* ---- Level 3: Das Labyrinth der Lügen ----
     Dreistufiges Urteil je Meldung: belegt | unklar | widerlegt.
     Jede Meldung bringt einen 4-teiligen Fakten-Check mit (Quelle, Metadaten,
     Lizenz/Rohdaten, Plausibilität). Pro Frage gibt es eine kostenlose INFO
     (Methodik/Fachbegriff) und einen TIPP mit Punktabzug (konkreter Hinweis).
     taskIndex = Prüf-Checkliste: 0 Quelle · 1 Lizenz · 2 Metadaten · 3 Plausibilität */
  var level3 = {

    /* Punkte: score = max(floor, 100 − Fehlversuche*wrong − Tipps*tip).
       Die Spec nennt −50 je Tipp, nennt aber kein Level-Budget: gegen 6×100 sind das 8,3 %,
       auf ein 100-Punkte-Level übertragen also ≈ −10 (siehe CHANGELOG v0.6.0). */
    scoring: { wrong: 8, tip: 10, floor: 40 },

    /* Die drei Urteilsstufen (Reihenfolge = Anzeige- und Tastenreihenfolge 1/2/3) */
    verdicts: [
      { id: 'belegt',    key: '1', icon: '🟢', label: 'BELEGT',                  color: '#39ff14' },
      { id: 'unklar',    key: '2', icon: '🟡', label: 'UNKLAR – ZU WENIG DATEN', color: '#f59e0b' },
      { id: 'widerlegt', key: '3', icon: '🔴', label: 'WIDERLEGT',               color: '#ef4444' }
    ],

    /* Kopfzeilen der vier Fakten-Check-Module (Reihenfolge = Renderreihenfolge) */
    factMeta: [
      { key: 'quelle',         icon: '🌐', label: 'Quelle & Portal' },
      { key: 'metadaten',      icon: '🏷️', label: 'Metadaten' },
      { key: 'lizenz',         icon: '📜', label: 'Lizenz & Rohdaten' },
      { key: 'plausibilitaet', icon: '🧠', label: 'Plausibilität' }
    ],

    /* Rückmeldung bei falschem Urteil – nach GEWÄHLTER Stufe, nicht nach Lösung.
       Verrät die Antwort nicht, korrigiert nur den Denkfehler. */
    feedbackWrong: {
      belegt:    'Vorsicht: Ein offizielles Aussehen, ein blauer Haken oder eine offene Lizenz sind noch kein Beweis. Prüfe Metadaten und Plausibilität noch einmal.',
      unklar:    'Sieh genauer hin – hier liefern die vier Module genug Substanz für ein klares Urteil.',
      widerlegt: 'Achtung: Fehlende oder unvollständige Belege machen eine These noch nicht falsch.'
    },

    /* Labyrinth-Mini-Map: 7×7-Raster, Weg vom Eingang (unten links) ins Zentrum.
       Genau 7 Positionen = Start + 1 Schritt je richtiger Antwort (6 Fragen).
       c = Spalte 0..6 (links→rechts), r = Zeile 0..6 (oben→unten).
       Mauern sind rein dekorativ; keine Mauer liegt auf dem Weg. */
    maze: {
      cols: 7, rows: 7,
      path: [
        { c: 0, r: 6, label: 'EINGANG · RAW DATA' },
        { c: 1, r: 6, label: 'PRE-PROCESSING' },
        { c: 1, r: 5, label: 'FILTERING' },
        { c: 2, r: 5, label: 'VALIDATION' },
        { c: 2, r: 4, label: 'CLEANING' },
        { c: 3, r: 4, label: 'ORGANIZATION' },
        { c: 3, r: 3, label: 'ZENTRUM · GOLDEN RECORD' }
      ],
      walls: [
        '4,6', '6,6',
        '0,5', '3,5', '6,5',
        '1,4', '4,4',
        '0,3', '2,3', '5,3',
        '2,2', '5,2',
        '0,1', '3,1', '6,1',
        '1,0', '3,0'
      ]
    },

    finale: {
      title: '🎉 GOLDEN RECORD FREIGESCHALTET',
      text: 'Glückwunsch! Du hast das Labyrinth der Lügen durchquert und den Golden Record freigeschaltet!'
    },

    questions: [
      {
        id: 1,
        topic: 'Trinkwasser-Qualität',
        theme: 'Quellencheck & Verifizierung',
        taskIndex: 0,
        post: {
          icon: '💧', profile_name: 'Wasserwerk_Stadt_Nexus', is_verified: true,
          statement: 'Unser aktueller Prüfbericht bestätigt: Das Trinkwasser erfüllt alle ' +
            'Grenzwerte. Den vollständigen Bericht gibt es auf unserer Website.'
        },
        facts: {
          quelle: 'Profil verweist auf wasserwerke.nexus.gov/daten/analyse-2026 ' +
            '(verifizierte Behörden-Domain mit Impressum).',
          metadaten: 'Stand: Gestern, 08:30 Uhr | Dateiformat: .json',
          lizenz: 'CC0 (Public Domain) | Vollständige Labor-Rohdaten angehängt.',
          plausibilitaet: 'Nitrat- und pH-Messergebnisse sind stabil und decken sich mit historischen Daten.'
        },
        help: {
          infoTitle: 'ℹ️ BEGRIFFS-GUIDE · QUELLE & LIZENZ',
          infoHtml: '<p>Ein <b>blauer Haken</b> auf Social Media beweist noch nicht, dass eine ' +
            'Meldung stimmt. Achte auf die verlinkte Web-Adresse (<b>Domain</b>): Behörden nutzen ' +
            'geschützte Endungen wie <code>.gov</code>.</p>' +
            '<p>Die Lizenz <b>CC0</b> erlaubt jedem die freie Weiterverwendung, sagt aber ' +
            '<b>nichts</b> über die inhaltliche Richtigkeit aus.</p>',
          tip: 'Die Quelle ist eine echte städtische Domain, die Rohdaten liegen vollständig vor ' +
            'und die Werte passen zur Historie. Der Bericht ist voll abgedeckt.'
        },
        correct: 'belegt',
        explanation: 'Quellen-, Metadaten- und Rohdatenprüfung bestanden – die Meldung ist vollständig belegt.'
      },
      {
        id: 2,
        topic: 'Brückeneinsturz-Warnung',
        theme: 'Nachgeahmte Webseiten / Gefälschtes Datenportal',
        taskIndex: 0,
        post: {
          icon: '🕶️', profile_name: 'DarkBridge_Leaks', is_verified: false,
          statement: 'Eil-Warnung! Die Hauptbrücke über den Nexus-Fluss bricht morgen ein! ' +
            'Ich habe geheime Messdaten bekommen. Glaubt mir einfach!'
        },
        facts: {
          quelle: 'Link führt auf ein nachgeahmtes Portal file-drop-temp.net/nexus/download.pdf. ' +
            'Kein Impressum, kein Herausgeber.',
          metadaten: 'Erstellungsdatum der Datei fehlt komplett | Urheber: Anonym',
          lizenz: 'Keine Lizenz vorhanden | Nur ein Text-Screenshot, keine Rohdaten.',
          plausibilitaet: 'Ein Quervergleich mit dem offiziellen Geoportal der Stadt zeigt: Die echten ' +
            'Echtzeit-Brückensensoren melden absolut normale Belastungswerte.'
        },
        help: {
          infoTitle: 'ℹ️ BEGRIFFS-GUIDE · ANONYME QUELLEN',
          infoHtml: '<p>Anonyme Filehoster (<code>file-drop…</code>) sind <b>keine</b> verlässlichen ' +
            'Datenportale: Jede Person kann dort ohne Prüfung hochladen.</p>' +
            '<p>Wenn eine Behauptung den offiziellen <b>Live-Sensoren</b> der Stadt widerspricht, ' +
            'ist sie fachlich entkräftet – nicht nur unbelegt.</p>',
          tip: 'Anonymer Upload-Server, fehlende Metadaten und ein direkter Widerspruch zu den echten ' +
            'städtischen Messsensoren – diese Panikmeldung ist klar falsch.'
        },
        correct: 'widerlegt',
        explanation: 'Widerspricht den tatsächlichen Echtzeit-Sensordaten der Stadt.'
      },
      {
        id: 3,
        topic: 'Feinstaub-Rekord an der Schule',
        theme: 'Lizenzoffenheit vs. inhaltliche Richtigkeit',
        taskIndex: 1,
        post: {
          icon: '🏫', profile_name: 'Eltern-Initiative_Nexus', is_verified: false,
          statement: 'Achtung! Die Feinstaubwerte vor dem Schulzentrum Nexus-West haben heute ' +
            'gefährliche Rekordhöhen erreicht.'
        },
        facts: {
          quelle: 'Private Vereins-Website nexus-eltern-initiative.org',
          metadaten: 'Veröffentlicht: Heute, 12:00 Uhr | Urheber: Elternverein Nexus',
          lizenz: 'CC-BY 4.0 sauber im Fußbereich angegeben. Es fehlen jedoch jegliche Rohdaten-Downloads!',
          plausibilitaet: 'Im Beitrag wird nur ein einzelner Zahlenwert genannt. Es gibt keine Angaben ' +
            'zur Messmethode, zum verwendeten Sensor oder zum genauen Standort.'
        },
        help: {
          infoTitle: 'ℹ️ WICHTIGER LIZENZ-HINWEIS',
          infoHtml: '<p>Eine Lizenz (wie <b>CC-BY</b>) regelt rein rechtlich, <i>wie</i> Daten ' +
            'weiterverwendet werden dürfen. Sie ist <b>KEIN</b> Qualitätssiegel dafür, ob die Daten ' +
            'wahr oder vollständig sind!</p>' +
            '<p>Ohne Rohdaten und Messprotokoll kann ein Wert weder bewiesen noch widerlegt werden. ' +
            'Genau dafür gibt es die mittlere Stufe.</p>',
          tip: 'Die Angabe von CC-BY ist vorbildlich, aber der eigentliche Beleg fehlt! Ein einzelner ' +
            'Textwert ohne Rohdaten ist unvollständig. Reicht das für „Belegt" oder „Widerlegt"?'
        },
        correct: 'unklar',
        explanation: 'Fehlende Belege machen eine These noch nicht falsch – aber auch nicht belegt!'
      },
      {
        id: 4,
        topic: 'Lagebericht Stromnetz',
        theme: 'Metadaten-Analyse & Zeit-Kontext',
        taskIndex: 2,
        post: {
          icon: '⚡', profile_name: 'Nexus_Energy', is_verified: true,
          statement: 'Eil-Meldung! Aktueller Lagebericht zur kritischen Überlastung und drohenden ' +
            'Ausfällen im städtischen Stromnetz.'
        },
        facts: {
          quelle: 'Verlinkung auf das echte Open-Data-Portal open-data.nexus-energy.io.',
          metadaten: 'Im Beitrag steht „Messwerte aktuell von heute". Der Datei-Header und die ' +
            'Versions-Metadaten zeigen aber als Berichtszeitraum: 14. November 2018.',
          lizenz: 'CC-BY 4.0 | CSV-Rohdatensatz liegt vor.',
          plausibilitaet: 'Die Messwerte beschreiben eine reale Netzüberlastung, allerdings aus dem Jahr 2018.'
        },
        help: {
          infoTitle: 'ℹ️ BEGRIFFS-GUIDE · METADATEN',
          infoHtml: '<p><b>Metadaten</b> sind Angaben <i>über</i> die Daten: Erstellungsdatum, ' +
            'Berichtszeitraum, Urheber, Dateiformat.</p>' +
            '<p>Ein häufiger Trick: echte, alte Daten werden mit einer falschen Überschrift als ' +
            '„aktuelle Krise" verkauft. Prüfe deshalb immer den <b>Berichtszeitraum</b> gegen die Behauptung.</p>',
          tip: 'Die Rohdaten sind echt, aber der behauptete Berichtszeitraum („Heute") widerspricht ' +
            'den Metadaten der Datei (2018). Die Behauptung einer aktuellen Krise ist damit falsch.'
        },
        correct: 'widerlegt',
        explanation: 'Alte Daten (2018) werden irreführend als aktuelle Notlage verkauft.'
      },
      {
        id: 5,
        topic: 'Tram-Ausfall wegen Baustelle',
        theme: 'Standardisierte Datenformate & Quervergleich',
        taskIndex: 3,
        post: {
          icon: '🚌', profile_name: 'Verkehrsbetriebe_Nexus', is_verified: true,
          statement: 'Wegen Gleisarbeiten auf der Hauptstraße fährt die Tram-Linie 3 am kommenden ' +
            'Wochenende nicht.'
        },
        facts: {
          quelle: 'Offizielle Stadt-Domain mobilitaet.nexus.gov/fahrplan',
          metadaten: 'Stand: Vor 2 Stunden | Herausgeber: Pressestelle Verkehrsbetriebe',
          lizenz: 'CC-BY 4.0 | Fahrplandaten liegen im offenen Standard-Format GTFS / JSON vor.',
          plausibilitaet: 'Der angegebene Baustellenzeitraum deckt sich exakt mit dem Eintrag im ' +
            'städtischen Tiefbauamt.'
        },
        help: {
          infoTitle: 'ℹ️ BEGRIFFS-GUIDE · OFFENE FORMATE',
          infoHtml: '<p><b>JSON</b> und <b>GTFS</b> sind offene, maschinenlesbare Datenformate. ' +
            'Sie ermöglichen es z.&nbsp;B. Karten-Apps, Fahrpläne automatisch einzulesen.</p>' +
            '<p>Stimmige Daten von <b>zwei unabhängigen Behörden</b> sichern eine Meldung zusätzlich ab – ' +
            'das nennt man Quervergleich.</p>',
          tip: 'Domain verifiziert, Datenformat offen und ein unabhängiger Abgleich mit dem Tiefbauamt ' +
            'bestätigt die Baustelle. Alles ist sauber belegt.'
        },
        correct: 'belegt',
        explanation: 'Echte Quelle, offenes Datenformat (GTFS/JSON) und doppelt abgesichert.'
      },
      {
        id: 6,
        topic: 'Waldrodung im Stadtpark',
        theme: 'Fehlinterpretation echter Daten',
        taskIndex: 3,
        post: {
          icon: '🌳', profile_name: 'Nexus_Watch', is_verified: false,
          statement: 'Satellitenbild entlarvt die Stadt! Die Hälfte aller Bäume im Nexus-Stadtpark ' +
            'wurde heimlich gerodet.'
        },
        facts: {
          quelle: 'Echtes Geoportal geoportal.nexus.gov/satellit/stadtpark',
          metadaten: 'Bildeigenschaften der .tiff-Datei zeigen Aufnahmedatum: 15. Januar. ' +
            'Im Text wird behauptet: „Sommer-Luftbild".',
          lizenz: 'CC-BY 4.0 | Hochaufgelöste Satellitenbild-Datei vorhanden.',
          plausibilitaet: 'Die Aufnahme zeigt unbelaubte, kahle Baumkronen im tiefsten Winter, ' +
            'was fälschlicherweise als Rodung interpretiert wird.'
        },
        help: {
          infoTitle: 'ℹ️ BEGRIFFS-GUIDE · ECHTE DATEN, FALSCHE DEUTUNG',
          infoHtml: '<p>Ein Foto oder Datensatz kann zu 100 % <b>echt</b> sein – und trotzdem durch ' +
            'eine falsche Erklärung verdreht werden.</p>' +
            '<p>Prüfe bei Bildern immer die Metadaten (<b>Aufnahmedatum</b>, Jahreszeit) und frage dich: ' +
            'Passt die Erklärung überhaupt zur Realität?</p>',
          tip: 'Das Bild ist echt und stammt vom städtischen Portal, aber das Datum (Januar) zeigt: ' +
            'Hier sieht man nur Laubbäume im Winter. Die Behauptung einer „Rodung" ist widerlegt.'
        },
        correct: 'widerlegt',
        explanation: 'Echtes Winterbild (15. Januar) wird fälschlich als Baumrodung dargestellt.'
      }
    ]
  };

  /* ---- Level 4: Die Daten-Metropole (Bürger-Dashboard + 360°-Stadt) ----
     Phase 1: drei Datensätze, deren STRUKTUR den richtigen Diagrammtyp bestimmt.
     Erst wird der Typ gewählt (bewertet), dann der Daten-Chip per Drag & Drop
     ins freigeschaltete Zielfeld gezogen (nicht bewertet – reine Aktivierung).
     Phase 2: 360°-Erkundung, 10 Szenarien Open Data vs. DSGVO (je Objekt eine
     Entscheidung [FREIGEBEN]/[SPERREN], alle 10 werden erklärt). */
  var level4 = {

    /* Punkte: score = max(floor, 100 − wrongType*Fehlversuch − wrongDecision*Fehlentscheidung).
       Tipps zieht der Level-Host zentral ab (screens.js) – hier NICHT einrechnen. */
    scoring: { wrongType: 6, wrongDecision: 5, floor: 40 },

    ki: { name: 'BÜRGER-KI', icon: '🛰️' },

    /* --- Phase 1: drei Aufbereitungs-Aufgaben (Reihenfolge = Spielreihenfolge) --- */
    charts: [
      {
        id: 'feinstaub',
        chip: '🌫️ Feinstaub-Messreihe',
        titel: 'Der Atem der Stadt · Feinstaub (PM10) über 24 Stunden',
        quelle: 'Luftgüte-Sensornetz Nexus · CC-BY 4.0 · Stand: heute 00:00–23:00',
        einheit: 'µg/m³',
        typ: 'line',
        labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
                 '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
                 '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        values: [14, 12, 11, 10, 12, 17, 26, 38, 46, 41, 33, 29, 27, 26, 28, 31,
                 37, 45, 52, 44, 35, 28, 22, 17],
        merkmal: '24 Messpunkte · fortlaufende Zeitreihe',
        erfolg: 'Perfekt! Die Bürger sehen auf einen Blick, wann die Luft am schlechtesten war.',
        lehrsatz: 'Zeitliche Verläufe gehören auf eine Linie – die Zwischenwerte hängen zusammen.'
      },
      {
        id: 'muell',
        chip: '🗑️ Müllaufkommen 5 Stadtteile',
        titel: 'Der Müll-Check · Restmüll je Stadtteil (Tonnen / Woche)',
        quelle: 'Abfallwirtschaft Nexus · CC-BY 4.0 · Kalenderwoche 31',
        einheit: 't/Woche',
        typ: 'bar',
        labels: ['Zentrum', 'Hafen', 'Altstadt', 'Nordpark', 'Industrie'],
        values: [128, 176, 94, 61, 213],
        merkmal: '5 getrennte Kategorien · kein Zeitbezug',
        erfolg: 'Sehr gut! So sehen alle sofort, welcher Stadtteil den meisten Müll produziert.',
        lehrsatz: 'Getrennte Kategorien vergleicht man mit Säulen nebeneinander.'
      },
      {
        id: 'budget',
        chip: '💶 Budget-Aufteilung',
        titel: 'Der Stadt-Kuchen · Verteilung des Jahresbudgets (100 %)',
        quelle: 'Finanzabteilung Nexus · CC-BY 4.0 · Haushaltsplan 2026',
        einheit: '%',
        typ: 'pie',
        labels: ['Bildung & Schulen', 'Mobilität & Verkehr', 'Digitale Infrastruktur',
                 'Grünflächen & Umwelt', 'Kultur & Soziales'],
        values: [28, 22, 19, 17, 14],
        merkmal: 'Anteile eines geschlossenen Ganzen · Summe = 100 %',
        erfolg: 'Genau richtig! Das versteht wirklich jeder Bürger sofort.',
        lehrsatz: 'Anteile an einem Ganzen (100 %) zeigt der Kreis am ehrlichsten.'
      }
    ],

    /* Typ-Auswahl: Reihenfolge = Anzeige- und Tastenreihenfolge 1/2/3 */
    typen: [
      { id: 'line', key: '1', icon: '📈', label: 'LINIENDIAGRAMM',
        hint: 'Falsches Werkzeug! Überlege, was für die Bürger am leichtesten zu lesen ist. ' +
              'Eine Linie verbindet Werte – das ergibt nur bei einem Verlauf Sinn.' },
      { id: 'bar', key: '2', icon: '📊', label: 'SÄULENDIAGRAMM',
        hint: 'Falsches Werkzeug! Säulen stellen getrennte Kategorien nebeneinander – ' +
              'für Verläufe oder Anteile sind sie die falsche Wahl.' },
      { id: 'pie', key: '3', icon: '🥧', label: 'KREISDIAGRAMM',
        hint: 'Falsches Werkzeug! Ein Kreis funktioniert nur, wenn sich alle Teile ' +
              'zu einem Ganzen (100 %) ergänzen.' }
    ],

    slotHint: 'Zuerst den Diagrammtyp wählen – dieses Feld ist noch nicht freigeschaltet.',

    /* --- Phase 2: die lebendige Cyber-Stadt (360°-Epilog nach den 3 Diagrammen) --- */
    city: {
      intro: {
        title: '🏙️ DIE LEBENDIGE CYBER-STADT',
        text: 'Das Bürger-Portal läuft. Jetzt geh hinaus und prüfe, welche Daten in der ' +
              'Stadt wirklich offen sein dürfen – und welche streng privat bleiben müssen. ' +
              'Drehe dich mit der Maus oder den Pfeiltasten um 360° und tippe die ' +
              'leuchtenden Punkte an.',
        cta: '🌍 STADT BETRETEN'
      },
      answers: [
        { id: 'open', key: 'f', icon: '🟢', label: 'FREIGEBEN', color: '#39ff88' },
        { id: 'block', key: 's', icon: '🔴', label: 'SPERREN', color: '#ff4d6d' }
      ],
      finale: {
        title: '🏆 OPEN-DATA-HERO-AWARD',
        text: 'Alle zehn Szenarien geprüft! Du hast die begrünte Cyber-Stadt in eine ' +
              'sichere und transparente Zukunft geführt: offen, wo es allen nützt – ' +
              'geschützt, wo es Menschen betrifft.'
      },

      /* angle = Blickrichtung in Grad (0 = Startblick), y = Höhe in % der City-Ebene.
         Offene und private Szenarien wechseln sich bewusst ab (Mindestabstand 26°) –
         die Position darf die Antwort nicht verraten. */
      spots: [
        {
          id: 'jogger', angle: 10, y: 30, icon: '🏃', tag: 'Fitness-Statistik',
          title: 'Die Jogger im Park',
          desc: 'Anonymisierte Fitness-Statistiken von Sportlern helfen der Stadtverwaltung ' +
                'dabei, Laufstrecken und Parks optimal zu planen.',
          detail: 'Das Terminal zeigt Mittelwerte: „Ø 7.400 Schritte · 214 Läufer:innen heute · ' +
                   'keine Namen, keine Geräte-IDs."',
          correct: 'open',
          okText: 'Richtig freigegeben! Hier stehen nur Mittelwerte – kein Mensch ist ' +
                   'wiedererkennbar. Mit diesen Zahlen plant die Stadt breitere Laufwege und ' +
                   'mehr Trinkbrunnen genau dort, wo wirklich gelaufen wird.',
          warnText: 'Zu vorsichtig gesperrt: Anonymisierte Summen schaden niemandem. Wer auch ' +
                     'harmlose Daten wegsperrt, nimmt der Stadt die Grundlage für gute ' +
                     'Entscheidungen – Datenschutz heißt schützen, nicht alles verstecken.',
          law: null
        },
        {
          id: 'cafe', angle: 46, y: 34, icon: '💳', tag: 'Zahlungsdaten',
          title: 'Die Kundin beim Bezahlen im Café',
          desc: 'Eine Person zahlt an der Kasse; auf einem Hologramm blinken Kontostand, ' +
                'IBAN und Einkäufe auf (Unterliegt streng der DSGVO).',
          detail: 'Das Hologramm zeigt offen: „M. Sandhofer · AT61 1904 3002 3457 3201 · ' +
                   'Kontostand 1.284,90 € · zuletzt gekauft: Medikament, Buch, Kaffee."',
          correct: 'block',
          okText: 'Richtig gesperrt! Kontostand, IBAN und Einkaufsliste sind ' +
                   'personenbezogene Daten. Aus einer Einkaufsliste lassen sich Krankheiten, ' +
                   'Religion oder Geldsorgen ablesen – das geht niemanden etwas an.',
          warnText: '⚠ SCHWERER DATENSCHUTZVERSTOSS! Du hast Kontodaten einer namentlich ' +
                     'erkennbaren Person veröffentlicht. Das ist ein direkter Verstoß gegen die ' +
                     'DSGVO und öffnet Tür und Tor für Betrug und Identitätsdiebstahl. ' +
                     'Sperre diese Anzeige sofort!',
          law: 'DSGVO Art. 6 · Personenbezogene Finanzdaten brauchen eine Rechtsgrundlage – ' +
               'öffentliche Anzeige ist keine.'
        },
        {
          id: 'luftguete', angle: 82, y: 46, icon: '📡', tag: 'Umweltsensor',
          title: 'Die Luftgüte-Station an der Kreuzung',
          desc: 'Ein futuristischer Sensor an einem Baum zeigt live die Feinstaubwerte für ' +
                'den Umweltschutz an.',
          detail: 'Das Display zeigt: „PM10: 26 µg/m³ · Standort: Kreuzung Nexusallee · ' +
                   'öffentlicher Umweltsensor."',
          correct: 'open',
          okText: 'Richtig freigegeben! Luftmesswerte betreffen niemanden persönlich – sie ' +
                   'helfen allen, die Umweltbelastung im Blick zu behalten.',
          warnText: 'Zu vorsichtig gesperrt: Ein Umweltsensor misst die Luft, keine Menschen. ' +
                     'Solche Daten gehören ins Open-Data-Portal, nicht in den Panzerschrank.',
          law: null
        },
        {
          id: 'handy', angle: 118, y: 26, icon: '📱', tag: 'Privater Chat',
          title: 'Das Smartphone mit privatem Chat auf der Parkbank',
          desc: 'Ein liegengebliebenes Gerät zeigt im Vorschaufenster persönliche Nachrichten ' +
                'und private Gespräche.',
          detail: 'Auf dem Sperrbildschirm ist zu lesen: „Mama: Ruf mich bitte an, es geht um ' +
                   'den Arzttermin …"',
          correct: 'block',
          okText: 'Richtig gesperrt! Private Nachrichten gehören ausschließlich der Person, ' +
                   'die sie geschrieben oder empfangen hat – niemand sonst darf mitlesen.',
          warnText: '⚠ DATENSCHUTZVERSTOSS! Du hast private Nachrichten einer fremden Person ' +
                     'offengelegt. Chatverläufe sind höchstpersönlich – so etwas sperrt man ' +
                     'sofort und bringt das Gerät zum Fundbüro.',
          law: 'DSGVO Art. 5 Abs. 1 lit. f · Vertraulichkeit der Kommunikation ist ' +
               'grundrechtlich geschützt.'
        },
        {
          id: 'fahrplan', angle: 154, y: 32, icon: '🚌', tag: 'Echtzeitdaten',
          title: 'Der Live-Fahrplan an der Bushaltestelle',
          desc: 'Digitale Echtzeitdaten, die den Bürgerinnen und Bürgern die genaue ' +
                'Ankunftszeit der Busse anzeigen.',
          detail: 'Die Anzeige meldet: „Linie 7 in 3 Min · Linie 12 in 9 Min · Datenquelle: ' +
                   'GTFS Verkehrsbetriebe Nexus."',
          correct: 'open',
          okText: 'Richtig freigegeben! Fahrplandaten betreffen Fahrzeuge, nicht Personen – ' +
                   'offen zugänglich sparen sie allen Fahrgästen Wartezeit.',
          warnText: 'Zu vorsichtig gesperrt: Ein Busfahrplan verrät nichts über eine einzelne ' +
                     'Person. Gesperrt hilft er niemandem – offen hilft er der ganzen Stadt.',
          law: null
        },
        {
          id: 'kamera', angle: 190, y: 52, icon: '📹', tag: 'Überwachungskamera',
          title: 'Die Überwachungskamera am Wohneingang',
          desc: 'Eine Live-Kamera filmt das Gesicht einer Privatperson beim Betreten ihres ' +
                'Hauses (Verletzt die Privatsphäre).',
          detail: 'Der Feed zeigt in Großaufnahme das Gesicht einer Bewohnerin beim ' +
                   'Aufschließen ihrer Wohnungstür.',
          correct: 'block',
          okText: 'Richtig gesperrt! Ein Gesicht ist ein biometrisches Merkmal – die Aufnahme ' +
                   'zeigt eindeutig, wer wann zu Hause ist. Das gehört nicht ins offene Netz.',
          warnText: '⚠ SCHWERER DATENSCHUTZVERSTOSS! Du hast die Live-Aufnahme einer erkennbaren ' +
                     'Person veröffentlicht. Damit lässt sich nachverfolgen, wann jemand zu ' +
                     'Hause ist oder nicht – ein Sicherheitsrisiko für die betroffene Person.',
          law: 'DSGVO Art. 9 · Biometrische Daten zur eindeutigen Identifizierung sind ' +
               'besonders geschützt.'
        },
        {
          id: 'parkhaus', angle: 226, y: 38, icon: '🅿️', tag: 'Parkleitsystem',
          title: 'Die freien Parkplätze in der Tiefgarage',
          desc: 'Live-Anzeigen, die den Parksuchverkehr reduzieren und so die ' +
                'Umweltbelastung in der Stadt senken.',
          detail: 'Die Anzeigetafel meldet: „Tiefgarage Nexusplatz: 42 von 180 Plätzen frei."',
          correct: 'open',
          okText: 'Richtig freigegeben! Eine Zahl freier Stellplätze verrät nichts über ' +
                   'einzelne Autos oder Personen – sie spart unnötigen Parksuchverkehr.',
          warnText: 'Zu vorsichtig gesperrt: Eine reine Stellplatzzahl ist so anonym wie eine ' +
                     'Wettervorhersage. Gesperrt bringt sie niemandem etwas.',
          law: null
        },
        {
          id: 'akte', angle: 262, y: 30, icon: '🩺', tag: 'Krankenakte',
          title: 'Die offene Krankenakte im Wartezimmer',
          desc: 'Ein herumliegender Aktenordner zeigt Namen und medizinische Diagnosen eines ' +
                'Bürgers (Extrem schützenswerte Gesundheitsdaten).',
          detail: 'Auf dem sichtbaren Deckblatt steht: „Patient: J. Reiter · Diagnose: ' +
                   'Diabetes Typ 2 · nächster Termin: …"',
          correct: 'block',
          okText: 'Richtig gesperrt! Gesundheitsdaten gehören zu den am strengsten ' +
                   'geschützten Informationen überhaupt – sie dürfen niemals offen einsehbar sein.',
          warnText: '⚠ SCHWERER DATENSCHUTZVERSTOSS! Du hast die Diagnose einer namentlich ' +
                     'genannten Person offengelegt. Gesundheitsdaten sind eine „besondere ' +
                     'Kategorie" personenbezogener Daten – ihre Offenlegung kann zu ' +
                     'Diskriminierung führen. Sofort sperren!',
          law: 'DSGVO Art. 9 · Gesundheitsdaten zählen zu den besonderen Kategorien ' +
               'personenbezogener Daten.'
        },
        {
          id: 'stadtplan', angle: 298, y: 34, icon: '🗺️', tag: 'Barrierefrei-Info',
          title: 'Der öffentliche Stadtplan',
          desc: 'Digitale Terminals, die barrierefreie Wege, öffentliche Trinkbrunnen und ' +
                'Sitzbänke für alle verzeichnen.',
          detail: 'Das Terminal zeigt eine Karte mit Symbolen für Rampen, Trinkbrunnen und ' +
                   'Ruhebänke – ohne jeden Personenbezug.',
          correct: 'open',
          okText: 'Richtig freigegeben! Ein Stadtplan mit Infrastruktur-Infos nützt allen ' +
                   'Bürger:innen gleichermaßen und enthält keine persönlichen Daten.',
          warnText: 'Zu vorsichtig gesperrt: Wege, Brunnen und Bänke gehören der Allgemeinheit – ' +
                     'ein gesperrter Stadtplan hilft niemandem, sich zurechtzufinden.',
          law: null
        },
        {
          id: 'haustuer', angle: 334, y: 44, icon: '🔐', tag: 'Smart-Home',
          title: 'Der digitale Haustür-Code / Smart-Home',
          desc: 'Ein Display an einer Wohnungsfassade zeigt den Zugangscode und die ' +
                'Steuerung der privaten Immobilie (Sicherheitsrisiko).',
          detail: 'Das Display zeigt offen: „Zugangscode: 4471 · Alarmanlage: deaktiviert."',
          correct: 'block',
          okText: 'Richtig gesperrt! Ein offen sichtbarer Türcode ist eine direkte Einladung ' +
                   'für Einbrecher – Zugangsdaten zu einer Privatimmobilie müssen geheim bleiben.',
          warnText: '⚠ SICHERHEITSRISIKO! Du hast den Zugangscode zu einer privaten Wohnung ' +
                     'offengelegt. Damit könnte sich jede Person unbefugt Zutritt verschaffen – ' +
                     'sofort sperren!',
          law: 'DSGVO Art. 32 · Sicherheit der Verarbeitung – Zugangsdaten müssen vor ' +
               'unbefugtem Zugriff geschützt werden.'
        }
      ]
    }
  };

  NX.data = { avatars: avatars, level1: level1, level2: level2, level3: level3, level4: level4 };
})(window.NX);
