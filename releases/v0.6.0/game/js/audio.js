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

  /* ---- Sprachausgabe (Funk-Kanal im Info-System) ------------------------
     Reine Browser-API (speechSynthesis) – keine Audiodateien, kein CDN.
     Fällt sauber aus, wenn keine Stimme verfügbar ist: dann greift im
     Info-System das Funk-Transkript.                                      */
  var voice = (function () {
    var synth = window.speechSynthesis || null;
    var hasAPI = !!(synth && window.SpeechSynthesisUtterance);
    var deVoice = null;
    var queue = [], idx = 0, cur = null, cbs = {};
    var active = false, paused = false, stopping = false, watchdog = null;

    function pickVoice() {
      if (!hasAPI) return;
      var list = [];
      try { list = synth.getVoices() || []; } catch (e) { list = []; }
      var de = list.filter(function (v) { return /^de/i.test(v.lang || ''); });
      deVoice = de.filter(function (v) { return v.localService; })[0] || de[0] || null;
    }
    if (hasAPI) {
      pickVoice();
      // Chrome/Edge liefern die Stimmenliste erst asynchron nach
      try { synth.addEventListener('voiceschanged', pickVoice); }
      catch (e) { synth.onvoiceschanged = pickVoice; }
    }

    function speakNext() {
      if (!active || stopping || idx >= queue.length) {
        if (active && !stopping && idx >= queue.length) { active = false; if (cbs.onDone) cbs.onDone(); }
        return;
      }
      var i = idx;
      var u = new window.SpeechSynthesisUtterance(queue[i]);
      u.lang = 'de-DE';                 // reicht auch ohne explizit gefundene Stimme
      if (deVoice) u.voice = deVoice;
      u.rate = 0.98; u.pitch = 1; u.volume = 1;
      u.onstart = function () { if (cbs.onLine) cbs.onLine(i); };
      u.onend = function () { if (stopping) return; idx++; speakNext(); };
      u.onerror = function (e) {
        if (stopping || !e || e.error === 'interrupted' || e.error === 'canceled') return;
        active = false;
        if (cbs.onError) cbs.onError();
      };
      cur = u;
      try { synth.speak(u); } catch (err) { active = false; if (cbs.onError) cbs.onError(); }
    }

    /* lines = Array kurzer Sätze. Ein Utterance pro Satz: umgeht Chromes
       Abbruch langer Texte und liefert die Zeilen-Hervorhebung gratis. */
    function speak(lines, handlers) {
      cbs = handlers || {};
      if (!hasAPI || muted) { if (cbs.onUnavailable) cbs.onUnavailable(); return false; }
      stop();
      stopping = false;
      queue = (lines || []).slice();
      idx = 0; active = true; paused = false;
      speakNext();
      // Watchdog: API da, aber keine Stimme installiert (typisch auf Schul-Images)
      watchdog = setTimeout(function () {
        if (!active) return;
        var speaking = false;
        try { speaking = synth.speaking || synth.pending; } catch (e) { speaking = false; }
        if (!speaking) { active = false; if (cbs.onUnavailable) cbs.onUnavailable(); }
      }, 1200);
      return true;
    }

    function pause() {
      if (!hasAPI || !active) return;
      try { synth.pause(); } catch (e) { return; }
      paused = true;
    }
    function resume() {
      if (!hasAPI || !active) return;
      try { synth.resume(); } catch (e) { return; }
      paused = false;
    }
    /* Reihenfolge ist wichtig: erst stopping setzen und die Handler lösen,
       dann cancel() – cancel() feuert auf mehreren Engines onend, was sonst
       den nächsten Satz startet. */
    function stop() {
      stopping = true;
      if (watchdog) { clearTimeout(watchdog); watchdog = null; }
      if (cur) { cur.onend = null; cur.onstart = null; cur.onerror = null; cur = null; }
      if (hasAPI) { try { synth.cancel(); } catch (e) { /* ignore */ } }
      queue = []; idx = 0; active = false; paused = false;
      stopping = false;
    }

    try { window.addEventListener('beforeunload', stop); } catch (e) { /* ignore */ }

    return {
      available: function () { return hasAPI; },
      speak: speak, pause: pause, resume: resume, stop: stop,
      isActive: function () { return active; },
      isPaused: function () { return paused; }
    };
  })();

  NX.audio = { play: play, isMuted: isMuted, setMuted: setMuted, toggle: toggle, voice: voice };
})(window.NX);
