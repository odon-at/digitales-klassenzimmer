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

  /* ---- modal / info popup ---- */
  function showModal(title, bodyHtml) {
    var m = $('#modal');
    $('#modal-title').textContent = title || 'INFO';
    $('#modal-body').innerHTML = bodyHtml || '';
    m.hidden = false;
  }
  function closeModal() { var m = $('#modal'); if (m) m.hidden = true; }

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
    setBar: setBar, highlightJSON: highlightJSON, celebrate: celebrate
  };
})(window.NX);
