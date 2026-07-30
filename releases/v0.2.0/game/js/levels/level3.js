/* =========================================================================
   Level 3 — Das Labyrinth der Lügen
   Mini-task: Swipe-Karten-System über einem zoomenden Labyrinth.
   Jede Meldung (Social-Media-Karte) wird bewertet:
     ◀ nach LINKS  = RICHTIG / glaubwürdig
     nach RECHTS ▶ = FALSCH  / Lüge
   Richtig → Karte fliegt raus + Labyrinth zoomt tiefer; Falsch → Shake, erneut versuchen.
   Teaches: Quelle, Lizenz (CC-BY/CC0), Metadaten, Plausibilität.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  var state3 = {}; // hält den Keydown-Handler für unmount()

  NX.levelDefs.push({
    id: 3,
    num: 'LEVEL 3',
    title: 'Das Labyrinth der Lügen',
    subtitle: 'Daten prüfen & hinterfragen',
    accent: 'yellow',
    story: 'Der Hacker flutet das Netz mit Lügen: das Wasser sei vergiftet, die Brücken unsicher. ' +
           'Wische dich durch die Meldungen und beweise, welche Daten das Siegel der Wahrheit tragen. ' +
           'Jede richtige Entscheidung führt dich tiefer ins Labyrinth zum „Golden Record".',
    tasks: ['Quellen-Check (Fake-Server)', 'Lizenz-Prüfung (CC-BY/CC0)', 'Metadaten-Analyse', 'Plausibilitätstest'],
    quality: null,
    maxScore: 100,
    info: {
      title: 'INFO · VERTRAUENSWÜRDIGE DATEN',
      html: '<p>Prüfe jede Meldung an vier Merkmalen:</p><ul>' +
            '<li><b>Quelle</b>: offizieller, nachvollziehbarer Absender – kein anonymer/dubioser Account.</li>' +
            '<li><b>Lizenz</b>: <b>CC-BY</b> erlaubt Nutzung <i>mit</i> Namensnennung, <b>CC0</b> ganz frei.</li>' +
            '<li><b>Metadaten</b>: passen z.&nbsp;B. Datum/Angaben zur Behauptung?</li>' +
            '<li><b>Plausibilität</b>: sind die Werte realistisch (z.&nbsp;B. pH nur 0–14)?</li></ul>' +
            '<p>Wische ◀ links = <b>glaubwürdig</b>, rechts ▶ = <b>Lüge</b>.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level3;
      var questions = d.questions;
      var total = questions.length;
      var idx = 0;         // aktuelle Frage (0-basiert; steigt nur bei richtiger Antwort)
      var wrong = 0;       // Fehlversuche (für Punkte)
      var started = false; // Labyrinth angeklickt?
      var busy = false;    // gerade Animation?
      var finished = false;

      var intro = el('p', { class: 'hint', style: 'text-align:left;margin:0 0 8px',
        text: 'Wische jede Meldung: ◀ nach links = glaubwürdig · nach rechts = Lüge ▶' });

      var img = el('img', { class: 'laby3-img', src: 'media/labyrinth.jpeg', alt: 'Labyrinth der Daten' });
      var veil = el('div', { class: 'laby3-veil' });
      var progress = el('div', { class: 'laby3-progress', text: 'Frage 0 / ' + total });
      var leftLabel = el('div', { class: 'swipe-label left', text: '◀ RICHTIG' });
      var rightLabel = el('div', { class: 'swipe-label right', text: 'FALSCH ▶' });
      var deck = el('div', { class: 'swipe-deck' });
      var swipeArea = el('div', { class: 'swipe-area' }, [leftLabel, rightLabel, deck]);
      var startOverlay = el('div', { class: 'laby3-start' }, [
        el('div', { class: 'laby3-start-inner',
          html: '<span class="laby3-big">🌀</span>Klick, um ins Labyrinth der Lügen einzutauchen' })
      ]);
      var stage = el('div', { class: 'laby3-stage' }, [img, veil, progress, swipeArea, startOverlay]);

      var btnLeft = el('button', { class: 'btn btn-neon swipe-btn', text: '◀ Richtig',
        onclick: function () { decide('left'); } });
      var btnRight = el('button', { class: 'btn btn-neon swipe-btn', text: 'Falsch ▶',
        onclick: function () { decide('right'); } });
      var controls = el('div', { class: 'swipe-controls', hidden: 'hidden' }, [btnLeft, btnRight]);

      container.appendChild(intro);
      container.appendChild(stage);
      container.appendChild(controls);

      startOverlay.addEventListener('click', startGame);
      img.addEventListener('click', function () { if (!started) startGame(); });

      var keyHandler = function (e) {
        if (!started || busy || finished) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); decide('left'); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); decide('right'); }
      };
      document.addEventListener('keydown', keyHandler);
      state3.keyHandler = keyHandler;

      setZoom(0);

      function startGame() {
        if (started) return;
        started = true;
        ctx.audio.play('click');
        startOverlay.classList.add('gone');
        setTimeout(function () { if (startOverlay.parentNode) startOverlay.remove(); }, 420);
        controls.hidden = false;
        setZoom(1); // in die erste Station zoomen
        renderCard();
      }

      // step 0 = ganzes Labyrinth; jede Stufe zoomt tiefer Richtung Zentrum
      function setZoom(step) {
        var s = 1 + step * 0.26;
        stage.classList.toggle('zoomed', step > 0);
        img.style.transform = 'scale(' + s.toFixed(3) + ')';
      }

      function renderCard() {
        deck.innerHTML = '';
        if (idx >= total) { finish(); return; }
        var q = questions[idx];
        progress.textContent = 'Frage ' + (idx + 1) + ' / ' + total;

        var badge = q.is_verified
          ? el('span', { class: 'sc-verified', title: 'verifizierter Absender', text: '✔' })
          : el('span', { class: 'sc-unverified', title: 'nicht verifiziert', text: '?' });
        var header = el('div', { class: 'sc-header' }, [
          el('div', { class: 'sc-avatar', text: q.icon || '📄' }),
          el('div', {}, [
            el('div', { class: 'sc-name' }, [q.profile_name + ' ', badge]),
            el('div', { class: 'sc-topic', text: q.topic })
          ])
        ]);
        var body = el('div', { class: 'sc-body' }, [el('p', { class: 'sc-statement', text: q.statement })]);
        if (q.metadata_hint) body.appendChild(el('div', { class: 'sc-meta', text: '🗂 ' + q.metadata_hint }));
        var hint = el('div', { class: 'sc-hint' }, [
          el('span', { text: '◀ glaubwürdig' }), el('span', { text: 'Lüge ▶' })
        ]);

        var card = el('div', { class: 'swipe-card' }, [header, body, hint]);
        deck.appendChild(card);
        attachDrag(card);
        requestAnimationFrame(function () { card.classList.add('in'); });
        state3.card = card;
      }

      function attachDrag(card) {
        var startX = 0, dx = 0, dragging = false, pid = null;
        card.addEventListener('pointerdown', function (e) {
          if (busy || finished) return;
          dragging = true; pid = e.pointerId; startX = e.clientX; dx = 0;
          try { card.setPointerCapture(pid); } catch (_) {}
          card.classList.add('dragging');
        });
        card.addEventListener('pointermove', function (e) {
          if (!dragging) return;
          dx = e.clientX - startX;
          card.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx * 0.04) + 'deg)';
          leftLabel.style.opacity = dx < 0 ? Math.min(1, -dx / 90) : 0;
          rightLabel.style.opacity = dx > 0 ? Math.min(1, dx / 90) : 0;
          card.classList.toggle('to-left', dx < -20);
          card.classList.toggle('to-right', dx > 20);
        });
        var end = function () {
          if (!dragging) return;
          dragging = false;
          try { card.releasePointerCapture(pid); } catch (_) {}
          card.classList.remove('dragging');
          leftLabel.style.opacity = 0; rightLabel.style.opacity = 0;
          if (Math.abs(dx) > 90) { decide(dx < 0 ? 'left' : 'right'); }
          else { card.style.transform = ''; card.classList.remove('to-left', 'to-right'); }
        };
        card.addEventListener('pointerup', end);
        card.addEventListener('pointercancel', end);
      }

      function decide(dir) {
        if (!started || busy || finished) return;
        var card = state3.card;
        if (!card) return;
        var q = questions[idx];

        if (dir === q.correct_answer) {
          busy = true;
          ctx.audio.play('success');
          ctx.markTask(q.taskIndex);
          card.classList.add('fly-' + dir);
          card.style.transform = 'translateX(' + (dir === 'left' ? '-140%' : '140%') + ') rotate(' + (dir === 'left' ? -18 : 18) + 'deg)';
          card.style.opacity = '0';
          leftLabel.style.opacity = 0; rightLabel.style.opacity = 0;
          ui.toast('✓ ' + q.explanation, 'ok', 3200);
          idx++;
          setZoom(idx + 1);
          setTimeout(function () { busy = false; renderCard(); }, 470);
        } else {
          wrong++;
          ctx.audio.play('error');
          card.classList.remove('to-left', 'to-right');
          card.style.transform = '';
          leftLabel.style.opacity = 0; rightLabel.style.opacity = 0;
          card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
          ui.toast('✗ Überdenke das noch einmal – prüfe Quelle, Lizenz, Metadaten & Plausibilität.', 'warn', 2600);
        }
      }

      function finish() {
        finished = true;
        controls.hidden = true;
        setZoom(total + 2);
        stage.classList.add('golden');
        var score = Math.max(40, 100 - wrong * 10);
        ctx.complete(score);
      }
    },

    unmount: function () {
      if (state3.keyHandler) { document.removeEventListener('keydown', state3.keyHandler); state3.keyHandler = null; }
      state3.card = null;
    }
  });
})(window.NX);
