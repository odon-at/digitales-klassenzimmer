/* =========================================================================
   Level 2 — Flug der Cyber-Tauben
   Mini-task: build an API request (endpoint + token), "send" a cyber-pigeon,
   receive the data packet as JSON. Simulated fetch (works offline).
   Teaches: API query, API token, JSON.
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
    story: 'Die Glasfaser der Stadt ist vom Feind gekapert – jedes Bit wird abgefangen. Nur die ' +
           'Cyber-Tauben kommen durch. Programmiere die Anfrage: wähle den richtigen Endpunkt, setze ' +
           'den API-Token ein und empfange das Datenpaket im JSON-Format.',
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

      var endpointSel = el('select', {}, [el('option', { value: '', text: '— Endpunkt wählen —' })].concat(
        d.endpoints.map(function (e) { return el('option', { value: e.url, text: e.label }); })
      ));
      var tokenInput = el('input', { type: 'text', placeholder: 'API-Token einfügen …', autocomplete: 'off' });

      var form = el('div', {}, [
        el('div', { class: 'field-row' }, [el('label', { text: 'Methode:' }),
          el('input', { type: 'text', value: 'GET', readonly: 'readonly', style: 'max-width:110px' })]),
        el('div', { class: 'field-row' }, [el('label', { text: 'Endpunkt (URL):' }), endpointSel]),
        el('div', { class: 'field-row' }, [el('label', { text: 'Authorization:' }), tokenInput]),
        el('p', { class: 'hint', style: 'text-align:left', html:
          'Dein bereitgestellter Token: <span class="token-hint">' + ui.escapeHtml(d.validToken) + '</span>' })
      ]);

      var pigeon = el('div', { class: 'pigeon-fly' });
      var out = el('pre', { class: 'code-out', text: '// noch keine Antwort empfangen' });

      var sendBtn = el('button', { class: 'btn btn-neon', text: '🕊 Anfrage senden',
        onclick: send });
      var actions = el('div', { class: 'task-actions' }, [sendBtn]);

      container.appendChild(form);
      container.appendChild(actions);
      container.appendChild(pigeon);
      container.appendChild(out);

      function send() {
        if (solved) return;
        var url = endpointSel.value;
        var token = tokenInput.value.trim();
        if (!url) { ui.toast('Bitte wähle zuerst einen Endpunkt.', 'warn'); return; }
        ctx.markTask(0);
        attempts++;
        ctx.audio.play('click');

        // pigeon flight animation
        pigeon.innerHTML = '';
        pigeon.appendChild(el('span', { text: '🕊' }));

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
          // success
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
