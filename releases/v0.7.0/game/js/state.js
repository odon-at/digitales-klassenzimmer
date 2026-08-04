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

  /* Hall of Chroniclers (leaderboard) */
  function getHall() {
    try { return JSON.parse(localStorage.getItem(HALL_KEY)) || []; }
    catch (e) { return []; }
  }
  function addToHall(entry) {
    var hall = getHall();
    hall.push(entry);
    hall.sort(function (a, b) { return b.score - a.score; });
    hall = hall.slice(0, 12);
    try { localStorage.setItem(HALL_KEY, JSON.stringify(hall)); } catch (e) { /* ignore */ }
    return hall;
  }

  NX.state = {
    load: load, save: save, reset: reset, get: get, update: update,
    isCompleted: isCompleted, keysCount: keysCount, totalScore: totalScore, taskScore: taskScore,
    completeLevel: completeLevel, hasSave: hasSave,
    hasAnsweredBonus: hasAnsweredBonus, bonusEarned: bonusEarned,
    awardBonus: awardBonus, bonusTotal: bonusTotal,
    hasAward: hasAward, grantAward: grantAward,
    getHall: getHall, addToHall: addToHall
  };
})(window.NX);
