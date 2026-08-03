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

  /* ---- Level 1: Das Schatten-Archiv ----
     Interne Systemdaten wurden vom Hacker manipuliert. Die echten Werte holt man aus dem
     unabhängigen Open-Data-Portal der (fiktiven) "Datenbehörde Nexus" und gleicht sie ab.
     Korrektur = echten Wert aus der Quelle übernehmen (nicht raten). */
  var level1 = {
    portalUrl: 'https://datenbehoerde-nexus.gv.at/stadt-open-data',
    urlSuggestion: 'https://datenbehoerde-nexus.gv.at/stadt-open-data',
    publisher: 'Datenbehörde Nexus',
    lizenz: 'CC BY 4.0',
    quality: 35, // Start-Datenqualität in %
    // Open-Data-Portal: 7 Kategorien (5 davon sind im internen System manipuliert)
    categories: [
      { key: 'strom',      icon: '⚡', name: 'Strom & Energie',        metric: 'Tagesverbrauch', trueValue: '48.500', unit: 'kWh', updated: '2026-07-30' },
      { key: 'sicherheit', icon: '🚨', name: 'Sicherheit & Standort',   metric: 'Notrufzentralen', trueValue: '12',    unit: '',    updated: '2026-07-28' },
      { key: 'demografie', icon: '👥', name: 'Demografie',              metric: 'Einwohnerzahl',  trueValue: '512.340', unit: '',   updated: '2026-06-30' },
      { key: 'verkehr',    icon: '🚦', name: 'Verkehr & Lichtsignale',  metric: 'Ampelsteuerung', trueValue: 'Automatisch', unit: '', updated: '2026-07-29' },
      { key: 'wasser',     icon: '💧', name: 'Trinkwasser',            metric: 'Zustand',        trueValue: 'Einwandfrei', unit: '', updated: '2026-07-31' },
      { key: 'abfall',     icon: '♻️', name: 'Abfall & Recycling',     metric: 'Recyclingquote', trueValue: '62',      unit: '%',   updated: '2026-07-15' },
      { key: 'gruen',      icon: '🌳', name: 'Grünflächen',            metric: 'Parkanlagen',    trueValue: '37',      unit: '',    updated: '2026-07-10' }
    ],
    // Internes (gehacktes) Stadt-System: 5 manipulierte Einträge, die korrigiert werden müssen
    system: [
      { key: 'strom',      field: 'Tagesverbrauch (kWh)', hacked: '1',                    type: 'number' },
      { key: 'sicherheit', field: 'Notrufzentralen',      hacked: '0',                    type: 'number' },
      { key: 'demografie', field: 'Einwohnerzahl',        hacked: '15',                   type: 'number' },
      { key: 'verkehr',    field: 'Ampelsteuerung',       hacked: 'Manuell / Ausfall',    type: 'text' },
      { key: 'wasser',     field: 'Zustand',              hacked: 'Gefährliche Chemikalien', type: 'text' }
    ],
    // akzeptierte Schreibweisen bei Text-Werten (Groß/Klein egal)
    synonyms: {
      verkehr: ['automatisch', 'auto', 'automatik'],
      wasser: ['einwandfrei', 'ok', 'in ordnung', 'sauber', 'gut', 'trinkbar', 'unbedenklich']
    }
  };

  /* ---- Level 2: simulierte API-Antwort ---- */
  var level2 = {
    validEndpoint: 'https://opendata.nexus.city/v1/luftqualitaet',
    endpoints: [
      { url: 'https://opendata.nexus.city/v1/luftqualitaet', label: 'opendata.nexus.city/v1/luftqualitaet', ok: true },
      { url: 'https://darknet-fog.io/grab', label: 'darknet-fog.io/grab  ⚠ verdächtig', ok: false },
      { url: 'https://opendata.nexus.city/v1/unbekannt', label: 'opendata.nexus.city/v1/unbekannt', ok: false }
    ],
    validToken: 'NX-TOKEN-7F3A-9K2D',
    response200: {
      dataset: 'luftqualitaet',
      stadt: 'Nexus',
      lizenz: 'CC-BY 4.0',
      aktualisiert: '2026-07-28',
      einheit: 'µg/m³ (PM10)',
      messwerte: [
        { bezirk: 'Zentrum',   pm10: 34 },
        { bezirk: 'Hafen',     pm10: 41 },
        { bezirk: 'Altstadt',  pm10: 28 },
        { bezirk: 'Nordpark',  pm10: 19 },
        { bezirk: 'Industrie', pm10: 57 }
      ]
    }
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
