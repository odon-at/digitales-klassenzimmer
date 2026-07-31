/* =========================================================================
   Level 1 — Das Schatten-Archiv
   Mini-task: Miss den wahren Wert an den Neon-Brunnen der Bezirke, vergleiche
   ihn mit der Datentabelle und korrigiere die unmöglichen Temperatur-Werte.
   Teaches: was Open Data ist, Datenqualität, Werte prüfen & korrigieren.
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
    story: 'Tief im Schatten-Archiv liegen die ersten Datenfragmente. Der Nebel hat Datensätze ' +
           'beschädigt. Miss die wahren Werte an den Brunnen, finde die unmöglichen Einträge in der ' +
           'Tabelle und korrigiere sie – nur saubere Daten öffnen das Schloss.',
    tasks: ['Verständnis: Open Data', 'Datensatz prüfen', 'Falschen Wert korrigieren', 'Schlüssel finden'],
    quality: 80,
    maxScore: 100,
    info: {
      title: 'INFO · OPEN DATA & DATENQUALITÄT',
      html: '<p><b>Open Data</b> sind frei zugängliche Daten, die jede:r nutzen, teilen und ' +
            'weiterverwenden darf – oft veröffentlicht von Städten und Behörden.</p>' +
            '<p><b>Datenqualität</b> bedeutet: die Werte sind vollständig, korrekt und <b>plausibel</b>. ' +
            'Physikalisch unmögliche Messwerte (z.&nbsp;B. Temperaturen von 2000&nbsp;°C oder unter dem ' +
            'absoluten Nullpunkt) sind ein klares Zeichen für einen Fehler im Datensatz.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level1;
      var badTotal = d.rows.filter(function (r) { return r.bad; }).length;
      var fixed = {};                 // bezirk -> true, wenn korrigiert
      var measured = {};              // bezirk -> true, wenn Brunnen gemessen
      var wrong = 0, hints = 0, solved = false;

      ctx.setQuality(d.quality || 80);

      container.appendChild(el('p', { class: 'hint', style: 'text-align:left;margin:0 0 10px',
        text: 'Vergleiche die Daten in der Tabelle mit den Werten bei den Brunnen. Tippe die Brunnen an, ' +
              'um den wahren Wert zu sehen, und korrigiere die falschen Einträge in der Tabelle!' }));

      /* ---- Brunnen-Stationen ---- */
      var fountains = el('div', { class: 'fountains' });
      var valSpans = {};
      d.rows.forEach(function (row) {
        var val = el('div', { class: 'fountain-val', text: '– °C' });
        valSpans[row.bezirk] = val;
        var f = el('div', { class: 'fountain', title: row.theme, dataset: { bezirk: row.bezirk } }, [
          el('div', { class: 'fountain-ico', text: row.icon }),
          el('div', { class: 'fountain-name', text: row.bezirk }),
          el('div', { class: 'fountain-drop', text: '💧' }),
          val,
          el('div', { class: 'fountain-hint', text: 'messen' })
        ]);
        f.style.setProperty('--fc', row.fc);
        f.addEventListener('click', function () { measure(row, f, val); });
        fountains.appendChild(f);
      });
      container.appendChild(fountains);

      /* ---- Datentabelle ---- */
      var table = el('table', { class: 'data-table' });
      table.appendChild(el('thead', {}, [el('tr', {}, d.columns.map(function (c) { return el('th', { text: c }); }))]));
      var tbody = el('tbody');
      var tempCells = {};
      d.rows.forEach(function (row, ri) {
        var tr = el('tr');
        tr.appendChild(el('td', { text: row.id }));
        tr.appendChild(el('td', { text: row.bezirk }));
        tr.appendChild(el('td', { text: row.ph }));
        var tempTd = el('td', { class: 'cell', dataset: { row: String(ri) }, text: row.temp });
        tempCells[row.bezirk] = tempTd;
        tempTd.addEventListener('click', function () { onTempClick(row, tempTd); });
        tr.appendChild(tempTd);
        tr.appendChild(el('td', { text: row.status }));
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      container.appendChild(table);

      var fixbox = el('div', { style: 'margin-top:14px' });
      container.appendChild(fixbox);

      container.appendChild(el('div', { class: 'task-actions' }, [
        el('button', { class: 'btn btn-ghost btn-sm', text: '💡 Tipp', onclick: function () {
          hints++; ctx.audio.play('click');
          ui.toast('Tipp: Miss die Brunnen und suche in der Spalte „Temperatur“ nach unmöglichen Werten (z.B. 2000 °C).', 'warn', 3200);
        } })
      ]));

      /* ---- Messen am Brunnen ---- */
      function measure(row, fEl, valEl) {
        if (fEl.classList.contains('measured') || fEl.classList.contains('measuring')) return;
        ctx.audio.play('click');
        ctx.markTask(1);
        fEl.classList.add('measuring');
        valEl.textContent = 'messe …';
        setTimeout(function () {
          fEl.classList.remove('measuring');
          fEl.classList.add('measured');
          measured[row.bezirk] = true;
          valEl.textContent = row.trueTemp.toFixed(1) + ' °C';
          fEl.querySelector('.fountain-hint').textContent = 'wahrer Wert';
          ctx.audio.play('success');
        }, 850);
      }

      /* ---- Temperatur-Zelle anklicken ---- */
      function onTempClick(row, td) {
        if (solved || fixed[row.bezirk]) return;
        ctx.audio.play('click');
        if (!row.bad) {
          wrong++;
          ui.toast('Dieser Temperaturwert ist plausibel. Suche den unmöglichen Wert.', null, 1900);
          return;
        }
        if (!measured[row.bezirk]) {
          ui.toast('Miss zuerst den Brunnen in ' + row.bezirk + ' (oben antippen), um den wahren Wert zu sehen.', 'warn', 3000);
          return;
        }
        showFix(row, td);
      }

      function showFix(row, td) {
        ui.$$('.data-table td.bad-selected').forEach(function (n) { n.classList.remove('bad-selected'); });
        td.classList.add('bad-selected');
        fixbox.innerHTML = '';
        var input = el('input', { type: 'number', step: '0.1', placeholder: 'z.B. ' + row.trueTemp.toFixed(1), style: 'max-width:170px' });
        fixbox.appendChild(el('div', { class: 'field-row' }, [
          el('label', { text: 'Korrigierter Temperaturwert (°C):' }),
          input,
          el('button', { class: 'btn btn-neon btn-sm', text: 'Korrigieren', onclick: function () { tryFix(row, td, input); } })
        ]));
        fixbox.appendChild(el('p', { class: 'hint', style: 'text-align:left',
          text: 'Trage den am Brunnen ' + row.bezirk + ' gemessenen Wert ein.' }));
        input.focus();
      }

      function tryFix(row, td, input) {
        if (solved || fixed[row.bezirk]) return;
        var v = parseFloat(input.value);
        if (isNaN(v)) { ui.toast('Bitte gib eine Zahl ein.', 'warn'); return; }
        if (v < d.tempHardRange.min || v > d.tempHardRange.max) {
          wrong++; ctx.audio.play('error');
          ui.toast('Unmöglich – die Wasser-Temperatur liegt real etwa zwischen ' + d.tempHardRange.min + ' und ' + d.tempHardRange.max + ' °C.', 'warn', 3000);
          return;
        }
        if (Math.abs(v - row.trueTemp) > d.tolerance) {
          wrong++; ctx.audio.play('error');
          ui.toast('Das passt nicht zum gemessenen Wert am Brunnen ' + row.bezirk + '. Vergleiche nochmal.', 'warn', 3000);
          return;
        }
        // korrekt
        fixed[row.bezirk] = true;
        td.classList.remove('bad-selected'); td.classList.add('fixed');
        td.textContent = v.toFixed(1);
        fixbox.innerHTML = '';
        ctx.audio.play('success');
        var count = Object.keys(fixed).length;
        ctx.setQuality(count >= badTotal ? 100 : 90);
        if (count >= badTotal) {
          solved = true;
          ctx.markTask(2);
          var score = Math.max(40, 100 - wrong * 10 - hints * 15);
          ctx.complete(score);
        } else {
          ui.toast('Gut! Noch ' + (badTotal - count) + ' fehlerhafter Wert.', 'ok', 2200);
        }
      }
    }
  });
})(window.NX);
