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
      { t: '',                 label: '— kein Token —',                     ok: false },
      { t: 'NX-TAUBE-4211-CX', label: 'NX-TAUBE-4211-CX  (bereitgestellt)', ok: true },
      { t: 'GAST-0000',        label: 'GAST-0000  (abgelaufen)',            ok: false }
    ],
    validToken: 'NX-TAUBE-4211-CX',
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

  /* ---- Level 3: Fragen-Katalog (Swipe-Karten) ----
     Swipe: correct_answer 'left' = RICHTIG/glaubwürdig, 'right' = FALSCH/Lüge.
     icon = Emoji-Ersatz für das (nicht vorhandene) profile_image.
     taskIndex = Checkliste: 0 Quelle · 1 Lizenz · 2 Metadaten · 3 Plausibilität */
  var level3 = {
    questions: [
      {
        id: 1, topic: 'Wasserqualität (Quellcheck)', taskIndex: 0,
        profile_name: 'Wasserwerk_Stadt_Wien', icon: '💧', is_verified: true,
        statement: 'Unser aktueller Prüfbericht bestätigt: Das Trinkwasser erfüllt alle ' +
          'Grenzwerte der Trinkwasserverordnung. Den vollständigen Laborbericht könnt ihr auf ' +
          'unserer offiziellen Website einsehen.',
        correct_answer: 'left', status: 'Richtig',
        explanation: 'Transparenter, offizieller Absender mit Verweis auf verifizierbare Prüfberichte.'
      },
      {
        id: 2, topic: 'Brückensicherheit (Quellcheck)', taskIndex: 0,
        profile_name: 'DarkBridge_Leaks', icon: '🕶️', is_verified: false,
        statement: 'Achtung! Die Reichsbrücke bricht morgen ein! Ich habe geheime Daten von einem ' +
          'anonymen Insider bekommen. Ein Impressum habe ich nicht, aber glaubt mir einfach!',
        correct_answer: 'right', status: 'Falsch',
        explanation: 'Anonymer Panikmache-Account ohne Impressum oder nachvollziehbare Quelle.'
      },
      {
        id: 3, topic: 'Stromqualität (Lizenzprüfung)', taskIndex: 1,
        profile_name: 'Elektro_Max_Fotos', icon: '📷', is_verified: false,
        statement: 'Ich habe dieses Diagramm zur Netzspannung und Stromqualität erstellt und unter ' +
          '‚CC BY‘ hochgeladen. Ihr könnt es in eure Präsentation einbauen, ohne meinen ' +
          'Namen zu nennen – das braucht man bei CC BY nicht!',
        correct_answer: 'right', status: 'Falsch',
        explanation: 'Inhaltlich falsch: Die Lizenz ‚CC BY‘ verpflichtet ausdrücklich zur Namensnennung des Urhebers.'
      },
      {
        id: 4, topic: 'Ampelschaltungen (Lizenzprüfung)', taskIndex: 1,
        profile_name: 'SmartCity_OpenData', icon: '🚦', is_verified: true,
        statement: 'Unser Datensatz zu den Ampelschaltzeiten der Innenstadt steht unter der Lizenz ' +
          '‚CC0‘. Ihr dürft die Daten für eure Schulprojekte völlig frei nutzen, verändern ' +
          'und müsst niemanden als Urheber angeben.',
        correct_answer: 'left', status: 'Richtig',
        explanation: 'Korrekte Erklärung der CC0-Lizenz (Gemeinfreiheit).'
      },
      {
        id: 5, topic: 'Flugverkehr (Metadatenanalyse)', taskIndex: 2,
        profile_name: 'AeroData_2024', icon: '✈️', is_verified: false,
        statement: 'Hier ist die brandneue Live-Auswertung des heutigen Flugverkehrs über dem Flughafen!',
        metadata_hint: 'Dateidetails / Metadaten: Erstellungsdatum 14.05.2011',
        correct_answer: 'right', status: 'Falsch',
        explanation: 'Widerspruch zwischen Behauptung (‚heute‘) und den tatsächlichen Metadaten der Datei (Jahr 2011).'
      },
      {
        id: 6, topic: 'Umwelt / Wasser (Plausibilitätstest)', taskIndex: 3,
        profile_name: 'EcoMonitor_Online', icon: '🌿', is_verified: false,
        statement: 'Sensoren-Rekord: Der pH-Wert unseres Trinkwassers liegt heute bei unschlagbaren ' +
          '98,5! Das ist das sauberste Wasser aller Zeiten!',
        correct_answer: 'right', status: 'Falsch',
        explanation: 'Völlig unplausibel: Die pH-Skala reicht nur von 0 bis 14. Ein Wert von 98,5 ist wissenschaftlich unmöglich.'
      }
    ]
  };

  /* ---- Level 4: Datensatz für die Visualisierung (aus Level 2 verifiziert) ---- */
  var level4 = {
    titel: 'Luftqualität Nexus – PM10 je Bezirk (µg/m³)',
    labels: ['Zentrum', 'Hafen', 'Altstadt', 'Nordpark', 'Industrie'],
    values: [34, 41, 28, 19, 57]
  };

  NX.data = { avatars: avatars, level1: level1, level2: level2, level3: level3, level4: level4 };
})(window.NX);
