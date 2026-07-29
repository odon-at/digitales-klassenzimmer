/* =========================================================================
   Level 1 — Das Schatten-Archiv
   Mini-task: find the impossible value in an Open-Data table and correct it.
   Teaches: what Open Data is, data correction, finding the key.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  NX.levelDefs.push({
    id: 1,
    num: 'LEVEL 1',
    title: 'Das Schatten-Archiv',
    subtitle: 'Das Datenbank-Archiv',
    accent: 'green',
    story: 'Tief im Schatten-Archiv liegen die ersten Daten-Fragmente. Doch der Nebel hat einen Datensatz ' +
           'beschädigt. Prüfe den offenen Datensatz, finde den unmöglichen Wert und korrigiere ihn – ' +
           'nur saubere Daten öffnen das Schloss.',
    tasks: ['Verständnis: Open Data', 'Datensatz prüfen', 'Falschen Wert korrigieren', 'Schlüssel finden'],
    quality: 80,
    maxScore: 100,
    info: {
      title: 'INFO · OPEN DATA',
      html: '<p><b>Open Data</b> sind frei zugängliche Daten, die jede:r nutzen, teilen und ' +
            'weiterverwenden darf – oft veröffentlicht von Städten und Behörden.</p>' +
            '<p>Damit man ihnen vertrauen kann, müssen die Werte <b>plausibel</b> und ' +
            '<b>korrekt</b> sein. Ein <b>pH-Wert</b> liegt z.&nbsp;B. immer zwischen 0 und 14.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level1;
      var wrongClicks = 0, hintsUsed = 0, solved = false;

      ctx.setQuality(d.quality || 80);

      var info = el('p', { class: 'hint', style: 'text-align:left;margin:0 0 10px',
        text: 'Datensatz „Trinkbrunnen der Stadt Nexus“ · Klicke einen Wert an, um ihn zu prüfen.' });

      var table = el('table', { class: 'data-table' });
      var thead = el('tr', {}, d.columns.map(function (c) { return el('th', { text: c }); }));
      table.appendChild(el('thead', {}, [thead]));
      var tbody = el('tbody');

      d.rows.forEach(function (row, ri) {
        var tr = el('tr');
        tr.appendChild(el('td', { text: row.id }));
        tr.appendChild(el('td', { text: row.bezirk }));
        [['ph', row.ph], ['temp', row.temp], ['status', row.status]].forEach(function (pair) {
          var field = pair[0];
          var td = el('td', { class: 'cell', dataset: { row: String(ri), field: field }, text: pair[1] });
          td.addEventListener('click', function () { onCellClick(ri, field, td); });
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      var fixbox = el('div', { style: 'margin-top:14px' });
      var actions = el('div', { class: 'task-actions' }, [
        el('button', { class: 'btn btn-ghost btn-sm', text: '💡 Tipp',
          onclick: function () {
            hintsUsed++; ctx.audio.play('click');
            ui.toast('Tipp: Ein pH-Wert kann niemals über 14 liegen …', 'warn');
          } })
      ]);

      container.appendChild(info);
      container.appendChild(table);
      container.appendChild(fixbox);
      container.appendChild(actions);

      ctx.markTask(1);

      function onCellClick(ri, field, td) {
        if (solved) return;
        ctx.audio.play('click');
        if (ri === d.badCell.rowIndex && field === d.badCell.field) {
          // correct cell identified -> show correction UI
          ui.$$('.data-table td.bad-selected').forEach(function (n) { n.classList.remove('bad-selected'); });
          td.classList.add('bad-selected');
          showFixUI(td);
        } else {
          wrongClicks++;
          ui.toast('Dieser Wert sieht plausibel aus. Suche weiter.', null, 1800);
        }
      }

      function showFixUI(td) {
        fixbox.innerHTML = '';
        var input = el('input', { type: 'number', step: '0.1', placeholder: 'z.B. 7.2', style: 'max-width:160px' });
        var row = el('div', { class: 'field-row' }, [
          el('label', { text: 'Korrigierter pH-Wert:' }),
          input,
          el('button', { class: 'btn btn-neon btn-sm', text: 'Korrigieren',
            onclick: function () { tryFix(td, input); } })
        ]);
        var help = el('p', { class: 'hint', style: 'text-align:left',
          text: 'Gültiger pH-Bereich: 0–14 · plausibel für Trinkwasser: ' + d.validPh.min + '–' + d.validPh.max });
        fixbox.appendChild(row); fixbox.appendChild(help);
        input.focus();
      }

      function tryFix(td, input) {
        if (solved) return;
        var v = parseFloat(input.value);
        if (isNaN(v)) { ui.toast('Bitte gib eine Zahl ein.', 'warn'); return; }
        if (v < d.phHardRange.min || v > d.phHardRange.max) {
          wrongClicks++; ctx.audio.play('error');
          ui.toast('Unmöglich – ein pH-Wert liegt immer zwischen 0 und 14.', 'warn'); return;
        }
        if (v < d.validPh.min || v > d.validPh.max) {
          ctx.audio.play('error');
          ui.toast('Technisch möglich, aber für Trinkwasser unplausibel. Ziel: ' + d.validPh.min + '–' + d.validPh.max, 'warn');
          return;
        }
        // success
        solved = true;
        td.classList.remove('bad-selected'); td.classList.add('fixed');
        td.textContent = v.toFixed(1);
        ctx.setQuality(100);
        ctx.markTask(2);
        fixbox.innerHTML = '';
        var score = Math.max(40, 100 - wrongClicks * 10 - hintsUsed * 15);
        ctx.complete(score);
      }
    }
  });
})(window.NX);
