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

  /* ---- Sprachleiste: EIN Vorlese-Knopf (story/stimme.md) -----------------
     Genau ein Bedienelement, überall gleich, und es startet ausschließlich
     auf Knopfdruck – nie von selbst.

     Beim Klick gilt: Liegt zum Schlüssel (opts.clipKey) eine Aufnahme in
     js/data/voice.js, wird sie abgespielt; sonst liest die Browser-Stimme vor.
     Schlägt die hinterlegte Datei fehl, springt die Stimme ein, damit der
     Knopf nie ins Leere klickt.

     getText ist eine Funktion, damit die Leiste auch dort arbeitet, wo sich
     der Text unter ihr ändert (Info-Overlay).
     opts.lines   – fertig zerlegte Sätze (sonst wird getText() zerlegt)
     opts.onLine  – Rückmeldung je gesprochenem Satz (Lennox hebt mit)
     opts.onDone  – am Ende der Ausgabe
     opts.onUnavailable – eigener Ersatzweg, wenn keine Stimme da ist        */
  function voiceBar(getText, opts) {
    opts = opts || {};
    var A = NX.audio;
    var readBtn = el('button', { class: 'btn btn-ghost btn-sm voicebar-read', type: 'button' });
    var bar = el('div', { class: 'voicebar' }, [
      el('span', { class: 'voicebar-ico', text: '🔈' }),
      el('span', { class: 'voicebar-label', text: 'VORLESEN' }),
      readBtn
    ]);

    function idle() { readBtn.textContent = '🔊 Vorlesen'; }
    function busy() { readBtn.textContent = '⏹ Stopp'; }
    function stop() {
      if (A) { if (A.voice) A.voice.stop(); if (A.clip) A.clip.stop(); }
      idle();
    }
    function finished() { idle(); if (opts.onDone) opts.onDone(); }
    idle();

    function val(x) { return typeof x === 'function' ? x() : x; }

    function speakText() {
      var lines = val(opts.lines) || toLines(val(getText));
      if (!lines.length) { toast('Hier gibt es nichts vorzulesen.', 'warn'); return false; }
      var started = A.voice.speak(lines, {
        onLine: opts.onLine || null,
        onDone: finished,
        onError: idle,
        onUnavailable: function () {
          idle();
          // Wer einen eigenen Ersatzweg hat (Lennox: Transkript-Durchlauf),
          // bekommt ihn; sonst ein Hinweis.
          if (opts.onUnavailable) { opts.onUnavailable(A.isMuted()); return; }
          toast(A.isMuted() ? 'Ton ist stumm (🔇 oben rechts).'
                            : 'Dein Browser hat keine deutsche Sprachausgabe.', 'warn');
        }
      });
      if (started) busy();
      return started;
    }

    readBtn.addEventListener('click', function () {
      if (!A) return;
      var running = (A.voice && A.voice.isActive()) || (A.clip && A.clip.isPlaying());
      if (running) { stop(); return; }

      var key = val(opts.clipKey);
      if (key && A.clip && A.clip.available(key)) {
        var ok = A.clip.play(key, {
          onStart: busy,
          onDone: finished,
          // Datei fehlt oder ist gesperrt -> die Stimme übernimmt
          onUnavailable: function () { idle(); speakText(); }
        });
        if (ok) return;
      }
      speakText();
    });

    return bar;
  }

  function stopSpeech() {
    if (!NX.audio) return;
    if (NX.audio.voice) NX.audio.voice.stop();
    if (NX.audio.clip) NX.audio.clip.stop();
  }

  /* ---- modal / info popup ----
     opts.speak   = Text zum Vorlesen (true = bodyHtml verwenden)
     opts.clipKey = Schlüssel einer hinterlegten Aufnahme (js/data/voice.js)
     Vorgelesen wird nur auf Knopfdruck – hier startet nichts von selbst.  */
  function showModal(title, bodyHtml, opts) {
    var m = $('#modal');
    var body = $('#modal-body');
    $('#modal-title').textContent = title || 'INFO';
    body.innerHTML = bodyHtml || '';
    stopSpeech();
    if (opts && opts.speak) {
      var speakText = opts.speak === true ? bodyHtml : opts.speak;
      body.insertBefore(voiceBar(function () { return speakText; }, { clipKey: opts.clipKey }),
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
