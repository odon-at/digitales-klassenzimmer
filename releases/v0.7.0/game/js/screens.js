/* =========================================================================
   screens.js — router + rendering & wiring for every screen, plus the
   generic level host that mounts a pluggable level module.
   Exposes: window.NX.screens
   ========================================================================= */
window.NX = window.NX || {};
(function (NX) {
  'use strict';

  var ui = NX.ui, el = ui.el, S = NX.state, L = NX.levels, D = NX.data;
  var $ = ui.$;

  var HUD_SCREENS = { 'screen-map': 1, 'screen-level': 1, 'screen-reward': 1 };

  var selectedAvatarId = null; // avatar screen working selection
  var currentLevel = null;     // active level def (for unmount / info)
  var introTimer = null;
  var finaleTimers = [];       // Zeremonie-Beats (überspringbar / wiederholbar)

  /* Tipps kosten zentral – EINE Stelle für Preis und Abzug (story/info.md §1).
     Die Level-3-Spec nennt −50, info.md −10/−15; normalisiert auf 10,
     siehe CHANGELOG v0.6.0. */
  var TIP_COST = 10;
  var tipsUsed = 0;

  /* ------------------------------------------------------------------ router */
  function showScreen(id) {
    if (introTimer) { clearInterval(introTimer); introTimer = null; }
    if (id !== 'screen-finale') clearFinaleTimers();
    ui.$$('.screen').forEach(function (s) { s.classList.toggle('active', s.id === id); });
    var hud = $('#hud');
    if (hud) hud.hidden = !HUD_SCREENS[id];
    if (HUD_SCREENS[id]) updateHud();
    window.scrollTo(0, 0);
  }

  function route(id) {
    showScreen(id);
    if (id === 'screen-start') renderStart();
    else if (id === 'screen-avatar') renderAvatar();
    else if (id === 'screen-intro') startIntro();
    else if (id === 'screen-map') renderMap();
    else if (id === 'screen-finale') startFinale();
    else if (id === 'screen-reward') renderReward();
  }

  function updateHud() {
    var st = S.get();
    var av = D.avatars.filter(function (a) { return a.id === st.avatarId; })[0];
    var img = $('#hud-avatar-img'), name = $('#hud-avatar-name');
    if (av) { img.src = av.img; img.alt = av.name; name.textContent = st.name || av.name; }
    else { img.removeAttribute('src'); name.textContent = '–'; }
    $('#hud-keys').textContent = S.keysCount();
    var bonusEl = $('#hud-bonus');
    if (bonusEl) bonusEl.textContent = S.bonusTotal();
    $('#hud-score').textContent = S.totalScore();
  }

  /* Ein Level öffnet seine Info: bevorzugt das avatar-spezifische Overlay,
     sonst der bestehende Modal-Fallback aus lv.info. */
  function openInfo(lv) {
    if (!lv) return;
    NX.audio.play('click');
    if (NX.infoSystem && NX.infoSystem.has(lv.id)) {
      NX.infoSystem.open(lv.id, { onAward: updateHud });
    } else if (lv.info) {
      ui.showModal(lv.info.title, lv.info.html);
    }
  }

  /* ------------------------------------------------------------------ START */
  function renderStart() {
    var has = S.hasSave();
    var start = $('#btn-start'), cont = $('#btn-continue');
    start.textContent = has ? '⟲ NEUES SPIEL' : '▶ SPIEL STARTEN';
    cont.hidden = !has;
    // Autoren-Credit + Build-Version (Quelle: NX.build aus js/version.js)
    var credits = $('#screen-start .credits');
    var b = window.NX.build || {};
    if (credits) {
      credits.textContent = 'Ein Spiel von Sarah und Chiara' + (b.version ? ' · v' + b.version : '');
    }
  }

  /* ------------------------------------------------------------------ LOGIN */
  function renderLogin() {
    var st = S.get();
    $('#input-code').value = st.classCode || '';
    $('#input-name').value = st.name || '';
    $('#login-error').hidden = true;
  }

  function submitLogin() {
    var code = $('#input-code').value.trim();
    var name = $('#input-name').value.trim();
    if (!code) {
      var err = $('#login-error');
      err.textContent = 'Bitte gib einen Klassen-Code ein.';
      err.hidden = false;
      NX.audio.play('error');
      return;
    }
    S.update({ classCode: code.toUpperCase(), name: name });
    NX.audio.play('success');
    route('screen-avatar');
  }

  /* ------------------------------------------------------------------ AVATAR */
  function renderAvatar() {
    var st = S.get();
    var wrap = $('#avatar-cards');
    wrap.innerHTML = '';
    selectedAvatarId = st.avatarId || null;

    D.avatars.forEach(function (a) {
      var btn = el('button', { class: 'btn', text: 'AUSWÄHLEN' });
      var card = el('div', { class: 'avatar-card', dataset: { id: a.id } }, [
        el('img', { class: 'avatar-portrait', src: a.img, alt: a.name }),
        el('div', { class: 'avatar-name', text: a.name }),
        el('div', { class: 'avatar-role', text: a.role }),
        el('ul', { class: 'avatar-skills' }, a.skills.map(function (s) { return el('li', { text: s }); })),
        btn
      ]);
      card.style.setProperty('--c', a.color);
      var pick = function () { selectAvatar(a); };
      card.addEventListener('mouseenter', function () { previewAvatar(a); });
      card.addEventListener('click', pick);
      btn.addEventListener('click', function (e) { e.stopPropagation(); pick(); });
      wrap.appendChild(card);
    });

    var initial = D.avatars.filter(function (a) { return a.id === selectedAvatarId; })[0] || D.avatars[0];
    previewAvatar(initial);
    if (selectedAvatarId) highlightSelected();
    $('#btn-avatar-confirm').disabled = !selectedAvatarId;
  }

  function previewAvatar(a) {
    var list = $('#abilities-list');
    list.innerHTML = '';
    a.abilities.forEach(function (ab) {
      list.appendChild(el('li', {}, [el('span', { class: 'ab-ico', text: ab.slice(0, 2).trim() }),
        el('span', { text: ab.replace(/^\S+\s/, '') })]));
    });
    $('#avatar-info').textContent = a.info;
  }

  function selectAvatar(a) {
    selectedAvatarId = a.id;
    NX.audio.play('select');
    previewAvatar(a);
    highlightSelected();
    $('#btn-avatar-confirm').disabled = false;
  }

  function highlightSelected() {
    ui.$$('.avatar-card').forEach(function (c) {
      c.classList.toggle('selected', c.dataset.id === selectedAvatarId);
    });
  }

  function confirmAvatar() {
    if (!selectedAvatarId) return;
    S.update({ avatarId: selectedAvatarId });
    if (!S.get().startedAt) S.update({ startedAt: Date.now() });
    NX.audio.play('success');
    // first run -> intro; returning player with progress -> straight to map
    if (S.keysCount() > 0) route('screen-map'); else route('screen-intro');
  }

  /* ------------------------------------------------------------------ INTRO */
  var INTRO_TEXT =
    'Es passierte um Punkt 03:00 Uhr nachts. Ein mysteriöser Cyber-Angriff – bekannt als ' +
    '„Der große Nebel“ – hat die Kontrolle über die digitale Infrastruktur der Stadt übernommen. ' +
    'Die städtischen Datenbanken wurden gesperrt, Ampeln spielen verrückt, und die offiziellen ' +
    'Systeme sind tot. Die Stadt ist im digitalen Koma. Eine alte, vergessene Backup-Meldung ' +
    'taucht auf den Bildschirmen der Stadt auf:';

  function startIntro() {
    var textEl = $('#intro-text');
    var quote = $('#intro-quote'), go = $('#btn-intro-go'), skip = $('#btn-intro-skip');
    quote.hidden = true; go.hidden = true; skip.hidden = false;
    textEl.textContent = '';
    var i = 0;
    var cursor = el('span', { class: 'cursor', text: '▊' });
    textEl.appendChild(cursor);
    introTimer = setInterval(function () {
      if (i >= INTRO_TEXT.length) { finishIntro(); return; }
      cursor.insertAdjacentText('beforebegin', INTRO_TEXT.charAt(i));
      i++;
    }, 18);
  }

  function finishIntro() {
    if (introTimer) { clearInterval(introTimer); introTimer = null; }
    $('#intro-text').textContent = INTRO_TEXT;
    $('#intro-quote').hidden = false;
    $('#btn-intro-go').hidden = false;
    $('#btn-intro-skip').hidden = true;
    NX.audio.play('select');
  }

  /* ------------------------------------------------------------------ MAP */
  function renderMap() {
    renderMapAvatar();
    var wrap = $('#map-tiles');
    wrap.innerHTML = '';
    L.all().forEach(function (lv, idx) {
      var done = S.isCompleted(lv.id);
      var open = L.isUnlocked(lv.id) && !done;
      var locked = !L.isUnlocked(lv.id);
      var accent = L.accentOf(lv.accent);

      var statusTxt = done ? '✔ Fragment gesichert' : (open ? '▶ Start' : '🔒 gesperrt');
      var statusCls = done ? 's-done' : (open ? 's-open' : 's-lock');

      var tile = el('div', { class: 'map-tile' + (done ? ' done' : '') + (locked ? ' locked' : '') }, [
        el('div', { class: 'tile-badge', text: done ? '🔑' : (locked ? '🔒' : '🔓') }),
        el('div', { class: 'tile-num', text: String(idx + 1) }),
        el('div', { class: 'tile-title', text: lv.title }),
        el('div', { class: 'tile-sub', text: lv.subtitle }),
        el('div', { class: 'tile-status ' + statusCls, text: statusTxt })
      ]);
      tile.style.setProperty('--c', accent[0]);
      if (!locked) {
        tile.addEventListener('click', function () { NX.audio.play('click'); openLevel(lv.id); });
      } else {
        tile.addEventListener('click', function () { ui.toast('Schließe zuerst das vorige Level ab.', 'warn'); });
      }
      wrap.appendChild(tile);
    });

    var pct = L.count() ? (S.keysCount() / L.count()) * 100 : 0;
    ui.setBar($('#map-progress-fill'), $('#map-progress-pct'), pct);
    $('#btn-to-finale').hidden = !L.allCompleted();
  }

  // gewählter Avatar links neben der Missionskarte
  function renderMapAvatar() {
    var box = $('#map-avatar');
    if (!box) return;
    box.innerHTML = '';
    var st = S.get();
    var av = D.avatars.filter(function (a) { return a.id === st.avatarId; })[0] || D.avatars[0];
    if (!av) return;
    box.style.setProperty('--c', av.color);
    box.appendChild(el('img', { class: 'map-avatar-img', src: av.img, alt: av.name }));
    box.appendChild(el('div', { class: 'map-avatar-name', text: st.name || av.name }));
    box.appendChild(el('div', { class: 'map-avatar-role', text: av.role }));
  }

  /* ------------------------------------------------------------------ LEVEL host */
  function openLevel(id) {
    var lv = L.byId(id);
    if (!lv) return;
    if (!L.isUnlocked(id)) { ui.toast('Level noch gesperrt.', 'warn'); return; }
    leaveLevel();
    currentLevel = lv;
    tipsUsed = 0;

    // Level 3 rechnet seine Tipps frageweise selbst ab -> Host-Button ausblenden
    var tipBtn = $('#btn-level-tip');
    if (tipBtn) tipBtn.hidden = !(lv.tips && lv.tips.length);

    var frame = $('.level-frame');
    var accent = L.accentOf(lv.accent);
    frame.style.setProperty('--accent', accent[0]);
    frame.style.setProperty('--accent-soft', accent[1]);

    $('#level-num').textContent = lv.num;
    $('#level-title').textContent = lv.title;
    $('#level-subtitle').textContent = lv.subtitle;
    $('#level-story').textContent = lv.story;

    var taskList = $('#level-tasks');
    taskList.innerHTML = '';
    (lv.tasks || []).forEach(function (t, i) {
      taskList.appendChild(el('li', { dataset: { i: String(i) }, text: t }));
    });

    var qWrap = $('#quality-fill').closest('.bar-wrap');
    if (lv.quality == null) { qWrap.style.display = 'none'; }
    else { qWrap.style.display = ''; ui.setBar($('#quality-fill'), $('#quality-pct'), lv.quality); }

    var body = $('#level-body');
    body.innerHTML = '';

    var ctx = {
      ui: ui, el: el, data: D, audio: NX.audio, state: S.get(),
      markTask: function (i) {
        var li = taskList.querySelector('li[data-i="' + i + '"]');
        if (li) li.classList.add('done');
      },
      setQuality: function (pct) {
        qWrap.style.display = '';
        ui.setBar($('#quality-fill'), $('#quality-pct'), pct);
      },
      info: function () { openInfo(lv); },
      complete: function (score) { completeLevel(lv, score); }
    };

    lv.mount(body, ctx);
    showScreen('screen-level');
  }

  function leaveLevel() {
    // zuerst: Overlay zu und Sprachausgabe stoppen, sonst spricht der Funk-Kanal weiter
    if (NX.infoSystem) { try { NX.infoSystem.close(); } catch (e) {} }
    if (currentLevel && typeof currentLevel.unmount === 'function') {
      try { currentLevel.unmount(); } catch (e) {}
    }
    var overlay = $('.level-success');
    if (overlay) overlay.remove();
    currentLevel = null;
  }

  function completeLevel(lv, score) {
    // Tipp-Abzug passiert genau hier – Level rechnen ihn nicht selbst ein
    var final = Math.max(lv.minScore || 40, Math.round(score) - tipsUsed * TIP_COST);
    S.completeLevel(lv.id, final);
    updateHud();
    NX.audio.play('key');

    var frame = $('.level-frame');
    var old = frame.querySelector('.level-success');
    if (old) old.remove();
    var last = L.allCompleted();
    var overlay = el('div', { class: 'level-success' }, [
      el('div', { class: 'key-icon', text: '🔑' }),
      el('h3', { text: 'SCHLÜSSEL GEFUNDEN!' }),
      el('p', { text: lv.title + ' abgeschlossen · +' + final + ' Punkte' +
        (tipsUsed ? '  (−' + (tipsUsed * TIP_COST) + ' für Tipps)' : '') }),
      el('button', { class: 'btn btn-neon', text: last ? 'ZUM FINALE →' : 'Weiter zur Karte →',
        onclick: function () {
          NX.audio.play('click');
          leaveLevel();
          if (last) route('screen-finale'); else route('screen-map');
        } })
    ]);
    frame.appendChild(overlay);
  }

  /* ------------------------------------------------------------------ FINALE */
  /* Zeremonie vor dem Zertifikat. Muss idempotent und überspringbar sein:
     „ZUM FINALE" und der Karten-Button sind beliebig oft erreichbar. */
  var FIN_SPEECH = 'Agent! Du hast die Stadt aus dem digitalen Koma gerettet. Du hast rohes ' +
    'Datenchaos in klare, verständliche Einsichten verwandelt, die Gesetze des Datenschutzes ' +
    'gewahrt und die Verwaltung transparent gemacht!';
  var FIN_CLOSING = '„Transparenz schafft Vertrauen – und du hast gezeigt, wie eine smarte ' +
    'Stadt von morgen aussieht!"';
  /* Reihenfolge nach dem TATSÄCHLICHEN Spielaufbau. Die Spec listet hier noch die
     alte Nummerierung (L1 Open Data / L2 API) – seit v0.5.0 sind L1 und L2 getauscht. */
  var FIN_LEVELS = [
    { id: 1, icon: '📡', text: 'APIs & JSON – Daten sicher abgeholt' },
    { id: 2, icon: '🗄️', text: 'Open Data verstanden & Fälschungen korrigiert' },
    { id: 3, icon: '🔍', text: 'Quellen geprüft – Lügen entlarvt' },
    { id: 4, icon: '📊', text: 'Diagramme gewählt & 360°-Datenschutz-Check gemeistert' }
  ];

  function clearFinaleTimers() {
    finaleTimers.forEach(function (t) { clearTimeout(t); });
    finaleTimers = [];
  }

  function startFinale() {
    clearFinaleTimers();
    var st = S.get();
    var av = D.avatars.filter(function (a) { return a.id === st.avatarId; })[0] || D.avatars[0];
    var img = $('#fin-avatar');
    if (img) { img.src = av.img; img.alt = av.name; }

    var stage = $('.fin-stage');
    var speech = $('#fin-speech'), levels = $('#fin-levels');
    var trophy = $('#fin-trophy'), badge = $('#fin-badge'), closing = $('#fin-closing');

    // Ausgangszustand (wichtig beim erneuten Betreten)
    stage.classList.remove('is-lit');
    [speech, levels, trophy, badge, closing].forEach(function (n) { if (n) n.classList.remove('show'); });
    speech.textContent = FIN_SPEECH;
    closing.textContent = FIN_CLOSING;

    levels.innerHTML = '';
    FIN_LEVELS.forEach(function (lv) {
      var pts = st.scores && st.scores[lv.id] ? st.scores[lv.id] : 0;
      levels.appendChild(el('li', { class: 'fin-lvl' }, [
        el('b', { text: lv.icon + ' Level ' + lv.id }),
        el('span', { text: lv.text + ' · ' + pts + ' Pkt' })
      ]));
    });

    // Award nur zeigen, wenn er in der 360°-Stadt auch verdient wurde
    badge.hidden = !S.hasAward('open-data-hero');

    var fast = reducedMotion();
    var beats = [
      [fast ? 0 : 200,  function () { stage.classList.add('is-lit'); }],
      [fast ? 0 : 700,  function () { speech.classList.add('show'); NX.audio.play('select'); }],
      [fast ? 0 : 1900, function () { levels.classList.add('show'); }],
      [fast ? 0 : 2700, function () { trophy.classList.add('show'); NX.audio.play('key'); }],
      [fast ? 0 : 3600, function () { badge.classList.add('show'); }],
      [fast ? 0 : 4200, function () { closing.classList.add('show'); NX.audio.play('win'); ui.celebrate(); }]
    ];
    beats.forEach(function (b) { finaleTimers.push(setTimeout(b[1], b[0])); });
  }

  function skipFinale() {
    clearFinaleTimers();
    var stage = $('.fin-stage');
    stage.classList.add('is-lit');
    ['#fin-speech', '#fin-levels', '#fin-trophy', '#fin-badge', '#fin-closing'].forEach(function (sel) {
      var n = $(sel); if (n) n.classList.add('show');
    });
  }

  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  /* ------------------------------------------------------------------ REWARD */
  /* Erreichbare Höchstpunktzahl: Level-Maxima + alle Wissens-Boni.
     Die Schwellen sind prozentual, damit neue Boni die Ränge nicht entwerten
     (früher fix 360/280/200 = 90/70/50 % von 400). */
  function maxTotal() {
    var base = L.all().reduce(function (s, lv) { return s + (lv.maxScore || 100); }, 0);
    return base + (NX.infoSystem ? NX.infoSystem.maxBonusTotal() : 0);
  }
  function rankFor(score) {
    var m = maxTotal() || 400;
    if (score >= m * 0.90) return { r: 'S', t: 'Legendäre:r Chronist:in', b: 'Nexus erstrahlt wieder – dein Name leuchtet in der Halle der Chronisten!' };
    if (score >= m * 0.70) return { r: 'A', t: 'Meister-Archivar:in', b: 'Saubere Daten, klare Wahrheit. Die Stadt verdankt dir viel.' };
    if (score >= m * 0.50) return { r: 'B', t: 'Daten-Detektiv:in', b: 'Gut gemacht – du hast die Fragmente zurückgeholt.' };
    return { r: 'C', t: 'Aura-Lehrling', b: 'Mission erfüllt. Mit etwas Übung wird daraus Meisterschaft.' };
  }

  function renderReward() {
    var st = S.get();
    var av = D.avatars.filter(function (a) { return a.id === st.avatarId; })[0] || D.avatars[0];
    var score = S.totalScore();
    var keys = S.keysCount();
    var rk = rankFor(score);

    var img = $('#cert-avatar'); img.src = av.img; img.alt = av.name;
    $('#cert-name').textContent = st.name || av.name;
    $('#cert-keys').textContent = keys + '/' + L.count();
    $('#cert-score').textContent = score;
    $('#cert-rank').textContent = rk.r;
    $('#cert-blurb').textContent = '„' + rk.t + '“ — ' + rk.b;
    $('#cert-code').textContent = st.classCode || '—';
    var dateStr;
    try { dateStr = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch (e) { dateStr = ''; }
    var bv = (window.NX.build && window.NX.build.version) ? ' · v' + window.NX.build.version : '';
    $('#cert-date').textContent = dateStr + bv;

    // Auszeichnung + Level-Übersicht (werden mitgedruckt, siehe @media print)
    var awardRow = $('#cert-award');
    if (awardRow) awardRow.hidden = !S.hasAward('open-data-hero');
    var certLevels = $('#cert-levels');
    if (certLevels) {
      certLevels.innerHTML = '';
      FIN_LEVELS.forEach(function (lv) {
        var pts = st.scores && st.scores[lv.id] ? st.scores[lv.id] : 0;
        certLevels.appendChild(el('li', {}, [
          el('b', { text: lv.icon + ' L' + lv.id + ': ' }), pts + ' Pkt'
        ]));
      });
    }

    // Hall of Chroniclers — save this run once
    if (!st.hallSaved && L.allCompleted()) {
      S.addToHall({ name: st.name || av.name, avatar: av.name, score: score, keys: keys, date: dateStr, code: st.classCode });
      S.update({ hallSaved: true });
    }
    renderHall(st, score);

    // feedback
    $('#feedback-text').value = st.feedback || '';
    $('#feedback-saved').hidden = true;

    NX.audio.play('win');
    ui.celebrate();
  }

  function renderHall(st, score) {
    var hall = S.getHall();
    var list = $('#hall-list');
    list.innerHTML = '';
    if (!hall.length) { list.appendChild(el('li', { text: 'Noch keine Einträge.' })); return; }
    hall.forEach(function (e) {
      var mine = (e.name === (st.name || '') || e.score === score) && e.code === st.classCode;
      list.appendChild(el('li', { class: mine ? 'me' : '',
        text: e.name + ' · ' + e.score + ' Pkt · ' + e.keys + ' 🔑' }));
    });
  }

  function saveFeedback() {
    S.update({ feedback: $('#feedback-text').value });
    $('#feedback-saved').hidden = false;
    NX.audio.play('select');
  }

  /* ------------------------------------------------------------------ init / wiring */
  function init() {
    // start
    $('#btn-start').addEventListener('click', function () {
      NX.audio.play('click');
      if (S.hasSave()) {
        if (!window.confirm('Neues Spiel starten? Der aktuelle Fortschritt geht verloren.')) return;
        S.reset();
      }
      showScreen('screen-login');
      renderLogin();
    });
    $('#btn-continue').addEventListener('click', function () { NX.audio.play('click'); route('screen-map'); });

    // login
    $('#btn-login').addEventListener('click', function () { NX.audio.play('click'); submitLogin(); });
    ['#input-code', '#input-name'].forEach(function (sel) {
      $(sel).addEventListener('keydown', function (e) { if (e.key === 'Enter') submitLogin(); });
    });

    // avatar
    $('#btn-avatar-back').addEventListener('click', function () { NX.audio.play('click'); showScreen('screen-login'); renderLogin(); });
    $('#btn-avatar-confirm').addEventListener('click', function () { NX.audio.play('click'); confirmAvatar(); });

    // intro
    $('#btn-intro-skip').addEventListener('click', function () { NX.audio.play('click'); finishIntro(); });
    $('#btn-intro-go').addEventListener('click', function () { NX.audio.play('click'); route('screen-map'); });

    // map
    $('#btn-map-quit').addEventListener('click', function () { NX.audio.play('click'); route('screen-start'); });
    $('#btn-to-finale').addEventListener('click', function () { NX.audio.play('click'); route('screen-finale'); });

    // finale (Zeremonie)
    $('#btn-finale-skip').addEventListener('click', function () { NX.audio.play('click'); skipFinale(); });
    $('#btn-finale-go').addEventListener('click', function () {
      NX.audio.play('click'); clearFinaleTimers(); route('screen-reward');
    });

    // level host
    $('#btn-level-back').addEventListener('click', function () { NX.audio.play('click'); leaveLevel(); route('screen-map'); });
    $('#btn-level-info').addEventListener('click', function () { openInfo(currentLevel); });
    $('#btn-level-tip').addEventListener('click', function () {
      if (!currentLevel) return;
      var tips = currentLevel.tips || [];
      if (!tips.length) { ui.toast('Für dieses Level gibt es die Tipps direkt bei der Aufgabe.', 'warn'); return; }
      if (tipsUsed >= tips.length) { ui.toast('Keine weiteren Tipps für dieses Level.', 'warn'); return; }
      // Preis unübersehbar machen – gleiches Muster wie beim „Neues Spiel"-Dialog
      if (!window.confirm('Ein Tipp kostet ' + TIP_COST + ' Punkte. Trotzdem anzeigen?')) return;
      NX.audio.play('click');
      ui.showModal('💡 TIPP ' + (tipsUsed + 1) + '/' + tips.length + ' · −' + TIP_COST + ' PUNKTE', tips[tipsUsed]);
      tipsUsed++;
    });

    // reward
    $('#btn-print').addEventListener('click', function () { window.print(); });
    $('#btn-replay').addEventListener('click', function () {
      NX.audio.play('click'); S.reset(); route('screen-start');
    });
    $('#btn-feedback-save').addEventListener('click', function () { NX.audio.play('click'); saveFeedback(); });
  }

  NX.screens = { init: init, route: route, showScreen: showScreen, updateHud: updateHud };
})(window.NX);
