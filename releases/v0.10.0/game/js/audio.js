/* =========================================================================
   audio.js — Web-Audio-SFX (ohne Asset-Dateien) + Mute + Sprachausgabe
              + Audio-Clips (ab v0.9.0: die Stimme der Bürger-KI als MP3)
   Exposes: window.NX.audio

   Drei Tonquellen, ein gemeinsamer Mute-Schalter:
     play(name)    – kurze Oszillator-Effekte, brauchen keine Datei
     voice.speak() – Browser-Sprachsynthese, spricht BELIEBIGE Texte
     clip.play(k)  – hinterlegte Aufnahme zum Schlüssel k (js/data/voice.js)
   Der Vorlese-Knopf bevorzugt die Aufnahme und fällt auf die Sprachsynthese
   zurück, wenn zum Schlüssel keine Datei hinterlegt ist. voice und clip
   schließen sich gegenseitig aus – zwei Stimmen gleichzeitig versteht niemand.
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
    // Stummschalten heißt: JETZT still. Laufende Sprachausgabe und Clips enden.
    if (muted) {
      if (voice) voice.stop();
      if (clip) clip.stop();
    }
    return muted;
  }
  function toggle() { return setMuted(!muted); }

  var clip;   // weiter unten befüllt; voice.speak() stoppt darüber laufende Clips

  /* ---- Sprachausgabe (Funk-Kanal im Info-System, Tipps, Info-Texte) -----
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
      if (clip) clip.stop();   // nicht gegen die Aufnahme anreden
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

  /* ---- Audio-Clips ------------------------------------------------------
     Feste Aufnahmen aus game/media/. Anders als voice sprechen sie immer
     denselben Text – sie sind die Erkennungsstimme, nicht der Vorleser.
     Geladen wird über ein <audio>-Element, also per URL wie die Bilder auch;
     das funktioniert auch, wenn index.html direkt per file:// geöffnet wird
     (fetch/XHR täte es dort nicht). Fehlt die Datei, wird der Clip dauerhaft
     als kaputt vermerkt und jeder Aufruf still zum No-Op – das Spiel darf an
     einer fehlenden MP3 niemals hängen bleiben.                            */
  clip = (function () {
    var els = {};       // name -> <audio>
    var broken = {};    // name -> true, sobald das Laden einmal scheiterte
    var current = null;
    var currentCbs = {};

    function supported() { return typeof window.Audio === 'function'; }
    /* Die Zuordnung steht in js/data/voice.js und wird bei JEDEM Zugriff frisch
       gelesen – so wirkt ein nachgetragener Eintrag sofort, ohne Neustart. */
    function src(name) {
      var reg = NX.voiceClips;
      if (!reg || !name) return null;
      return Object.prototype.hasOwnProperty.call(reg, name) ? reg[name] : null;
    }
    function known(name) { return !!src(name); }

    function fail() {
      var cbs = currentCbs;
      current = null; currentCbs = {};
      if (cbs.onUnavailable) cbs.onUnavailable();
    }

    function get(name) {
      if (!known(name) || broken[name] || !supported()) return null;
      if (els[name]) return els[name];
      var a;
      try { a = new window.Audio(src(name)); } catch (e) { broken[name] = true; return null; }
      // Erst holen, wenn wirklich jemand auf Vorlesen drückt
      try { a.preload = 'none'; } catch (e) { /* ignore */ }
      a.addEventListener('error', function () {
        broken[name] = true;
        if (current === a) fail();
      });
      a.addEventListener('ended', function () {
        if (current !== a) return;
        var cbs = currentCbs;
        current = null; currentCbs = {};
        if (cbs.onDone) cbs.onDone();
      });
      els[name] = a;
      return a;
    }

    function stop() {
      if (!current) return;
      try { current.pause(); current.currentTime = 0; } catch (e) { /* ignore */ }
      current = null; currentCbs = {};
    }

    function playClip(name, handlers) {
      var cbs = handlers || {};
      if (muted) { if (cbs.onUnavailable) cbs.onUnavailable(); return false; }
      var a = get(name);
      if (!a) { if (cbs.onUnavailable) cbs.onUnavailable(); return false; }
      stop();
      voice.stop();     // Aufnahme hat Vorrang, sobald sie startet
      current = a; currentCbs = cbs;
      try { a.currentTime = 0; } catch (e) { /* Datei noch nicht geladen – egal */ }
      var p;
      try { p = a.play(); } catch (e) { fail(); return false; }
      // Autoplay-Sperren und Ladefehler melden sich erst über das Promise
      if (p && typeof p.catch === 'function') {
        p['catch'](function () { if (current === a) fail(); });
      }
      if (cbs.onStart) cbs.onStart();
      return true;
    }

    return {
      play: playClip,
      stop: stop,
      available: function (name) { return supported() && known(name) && !broken[name]; },
      isPlaying: function (name) { return !!current && (!name || els[name] === current); }
    };
  })();

  try { window.addEventListener('beforeunload', clip.stop); } catch (e) { /* ignore */ }

  NX.audio = {
    play: play, isMuted: isMuted, setMuted: setMuted, toggle: toggle,
    voice: voice, clip: clip
  };
})(window.NX);
