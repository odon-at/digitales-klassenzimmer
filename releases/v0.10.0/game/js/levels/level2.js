/* =========================================================================
   Level 2 — Das Schattenarchiv
   Interne Systemdaten wurden manipuliert. Die echten Werte kommen aus dem
   unabhängigen Open-Data-Portal der Datenbehörde Nexus (URL eingeben → senden),
   werden verglichen und im internen Stadt-System korrigiert.
   Abschluss: kurzer "Real-Life Break" (überspringbar).
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  var breakTimer = null; // Countdown-Interval (für unmount)

  NX.levelDefs.push({
    id: 2,
    num: 'LEVEL 2',
    title: 'Das Schattenarchiv',
    subtitle: 'Das Datenbank-Archiv',
    accent: 'green',
    story: 'Alle internen Systemdaten wurden vom Hacker manipuliert – nur die unabhängigen ' +
           'Open-Data-Archive blieben echt. Öffne das Portal der Datenbehörde Nexus, vergleiche die ' +
           'echten Werte mit dem gehackten Stadt-System und korrigiere die Fälschungen.',
    tasks: ['Verständnis: Open Data', 'Open-Data-Portal öffnen', 'Falschen Wert korrigieren', 'Schlüssel finden'],
    quality: null,
    // 6 bewertete Teilaufgaben: 5 Open-Data-Abgleiche + der Plausibilitätsfall
    scoreUnits: 6,
    tips: [
      'Tippe die URL-Zeile an – sie füllt die Adresse des Open-Data-Portals vor – und klicke SENDEN.',
      'Klicke im Portal die passende Kategorie an und übernimm den <b>echten Wert</b> in die Tabelle.',
      'Für den pH-Wert gibt es <b>keinen</b> Vergleichswert im Portal. Überlege: Darf man einen Messwert erfinden?'
    ],
    info: {
      title: 'INFO · OPEN DATA & DATENQUALITÄT',
      html: '<p><b>Open Data</b> sind frei zugängliche, unabhängig gespeicherte Daten (oft von ' +
            'Behörden). Weil sie öffentlich und dezentral liegen, sind sie schwer zu fälschen.</p>' +
            '<p><b>Datenqualität</b> bedeutet: Werte sind vollständig, aktuell und plausibel.</p>' +
            '<p><b>Grundregel:</b> Einen falschen Wert korrigiert man nicht durch Raten, sondern indem ' +
            'man den echten Wert aus einer <b>vertrauenswürdigen Originalquelle</b> übernimmt.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level2;
      var byKey = {}; d.categories.forEach(function (c) { byKey[c.key] = c; });
      var pl = d.plausibility;
      // +1: der Plausibilitäts-Fall zählt beim Fortschritt mit
      var badTotal = d.system.length + 1;
      var qStep = (100 - d.quality) / badTotal;
      var portalOpen = false, wrong = 0, fixedCount = 0, solved = false;

      ctx.markTask(0);

      /* Große Ansage statt kleinem Hinweissatz, direkt über der URL-Zeile
         (Spec „Verbesserung für Usability"): Der Auftrag muss auf den ersten
         Blick erkennbar sein. */
      var brief = el('div', { class: 'instr-brief', role: 'note' }, [
        el('div', { class: 'instr-brief-head' }, [
          el('span', { class: 'instr-brief-ico', text: '⚠' }),
          el('span', { text: d.brief.head })
        ]),
        el('ol', { class: 'instr-brief-steps' }, d.brief.steps.map(function (t) {
          return el('li', { text: t });
        })),
        el('div', { class: 'instr-brief-foot', text: '▸ ' + d.brief.foot })
      ]);

      var root = el('div', { class: 'l1-root' });
      container.appendChild(root);

      var urlInput = el('input', { class: 'l1-url', type: 'text', autocomplete: 'off', spellcheck: 'false',
        placeholder: 'https://…  (URL des Open-Data-Portals)' });
      urlInput.addEventListener('focus', function () { if (!urlInput.value) urlInput.value = d.urlSuggestion; });
      urlInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') openPortal(); });
      var sendBtn = el('button', { class: 'btn btn-neon btn-sm', text: 'SENDEN', onclick: openPortal });
      root.appendChild(brief);
      root.appendChild(el('div', { class: 'l1-portalbar' }, [
        el('span', { class: 'l1-url-label', text: 'URL:' }), urlInput, sendBtn
      ]));

      var cats = el('div', { class: 'l1-cats' });
      d.categories.forEach(function (c) {
        cats.appendChild(el('button', { class: 'l1-cat', text: c.icon + ' ' + c.name,
          onclick: function () { showDetail(c); } }));
      });
      var detail = el('div', { class: 'l1-detail' }, [
        el('span', { class: 'dim', text: d.detailHint })
      ]);
      var portal = el('div', { class: 'l1-portal', hidden: 'hidden' }, [
        el('div', { class: 'l1-portal-title', text: '🌐 Datenbehörde Nexus · Open-Data-Portal' }),
        cats, detail
      ]);
      root.appendChild(portal);

      var qFill = el('div', { class: 'bar-fill quality' });
      var qPct = el('span', {});
      root.appendChild(el('div', { class: 'bar-wrap l1-quality' }, [
        el('div', { class: 'bar-label', text: 'DATENQUALITÄT' }), el('div', { class: 'bar' }, [qFill]), qPct
      ]));
      ui.setBar(qFill, qPct, d.quality);

      var sysTable = el('table', { class: 'data-table l1-system-table' });
      sysTable.appendChild(el('thead', {}, [el('tr', {}, [
        el('th', { text: 'Kategorie' }), el('th', { text: 'Kennzahl' }), el('th', { text: 'Interner Wert (gehackt)' })
      ])]));
      var sysBody = el('tbody');
      d.system.forEach(function (rowDef) {
        var cat = byKey[rowDef.key];
        var valCell = el('td', { class: 'cell bad', text: rowDef.hacked });
        valCell.addEventListener('click', function () { onCellClick(rowDef, cat, valCell); });
        sysBody.appendChild(el('tr', {}, [
          el('td', { text: cat.icon + ' ' + cat.name }), el('td', { text: rowDef.field }), valCell
        ]));
      });
      // Zusatzfall: unplausibler Wert OHNE Vergleichsquelle -> nicht raten, sondern NULL
      var plCell = el('td', { class: 'cell bad', text: pl.hacked });
      plCell.addEventListener('click', function () { onPlausibilityClick(plCell); });
      sysBody.appendChild(el('tr', {}, [
        el('td', { text: pl.icon + ' ' + pl.name }), el('td', { text: pl.field }), plCell
      ]));

      sysTable.appendChild(sysBody);
      var fixbox = el('div', { style: 'margin-top:10px' });
      root.appendChild(el('div', { class: 'l1-system' }, [
        el('div', { class: 'l1-system-title', text: '🖥️ Internes Stadt-System (kompromittiert)' }),
        sysTable, fixbox
      ]));

      function openPortal() {
        if (portalOpen) return;
        var v = urlInput.value.trim().toLowerCase();
        ctx.audio.play('click');
        if (v.indexOf('datenbehoerde-nexus') === -1) {
          wrong++; ctx.audio.play('error');
          ui.toast('Diese Adresse führt nicht zum offiziellen Open-Data-Portal der Datenbehörde Nexus.', 'warn', 3000);
          return;
        }
        portalOpen = true;
        portal.hidden = false;
        portal.classList.add('open');
        ctx.markTask(1);
        ui.toast('Open-Data-Portal verbunden. Vergleiche die echten Werte mit dem Stadt-System.', 'ok', 2400);
      }

      function showDetail(c) {
        ctx.audio.play('click');
        detail.innerHTML = '';
        detail.appendChild(el('div', { class: 'l1-detail-head', text: c.icon + ' ' + c.name }));
        detail.appendChild(el('div', { class: 'l1-detail-val',
          html: 'Echter Wert: <b>' + ui.escapeHtml(c.trueValue + (c.unit ? ' ' + c.unit : '')) + '</b>' }));
        detail.appendChild(el('div', { class: 'l1-detail-meta',
          text: 'Kennzahl: ' + c.metric + ' · Herausgeber: ' + d.publisher + ' · Lizenz: ' + d.lizenz + ' · Stand: ' + c.updated }));
      }

      function onCellClick(rowDef, cat, cell) {
        if (solved || cell.classList.contains('fixed')) return;
        ctx.audio.play('click');
        if (!portalOpen) { ui.toast('Öffne zuerst das Open-Data-Portal (URL eingeben und SENDEN).', 'warn', 3000); return; }
        showFix(rowDef, cat, cell);
      }

      function showFix(rowDef, cat, cell) {
        ui.$$('.data-table td.bad-selected').forEach(function (n) { n.classList.remove('bad-selected'); });
        cell.classList.add('bad-selected');
        fixbox.innerHTML = '';
        var input = el('input', { type: 'text', autocomplete: 'off', spellcheck: 'false', placeholder: 'echten Wert eintragen' });
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryFix(rowDef, cat, cell, input); });
        fixbox.appendChild(el('div', { class: 'field-row' }, [
          el('label', { text: 'Korrigierter Wert · ' + cat.name + ':' }),
          input,
          el('button', { class: 'btn btn-neon btn-sm', text: 'Korrigieren', onclick: function () { tryFix(rowDef, cat, cell, input); } })
        ]));
        fixbox.appendChild(el('p', { class: 'hint', style: 'text-align:left',
          html: 'Übernimm den <b>echten Wert</b> aus dem Open-Data-Portal (Kategorie „' + ui.escapeHtml(cat.name) + '" anklicken).' }));
        input.focus();
      }

      /* ---- Zusatzfall „NULL statt Raten" (Spec: level-3-Datei, Abschnitt 5) ----
         Unplausibler Wert, für den es KEINEN Open-Data-Vergleichswert gibt.
         Lernziel: Messwerte werden nicht erfunden, sondern als fehlend markiert. */
      function onPlausibilityClick(cell) {
        if (solved || cell.classList.contains('fixed')) return;
        ctx.audio.play('click');
        if (!portalOpen) { ui.toast('Öffne zuerst das Open-Data-Portal (URL eingeben und SENDEN).', 'warn', 3000); return; }
        ui.$$('.data-table td.bad-selected').forEach(function (n) { n.classList.remove('bad-selected'); });
        cell.classList.add('bad-selected');
        showPlausibilityBox(cell);
      }

      function showPlausibilityBox(cell) {
        fixbox.innerHTML = '';
        var markBtn = el('button', { class: 'btn btn-neon btn-sm', text: pl.markLabel });
        var wrap = el('div', {}, [
          el('p', { class: 'hint', style: 'text-align:left', html:
            '<b>' + ui.escapeHtml(pl.field) + ':</b> ' + ui.escapeHtml(pl.reason) }),
          el('div', { class: 'task-actions' }, [markBtn])
        ]);
        fixbox.appendChild(wrap);

        markBtn.addEventListener('click', function () {
          ctx.audio.play('click');
          fixbox.innerHTML = '';
          var box = el('div', {}, [el('p', { class: 'hint', style: 'text-align:left', text: pl.question })]);
          var acts = el('div', { class: 'task-actions' });
          pl.options.forEach(function (o) {
            acts.appendChild(el('button', {
              class: 'btn ' + (o.ok ? 'btn-neon' : 'btn-ghost') + ' btn-sm',
              text: '[' + o.id.toUpperCase() + '] ' + o.label,
              onclick: function () { choose(o, cell); }
            }));
          });
          box.appendChild(acts);
          fixbox.appendChild(box);
        });
      }

      function choose(o, cell) {
        if (!o.ok) {
          wrong++;
          ctx.audio.play('error');
          ui.toast('✗ ' + o.feedback, 'warn', 5000);
          return;
        }
        ctx.audio.play('success');
        cell.classList.remove('bad', 'bad-selected');
        cell.classList.add('fixed');
        cell.textContent = pl.resultValue;
        fixbox.innerHTML = '';
        fixbox.appendChild(el('p', { class: 'hint', style: 'text-align:left', text: '✓ ' + o.feedback }));
        countFix();
      }

      function digits(s) { return String(s).replace(/[^0-9]/g, ''); }
      function norm(s) { return String(s).toLowerCase().replace(/\s+/g, ' ').trim(); }
      function isCorrect(cat, rowDef, val) {
        if (rowDef.type === 'number') { return digits(val).length > 0 && digits(val) === digits(cat.trueValue); }
        var n = norm(val);
        if (n === norm(cat.trueValue)) return true;
        var syn = (d.synonyms && d.synonyms[rowDef.key]) || [];
        return syn.indexOf(n) !== -1;
      }

      function tryFix(rowDef, cat, cell, input) {
        if (solved || cell.classList.contains('fixed')) return;
        var val = input.value;
        if (!val.trim()) { ui.toast('Bitte einen Wert eintragen.', 'warn'); return; }
        if (!isCorrect(cat, rowDef, val)) {
          wrong++; ctx.audio.play('error');
          ui.toast('Das stimmt nicht mit dem Open-Data-Portal überein. Vergleiche genau.', 'warn', 3000);
          return;
        }
        cell.classList.remove('bad', 'bad-selected'); cell.classList.add('fixed');
        cell.textContent = cat.trueValue + (cat.unit ? ' ' + cat.unit : '');
        fixbox.innerHTML = '';
        ctx.audio.play('success');
        countFix();
      }

      /* Fortschritt nach jeder behobenen Zeile – Abgleich UND Plausibilitätsfall.
         Tipp-Abzüge rechnet der Level-Host zentral (screens.js), nicht hier. */
      function countFix() {
        fixedCount++;
        if (fixedCount === 1) ctx.markTask(2);
        ui.setBar(qFill, qPct, d.quality + qStep * fixedCount);
        if (fixedCount >= badTotal) {
          solved = true;
          ctx.markTask(3);
          /* 6 Teilaufgaben; Erstversuch-Bonus für jede, die ohne Fehleingabe saß.
             `wrong` zählt Fehleingaben und falsche URLs. */
          showBreak({ units: badTotal, firstTry: Math.max(0, badTotal - wrong), wrong: wrong });
        } else {
          ui.toast('Erledigt! Noch ' + (badTotal - fixedCount) + ' auffällige Einträge.', 'ok', 2000);
        }
      }

      /* ---- Real-Life Break (überspringbar) ---- */
      function showBreak(result) {
        ctx.audio.play('key');
        var secs = 600; // 10:00
        var timeEl = el('div', { class: 'l2-break-time', text: '10:00' });
        var tips = el('ul', { class: 'l2-break-tips' }, d.breakTips.map(function (t) { return el('li', { text: t }); }));
        var weiter = el('button', { class: 'btn btn-neon', text: 'Weiter →', onclick: function () { finish(); } });
        var overlay = el('div', { class: 'l2-break' }, [
          el('div', { class: 'l2-break-title', text: '✅ Daten abgeglichen · Real-Life Break' }),
          el('p', { class: 'l2-break-sub', text: 'Die Server laufen wieder stabil. Kurze Pause für den Kopf – du kannst jederzeit weiter.' }),
          timeEl, tips, weiter
        ]);
        container.appendChild(overlay);

        function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
        breakTimer = setInterval(function () {
          secs--; if (secs < 0) secs = 0;
          timeEl.textContent = fmt(secs);
          if (secs === 0) { clearInterval(breakTimer); breakTimer = null; }
        }, 1000);

        function finish() {
          if (breakTimer) { clearInterval(breakTimer); breakTimer = null; }
          if (overlay.parentNode) overlay.remove();
          ctx.complete(result);
        }
      }
    },

    unmount: function () {
      if (breakTimer) { clearInterval(breakTimer); breakTimer = null; }
    }
  });
})(window.NX);
