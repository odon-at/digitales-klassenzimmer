/* =========================================================================
   score.js — zentrale Punktelogik (Spec: level-4 „5.3 Punkte- & Scoring-Mechanik“)
   Gilt ab v0.8.0 für ALLE Level, damit die Wertung im Klassen-Leaderboard
   über das ganze Spiel hinweg vergleichbar bleibt.

     richtige Teilaufgabe        +100
     ohne Fehlversuch gelöst      +50  (Erstversuch-Bonus)
     je Fehlversuch               −30
     Zeit-Bonus je Level      bis +100  (siehe timeBonus())

   Der Gesamtwert eines Levels kann nicht unter 0 fallen.
   Ein „Teilaufgabe“ ist die kleinste bewertete Entscheidung eines Levels
   (z. B. eine Diagrammwahl, eine Datenkorrektur, ein Belegstand-Urteil).
   Exposes: window.NX.score
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  var UNIT = 100;        // richtige Teilaufgabe
  var FIRST_TRY = 50;    // Bonus, wenn diese Teilaufgabe ohne Fehlversuch saß
  var PENALTY = 30;      // je Fehlversuch

  /* Zeit-Bonus: voller Bonus bis FAST_MS, danach linear fallend bis SLOW_MS.
     Bewusst großzügig – das Spiel belohnt sonst Hetze statt Nachdenken, und
     Info-Texte und Tipps wollen ja gelesen werden. */
  var TIME_MAX = 100;
  var FAST_MS = 150000;  // 2:30 min – bis hierhin voller Bonus
  var SLOW_MS = 600000;  // 10:00 min – ab hier kein Bonus mehr

  function timeBonus(elapsedMs) {
    if (typeof elapsedMs !== 'number' || !isFinite(elapsedMs) || elapsedMs < 0) return 0;
    if (elapsedMs <= FAST_MS) return TIME_MAX;
    if (elapsedMs >= SLOW_MS) return 0;
    var f = 1 - (elapsedMs - FAST_MS) / (SLOW_MS - FAST_MS);
    return Math.round(TIME_MAX * f);
  }

  /* r = { units, firstTry, wrong }  ·  elapsedMs optional */
  function levelScore(r, elapsedMs) {
    r = r || {};
    var units = Math.max(0, r.units || 0);
    var first = Math.max(0, Math.min(units, r.firstTry || 0));
    var wrong = Math.max(0, r.wrong || 0);
    var raw = units * UNIT + first * FIRST_TRY - wrong * PENALTY + timeBonus(elapsedMs);
    return Math.max(0, Math.round(raw));
  }

  /* Höchstpunktzahl eines Levels: alle Teilaufgaben im Erstversuch + Zeit-Bonus.
     `units` steht als `scoreUnits` in der Level-Definition. */
  function levelMax(units) {
    return Math.max(0, units || 0) * (UNIT + FIRST_TRY) + TIME_MAX;
  }

  NX.score = {
    UNIT: UNIT, FIRST_TRY: FIRST_TRY, PENALTY: PENALTY, TIME_MAX: TIME_MAX,
    timeBonus: timeBonus, levelScore: levelScore, levelMax: levelMax
  };
})(window.NX);
