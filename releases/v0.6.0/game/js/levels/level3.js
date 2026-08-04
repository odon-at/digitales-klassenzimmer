/* =========================================================================
   Level 3 — Das Labyrinth der Lügen
   Jede Meldung wird DREISTUFIG bewertet: 🟢 BELEGT · 🟡 UNKLAR · 🔴 WIDERLEGT.
   Die mittlere Stufe ist der eigentliche Lerninhalt: fehlende Belege machen
   eine These noch nicht falsch.
   Zu jeder Meldung gehört ein 4-teiliger Fakten-Check (Quelle · Metadaten ·
   Lizenz/Rohdaten · Plausibilität) sowie zwei Hilfen: ℹ️ INFO (0 Punkte,
   erklärt nur das Prinzip) und 💡 TIPP (kostet Punkte, konkreter Hinweis).
   Der gewählte Avatar läuft durch das Labyrinth: Mini-Map mit Laser-Spur +
   Korridor-Ansicht mit Lauf-Animation; im Zentrum wartet der Golden Record.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  // Aufräum-Infrastruktur (Muster aus level1.js): unmount() killt alles.
  var lb = { timers: [], alive: false, keyHandler: null };
  function later(fn, ms) {
    var id = setTimeout(function () { if (lb.alive) fn(); }, ms);
    lb.timers.push(id);
    return id;
  }
  function reduceMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }
  // '#39ff14' -> 'rgba(57,255,20,.22)' (kein color-mix(): ältere Schul-Laptops)
  function softColor(hex) {
    var m = /^#([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 'rgba(255,255,255,.12)';
    var n = parseInt(m[1], 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',.22)';
  }

  NX.levelDefs.push({
    id: 3,
    num: 'LEVEL 3',
    title: 'Das Labyrinth der Lügen',
    subtitle: 'Daten prüfen & hinterfragen',
    accent: 'yellow',
    story: 'Der Hacker hat das Netz mit getarnten Gerüchten, gefälschten Portalen und zweifelhaften ' +
           'Lizenzen geflutet. Ein simples „Stimmt" oder „Stimmt nicht" reicht nicht mehr: Prüfe Quelle, ' +
           'Lizenz, Metadaten und Plausibilität und entscheide, ob eine Meldung BELEGT, UNKLAR oder ' +
           'WIDERLEGT ist. Jede richtige Entscheidung führt deinen Avatar tiefer ins Labyrinth – ' +
           'bis zum Golden Record.',
    tasks: [
      'Quellencheck · echte Domain & Impressum',
      'Lizenz-Check · CC0/CC-BY ist kein Wahrheitsstempel',
      'Metadaten-Analyse · Berichtszeitraum vs. Behauptung',
      'Plausibilitätstest · Abgleich mit der Realität'
    ],
    quality: null,
    maxScore: 100,
    tips: null, // Level 3 rechnet seine Tipps frageweise selbst ab (siehe openTip)
    info: {
      title: 'INFO · PRÜF-CHECKLISTE & CYBER-GLOSSAR',
      html:
        '<p><b>Deine Prüf-Checkliste</b></p><ul>' +
        '<li><b>Quellencheck:</b> Gefälschtes Datenportal oder offizielle Domain (<code>.gov</code>, Impressum)?</li>' +
        '<li><b>Lizenz-Check:</b> <b>CC0</b>/<b>CC-BY</b> regeln nur die <i>Nutzung</i> – <b>kein</b> Wahrheitsstempel!</li>' +
        '<li><b>Metadaten-Analyse:</b> Passt der Berichtszeitraum zur Behauptung?</li>' +
        '<li><b>Plausibilitätstest:</b> Deckt sich das mit unabhängigen Sensoren und der Realität?</li></ul>' +
        '<p><b>Die drei Stufen</b></p><ul>' +
        '<li>🟢 <b>BELEGT</b> – Quelle, Metadaten und Rohdaten halten der Prüfung stand.</li>' +
        '<li>🟡 <b>UNKLAR</b> – zu wenig Daten. <i>Fehlende Belege machen eine These noch nicht falsch.</i></li>' +
        '<li>🔴 <b>WIDERLEGT</b> – etwas Nachprüfbares spricht dagegen.</li></ul>' +
        '<p><b>Cyber-Glossar</b></p><ul>' +
        '<li><b>API / Token:</b> Ein digitaler Schlüssel, mit dem Programme Daten von einem Server abrufen.</li>' +
        '<li><b>JSON / CSV / GTFS:</b> Offene Standard-Dateiformate für Tabellen und Datenstrukturen.</li>' +
        '<li><b>CC0 / CC-BY:</b> Rechte-Lizenzen. Regeln nur, wer die Daten wie nutzen darf.</li>' +
        '<li><b>Metadaten:</b> Daten über Daten (Erstellungsdatum, Urheber, Dateiformat).</li></ul>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level3;
      var qs = d.questions, TOTAL = qs.length, sc = d.scoring;
      var maze = d.maze, LAST = maze.path.length - 1;
      var avatar = ctx.data.avatars.filter(function (a) { return a.id === ctx.state.avatarId; })[0] ||
                   ctx.data.avatars[0];

      lb = { timers: [], alive: true, keyHandler: null };

      var idx = 0;          // aktuelle Frage
      var step = 0;         // Position auf maze.path (0 = Eingang)
      var wrong = 0;        // Fehlversuche gesamt
      var tipsUsed = 0;     // bezahlte Tipps gesamt
      var tipsPaid = {};    // { frageIndex: true } – erneutes Lesen ist gratis
      var answered = false; // aktuelle Frage gelöst?
      var busy = false;     // Animation läuft
      var finished = false;
      var RUN_MS = reduceMotion() ? 0 : 1100;

      /* ---------------- Aufbau ---------------- */
      var pawn, trailGlow, trailCore, mapLabel; // von buildMap() gesetzt
      var hudQ = el('span', {}), hudStation = el('span', {}), hudScore = el('span', { class: 'lb-score' });
      var live = el('div', { class: 'lb-live', 'aria-live': 'polite' });
      var hud = el('div', { class: 'lb-hud' }, [hudQ, hudStation, hudScore, live]);

      var tunnel = el('div', { class: 'lb-tunnel' }, [
        el('div', { class: 'lb-surface lb-wall-l' }), el('div', { class: 'lb-surface lb-wall-r' }),
        el('div', { class: 'lb-surface lb-floor' }), el('div', { class: 'lb-surface lb-ceil' })
      ]);
      var hero = el('img', { class: 'lb-hero', src: avatar.img, alt: avatar.name });
      var stationTag = el('div', { class: 'lb-station', text: maze.path[0].label });
      var cardSlot = el('div', { class: 'lb-card' });
      var startOverlay = el('div', { class: 'lb-start' }, [
        el('div', {}, [el('span', { class: 'lb-big', text: '🌀' }), 'LABYRINTH BETRETEN'])
      ]);
      var corridor = el('div', { class: 'lb-corridor' }, [
        tunnel, el('div', { class: 'lb-vanish' }), hero, stationTag, cardSlot, startOverlay
      ]);

      var mapEl = buildMap();
      var stage = el('div', { class: 'lb-stage' }, [corridor, mapEl]);

      var post = el('div', { class: 'lb-post' });
      var facts = el('div', { class: 'lb-facts' });
      var verdicts = el('div', { class: 'lb-verdicts' });
      var infoBtn = el('button', { class: 'btn btn-ghost btn-sm', text: 'ℹ️ Info (0 Punkte)', onclick: openInfo });
      var tipBtn = el('button', { class: 'btn btn-ghost btn-sm', text: '💡 Tipp (−' + sc.tip + ' Punkte)', onclick: openTip });
      var help = el('div', { class: 'lb-help' }, [infoBtn, tipBtn]);
      var result = el('div', { class: 'lb-result', hidden: 'hidden' });
      var panel = el('div', { class: 'lb-panel' }, [post, facts, verdicts, help, result]);

      var root = el('div', { class: 'lb-root' }, [hud, stage, panel]);
      container.appendChild(root);

      var verdictBtns = [];
      buildVerdicts();
      setMapStep(0);
      updateHud();
      panel.hidden = true; // erst nach dem Betreten des Labyrinths

      startOverlay.addEventListener('click', startGame);

      lb.keyHandler = onKey;
      document.addEventListener('keydown', onKey);

      /* ---------------- Mini-Map ---------------- */
      function buildMap() {
        var cells = el('div', { class: 'lb-cells' });
        for (var r = 0; r < maze.rows; r++) {
          for (var c = 0; c < maze.cols; c++) {
            var isWall = maze.walls.indexOf(c + ',' + r) !== -1;
            cells.appendChild(el('i', { class: 'lb-cell' + (isWall ? ' wall' : '') }));
          }
        }
        // Laser-Spur: eine Polyline, per stroke-dashoffset aufgedeckt.
        // Jedes Segment misst exakt 100 viewBox-Einheiten -> Gesamtlänge deterministisch 600.
        var pts = maze.path.map(function (p) { return (p.c * 100 + 50) + ',' + (p.r * 100 + 50); }).join(' ');
        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'lb-trail');
        svg.setAttribute('viewBox', '0 0 ' + (maze.cols * 100) + ' ' + (maze.rows * 100));
        svg.setAttribute('aria-hidden', 'true');
        ['glow', 'core'].forEach(function (cls) {
          var pl = document.createElementNS(svgNS, 'polyline');
          pl.setAttribute('class', cls);
          pl.setAttribute('points', pts);
          svg.appendChild(pl);
        });
        trailGlow = svg.querySelector('.glow');
        trailCore = svg.querySelector('.core');

        var goal = maze.path[LAST];
        var goalEl = el('div', { class: 'lb-goal', 'aria-hidden': 'true', text: '🎁' });
        goalEl.style.left = ((goal.c + 0.5) / maze.cols * 100) + '%';
        goalEl.style.top = ((goal.r + 0.5) / maze.rows * 100) + '%';

        pawn = el('div', { class: 'lb-pawn' }, [el('img', { src: avatar.img, alt: '' })]);
        pawn.style.setProperty('--av', avatar.color);
        mapLabel = el('div', { class: 'lb-maplabel', text: maze.path[0].label });

        var box = el('div', { class: 'lb-map', role: 'img',
          'aria-label': 'Labyrinth-Karte: Position 0 von ' + LAST }, [cells]);
        box.appendChild(svg);
        box.appendChild(goalEl);
        box.appendChild(pawn);
        box.appendChild(mapLabel);
        return box;
      }

      function setMapStep(i) {
        var p = maze.path[i];
        pawn.style.left = ((p.c + 0.5) / maze.cols * 100) + '%';
        pawn.style.top = ((p.r + 0.5) / maze.rows * 100) + '%';
        var off = (LAST - i) * 100;
        trailCore.style.strokeDashoffset = off;
        trailGlow.style.strokeDashoffset = off;
        mapLabel.textContent = p.label;
        stationTag.textContent = p.label;
        mapEl.setAttribute('aria-label', 'Labyrinth-Karte: Position ' + i + ' von ' + LAST + ' · ' + p.label);
      }

      /* ---------------- Urteils-Buttons ---------------- */
      function buildVerdicts() {
        d.verdicts.forEach(function (v) {
          var b = el('button', { class: 'lb-verdict', 'aria-keyshortcuts': v.key }, [
            el('span', { class: 'lb-verdict-ico', text: v.icon }),
            el('span', { text: v.label }),
            el('span', { class: 'lb-verdict-key', text: 'Taste ' + v.key })
          ]);
          b.style.setProperty('--v', v.color);
          b.style.setProperty('--v-soft', softColor(v.color));
          b.addEventListener('click', function () { onVerdict(v.id, b); });
          verdictBtns.push(b);
          verdicts.appendChild(b);
        });
      }

      /* ---------------- Ablauf ---------------- */
      function startGame() {
        if (startOverlay.classList.contains('gone')) return;
        ctx.audio.play('click');
        startOverlay.classList.add('gone');
        later(function () { if (startOverlay.parentNode) startOverlay.remove(); }, 420);
        panel.hidden = false;
        runCorridor(function () { askQuestion(0); });
      }

      function runCorridor(done) {
        cardSlot.classList.remove('in');
        cardSlot.classList.add('out');
        if (RUN_MS === 0) { later(done, 0); return; }
        corridor.classList.remove('running');
        void corridor.offsetWidth; // Reflow erzwingen -> Animation startet neu
        corridor.classList.add('running');
        ctx.audio.play('click');
        later(function () { corridor.classList.remove('running'); done(); }, RUN_MS);
      }

      function askQuestion(i) {
        var q = qs[i];
        answered = false;
        result.hidden = true;
        result.innerHTML = '';

        // Meldung – in der Korridor-Karte und im Arbeitsbereich
        var badge = q.post.is_verified
          ? el('span', { class: 'lb-verified', title: 'verifizierter Absender', text: '✔' })
          : el('span', { class: 'lb-unverified', title: 'nicht verifiziert', text: '?' });
        post.innerHTML = '';
        post.appendChild(el('div', { class: 'lb-post-ico', text: q.post.icon }));
        post.appendChild(el('div', {}, [
          el('div', { class: 'lb-post-name' }, [q.post.profile_name + ' ', badge]),
          el('div', { class: 'lb-post-theme', text: q.topic + ' · ' + q.theme }),
          el('p', { class: 'lb-post-text', text: q.post.statement })
        ]));

        cardSlot.innerHTML = '';
        cardSlot.appendChild(el('div', { class: 'lb-post-name' }, [q.post.icon + ' ' + q.post.profile_name + ' ',
          q.post.is_verified ? el('span', { class: 'lb-verified', text: '✔' }) : el('span', { class: 'lb-unverified', text: '?' })]));
        cardSlot.appendChild(el('p', { class: 'lb-post-text', text: q.post.statement }));
        cardSlot.classList.remove('out');
        void cardSlot.offsetWidth;
        cardSlot.classList.add('in');

        // Fakten-Check: immer sichtbar (Spec verlangt „einsehbar")
        facts.innerHTML = '';
        d.factMeta.forEach(function (fm) {
          facts.appendChild(el('div', { class: 'lb-fact' }, [
            el('div', { class: 'lb-fact-lbl', text: fm.icon + ' ' + fm.label }),
            el('div', { class: 'lb-fact-txt', text: q.facts[fm.key] })
          ]));
        });

        verdictBtns.forEach(function (b) {
          b.disabled = false;
          b.classList.remove('is-correct', 'shake');
        });
        tipBtn.classList.remove('pulse');
        tipBtn.classList.toggle('used', !!tipsPaid[i]);
        tipBtn.textContent = tipsPaid[i] ? '💡 Tipp (bereits bezahlt)' : '💡 Tipp (−' + sc.tip + ' Punkte)';

        updateHud();
        announce('Frage ' + (i + 1) + ' von ' + TOTAL + ' · ' + q.topic);
        try { verdictBtns[0].focus({ preventScroll: true }); } catch (e) { /* ältere Browser */ }
      }

      function onVerdict(vId, btn) {
        if (busy || answered || finished) return;
        var q = qs[idx];
        if (vId === q.correct) {
          answered = true;
          ctx.audio.play('success');
          ctx.markTask(q.taskIndex);
          btn.classList.add('is-correct');
          verdictBtns.forEach(function (b) { b.disabled = true; });
          showResult(q);
        } else {
          wrong++;
          ctx.audio.play('error');
          btn.classList.remove('shake');
          void btn.offsetWidth;
          btn.classList.add('shake');
          ui.toast('✗ ' + d.feedbackWrong[vId], 'warn', 4200);
          announce('Falsch. ' + d.feedbackWrong[vId]);
          // Hilfe anbieten, nicht erzwingen
          if (wrong >= 2 && !tipsPaid[idx]) tipBtn.classList.add('pulse');
          updateHud();
        }
      }

      function showResult(q) {
        var v = d.verdicts.filter(function (x) { return x.id === q.correct; })[0];
        result.innerHTML = '';
        result.appendChild(el('p', { class: 'lb-result-txt' }, [
          el('b', { text: v.icon + ' ' + v.label + ' — ' }), q.explanation
        ]));
        result.appendChild(el('button', {
          class: 'btn btn-neon btn-sm',
          text: idx + 1 >= TOTAL ? 'Zum Zentrum ›' : 'Weiter ›',
          onclick: advance
        }));
        result.hidden = false;
        announce('Richtig: ' + v.label + '. ' + q.explanation);
      }

      function advance() {
        if (busy || finished || !answered) return;
        busy = true;
        step++;
        setMapStep(step); // Mini-Map und Korridor laufen gleichzeitig
        result.hidden = true;
        runCorridor(function () {
          busy = false;
          idx++;
          if (idx >= TOTAL) finale(); else askQuestion(idx);
        });
      }

      /* ---------------- Hilfe ---------------- */
      function openInfo() {
        if (finished) return;
        var q = qs[idx];
        ctx.audio.play('click');
        ui.showModal(q.help.infoTitle, q.help.infoHtml +
          '<p class="lb-modal-note">Diese Info kostet <b>keine Punkte</b> – sie erklärt das Prinzip, nicht die Lösung.</p>');
      }

      function openTip() {
        if (finished) return;
        var q = qs[idx];
        if (!tipsPaid[idx]) { // nur der erste Blick kostet
          tipsPaid[idx] = true;
          tipsUsed++;
          tipBtn.classList.remove('pulse');
          tipBtn.classList.add('used');
          tipBtn.textContent = '💡 Tipp (bereits bezahlt)';
          ui.toast('Tipp genutzt · −' + sc.tip + ' Punkte', 'warn', 2200);
          updateHud();
        }
        ctx.audio.play('select');
        ui.showModal('💡 TIPP · −' + sc.tip + ' Punkte',
          '<p>' + ui.escapeHtml(q.help.tip) + '</p>');
      }

      /* ---------------- HUD ---------------- */
      function scoreNow() {
        return Math.max(sc.floor, 100 - wrong * sc.wrong - tipsUsed * sc.tip);
      }
      function updateHud() {
        hudQ.innerHTML = '';
        hudQ.appendChild(el('span', { text: 'Frage ' }));
        hudQ.appendChild(el('b', { text: Math.min(idx + 1, TOTAL) + ' / ' + TOTAL }));
        hudStation.textContent = '· Station: ' + maze.path[step].label;
        hudScore.textContent = 'Punktestand: ' + scoreNow() +
          (tipsUsed ? ' (' + tipsUsed + ' Tipp' + (tipsUsed > 1 ? 's' : '') + ')' : '');
      }
      function announce(msg) { live.textContent = msg; }

      /* ---------------- Tastatur ---------------- */
      function onKey(e) {
        if (!lb.alive || finished) return;
        var modal = document.getElementById('modal');
        if (modal && !modal.hidden) return;          // Escape gehört ui.js
        var t = e.target && e.target.tagName;
        if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
        if (startOverlay.parentNode && !startOverlay.classList.contains('gone')) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startGame(); }
          return;
        }
        if (busy) return;
        if (e.key === 'Enter') {
          // Ein fokussierter Button feuert selbst – sonst doppelt
          if (answered && t !== 'BUTTON') { e.preventDefault(); advance(); }
          return;
        }
        if (e.key === 'i' || e.key === 'I') { e.preventDefault(); openInfo(); return; }
        if (e.key === 't' || e.key === 'T') { e.preventDefault(); openTip(); return; }
        var v = d.verdicts.filter(function (x) { return x.key === e.key; })[0];
        if (v && !answered) {
          e.preventDefault();
          var i = d.verdicts.indexOf(v);
          onVerdict(v.id, verdictBtns[i]);
        }
      }

      /* ---------------- Finale ---------------- */
      function spawnSparks(host, n) {
        for (var i = 0; i < n; i++) {
          var s = el('i', { class: 'lb-spark' });
          s.style.setProperty('--dx', (Math.random() * 180 - 90).toFixed(0) + 'px');
          s.style.setProperty('--dy', (-20 - Math.random() * 140).toFixed(0) + 'px');
          s.style.setProperty('--dur', (0.9 + Math.random() * 0.7).toFixed(2) + 's');
          s.style.setProperty('--del', (0.55 + Math.random() * 0.5).toFixed(2) + 's');
          s.style.setProperty('--sc', i % 2 ? '#00f3ff' : '#ffd700');
          host.appendChild(s);
        }
      }

      function finale() {
        finished = true;
        panel.hidden = true;
        cardSlot.classList.remove('in');
        root.classList.add('finale-on');
        ctx.audio.play('key');

        var chest = el('div', { class: 'lb-chest' }, [
          el('div', { class: 'lb-chest-box' }),
          el('div', { class: 'lb-chest-lid' }),
          el('div', { class: 'lb-record', text: '🔑' })
        ]);
        var box = el('div', { class: 'lb-finale' }, [
          chest,
          el('h3', { class: 'lb-finale-title', text: d.finale.title }),
          el('p', { class: 'lb-finale-sub', text: d.finale.text })
        ]);
        corridor.appendChild(box);
        announce(d.finale.text);

        var fast = RUN_MS === 0;
        later(function () { box.classList.add('open'); }, fast ? 0 : 250);
        later(function () { if (!fast) spawnSparks(box, 18); }, fast ? 0 : 900);
        later(function () {
          hero.classList.add('cheer');
          ctx.audio.play('win');
          ui.celebrate(); // offline ein No-Op – die Funken oben laufen trotzdem
        }, fast ? 0 : 1500);
        later(function () {
          var score = scoreNow();
          ui.showModal(d.finale.title,
            '<p>' + ui.escapeHtml(d.finale.text) + '</p>' +
            '<p class="lb-modal-note">Punkte: <b>' + score + '</b> · Fehlversuche: ' + wrong +
            ' · Tipps: ' + tipsUsed + '</p>');
          ctx.complete(score);
        }, fast ? 60 : 2400);
      }
    },

    unmount: function () {
      lb.alive = false;
      lb.timers.forEach(function (id) { clearTimeout(id); });
      lb.timers = [];
      if (lb.keyHandler) { document.removeEventListener('keydown', lb.keyHandler); lb.keyHandler = null; }
      try { NX.ui.closeModal(); } catch (e) { /* ignore */ }
    }
  });
})(window.NX);
