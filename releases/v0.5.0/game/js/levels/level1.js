/* =========================================================================
   Level 1 — Die Cyber-Tauben (sicherer Datenabruf → JSON)
   Terminal: Ausrüstungs-Regal (URL → Methode → Token, progressive Freischaltung)
   + Live-Code-Vorschau. Start → Kartenflug der Taube → Fehler-Matrix (404/401/405)
   oder Erfolg → Papierrollen-Chaos → SCAN → Maschinen-JSON + Human-Dashboard.
   Teaches: API, URL/Endpoint, HTTP-Methode (GET/POST), API-Token, JSON, Fehlercodes.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  var ct = { timers: [], alive: false }; // Timer-Aufräumung für unmount()
  function later(fn, ms) { var id = setTimeout(function () { if (ct.alive) fn(); }, ms); ct.timers.push(id); }

  NX.levelDefs.push({
    id: 1,
    num: 'LEVEL 1',
    title: 'Die Cyber-Tauben',
    subtitle: 'Die lautlosen Boten',
    accent: 'purple',
    story: 'Das digitale Hauptnetz ist blockiert – direkte Verbindungen sind gekappt. Programmiere die ' +
           'Cyber-Tauben: wähle die Ziel-Adresse, die Methode und den Passierschein. Hol das Datenpaket ' +
           'und wandle den unlesbaren Rohdaten-Strom in sauberes JSON um.',
    tasks: ['Ziel-URL wählen', 'HTTP-Methode (GET) wählen', 'API-Token einsetzen', 'Daten holen & in JSON umwandeln'],
    quality: null,
    maxScore: 100,
    info: {
      title: 'INFO · API, TOKEN & JSON',
      html: '<p>Eine <b>API</b> ist eine Schnittstelle, über die Programme Daten von Servern anfordern.</p>' +
            '<p><b>URL/Endpoint</b> = die genaue Zieladresse · <b>HTTP-Methode</b>: <b>GET</b> = abholen, ' +
            '<b>POST</b> = senden · <b>API-Token</b> = digitaler Passierschein.</p>' +
            '<p>Fehlercodes: <b>404</b> nicht gefunden · <b>401</b> nicht autorisiert · <b>405</b> falsche Methode.</p>' +
            '<p><b>JSON</b> beschriftet jede Info als <i>"Schlüssel": Wert</i> – so liest der Computer Daten fehlerfrei.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level1;
      ct = { timers: [], alive: true };
      var sel = { url: null, method: null, token: null, tokenChosen: false };
      var errorsCount = 0;

      var stage = el('div', { class: 'ct-stage' });
      container.appendChild(el('p', { class: 'hint', style: 'text-align:left;margin:0 0 10px', html:
        'Rüste die Cyber-Taube aus (von oben nach unten) und schick sie zum Daten-Nest.' }));
      container.appendChild(stage);

      renderTerminal();

      /* ---------------- Terminal-Ansicht ---------------- */
      function renderTerminal() {
        stage.innerHTML = '';

        // rechts: Code-Vorschau
        var codePre = el('pre', { class: 'code-out ct-preview' });
        function updatePreview() {
          codePre.textContent =
            (sel.method || 'GET') + ' ' + (sel.url || '—') + '\n' +
            'Authorization: ' + (sel.tokenChosen ? (sel.token || '(leer)') : '—');
        }

        var launch = el('button', { class: 'btn btn-neon ct-launch', disabled: 'disabled', text: '🕊 TAUBE LOSSCHICKEN!',
          onclick: goFlight });
        function updateLaunch() { launch.disabled = !(sel.url && sel.method && sel.tokenChosen); }

        // Regal-Ebenen
        var tier2, tier3;
        var tier1 = buildTier('1', 'URL / Zieladresse', d.tooltips.url,
          d.endpoints.map(function (e) { return { val: e.url, label: e.label }; }),
          function (val) { sel.url = val; ctx.markTask(0); unlock(tier2); updatePreview(); updateLaunch(); });
        tier2 = buildTier('2', 'HTTP-Methode', d.tooltips.method,
          d.methods.map(function (m) { return { val: m, label: m }; }),
          function (val) { sel.method = val; ctx.markTask(1); unlock(tier3); updatePreview(); updateLaunch(); });
        tier3 = buildTier('3', 'API-Token / Passierschein', d.tooltips.token,
          d.tokens.map(function (t) { return { val: t.t, label: t.label }; }),
          function (val) { sel.token = val; sel.tokenChosen = true; ctx.markTask(2); updatePreview(); updateLaunch(); });
        tier2.classList.add('locked'); tier3.classList.add('locked');
        // vorhandene Auswahl wiederherstellen (z.B. nach Fehler-Rückkehr)
        if (sel.url) { unlock(tier2); markChosen(tier1, sel.url); }
        if (sel.method) { unlock(tier3); markChosen(tier2, sel.method); }
        if (sel.tokenChosen) { markChosen(tier3, sel.token); }
        updatePreview(); updateLaunch();

        var shelf = el('div', { class: 'ct-shelf' }, [
          el('div', { class: 'ct-shelf-title', text: 'AUSRÜSTUNG' }), tier1, tier2, tier3
        ]);
        var station = el('div', { class: 'ct-station' }, [
          el('img', { class: 'ct-bird', src: 'media/cybertaube.png', alt: 'Cyber-Taube' }),
          launch
        ]);
        var preview = el('div', { class: 'ct-previewbox' }, [
          el('div', { class: 'ct-preview-title', text: 'HTTP-REQUEST (Vorschau)' }), codePre
        ]);
        stage.appendChild(el('div', { class: 'ct-terminal' }, [shelf, station, preview]));
      }

      function buildTier(nr, label, tip, options, onPick) {
        var opts = el('div', { class: 'ct-opts' });
        var tier = el('div', { class: 'ct-tier' }, [
          el('div', { class: 'ct-tier-head' }, [
            el('span', { class: 'ct-tier-nr', text: nr }),
            el('span', { text: label }),
            el('span', { class: 'ct-tip', title: tip, text: 'ⓘ' })
          ]),
          opts
        ]);
        options.forEach(function (o) {
          var b = el('button', { class: 'ct-opt', text: o.label, dataset: { val: o.val } });
          b.addEventListener('click', function () {
            if (tier.classList.contains('locked')) return;
            ctx.audio.play('click');
            ui.$$('.ct-opt', opts).forEach(function (n) { n.classList.remove('selected'); });
            b.classList.add('selected');
            onPick(o.val);
          });
          opts.appendChild(b);
        });
        return tier;
      }
      function unlock(tier) { if (tier) tier.classList.remove('locked'); }
      function markChosen(tier, val) {
        ui.$$('.ct-opt', tier).forEach(function (n) { n.classList.toggle('selected', n.dataset.val === String(val)); });
      }

      /* ---------------- Kartenflug ---------------- */
      function goFlight() {
        ctx.audio.play('click');
        stage.innerHTML = '';
        var bird = el('img', { class: 'ct-bird flying', src: 'media/cybertaube.png', alt: 'Cyber-Taube' });
        var status = el('div', { class: 'ct-status', text: 'Cybertaube im Anflug zum Daten-Nest …' });
        stage.appendChild(el('div', { class: 'ct-map' }, [
          el('div', { class: 'ct-server', text: '🛰️' }), bird, status
        ]));
        later(function () { evaluateFlight(bird, status); }, 1600);
      }

      function computeError() {
        if (sel.url !== d.validEndpoint) return 'url';
        if (sel.token !== d.validToken) return 'token';
        if (sel.method !== d.validMethod) return 'method';
        return null;
      }

      function evaluateFlight(bird, status) {
        var errType = computeError();
        if (errType) { errorsCount++; showError(errType, bird, status); }
        else { showSuccess(bird, status); }
      }

      function showError(type, bird, status) {
        var e = d.errors[type];
        ctx.audio.play('error');
        bird.classList.remove('flying'); bird.classList.add('failed');
        var icon = type === 'url' ? '📡' : (type === 'token' ? '🦅' : '⛔');
        var extra = type === 'url' ? 'Die Taube landet ratlos auf einem toten Masten.'
          : (type === 'token' ? 'Ein Türsteher-Falke blockiert den Server-Eingang.'
            : 'Der Server-Knoten verweigert die Herausgabe der Daten.');
        status.innerHTML = '';
        stage.appendChild(el('div', { class: 'ct-error' }, [
          el('div', { class: 'ct-error-ico', text: icon }),
          el('div', { class: 'ct-error-code', text: e.title }),
          el('div', { class: 'ct-error-msg', text: e.msg }),
          el('div', { class: 'ct-error-extra', text: extra }),
          el('button', { class: 'btn btn-ghost', text: '‹ Zurück zum Terminal', onclick: renderTerminal })
        ]));
      }

      function showSuccess(bird, status) {
        ctx.audio.play('success');
        status.textContent = 'Zugriff gewährt ✓ – Rückflug mit Datenpaket 📦';
        bird.classList.remove('flying'); bird.classList.add('returning');
        later(showDataChain, 1300);
      }

      /* ---------------- Papierrollen-Chaos → Scan → JSON + Dashboard ---------------- */
      function showDataChain() {
        stage.innerHTML = '';
        var roll = el('pre', { class: 'ct-paperroll', text: (d.rawStream + '  ') });
        var scanBtn = el('button', { class: 'btn btn-neon', text: '⚡ SCAN & IN JSON UMWANDELN', onclick: onScan });
        stage.appendChild(el('div', { class: 'ct-chain' }, [
          el('div', { class: 'ct-chain-title', text: '📦 Paket erhalten – doch der Rohdaten-Strom ist unlesbar:' }),
          el('div', { class: 'ct-rollwrap' }, [roll]),
          el('div', { class: 'ct-streamerr', text: '⚠ ERR_UNREADABLE_STREAM' }),
          el('div', { class: 'task-actions' }, [scanBtn])
        ]));

        function onScan() {
          ctx.audio.play('key');
          scanBtn.disabled = true;
          var laser = el('div', { class: 'ct-laser' });
          stage.querySelector('.ct-rollwrap').appendChild(laser);
          later(revealResult, 950);
        }
      }

      function revealResult() {
        ctx.markTask(3);
        stage.innerHTML = '';
        var json = el('pre', { class: 'code-out' }); json.innerHTML = ui.highlightJSON(d.cityJson);
        var machine = el('div', { class: 'ct-view' }, [el('div', { class: 'ct-view-title', text: '🖥️ Maschinen-Ansicht (JSON)' }), json]);
        var dash = el('div', { class: 'ct-dash' }, d.dashboard.map(function (c) {
          return el('div', { class: 'ct-card' }, [
            el('div', { class: 'ct-card-ico', text: c.icon }),
            el('div', { class: 'ct-card-lbl', text: c.label }),
            el('div', { class: 'ct-card-val', text: c.value })
          ]);
        }));
        var human = el('div', { class: 'ct-view' }, [el('div', { class: 'ct-view-title', text: '👁️ Menschen-Ansicht (Dashboard)' }), dash]);
        var explain = el('div', { class: 'ct-explain', html:
          '<b>💬 Warum JSON?</b> Im Rohtext („…Tagesverbrauch1Notrufzentrale0…") weiß der Computer nicht, wo eine ' +
          'Zahl endet und ein Begriff beginnt. JSON beschriftet jede Info als <b>"Schlüssel": Wert</b> – dadurch ' +
          'liest der Computer die Daten in Millisekunden fehlerfrei.' });
        var done = el('button', { class: 'btn btn-neon', text: 'Daten gesichert ✓',
          onclick: function () { ctx.complete(Math.max(40, 100 - errorsCount * 10)); } });
        ctx.audio.play('success');
        stage.appendChild(el('div', {}, [
          el('p', { class: 'hint', style: 'text-align:left', text: 'Scan erfolgreich! Der Strom wurde in strukturiertes JSON umgewandelt:' }),
          el('div', { class: 'ct-views' }, [machine, human]),
          explain,
          el('div', { class: 'task-actions' }, [done])
        ]));
      }
    },

    unmount: function () {
      ct.alive = false;
      ct.timers.forEach(function (id) { clearTimeout(id); });
      ct.timers = [];
    }
  });
})(window.NX);
