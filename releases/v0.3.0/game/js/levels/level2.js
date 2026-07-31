/* =========================================================================
   Level 2 — Flug der Cyber-Tauben
   Intro: eine große Cyber-Taube fliegt herein und bringt eine Pergamentrolle
   mit dem API-Token. Nach dem Klick fliegt sie weg, die Rolle öffnet sich und
   der Token wandert ins Token-Feld. Danach: API-Anfrage bauen (Endpunkt+Token)
   und das JSON-Paket empfangen (simuliert, offline).
   Teaches: API-Abfrage, API-Token, JSON.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  NX.levelDefs.push({
    id: 2,
    num: 'LEVEL 2',
    title: 'Flug der Cyber-Tauben',
    subtitle: 'Die lautlosen Boten',
    accent: 'purple',
    story: 'Die Glasfaser der Stadt ist vom Hacker besetzt – jedes Bit wird abgefangen. Nur die ' +
           'Cyber-Tauben kommen durch. Sie bringen dir den API-Token. Wähle dann den richtigen ' +
           'Endpunkt, setze den Token ein und empfange das Datenpaket im JSON-Format.',
    tasks: ['Endpunkt wählen (API-Abfrage)', 'API-Token einsetzen', 'Paket im JSON-Format empfangen'],
    quality: null,
    maxScore: 100,
    info: {
      title: 'INFO · API & JSON',
      html: '<p>Eine <b>API</b> ist eine Schnittstelle, über die Programme Daten anfordern können.</p>' +
            '<p>Ein <b>API-Token</b> ist wie ein Schlüssel: er beweist, dass du die Daten abfragen darfst. ' +
            'Ohne gültigen Token gibt es einen Fehler (401).</p>' +
            '<p>Die Antwort kommt oft als <b>JSON</b> – ein Textformat aus <i>Schlüssel: Wert</i>-Paaren, ' +
            'das Menschen und Maschinen lesen können.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level2;
      var attempts = 0, solved = false;

      /* ---------- Formular (wie gehabt, wird nach dem Intro genutzt) ---------- */
      var endpointSel = el('select', {}, [el('option', { value: '', text: '— Endpunkt wählen —' })].concat(
        d.endpoints.map(function (e) { return el('option', { value: e.url, text: e.label }); })
      ));
      var tokenInput = el('input', { type: 'text', placeholder: 'API-Token einfügen …', autocomplete: 'off' });
      var tokenField = el('span', { class: 'token-hint', text: d.validToken });

      var form = el('div', {}, [
        el('div', { class: 'field-row' }, [el('label', { text: 'Methode:' }),
          el('input', { type: 'text', value: 'GET', readonly: 'readonly', style: 'max-width:110px' })]),
        el('div', { class: 'field-row' }, [el('label', { text: 'Endpunkt (URL):' }), endpointSel]),
        el('div', { class: 'field-row' }, [el('label', { text: 'Authorization:' }), tokenInput]),
        el('p', { class: 'hint', style: 'text-align:left' }, ['Dein bereitgestellter Token: ', tokenField])
      ]);

      var flight = el('div', { class: 'pigeon-fly' });
      var out = el('pre', { class: 'code-out', text: '// noch keine Antwort empfangen' });
      var sendBtn = el('button', { class: 'btn btn-neon', text: '🕊 Anfrage senden', onclick: send });
      var formWrap = el('div', { class: 'dove-form' }, [
        form, el('div', { class: 'task-actions' }, [sendBtn]), flight, out
      ]);

      /* ---------- Intro-Bühne mit Taube + Pergamentrolle ---------- */
      var bird = el('img', { class: 'dove-bird', src: 'media/cybertaube.png', alt: 'Cyber-Taube' });
      var scroll = el('img', { class: 'dove-scroll', src: 'media/pergamentrolle.png', alt: 'Pergamentrolle mit API-Token' });
      var scrollToken = el('div', { class: 'dove-scroll-token', text: d.validToken });
      var cta = el('div', { class: 'dove-cta', text: '🕊 Klick auf die Cyber-Taube!' });
      var intro = el('div', { class: 'dove-intro' }, [bird, scroll, scrollToken, cta]);
      var stage = el('div', { class: 'dove-stage' }, [formWrap, intro]);
      container.appendChild(stage);

      var ready = false;
      // Taube ist geflogen → klickbar
      setTimeout(function () { ready = true; cta.classList.add('show'); }, 1250);
      bird.addEventListener('click', reveal);
      intro.addEventListener('click', function () { if (ready) reveal(); });

      function reveal() {
        if (!ready || intro.dataset.done) return;
        intro.dataset.done = '1';
        ctx.audio.play('click');
        cta.classList.remove('show');
        bird.classList.add('out');
        setTimeout(function () {
          scroll.classList.add('show');
          scrollToken.classList.add('show');
          ctx.audio.play('success');
        }, 500);
        // Token wandert ins Token-Feld
        setTimeout(flyToken, 1500);
      }

      function flyToken() {
        var stageRect = stage.getBoundingClientRect();
        var startRect = scrollToken.getBoundingClientRect();
        var endRect = tokenInput.getBoundingClientRect();
        var chip = el('div', { class: 'token-chip', text: d.validToken });
        chip.style.left = (startRect.left - stageRect.left + startRect.width / 2) + 'px';
        chip.style.top = (startRect.top - stageRect.top + startRect.height / 2) + 'px';
        stage.appendChild(chip);
        // reflow, dann zum Feld bewegen
        requestAnimationFrame(function () {
          chip.style.left = (endRect.left - stageRect.left + endRect.width / 2) + 'px';
          chip.style.top = (endRect.top - stageRect.top + endRect.height / 2) + 'px';
          chip.style.transform = 'translate(-50%,-50%) scale(.75)';
          chip.style.opacity = '0.2';
        });
        setTimeout(function () {
          if (chip.parentNode) chip.remove();
          tokenInput.value = d.validToken;
          tokenInput.classList.add('filled');
          tokenField.classList.add('delivered');
          ctx.markTask(1);
          intro.classList.add('gone');
          setTimeout(function () { if (intro.parentNode) intro.remove(); }, 450);
          ui.toast('Token erhalten! Wähle den Endpunkt und sende die Anfrage.', 'ok', 3000);
        }, 720);
      }

      /* ---------- Anfrage senden (simuliert) ---------- */
      function send() {
        if (solved) return;
        var url = endpointSel.value;
        var token = tokenInput.value.trim();
        if (!url) { ui.toast('Bitte wähle zuerst einen Endpunkt.', 'warn'); return; }
        ctx.markTask(0);
        attempts++;
        ctx.audio.play('click');

        flight.innerHTML = '';
        flight.appendChild(el('span', { text: '🕊' }));

        setTimeout(function () {
          var endpoint = d.endpoints.filter(function (e) { return e.url === url; })[0];
          if (!endpoint || !endpoint.ok) {
            out.className = 'code-out err';
            out.innerHTML = ui.highlightJSON({ status: 404, error: 'Endpoint not found / nicht vertrauenswürdig' });
            ctx.audio.play('error');
            ui.toast('Falscher oder unsicherer Endpunkt (404).', 'warn');
            return;
          }
          if (token !== d.validToken) {
            out.className = 'code-out err';
            out.innerHTML = ui.highlightJSON({ status: 401, error: 'Unauthorized – gültigen API-Token einsetzen' });
            ctx.audio.play('error');
            ui.toast('Kein gültiger Token (401).', 'warn');
            return;
          }
          ctx.markTask(1); ctx.markTask(2);
          out.className = 'code-out';
          out.innerHTML = ui.highlightJSON(Object.assign({ status: 200 }, d.response200));
          solved = true;
          var score = Math.max(50, 100 - (attempts - 1) * 15);
          ctx.complete(score);
        }, 1150);
      }
    }
  });
})(window.NX);
