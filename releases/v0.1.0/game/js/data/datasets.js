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
      id: 'ben', name: 'BEN', role: 'DER BESCHÜTZER', color: '#ffd21f',
      img: 'media/avatar-ben.png',
      skills: ['Nahkampf Experte', 'Stark & Ausdauernd', 'Team-Schild'],
      abilities: ['🛡 Schildwall', '🧱 Datenpanzer', '👁 Overwatch'],
      info: 'Ben hält den Schild hoch, wenn die Firewall bricht. Nichts kommt an ihm vorbei.'
    },
    {
      id: 'zen', name: 'ZEN', role: 'DIE VISIONÄR*IN', color: '#39ff88',
      img: 'media/avatar-zen.png',
      skills: ['Support Spezialist*in', 'Heilung & Boosts', 'Team Optimierung'],
      abilities: ['✚ Datenheilung', '🌊 Boost-Welle', '📈 Optimierung'],
      info: 'Zen sieht Muster, wo andere nur Chaos sehen, und bringt das Team nach vorne.'
    }
  ];

  /* ---- Level 1: Trinkbrunnen-Datensatz mit einem unmöglichen Wert ---- */
  var level1 = {
    columns: ['ID', 'Bezirk', 'pH-Wert', 'Temperatur °C', 'Status'],
    rows: [
      { id: 'BR-01', bezirk: 'Zentrum',    ph: '7.2',  temp: '11.4', status: 'aktiv' },
      { id: 'BR-02', bezirk: 'Hafen',      ph: '7.5',  temp: '12.1', status: 'aktiv' },
      { id: 'BR-03', bezirk: 'Altstadt',   ph: '6.9',  temp: '10.8', status: 'aktiv' },
      { id: 'BR-04', bezirk: 'Nordpark',   ph: '27.0', temp: '11.0', status: 'aktiv' }, // <- unmöglich (pH nur 0–14)
      { id: 'BR-05', bezirk: 'Industrie',  ph: '7.1',  temp: '12.6', status: 'aktiv' }
    ],
    badCell: { rowIndex: 3, field: 'ph' },
    validPh: { min: 6.5, max: 8.5 }, // plausibel für Trinkwasser
    phHardRange: { min: 0, max: 14 }
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

  /* ---- Level 3: vier Datensatz-Karten, nur eine ist vertrauenswürdig ---- */
  var level3 = {
    cards: [
      {
        id: 'A', titel: 'Trinkwasser-Report 2026',
        quelle: 'daten.nexus.gv.at', quelleOk: true,
        lizenz: 'CC-BY 4.0', lizenzOk: true,
        aktualisiert: '2026-07', metaOk: true,
        wert: 'Nitrat: 12 mg/l', wertOk: true,
        trust: true
      },
      {
        id: 'B', titel: 'Wasser-Fakten (Gratis-Download)',
        quelle: 'free-data-download.ru', quelleOk: false,
        lizenz: 'CC-BY 4.0', lizenzOk: true,
        aktualisiert: '2026-06', metaOk: true,
        wert: 'Nitrat: 11 mg/l', wertOk: true,
        trust: false, grund: 'Unbekannter, nicht-offizieller Server (Fake-Quelle).'
      },
      {
        id: 'C', titel: 'Stadtwasser-Analyse',
        quelle: 'daten.nexus.gv.at', quelleOk: true,
        lizenz: '© Alle Rechte vorbehalten', lizenzOk: false,
        aktualisiert: '2026-07', metaOk: true,
        wert: 'Nitrat: 13 mg/l', wertOk: true,
        trust: false, grund: 'Keine offene Lizenz – Nutzung nicht erlaubt (nicht CC-BY).'
      },
      {
        id: 'D', titel: 'Wasserqualität Live',
        quelle: 'daten.nexus.gv.at', quelleOk: true,
        lizenz: 'CC-BY 4.0', lizenzOk: true,
        aktualisiert: '2026-07', metaOk: true,
        wert: 'Nitrat: 9999 mg/l', wertOk: false,
        trust: false, grund: 'Unmöglicher Wert (9999 mg/l) – Plausibilitätstest nicht bestanden.'
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
