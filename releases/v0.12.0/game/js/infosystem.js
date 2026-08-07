/* =========================================================================
   infosystem.js — der ℹ-Info-Button (0 Punkte), avatar-spezifisch.

   Strikte Trennung (story/info.md §1):
     ℹ INFO  – kostet nichts, erklärt NUR den Fachbegriff des Levels.
     💡 TIPP – kostet Punkte, ist der einzige Ort für konkrete Lösungshinweise
               (liegt im Level-Host, nicht hier).

   Darstellung richtet sich nach dem gewählten Avatar (Lerntyp):
     Lyra   – interaktive Hologramm-Mindmap (visuell)
     Lennox – Funk-Kanal mit Sprachausgabe + Transkript (auditiv)
     Zen    – Hacker-Terminal, seitenweise (kognitiv/textbasiert)

   Wer den Inhalt vollständig durchgesehen hat, bekommt eine Bonusfrage.
   Sie zählt EINMAL – auch eine falsche Antwort wird gespeichert (kein Farmen).

   Eigenes Overlay statt ui.showModal(): dieses nimmt nur einen HTML-String,
   hier brauchen wir aber verdrahtete Knoten, Transport-Buttons und Optionen.
   ui.showModal bleibt unangetastet und dient weiter als Fallback.
   Exposes: window.NX.infoSystem
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  var ui = NX.ui, el = ui.el;
  var overlay, box, avatarImg, titleEl, termEl, bodyEl, bonusEl, stepsEl, nextBtn, doneBtn, voiceEl;
  var current = null, opts = {}, fallbackTimer = null, wired = false;
  /* Was der EINE Vorlese-Knopf gerade ausgeben würde (story/stimme.md).
     Jede Avatar-Variante trägt hier ein, was unter der Leiste sichtbar ist:
     Lyra den angetippten Knoten, Zen die aktuelle Seite, Lennox seine
     Funk-Zeilen samt Hervorhebung. */
  var speech = { text: '', lines: null, onLine: null, onDone: null, onUnavailable: null };
  function resetSpeech() {
    speech.text = ''; speech.lines = null;
    speech.onLine = null; speech.onDone = null; speech.onUnavailable = null;
  }

  function grab() {
    if (overlay) return !!overlay;
    overlay = document.getElementById('infoscreen');
    if (!overlay) return false;
    box = overlay.querySelector('.nfo-box');
    avatarImg = document.getElementById('nfo-avatar');
    titleEl = document.getElementById('nfo-title');
    termEl = document.getElementById('nfo-term');
    bodyEl = document.getElementById('nfo-body');
    voiceEl = document.getElementById('nfo-voice');
    bonusEl = document.getElementById('nfo-bonus');
    stepsEl = document.getElementById('nfo-steps');
    nextBtn = document.getElementById('nfo-next');
    doneBtn = document.getElementById('nfo-done');
    if (!wired) {
      wired = true;
      document.getElementById('nfo-close').addEventListener('click', close);
      doneBtn.addEventListener('click', close);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
      // Eigenes Escape-Handling: das aus ui.js kennt nur #modal
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && !overlay.hidden) { e.preventDefault(); close(); }
      });
    }
    return true;
  }

  function has(levelId) { return !!(NX.infos && NX.infos[levelId]); }

  function maxBonusTotal() {
    if (!NX.infos) return 0;
    return Object.keys(NX.infos).reduce(function (s, k) { return s + (NX.infos[k].bonusPoints || 0); }, 0);
  }

  function close() {
    if (ui.stopSpeech) ui.stopSpeech();
    else if (NX.audio && NX.audio.voice) NX.audio.voice.stop();
    if (fallbackTimer) { clearInterval(fallbackTimer); fallbackTimer = null; }
    if (voiceEl) voiceEl.innerHTML = '';
    resetSpeech();
    if (bodyEl) bodyEl.innerHTML = '';
    if (bonusEl) { bonusEl.innerHTML = ''; bonusEl.hidden = true; }
    if (stepsEl) stepsEl.innerHTML = '';
    if (nextBtn) nextBtn.hidden = true;
    if (overlay) overlay.hidden = true;
    current = null;
  }

  function open(levelId, options) {
    if (!grab() || !has(levelId)) return false;
    opts = options || {};
    close(); // idempotent: räumt eine vorige Sitzung ab
    var inf = NX.infos[levelId];
    current = inf;

    var st = NX.state.get();
    var av = NX.data.avatars.filter(function (a) { return a.id === st.avatarId; })[0] || NX.data.avatars[0];
    // Zen ist der sichere Rückfall: braucht weder Ton noch Zeigegenauigkeit
    var variant = inf[av.id] || inf.zen;

    box.className = 'nfo-box nfo-' + (inf[av.id] ? av.id : 'zen');
    avatarImg.src = av.img; avatarImg.alt = av.name;
    titleEl.textContent = inf.title;
    termEl.textContent = inf.term;
    bodyEl.innerHTML = '';
    bonusEl.innerHTML = ''; bonusEl.hidden = true;
    stepsEl.innerHTML = '';
    nextBtn.hidden = true;
    overlay.hidden = false;

    /* EINE Sprachleiste für alle drei Avatare. Sie startet nie von selbst,
       liest immer genau das vor, was gerade zu sehen ist – und immer per
       Browser-Stimme (story/allgemein.md). */
    voiceEl.innerHTML = '';
    resetSpeech();
    speech.text = inf.title + '. ' + (variant.headline || '');
    voiceEl.appendChild(ui.voiceBar(
      function () { return speech.text; },
      {
        lines: function () { return speech.lines; },
        onLine: function (i) { if (speech.onLine) speech.onLine(i); },
        onDone: function () { if (speech.onDone) speech.onDone(); },
        onUnavailable: function (muted) {
          if (speech.onUnavailable) { speech.onUnavailable(muted); return; }
          ui.toast(muted ? 'Ton ist stumm (🔇 oben rechts).'
                         : 'Dein Browser hat keine deutsche Sprachausgabe.', 'warn');
        }
      }
    ));

    var gate = function () { showBonus(inf, variant); };
    if (box.classList.contains('nfo-lyra')) renderLyra(variant, gate);
    else if (box.classList.contains('nfo-lennox')) renderLennox(variant, gate);
    else renderZen(variant, gate);
    return true;
  }

  /* ---------------- Lyra · Hologramm-Mindmap ----------------
     Die Knoten werden der REIHE NACH freigeschaltet (Spec Level 1: „Tippe
     immer den aktuell hervorgehobenen Knoten an"). Die Array-Reihenfolge in
     infos.js ist die Lehrreihenfolge und folgt dem Weg der Anfrage. */
  function renderLyra(v, done) {
    bodyEl.appendChild(el('div', { class: 'nfo-h', text: v.headline }));
    bodyEl.appendChild(el('p', { class: 'nfo-hint', text: v.caption }));

    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'nfo-mindmap');
    // Höhe 68 statt 62: die Beschriftung des untersten Knotens (y + 11) braucht Platz
    svg.setAttribute('viewBox', '0 0 100 68');
    var byId = {}, order = {};
    v.nodes.forEach(function (n, i) { byId[n.id] = n; order[n.id] = i; });

    var edgeEls = [];
    (v.edges || []).forEach(function (e) {
      var a = byId[e[0]], b = byId[e[1]];
      if (!a || !b) return;
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('class', 'nfo-edge');
      p.setAttribute('d', 'M' + a.x + ' ' + a.y + ' L' + b.x + ' ' + b.y);
      // Die Kante leuchtet, sobald BEIDE Enden erkundet sind
      edgeEls.push({ el: p, max: Math.max(order[e[0]], order[e[1]]) });
      svg.appendChild(p);
    });

    var textBox = el('div', { class: 'nfo-nodetext',
      text: 'Tippe den hervorgehobenen Knoten an – Schritt 1 von ' + v.nodes.length + '.' });
    var step = 0;          // Index des Knotens, der als Nächstes dran ist
    var groups = [];

    function paint() {
      groups.forEach(function (g, i) {
        var cls = 'nfo-node';
        if (i < step) cls += ' seen';
        else if (i === step) cls += ' is-next';
        else cls += ' locked';
        g.node.setAttribute('class', cls);
        g.cue.textContent = i === step ? 'Klick mich an!' : '';
        // Gesperrte Knoten sind auch für die Tastatur nicht erreichbar
        g.node.setAttribute('tabindex', i <= step ? '0' : '-1');
        g.node.setAttribute('aria-disabled', i > step ? 'true' : 'false');
      });
      edgeEls.forEach(function (e) {
        e.el.setAttribute('class', 'nfo-edge' + (e.max < step ? ' lit' : ''));
      });
    }

    v.nodes.forEach(function (n, i) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'nfo-node');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', n.label);
      g.style.setProperty('--nc', n.color);
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', 7);
      var ico = document.createElementNS(NS, 'text');
      ico.setAttribute('class', 'nfo-node-ico');
      ico.setAttribute('x', n.x); ico.setAttribute('y', n.y + 1);
      ico.textContent = n.icon;
      var lbl = document.createElementNS(NS, 'text');
      lbl.setAttribute('x', n.x); lbl.setAttribute('y', n.y + 11);
      lbl.textContent = (i + 1) + '. ' + n.label;
      var cue = document.createElementNS(NS, 'text');
      cue.setAttribute('class', 'nfo-node-cue');
      cue.setAttribute('x', n.x); cue.setAttribute('y', n.y + 15);
      cue.setAttribute('text-anchor', 'middle');
      g.appendChild(c); g.appendChild(ico); g.appendChild(lbl); g.appendChild(cue);

      function activate() {
        if (i > step) {   // noch gesperrt – erst ist der markierte Knoten dran
          textBox.textContent = 'Noch gesperrt. Tippe zuerst den hervorgehobenen Knoten an.';
          return;
        }
        textBox.textContent = n.label + ': ' + n.text;
        speech.text = n.label + '. ' + n.text;
        speech.lines = null;
        if (i === step) {
          step++;
          if (NX.audio) NX.audio.play('select');
          markSteps(step, v.nodes.length);
          paint();
          if (step >= v.nodes.length) done();
        }
      }
      g.addEventListener('click', activate);
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
      groups.push({ node: g, cue: cue });
      svg.appendChild(g);
    });
    paint();

    bodyEl.appendChild(svg);
    bodyEl.appendChild(textBox);
    if (v.analogy) {
      bodyEl.appendChild(el('div', { class: 'nfo-analogy' }, [
        el('div', { class: 'ico', text: v.analogy.icon }),
        el('div', {}, [el('b', { text: v.analogy.title + ': ' }), v.analogy.text])
      ]));
    }
    markSteps(0, v.nodes.length);
  }

  /* ---------------- Lennox · Funk-Kanal ---------------- */
  function renderLennox(v, done) {
    bodyEl.appendChild(el('div', { class: 'nfo-h', text: v.headline }));

    /* Ab v0.10.0 bedient Lennox denselben EINEN Vorlese-Knopf wie alle anderen
       (story/stimme.md). Geblieben ist nur „Transkript gelesen ✓" – das ist
       kein Audio-Knopf, sondern der einzige Weg zur Bonusfrage, wenn gar kein
       Ton zur Verfügung steht. */
    var eq = el('div', { class: 'nfo-eq' }, [1, 2, 3, 4, 5].map(function () { return el('i', { class: 'nfo-eq-bar' }); }));
    var readBtn = el('button', { class: 'btn btn-ghost btn-sm', text: 'Transkript gelesen ✓' });
    var radio = el('div', { class: 'nfo-radio idle' }, [
      el('div', { class: 'nfo-radio-dial', text: '📻 ' + v.channel }), eq,
      el('div', { class: 'nfo-transport' }, [readBtn])
    ]);
    bodyEl.appendChild(radio);

    // Transkript ist IMMER sichtbar – nichts hängt allein am Ton
    var lines = v.script.map(function (s) {
      return el('div', { class: 'nfo-line' }, [el('span', { class: 'who', text: s.who + ': ' }), s.text]);
    });
    var transcript = el('div', { class: 'nfo-transcript' }, lines);
    bodyEl.appendChild(transcript);
    var note = el('div', { class: 'nfo-noaudio', hidden: 'hidden' });
    bodyEl.appendChild(note);

    var texts = v.script.map(function (s) { return s.text; });
    var finished = false;
    function highlight(i) {
      lines.forEach(function (l, n) { l.classList.toggle('active', n === i); });
      markSteps(i + 1, texts.length);
      try { lines[i].scrollIntoView({ block: 'nearest' }); } catch (e) { /* ignore */ }
    }
    function finish() {
      radio.classList.add('idle');
      if (finished) return;
      finished = true;
      done();
    }
    function toFallback(msg) {
      radio.classList.add('idle');
      note.hidden = false;
      note.textContent = msg || 'Dein Browser hat keine deutsche Sprachausgabe – hier kommt das Funk-Transkript.';
      if (fallbackTimer) clearInterval(fallbackTimer);
      var i = 0;
      highlight(0);
      fallbackTimer = setInterval(function () {
        i++;
        if (i >= texts.length) {
          clearInterval(fallbackTimer); fallbackTimer = null;
          finish();
          return;
        }
        highlight(i);
        if (NX.audio) NX.audio.play('click');
      }, 1600);
    }

    /* Der gemeinsame Vorlese-Knopf spricht Lennox' Funk-Zeilen und hebt sie
       dabei einzeln hervor. Ist gar kein Ton verfügbar, läuft das Transkript
       zeitgesteuert durch – wie bisher. */
    speech.text = texts.join(' ');
    speech.lines = texts;
    speech.onLine = function (i) { radio.classList.remove('idle'); highlight(i); };
    speech.onDone = finish;
    speech.onUnavailable = function (muted) {
      toFallback(muted ? 'Ton ist stumm (🔇 oben rechts) – Transkript lesen genügt.' : null);
    };

    // Lesen statt hören ist gleichwertig – gleiche Freischaltung
    readBtn.addEventListener('click', function () {
      NX.audio.voice.stop();
      if (fallbackTimer) { clearInterval(fallbackTimer); fallbackTimer = null; }
      lines.forEach(function (l) { l.classList.add('active'); });
      markSteps(texts.length, texts.length);
      finish();
    });

    markSteps(0, texts.length);
  }

  /* ---------------- Zen · Hacker-Terminal ---------------- */
  function renderZen(v, done) {
    var pane = el('div', { class: 'nfo-termpane' });
    bodyEl.appendChild(el('div', { class: 'nfo-termbar' }, [
      el('i', {}), el('i', {}), el('i', {}), el('span', { text: ' ' + v.headline })
    ]));
    bodyEl.appendChild(pane);

    var page = 0, total = v.pages.length;
    nextBtn.hidden = total <= 1;
    nextBtn.textContent = '> weiter';

    function draw() {
      pane.innerHTML = '';
      v.pages[page].forEach(function (b) {
        if (b.k === 'h') pane.appendChild(el('div', { class: 'nfo-h', text: b.v }));
        else if (b.k === 'p') pane.appendChild(el('p', { class: 'nfo-p', text: b.v }));
        else if (b.k === 'ul') {
          pane.appendChild(el('ul', { class: 'nfo-ul' }, b.v.map(function (t) { return el('li', { text: t }); })));
        } else if (b.k === 'code') pane.appendChild(el('pre', { class: 'nfo-code', text: b.v }));
        else if (b.k === 'kv') {
          var dl = el('dl', { class: 'nfo-kv' });
          b.v.forEach(function (row) {
            dl.appendChild(el('dt', { text: row[0] }));
            dl.appendChild(el('dd', { text: row[1] }));
          });
          pane.appendChild(dl);
        }
      });
      pane.appendChild(el('div', { class: 'nfo-prompt', text: 'nexus@terminal:~$ ' }));
      speech.text = ui.plainText(pane.innerHTML);   // Vorlese-Knopf liest die aktuelle Seite
      speech.lines = null;
      markSteps(page + 1, total);
      if (page >= total - 1) { nextBtn.hidden = true; done(); }
    }
    nextBtn.onclick = function () {
      if (page < total - 1) { page++; if (NX.audio) NX.audio.play('click'); draw(); }
    };
    draw();
  }

  /* ---------------- Fortschritts-Punkte ---------------- */
  function markSteps(n, total) {
    if (!stepsEl) return;
    stepsEl.innerHTML = '';
    for (var i = 0; i < total; i++) {
      stepsEl.appendChild(el('i', { class: 'nfo-dot' + (i < n ? ' on' : '') }));
    }
  }

  /* ---------------- Bonusfrage ---------------- */
  function showBonus(inf, variant) {
    var b = variant.bonus;
    if (!b || !bonusEl) return;
    if (!bonusEl.hidden) return; // schon aufgebaut
    bonusEl.hidden = false;
    bonusEl.innerHTML = '';
    bonusEl.appendChild(el('div', { class: 'nfo-bonus-q', text: '⭐ BONUSFRAGE · ' + b.prompt }));

    var S = NX.state;
    if (S.hasAnsweredBonus(inf.id)) {
      renderResult(b, S.bonusEarned(inf.id) > 0, S.bonusEarned(inf.id), true);
      return;
    }

    var hasIcons = b.options.some(function (o) { return !!o.icon; });
    var wrap = el('div', { class: 'nfo-opts' + (hasIcons ? '' : ' rows') });
    var btns = [];
    b.options.forEach(function (o) {
      var kids = [];
      if (o.icon) kids.push(el('span', { class: 'ico', text: o.icon }));
      kids.push(el('span', { text: o.label }));
      var btn = el('button', { class: 'nfo-opt' }, kids);
      btn.addEventListener('click', function () { answer(b, inf, o.id, btn, btns); });
      btns.push(btn);
      wrap.appendChild(btn);
    });
    bonusEl.appendChild(wrap);
  }

  function answer(b, inf, picked, btn, btns) {
    var ok = picked === b.answer;
    var pts = ok ? (inf.bonusPoints || 15) : 0;
    // Auch bei FALSCH speichern -> die Frage ist verbraucht, kein Durchprobieren
    NX.state.awardBonus(inf.id, pts);
    btns.forEach(function (x) { x.disabled = true; });
    btn.classList.add(ok ? 'correct' : 'wrong');
    if (NX.audio) NX.audio.play(ok ? 'key' : 'error');
    renderResult(b, ok, pts, false);
    if (opts.onAward) opts.onAward();
  }

  function renderResult(b, ok, pts, replay) {
    var old = bonusEl.querySelector('.nfo-bonus-result');
    if (old) old.remove();
    var res = el('div', { class: 'nfo-bonus-result' });
    if (replay) {
      res.appendChild(el('p', { class: 'nfo-p' }, [
        el('b', { class: ok ? 'ok' : 'no', text: ok ? '✓ bereits beantwortet' : '✗ bereits beantwortet' }),
        ' · ' + pts + ' Bonuspunkte. Die Bonusfrage zählt nur einmal.'
      ]));
    } else {
      var head = el('p', { class: 'nfo-p' }, [
        el('b', { class: ok ? 'ok' : 'no', text: ok ? '✓ Richtig!' : '✗ Leider nicht.' }), ' ',
        ok ? b.okText : b.failText
      ]);
      if (ok) head.appendChild(el('span', { class: 'nfo-award', text: '+' + pts + ' ✨' }));
      res.appendChild(head);
    }
    bonusEl.appendChild(res);
  }

  NX.infoSystem = {
    has: has, open: open, close: close, maxBonusTotal: maxBonusTotal
  };
})(window.NX);
