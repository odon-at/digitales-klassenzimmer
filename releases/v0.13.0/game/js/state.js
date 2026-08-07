/* =========================================================================
   state.js — game state + localStorage persistence
   Exposes: window.NX.state
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  var SAVE_KEY = 'nexusdata.save';
  var HALL_KEY = 'nexusdata.hall';

  function defaults() {
    return {
      classCode: '',
      name: '',
      avatarId: null,
      completed: [],   // [levelId, ...] in completion order
      scores: {},      // { levelId: bestScore }
      bonuses: {},     // { levelId: Bonuspunkte } – Schlüssel existiert = Frage beantwortet
      awards: [],      // ['open-data-hero', ...] – dauerhaft freigeschaltete Auszeichnungen
      openDataSets: 0, // korrekt freigegebene Open-Data-Szenarien (Leaderboard-Spalte)
      feedback: '',
      startedAt: null,
      hallSaved: false
    };
  }

  var state = defaults();

  function load() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        state = Object.assign(defaults(), parsed);
        if (!Array.isArray(state.completed)) state.completed = [];
        if (typeof state.scores !== 'object' || !state.scores) state.scores = {};
        if (typeof state.bonuses !== 'object' || !state.bonuses) state.bonuses = {};
        if (!Array.isArray(state.awards)) state.awards = [];
        if (typeof state.openDataSets !== 'number') state.openDataSets = 0;
      }
    } catch (e) { state = defaults(); }
    return state;
  }

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function reset() { state = defaults(); save(); return state; }
  function get() { return state; }
  function update(patch) { Object.assign(state, patch); save(); return state; }

  /* progress helpers */
  function isCompleted(id) { return state.completed.indexOf(id) !== -1; }
  function keysCount() { return state.completed.length; }
  function taskScore() {
    return Object.keys(state.scores).reduce(function (sum, k) { return sum + (state.scores[k] || 0); }, 0);
  }
  function totalScore() { return taskScore() + bonusTotal(); }

  /* Wissens-Bonus aus dem Info-System (ℹ).
     Eine Map statt eines Arrays: Auch eine FALSCHE Antwort wird mit 0 gespeichert.
     Damit gilt die Frage als beantwortet und lässt sich nicht durchprobieren. */
  function hasAnsweredBonus(id) { return Object.prototype.hasOwnProperty.call(state.bonuses, id); }
  function bonusEarned(id) { return state.bonuses[id] || 0; }
  function awardBonus(id, pts) {
    if (hasAnsweredBonus(id)) return false;
    state.bonuses[id] = Math.max(0, Math.round(pts || 0));
    save();
    return true;
  }
  function bonusTotal() {
    return Object.keys(state.bonuses).reduce(function (sum, k) { return sum + (state.bonuses[k] || 0); }, 0);
  }
  /* Dauerhafte Auszeichnungen (z. B. „Open-Data-Hero-Award" aus der 360°-Stadt).
     Einmal vergeben, bleibt eine Auszeichnung erhalten – auch über Levelwiederholungen. */
  function hasAward(id) { return state.awards.indexOf(id) !== -1; }
  function grantAward(id) {
    if (hasAward(id)) return false;
    state.awards.push(id);
    save();
    return true;
  }

  function completeLevel(id, score) {
    if (state.completed.indexOf(id) === -1) state.completed.push(id);
    var prev = state.scores[id] || 0;
    state.scores[id] = Math.max(prev, Math.round(score));
    save();
  }

  /* does a resumable game exist? (avatar already chosen) */
  function hasSave() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      var p = JSON.parse(raw);
      return !!(p && p.avatarId);
    } catch (e) { return false; }
  }

  /* ---- Klassen-Leaderboard (lokal) --------------------------------------
     Ohne Server: alle Durchgänge dieses Geräts/Browsers liegen unter
     HALL_KEY. Die Anzeige filtert nach Klassencode, damit Schüler:innen nur
     ihre eigene Klasse sehen. Für mehrere Geräte gibt es Export/Import –
     die Lehrkraft kann Ergebnisse so auf einem Rechner zusammenführen. */
  var HALL_MAX = 200;

  function getHall() {
    try {
      var h = JSON.parse(localStorage.getItem(HALL_KEY));
      return Array.isArray(h) ? h : [];
    } catch (e) { return []; }
  }
  function writeHall(hall) {
    hall.sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
    hall = hall.slice(0, HALL_MAX);
    try { localStorage.setItem(HALL_KEY, JSON.stringify(hall)); } catch (e) { /* ignore */ }
    return hall;
  }
  function normCode(c) { return String(c || '').trim().toUpperCase(); }

  /* Eindeutige Kennung eines Durchgangs – verhindert Doppel-Einträge beim
     Zusammenführen (Import) und beim erneuten Betreten des Endscreens. */
  function runId(e) {
    return normCode(e.code) + '|' + String(e.name || '') + '|' + String(e.startedAt || e.date || '');
  }

  function addToHall(entry) {
    var hall = getHall();
    var id = runId(entry);
    var idx = -1, i;
    for (i = 0; i < hall.length; i++) { if (runId(hall[i]) === id) { idx = i; break; } }
    if (idx !== -1) {
      // gleicher Durchgang: nur verbessern, nie verschlechtern
      if ((entry.score || 0) >= (hall[idx].score || 0)) hall[idx] = entry;
    } else {
      hall.push(entry);
    }
    return writeHall(hall);
  }

  /* Bestenliste einer Klasse, absteigend nach Punkten */
  function hallForClass(code) {
    var c = normCode(code);
    return getHall().filter(function (e) { return normCode(e.code) === c; })
      .sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
  }

  /* Export: kompletter Bestand als JSON-Text (zum Speichern/Weitergeben) */
  function exportHall() {
    return JSON.stringify({ app: 'nexusdata', kind: 'hall', v: 1, entries: getHall() }, null, 2);
  }
  /* Import: führt fremde Einträge mit dem lokalen Bestand zusammen.
     Gibt die Anzahl neu übernommener Einträge zurück (−1 = ungültig). */
  function importHall(text) {
    var data;
    try { data = JSON.parse(text); } catch (e) { return -1; }
    var list = data && Array.isArray(data.entries) ? data.entries
             : (Array.isArray(data) ? data : null);
    if (!list) return -1;
    var hall = getHall();
    var seen = {}, i;
    for (i = 0; i < hall.length; i++) seen[runId(hall[i])] = i;
    var added = 0;
    for (i = 0; i < list.length; i++) {
      var e = list[i];
      if (!e || typeof e.score !== 'number') continue;
      var id = runId(e);
      if (Object.prototype.hasOwnProperty.call(seen, id)) {
        var at = seen[id];
        if ((e.score || 0) > (hall[at].score || 0)) hall[at] = e;
      } else {
        seen[id] = hall.length; hall.push(e); added++;
      }
    }
    writeHall(hall);
    return added;
  }

  NX.state = {
    load: load, save: save, reset: reset, get: get, update: update,
    isCompleted: isCompleted, keysCount: keysCount, totalScore: totalScore, taskScore: taskScore,
    completeLevel: completeLevel, hasSave: hasSave,
    hasAnsweredBonus: hasAnsweredBonus, bonusEarned: bonusEarned,
    awardBonus: awardBonus, bonusTotal: bonusTotal,
    hasAward: hasAward, grantAward: grantAward,
    getHall: getHall, addToHall: addToHall, hallForClass: hallForClass,
    exportHall: exportHall, importHall: importHall
  };
})(window.NX);
