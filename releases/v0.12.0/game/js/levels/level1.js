/* =========================================================================
   Level 1 — Die Cyber-Tauben (sicherer Datenabruf → JSON)
   KEIN Start-Intro: Das Tower-Panorama mit dem Ausrüstungs-Hangar steht sofort
   da. Der Spieler rüstet die Taube Schritt für Schritt aus (URL → Methode →
   Token, progressive Freischaltung); beim Token gleitet die Pergamentrolle in
   den Schnabel. Erst [TAUBE LOSSCHICKEN!] startet den Flug über die
   isometrische Vektor-Stadtkarte → Fehler-Matrix (404/401/405) oder Erfolg →
   Papierrollen-Chaos → SCAN → Maschinen-JSON + Human-Dashboard.
   Teaches: API, URL/Endpoint, HTTP-Methode (GET/POST), API-Token, JSON, Fehlercodes.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  var ct = { timers: [], raf: 0, alive: false }; // Aufräumen in unmount()
  function later(fn, ms) { var id = setTimeout(function () { if (ct.alive) fn(); }, ms); ct.timers.push(id); return id; }
  function reduceMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  /* Isometrische Vektor-Stadtkarte – reines Inline-SVG, keine Bild-Assets.
     Koordinaten sind in 2:1-Projektion von Hand gesetzt, damit die Türme
     aufrecht stehen (ein globales matrix() würde sie scheren). */
  function cityMarkup() {
    var i, s = [];
    var DIM = {}; // symbol-id -> [breite, höhe]; <use> braucht beides explizit,
                  // sonst skaliert das Symbol auf die volle viewBox.
    s.push('<svg viewBox="0 0 900 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">');
    s.push('<defs>');
    s.push('<linearGradient id="ctSky" x1="0" y1="0" x2="0" y2="1">' +
           '<stop offset="0" stop-color="#0a0f22"/><stop offset="1" stop-color="#1a0b2e"/></linearGradient>');
    // Turm-Bausteine: Dach-Raute + linke (dunkle) und rechte (hellere) Fläche
    function tower(id, w, h) {
      var W = w * 2, H = h + w;
      DIM[id] = [W, H];
      return '<symbol id="' + id + '" viewBox="0 0 ' + W + ' ' + H + '">' +
        '<polygon class="ct-twr-top" points="' + w + ',0 ' + W + ',' + (w / 2) + ' ' + w + ',' + w + ' 0,' + (w / 2) + '"/>' +
        '<polygon class="ct-twr-l" points="0,' + (w / 2) + ' ' + w + ',' + w + ' ' + w + ',' + (w + h) + ' 0,' + (w / 2 + h) + '"/>' +
        '<polygon class="ct-twr-r" points="' + W + ',' + (w / 2) + ' ' + w + ',' + w + ' ' + w + ',' + (w + h) + ' ' + W + ',' + (w / 2 + h) + '"/>' +
        '</symbol>';
    }
    s.push(tower('ctTwrA', 18, 74));
    s.push(tower('ctTwrB', 24, 40));
    s.push(tower('ctTwrC', 13, 100));
    DIM.ctTree = [16, 20];
    s.push('<symbol id="ctTree" viewBox="0 0 16 20">' +
           '<rect class="ct-tree" x="7" y="11" width="2" height="8" opacity=".7"/>' +
           '<circle class="ct-tree" cx="8" cy="8" r="7"/></symbol>');
    DIM.ctNode = [34, 34];
    s.push('<symbol id="ctNode" viewBox="0 0 40 40">' +
           '<polygon points="20,4 34,12 34,28 20,36 6,28 6,12"/>' +
           '<circle cx="20" cy="20" r="6"/></symbol>');
    s.push('</defs>');

    // <use> immer mit expliziter Größe erzeugen
    function use(id, x, y, cls) {
      var d = DIM[id];
      return '<use ' + (cls ? 'class="' + cls + '" ' : '') +
        'href="#' + id + '" xlink:href="#' + id + '" x="' + x + '" y="' + y +
        '" width="' + d[0] + '" height="' + d[1] + '"/>';
    }

    s.push('<rect width="900" height="420" fill="url(#ctSky)"/>');
    s.push('<ellipse class="ct-city-glow" cx="640" cy="150" rx="240" ry="90" fill="rgba(157,0,255,.16)"/>');

    // Isometrisches Bodenraster
    s.push('<g class="ct-city-grid">');
    for (i = -8; i <= 16; i++) {
      s.push('<line x1="' + (i * 80) + '" y1="420" x2="' + (i * 80 + 420) + '" y2="0"/>');
      s.push('<line x1="' + (i * 80) + '" y1="0" x2="' + (i * 80 + 420) + '" y2="420"/>');
    }
    s.push('</g>');

    // Flüsse
    s.push('<polygon class="ct-river" points="0,300 210,196 268,224 58,330"/>');
    s.push('<polygon class="ct-river" points="470,420 760,272 806,296 516,420"/>');
    // Brücken über die Flüsse
    s.push('<g class="ct-bridge"><polygon points="120,268 176,240 200,254 144,282"/>' +
           '<line x1="128" y1="266" x2="152" y2="278"/><line x1="142" y1="259" x2="166" y2="271"/>' +
           '<line x1="156" y1="252" x2="180" y2="264"/></g>');
    s.push('<g class="ct-bridge"><polygon points="612,352 668,324 692,338 636,366"/>' +
           '<line x1="620" y1="350" x2="644" y2="362"/><line x1="634" y1="343" x2="658" y2="355"/>' +
           '<line x1="648" y1="336" x2="672" y2="348"/></g>');

    // Leuchtende Straßenschluchten
    var streets = [[40, 250, 400, 50], [150, 380, 520, 120], [330, 420, 760, 210], [0, 170, 300, 20]];
    s.push('<g>');
    streets.forEach(function (l) {
      s.push('<line class="ct-street" x1="' + l[0] + '" y1="' + l[1] + '" x2="' + l[2] + '" y2="' + l[3] + '"/>');
    });
    s.push('</g>');

    // Türme – von hinten nach vorne, die Zeichenreihenfolge liefert die Tiefe
    var towers = [
      ['ctTwrC', 236, 44], ['ctTwrA', 300, 66], ['ctTwrB', 366, 74], ['ctTwrA', 430, 52],
      ['ctTwrC', 494, 40], ['ctTwrB', 150, 128], ['ctTwrA', 244, 150], ['ctTwrB', 340, 158],
      ['ctTwrA', 424, 176], ['ctTwrC', 512, 140], ['ctTwrB', 610, 186], ['ctTwrA', 80, 214],
      ['ctTwrB', 272, 250], ['ctTwrA', 690, 232]
    ];
    towers.forEach(function (t, n) {
      s.push(use(t[0], t[1], t[2]));
      // Fensterreihen auf der helleren rechten Fläche
      var w = DIM[t[0]][0];
      for (var k = 0; k < 3; k++) {
        s.push('<rect class="ct-win" x="' + (t[1] + w * 0.58) + '" y="' + (t[2] + 26 + k * 16) +
               '" width="4" height="6" opacity="' + (0.35 + ((n + k) % 3) * 0.2).toFixed(2) + '"/>');
        s.push('<rect class="ct-win" x="' + (t[1] + w * 0.78) + '" y="' + (t[2] + 32 + k * 16) +
               '" width="4" height="6" opacity="' + (0.3 + ((n + k) % 4) * 0.16).toFixed(2) + '"/>');
      }
    });

    // Parkanlagen
    [[52, 322], [74, 334], [96, 322], [688, 386], [710, 396], [732, 386]].forEach(function (p) {
      s.push(use('ctTree', p[0], p[1]));
    });

    // Server-Knoten + Ziel-Knoten (Daten-Nest, rechts – dort landet die Taube)
    [[168, 236], [408, 312], [286, 118]].forEach(function (n) {
      s.push(use('ctNode', n[0], n[1], 'ct-node'));
    });
    s.push(use('ctNode', 578, 152, 'ct-node ct-target'));

    // Daten-Spur der Taube (synchron zur Flug-Animation)
    s.push('<path class="ct-trail" d="M -60 270 C 120 190, 200 250, 320 250 S 460 150, 620 172"/>');
    s.push('</svg>');
    return s.join('');
  }

  NX.levelDefs.push({
    id: 1,
    num: 'LEVEL 1',
    title: 'Die Cyber-Tauben',
    subtitle: 'Die lautlosen Boten',
    accent: 'purple',
    story: 'Die zentralen, privaten Datenbanken der Stadt wurden gehackt – sie sind blockiert und ' +
           'unsicher. Um die Infrastruktur am Laufen zu halten, greifen wir auf Open Data zurück: ' +
           'öffentlich und sicher bereitgestellte Daten. Weil auch die normalen Netzwerke gestört ' +
           'sind, transportieren digitale Cyber-Tauben unsere Datenanfragen. Stelle die Anfrage ' +
           'zusammen und schick die Taube los.',
    /* Drei nummerierte Aufgaben plus das Ziel – exakt die Checkliste der Spec
       („Arbeite die folgenden 3 Aufgaben in dieser Reihenfolge ab"). Der
       Ziel-Eintrag bekommt keine Nummer, zählt aber weiter als Teilaufgabe. */
    tasks: [
      'Ziel-URL / Adresse auswählen',
      'HTTP-Methode festlegen (GET)',
      'API-Token einsetzen & Taube losschicken',
      { text: 'Rohdaten-Strom in sauberes JSON umwandeln', goal: true }
    ],
    quality: null,
    // 4 bewertete Teilaufgaben: URL · Methode · Token · JSON-Umwandlung (siehe score.js)
    scoreUnits: 4,
    tips: [
      'Sieh dir die drei Adressen genau an: eine gehört zum öffentlichen Open-Data-Netz der Stadt, ' +
      'die anderen führen ins interne (gehackte) oder in ein fremdes Netz.',
      'Du willst Daten <b>abholen</b>, nicht welche hinschicken.',
      'Nur einer der drei Zugangsschlüssel wurde dir von der Cyber-Taube gebracht – vergleiche ihn mit deinem Schlüssel-Speicher.'
    ],
    info: {
      title: 'INFO · API, TOKEN & JSON',
      html: '<p>Eine <b>API</b> ist eine Schnittstelle, über die Programme Daten von Servern anfordern.</p>' +
            '<p><b>URL/Endpoint</b> = die genaue Zieladresse · <b>HTTP-Methode</b>: <b>GET</b> = abholen, ' +
            '<b>POST</b> = senden · <b>API-Token</b> = digitaler Zugangsschlüssel.</p>' +
            '<p>Fehlercodes: <b>404</b> nicht gefunden · <b>401</b> nicht autorisiert · <b>405</b> falsche Methode.</p>' +
            '<p><b>JSON</b> beschriftet jede Info als <i>"Schlüssel": Wert</i> – so liest der Computer Daten fehlerfrei.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level1;
      ct = { timers: [], raf: 0, alive: true };
      var sel = { url: null, method: null, token: null, tokenChosen: false };
      var errorsCount = 0;
      var tokenSlot = null;     // Token-Speicher in Ebene 3
      var station = null;       // Ausrüstungs-Hangar rechts
      var scrollEl = null;      // Pergamentrolle (gleitet beim Token in den Schnabel)
      var hangarStatus = null;  // Statuszeile im Hangar

      var stage = el('div', { class: 'ct-stage' });
      /* Instruktions-Banner: nennt immer genau den Schritt, der jetzt dran ist
         (Spec „Verbesserung für Userbility"). role=status meldet den Wechsel
         auch an Screenreader. */
      var bannerTxt = el('span', { class: 'instr-banner-txt', text: d.banner.step1 });
      var banner = el('div', { class: 'instr-banner', role: 'status' }, [
        el('span', { class: 'instr-banner-ico', text: '👉' }), bannerTxt
      ]);
      container.appendChild(banner);
      container.appendChild(stage);

      function setBanner(text, ico, done) {
        bannerTxt.textContent = text;
        if (ico) banner.querySelector('.instr-banner-ico').textContent = ico;
        banner.classList[done ? 'add' : 'remove']('is-done');
      }
      function syncBanner() {
        if (!sel.url) setBanner(d.banner.step1, '👉');
        else if (!sel.method) setBanner(d.banner.step2, '👉');
        else if (!sel.tokenChosen) setBanner(d.banner.step3, '👉');
        else setBanner(d.banner.ready, '🚀');
      }

      /* KEIN automatisches Start-Intro (Spec „Wichtige Verbesserung zu Beginn
         des Level 1"): Das Tower-Panorama mit dem Hangar steht sofort da. Die
         Taube fliegt erst los, wenn der Spieler auf [TAUBE LOSSCHICKEN!] klickt. */
      renderTerminal();

      /* Ausrüstung im Hangar: Mit jeder getroffenen Wahl wird die Taube sichtbar
         weiter bestückt. Beim Token gleitet die Pergamentrolle in den Schnabel. */
      function equip(step) {
        if (!station) return;
        station.classList.add('eq-' + step);
        if (step === 'token') {
          if (scrollEl) scrollEl.classList.add('load');
          if (tokenSlot) {
            tokenSlot.textContent = d.validToken;
            tokenSlot.classList.add('filled', 'delivered');
          }
          ctx.audio.play('select');
        }
        if (hangarStatus) hangarStatus.textContent = hangarText();
        syncBanner();
      }
      function hangarText() {
        if (!sel.url) return d.hangar.step0;
        if (!sel.method) return d.hangar.step1;
        if (!sel.tokenChosen) return d.hangar.step2;
        return d.hangar.ready;
      }

      /* ================= Terminal-Ansicht ================= */
      function renderTerminal() {
        stage.innerHTML = '';

        var codePre = el('pre', { class: 'code-out ct-preview' });
        function updatePreview() {
          codePre.textContent =
            (sel.method || 'GET') + ' ' + (sel.url || '—') + '\n' +
            'Authorization: ' + (sel.tokenChosen ? (sel.token || '(leer)') : '—');
        }

        var launch = el('button', { class: 'btn btn-neon ct-launch', disabled: 'disabled', text: '🕊 TAUBE LOSSCHICKEN!',
          onclick: goFlight });
        function updateLaunch() { launch.disabled = !(sel.url && sel.method && sel.tokenChosen); }

        var tier2, tier3;
        var tier1 = buildTier('1', 'URL / Zieladresse', 'url',
          d.endpoints.map(function (e) { return { val: e.url, label: e.label }; }),
          function (val) { sel.url = val; ctx.markTask(0); unlock(tier2); equip('url'); updatePreview(); updateLaunch(); });
        tier2 = buildTier('2', 'HTTP-Methode', 'method',
          d.methods.map(function (m) { return { val: m, label: m }; }),
          function (val) { sel.method = val; ctx.markTask(1); unlock(tier3); equip('method'); updatePreview(); updateLaunch(); });
        tier3 = buildTier('3', 'API-Token / Zugangsschlüssel', 'token',
          d.tokens.map(function (t) { return { val: t.t, label: t.label }; }),
          function (val) { sel.token = val; sel.tokenChosen = true; ctx.markTask(2); equip('token'); updatePreview(); updateLaunch(); });

        // Schlüssel-Speicher: füllt sich, sobald der Zugangsschlüssel gewählt ist
        tokenSlot = el('span', { class: 'token-hint ct-token-slot', text: '— noch kein Zugangsschlüssel —' });
        if (sel.tokenChosen) { tokenSlot.textContent = d.validToken; tokenSlot.classList.add('filled'); }
        tier3.insertBefore(el('div', { class: 'ct-slotrow' }, [
          el('span', { text: 'SCHLÜSSEL-SPEICHER:' }), tokenSlot
        ]), tier3.lastChild);

        tier2.classList.add('locked'); tier3.classList.add('locked');
        // vorhandene Auswahl wiederherstellen (z.B. nach Fehler-Rückkehr)
        if (sel.url) { unlock(tier2); markChosen(tier1, sel.url); }
        if (sel.method) { unlock(tier3); markChosen(tier2, sel.method); }
        if (sel.tokenChosen) { markChosen(tier3, sel.token); }
        updatePreview(); updateLaunch();

        var shelf = el('div', { class: 'ct-shelf' }, [
          el('div', { class: 'ct-shelf-title', text: 'REQUEST-KONFIGURATOR' }), tier1, tier2, tier3
        ]);

        /* Tauben-Station rechts: Taube steht von Beginn an bereit; die
           Pergamentrolle gleitet erst beim Schlüssel-Schritt in den Schnabel. */
        scrollEl = el('img', { class: 'ct-hangar-scroll', src: 'media/pergamentrolle.png',
          alt: 'Pergamentrolle mit API-Token' });
        hangarStatus = el('div', { class: 'ct-hangar-status', text: hangarText() });
        station = el('div', { class: 'ct-station' }, [
          el('div', { class: 'ct-hangar-title', text: 'TAUBEN-STATION' }),
          el('div', { class: 'ct-hangar' }, [
            el('img', { class: 'ct-bird', src: 'media/cybertaube.png', alt: 'Cyber-Taube' }),
            scrollEl
          ]),
          hangarStatus, launch
        ]);
        // bereits getroffene Auswahl auch optisch wiederherstellen
        if (sel.url) station.classList.add('eq-url');
        if (sel.method) station.classList.add('eq-method');
        if (sel.tokenChosen) { station.classList.add('eq-token'); scrollEl.classList.add('load'); }

        var preview = el('div', { class: 'ct-previewbox' }, [
          el('div', { class: 'ct-preview-title', text: 'HTTP-REQUEST (Vorschau)' }), codePre
        ]);
        // Reihenfolge nach Spec: Request-Konfigurator links, Tauben-Station rechts
        stage.appendChild(el('div', { class: 'ct-terminal' }, [shelf, preview, station]));
      }

      /* Ein Hilfe-Fenster je Station. Kostet keine Punkte – der Satz steht
         sichtbar im Fenster, damit niemand aus Angst vor Abzug darauf
         verzichtet (Spec §3 „Punkte-Transparenz"). */
      var FREE_NOTE = '<p class="lb-modal-note">Das Lesen der Hilfe kostet dich ' +
        '<b>KEINE Punkte!</b></p>';
      function openHelp(key) {
        var h = d.help[key];
        if (!h) return;
        ctx.audio.play('click');
        ui.showModal(h.title, h.html + FREE_NOTE, { speak: h.html });
      }
      function helpBtn(key) {
        return el('button', {
          class: 'btn btn-ghost btn-sm ct-help', type: 'button',
          text: '? Was bedeutet das?',
          onclick: function (e) { e.stopPropagation(); openHelp(key); }
        });
      }

      /* helpKey statt Hover-Tooltip: Ein echter Knopf ist auf Touchgeräten
         treffbar und wird nicht übersehen (Spec §3). Die Erklärung kostet
         nichts – das steht auch im Fenster. */
      function buildTier(nr, label, helpKey, options, onPick) {
        var opts = el('div', { class: 'ct-opts' });
        var tier = el('div', { class: 'ct-tier' }, [
          el('div', { class: 'ct-tier-head' }, [
            el('span', { class: 'ct-tier-nr', text: nr }),
            el('span', { text: label }),
            helpBtn(helpKey)
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

      /* ================= Kartenflug ================= */
      function goFlight() {
        ctx.audio.play('click');
        setBanner(d.banner.flight, '🕊');
        stage.innerHTML = '';
        var bird = el('img', { class: 'ct-bird flying', src: 'media/cybertaube.png', alt: 'Cyber-Taube' });
        var status = el('div', { class: 'ct-status', text: 'Cybertaube im Anflug zum Daten-Nest …' });
        var map = el('div', { class: 'ct-map in-flight' }, [
          el('div', { class: 'ct-city', html: cityMarkup() }), bird, status
        ]);
        stage.appendChild(map);
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
        if (errType) { errorsCount++; setBanner(d.errors[errType].msg, '⚠'); showError(errType, bird, status); }
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
          el('button', { class: 'btn btn-ghost', text: '‹ Zurück zum Terminal',
            onclick: function () { syncBanner(); renderTerminal(); } })
        ]));
      }

      function showSuccess(bird, status) {
        ctx.audio.play('success');
        status.textContent = 'Zugriff gewährt ✓ – Rückflug mit Datenpaket 📦';
        bird.classList.remove('flying'); bird.classList.add('returning');
        later(showDataChain, 1300);
      }

      /* ================= Papierrollen-Chaos → Scan → JSON + Dashboard ================= */
      function showDataChain() {
        setBanner(d.banner.scan, '🎯');
        stage.innerHTML = '';
        var roll = el('pre', { class: 'ct-paperroll', text: (d.rawStream + '  ') });
        var scanBtn = el('button', { class: 'btn btn-neon', text: '⚡ SCAN & IN JSON UMWANDELN', onclick: onScan });
        stage.appendChild(el('div', { class: 'ct-chain' }, [
          el('div', { class: 'ct-chain-title', text: '📦 Paket erhalten – doch der Rohdaten-Strom ist unlesbar:' }),
          el('div', { class: 'ct-rollwrap' }, [roll]),
          el('div', { class: 'ct-streamerr', text: '⚠ ERR_UNREADABLE_STREAM' }),
          el('div', { class: 'task-actions' }, [scanBtn, helpBtn('json')])
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
        /* Schritt 3 wertet nur noch aus – es gibt nichts mehr abzuhaken.
           Aufgabenkarte, Checkliste, Tipp-Knopf und Fortschritt verschwinden
           deshalb, ebenso das Instruktions-Banner (Spec „UI-Anpassung für
           Level 1 – Schritt 3"). An ihre Stelle tritt eine ruhige Hinweiszeile. */
        if (ctx.showTasks) ctx.showTasks(false);
        if (banner.parentNode) banner.parentNode.removeChild(banner);
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

        /* Glossar – steht laut Spec HIER, neben Maschinen- und Menschen-Ansicht,
           nicht im Info-Fenster. Aufklappbar, damit die Ansichten daneben nicht
           erdrückt werden; kostet nichts. */
        var glos = el('div', { class: 'ct-view ct-glossar' }, [
          el('div', { class: 'ct-view-title', text: '📖 Glossar (0 Punkte)' })
        ].concat(d.glossary.map(function (g) {
          var det = el('details', { class: 'ct-glos-item' }, [
            el('summary', { text: g.term }),
            el('p', { text: g.text })
          ]);
          return det;
        })));
        var explain = el('div', { class: 'ct-explain', html:
          '<b>💬 Warum JSON?</b> Im Rohtext („…Tagesverbrauch1Notrufzentrale0…") weiß der Computer nicht, wo eine ' +
          'Zahl endet und ein Begriff beginnt. JSON beschriftet jede Info als <b>"Schlüssel": Wert</b> – dadurch ' +
          'liest der Computer die Daten in Millisekunden fehlerfrei.' });
        var done = el('button', { class: 'btn btn-neon', text: 'Daten gesichert ✓',
          onclick: function () {
            /* 4 Teilaufgaben (URL · Methode · Token · JSON). Erstversuch-Bonus für
               alle drei Request-Teile nur, wenn schon der erste Flug saß; die
               JSON-Umwandlung selbst kann man nicht falsch machen. */
            ctx.complete({ units: 4, firstTry: errorsCount === 0 ? 4 : 1, wrong: errorsCount });
          } });
        // Vergleichstabelle: warum es BEIDE Ansichten braucht
        var c = d.compare;
        var thead = el('tr', {}, c.head.map(function (h) { return el('th', { text: h }); }));
        var tbody = c.rows.map(function (r) {
          return el('tr', {}, r.map(function (cell, i) {
            return el(i === 0 ? 'th' : 'td', { text: cell });
          }));
        });
        var compare = el('div', { class: 'ct-compare' }, [
          el('p', { class: 'hint', style: 'text-align:left;margin:0 0 8px', text: c.intro }),
          el('table', { class: 'data-table ct-compare-table' }, [
            el('thead', {}, [thead]), el('tbody', {}, tbody)
          ])
        ]);

        /* Der INFO-Knopf bleibt erreichbar: Wer die Bonusfrage bis hierher nicht
           beantwortet hat, käme sonst nie mehr an die 150 Punkte – Schritt 3
           ist der letzte Bildschirm des Levels. */
        var noteKids = [
          el('span', { class: 'instr-note-ico', 'aria-hidden': 'true', text: '📖' }),
          el('span', { class: 'instr-note-txt',
            text: 'Aufmerksam durchlesen – nur für dein Verständnis, keine Aufgabe.' }),
          el('button', { class: 'btn btn-ghost btn-sm btn-info', type: 'button',
            text: 'ℹ INFO · 0 PKT', onclick: function () { ctx.info(); } })
        ];
        var inf = NX.infos && NX.infos[1];
        if (inf && !NX.state.hasAnsweredBonus(1)) {
          noteKids.push(el('p', { class: 'instr-note-bonus',
            text: '💡 In der Info wartet noch eine Bonusfrage (+' + (inf.bonusPoints || 0) + ' Punkte).' }));
        }
        var note = el('div', { class: 'instr-note', role: 'note' }, noteKids);

        ctx.audio.play('success');
        stage.appendChild(el('div', {}, [
          note,
          el('p', { class: 'hint', style: 'text-align:left', text: 'Scan erfolgreich! Der Strom wurde in strukturiertes JSON umgewandelt:' }),
          el('div', { class: 'ct-views' }, [machine, human, glos]),
          compare,
          explain,
          el('div', { class: 'task-actions' }, [done])
        ]));
      }
    },

    unmount: function () {
      ct.alive = false;
      ct.timers.forEach(function (id) { clearTimeout(id); });
      ct.timers = [];
      if (ct.raf) { cancelAnimationFrame(ct.raf); ct.raf = 0; }
    }
  });
})(window.NX);
