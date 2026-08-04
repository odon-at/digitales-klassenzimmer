/* =========================================================================
   registry.js — assembles the level list and the level "interface".
   This is the extension seam: to add / change a level, edit a level module
   (or push a new one to NX.levelDefs). Nothing else needs to change.
   Exposes: window.NX.levels
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  var defs = (NX.levelDefs || []).slice().sort(function (a, b) { return a.id - b.id; });

  function all() { return defs; }
  function byId(id) { return defs.filter(function (l) { return l.id === id; })[0] || null; }
  function orderedIds() { return defs.map(function (l) { return l.id; }); }
  function count() { return defs.length; }

  // level N is unlocked when the previous level in the ordered list is completed
  function isUnlocked(id) {
    var ids = orderedIds();
    var idx = ids.indexOf(id);
    if (idx <= 0) return true;
    return NX.state.isCompleted(ids[idx - 1]);
  }

  function allCompleted() {
    return orderedIds().every(function (id) { return NX.state.isCompleted(id); });
  }

  // accent key -> CSS color / soft rgba
  var ACCENTS = {
    green:  ['#39ff88', 'rgba(57,255,136,0.16)'],
    purple: ['#b25cff', 'rgba(178,92,255,0.18)'],
    yellow: ['#ffd21f', 'rgba(255,210,31,0.16)'],
    cyan:   ['#35e6ff', 'rgba(53,230,255,0.16)'],
    blue:   ['#00BFFF', 'rgba(0,191,255,0.20)']
  };
  function accentOf(key) { return ACCENTS[key] || ACCENTS.cyan; }

  NX.levels = {
    all: all, byId: byId, orderedIds: orderedIds, count: count,
    isUnlocked: isUnlocked, allCompleted: allCompleted, accentOf: accentOf
  };
})(window.NX);
