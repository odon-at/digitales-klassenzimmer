/* =========================================================================
   audio.js — lightweight Web Audio SFX (no asset files needed) + mute
   Exposes: window.NX.audio
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  var MUTE_KEY = 'nexusdata.muted';
  var ctx = null;
  var muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}

  function ensureCtx() {
    if (ctx) return ctx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    } catch (e) { ctx = null; }
    return ctx;
  }

  // play a single tone with a short attack/decay envelope
  function tone(freq, start, dur, type, vol) {
    if (!ctx) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    var t0 = ctx.currentTime + start;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  var SFX = {
    click:   function () { tone(620, 0, 0.06, 'square', 0.08); },
    select:  function () { tone(440, 0, 0.08, 'triangle', 0.12); tone(660, 0.06, 0.1, 'triangle', 0.1); },
    success: function () { tone(523, 0, 0.12, 'sine', 0.16); tone(784, 0.1, 0.18, 'sine', 0.16); },
    key:     function () { tone(880, 0, 0.1, 'sine', 0.16); tone(1318, 0.09, 0.22, 'sine', 0.14); },
    error:   function () { tone(180, 0, 0.18, 'sawtooth', 0.14); },
    win:     function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, i * 0.12, 0.28, 'sine', 0.16); }); }
  };

  function play(name) {
    if (muted) return;
    if (!ensureCtx()) return;
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    if (SFX[name]) SFX[name]();
  }

  function isMuted() { return muted; }
  function setMuted(v) {
    muted = !!v;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) {}
    return muted;
  }
  function toggle() { return setMuted(!muted); }

  NX.audio = { play: play, isMuted: isMuted, setMuted: setMuted, toggle: toggle };
})(window.NX);
