/* =========================================================================
   ui.js — shared DOM helpers, widgets (toast, modal, bars, JSON highlight)
   Exposes: window.NX.ui
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* create an element: el('button', {class:'btn', onclick:fn, text:'Hi'}, [childNodes]) */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'dataset') { Object.keys(v).forEach(function (dk) { node.dataset[dk] = v[dk]; }); }
      else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined && v !== false) node.setAttribute(k, v);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  /* ---- toast ---- */
  var toastTimer = null;
  function toast(msg, kind, ms) {
    var t = $('#toast');
    if (!t) return;
    t.className = 'toast' + (kind ? ' ' + kind : '');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, ms || 2600);
  }

  /* ---- Text zum Vorlesen aufbereiten -------------------------------------
     Die Tipp- und Info-Texte sind HTML-Schnipsel. plainText() macht daraus
     reinen Text, toLines() zerlegt ihn in Sätze – genau das Format, das
     NX.audio.voice.speak() erwartet (ein Utterance je Satz). Bewusst ohne
     Lookbehind: der Code muss ES5 bleiben.                                 */
  function plainText(html) {
    if (html == null) return '';
    var tmp = document.createElement('div');
    tmp.innerHTML = String(html);
    return (tmp.textContent || '').replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
  }
  function toLines(text) {
    return plainText(text)
      .replace(/([.!?:])\s+/g, '$1\n')
      .split('\n')
      .map(function (s) { return s.replace(/^\s+|\s+$/g, ''); })
      .filter(function (s) { return s.length > 1; });
  }

  /* ---- Sprachleiste (Vorlesen + Stimme der Bürger-KI) --------------------
     Zwei getrennte Quellen, ein Bedienelement: „Vorlesen" spricht den
     jeweils angezeigten Text per Browser-Sprachsynthese, „KI-Stimme" spielt
     die feste Aufnahme. Beide schließen sich in audio.js gegenseitig aus.
     getText ist eine Funktion, damit die Leiste auch dort funktioniert, wo
     sich der Text unter ihr ändert (Info-Overlay).                         */
  function voiceBar(getText, opts) {
    opts = opts || {};
    var A = NX.audio;
    var readBtn = el('button', { class: 'btn btn-ghost btn-sm voicebar-read', type: 'button' });
    var kiBtn = el('button', { class: 'btn btn-ghost btn-sm voicebar-ki', type: 'button' });
    var bar = el('div', { class: 'voicebar' }, [
      el('span', { class: 'voicebar-ico', text: '🛰️' }),
      el('span', { class: 'voicebar-label', text: 'BÜRGER-KI' }),
      readBtn, kiBtn
    ]);

    function resetRead() { readBtn.textContent = '🔊 Vorlesen'; }
    function resetKi() { kiBtn.textContent = '📻 KI-Stimme'; }
    resetRead(); resetKi();

    readBtn.addEventListener('click', function () {
      if (!A) return;
      if (A.voice.isActive()) { A.voice.stop(); resetRead(); return; }
      var lines = toLines(typeof getText === 'function' ? getText() : getText);
      if (!lines.length) { toast('Hier gibt es nichts vorzulesen.', 'warn'); return; }
      resetKi();
      var started = A.voice.speak(lines, {
        onDone: resetRead, onError: resetRead,
        onUnavailable: function () {
          resetRead();
          toast(A.isMuted() ? 'Ton ist stumm (🔇 oben rechts).'
                            : 'Dein Browser hat keine deutsche Sprachausgabe.', 'warn');
        }
      });
      if (started) readBtn.textContent = '⏹ Stopp';
    });

    kiBtn.addEventListener('click', function () {
      if (!A || !A.clip) return;
      if (A.clip.isPlaying()) { A.clip.stop(); resetKi(); return; }
      resetRead();
      playKi(function () { kiBtn.textContent = '⏹ Stopp'; }, resetKi);
    });

    function playKi(onStart, onStop) {
      if (!A || !A.clip) { if (onStop) onStop(); return false; }
      return A.clip.play('kiVoice', {
        onStart: onStart,
        onDone: onStop,
        onUnavailable: function () {
          if (onStop) onStop();
          if (A.isMuted()) toast('Ton ist stumm (🔇 oben rechts).', 'warn');
        }
      });
    }

    if (!A || !A.clip || !A.clip.available('kiVoice')) kiBtn.hidden = true;
    // Einmal je Sitzung meldet sich die KI von selbst – 35 Sekunden bei jedem
    // Öffnen wären ein Hinterhalt.
    if (opts.autoKi) playKi(function () { kiBtn.textContent = '⏹ Stopp'; }, resetKi);

    return bar;
  }

  function stopSpeech() {
    if (!NX.audio) return;
    if (NX.audio.voice) NX.audio.voice.stop();
    if (NX.audio.clip) NX.audio.clip.stop();
  }

  /* ---- modal / info popup ----
     opts.speak = Text zum Vorlesen (meist derselbe wie bodyHtml)
     opts.autoKi = die KI-Aufnahme startet beim Öffnen von selbst          */
  function showModal(title, bodyHtml, opts) {
    var m = $('#modal');
    var body = $('#modal-body');
    $('#modal-title').textContent = title || 'INFO';
    body.innerHTML = bodyHtml || '';
    stopSpeech();
    if (opts && opts.speak) {
      var speakText = opts.speak === true ? bodyHtml : opts.speak;
      body.insertBefore(voiceBar(function () { return speakText; }, { autoKi: !!opts.autoKi }),
                        body.firstChild);
    }
    m.hidden = false;
  }
  function closeModal() {
    var m = $('#modal');
    if (m) m.hidden = true;
    stopSpeech();
  }

  /* ---- bars ---- */
  function setBar(fillEl, pctEl, pct) {
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    if (fillEl) fillEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
  }

  /* ---- JSON syntax highlighting (escaped) ---- */
  function highlightJSON(obj) {
    var s = JSON.stringify(obj, null, 2);
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return s.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = 'json-num';
        if (/^"/.test(match)) cls = /:$/.test(match) ? 'json-key' : 'json-str';
        else if (/true|false|null/.test(match)) cls = 'json-bool';
        return '<span class="' + cls + '">' + match + '</span>';
      }
    );
  }

  /* ---- confetti (safe wrapper around CDN lib) ---- */
  function celebrate() {
    if (typeof window.confetti !== 'function') return;
    var end = Date.now() + 900;
    (function frame() {
      window.confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#35e6ff', '#39ff88', '#ffd21f', '#b25cff'] });
      window.confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#35e6ff', '#39ff88', '#ffd21f', '#ff2fb0'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  /* wire modal close (DOM is ready: script loads at end of <body>) */
  (function wireModal() {
    var closeBtn = document.getElementById('modal-close');
    var modal = document.getElementById('modal');
    if (closeBtn) closeBtn.addEventListener('click', function () { NX.audio && NX.audio.play('click'); closeModal(); });
    if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  })();

  NX.ui = {
    $: $, $$: $$, el: el, escapeHtml: escapeHtml,
    toast: toast, showModal: showModal, closeModal: closeModal,
    plainText: plainText, toLines: toLines, voiceBar: voiceBar, stopSpeech: stopSpeech,
    setBar: setBar, highlightJSON: highlightJSON, celebrate: celebrate
  };
})(window.NX);
