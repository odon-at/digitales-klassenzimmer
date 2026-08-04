/* =========================================================================
   Level 4 — Das Prisma der Stadt
   Mini-task: turn the verified JSON data into a live chart (Chart.js),
   write a one-line data story, then "publish" the dashboard.
   Teaches: data visualisation, dashboard, data storytelling, release.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  var chart = null; // module-scoped so unmount() can destroy it

  NX.levelDefs.push({
    id: 4,
    num: 'LEVEL 4',
    title: 'Das Prisma der Stadt',
    subtitle: 'Licht aus der Dunkelheit',
    accent: 'green',
    story: 'Die Daten sind echt und zurück – doch rohe Zahlen retten keine Leben. Aktiviere das Prisma: ' +
           'mach aus den Zahlen ein leuchtendes Bild, erzähle ihre Geschichte und veröffentliche das ' +
           'Wissen für alle.',
    tasks: ['JSON-Daten visualisieren', 'Dashboard aufbauen', 'Data-Story schreiben', 'Wissen veröffentlichen'],
    quality: null,
    maxScore: 100,
    tips: [
      'Für den Vergleich mehrerer Bezirke eignet sich ein <b>Balkendiagramm</b> am besten – ' +
      'die Unterschiede sieht man dann auf einen Blick.',
      'Eine gute Daten-Story nennt den auffälligsten Wert und sagt, warum er wichtig ist. ' +
      'Schau dir an, welcher Balken am weitesten heraussticht.'
    ],
    info: {
      title: 'INFO · VISUALISIERUNG & STORYTELLING',
      html: '<p><b>Datenvisualisierung</b> macht Zahlen begreifbar – ein Diagramm sagt oft mehr als eine Tabelle.</p>' +
            '<p><b>Data-Storytelling</b> verbindet die Grafik mit einer klaren Aussage: Was ist die wichtigste ' +
            'Erkenntnis?</p><p>Am Ende wird das Ergebnis als <b>Open Data</b> veröffentlicht – für alle nutzbar.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level4;
      var solved = false, currentType = 'bar';

      var typeSel = el('select', {}, [
        el('option', { value: 'bar', text: 'Balkendiagramm' }),
        el('option', { value: 'line', text: 'Liniendiagramm' }),
        el('option', { value: 'pie', text: 'Tortendiagramm' })
      ]);
      typeSel.addEventListener('change', function () {
        currentType = typeSel.value; ctx.audio.play('click'); render(); ctx.markTask(1);
      });

      var storyInput = el('input', { type: 'text', maxlength: '120',
        placeholder: 'z.B. „Der Bezirk Industrie hat die höchste Belastung.“' });
      storyInput.addEventListener('input', function () {
        if (storyInput.value.trim().length >= 10) { ctx.markTask(2); publishBtn.disabled = false; }
        else publishBtn.disabled = true;
      });

      var chartBox = el('div', { class: 'chart-box' });
      var canvas = el('canvas', { id: 'l4-canvas' });
      chartBox.appendChild(canvas);

      var publishBtn = el('button', { class: 'btn btn-neon', text: '🌐 Veröffentlichen', disabled: 'disabled',
        onclick: publish });

      container.appendChild(el('p', { class: 'hint', style: 'text-align:left;margin:0 0 8px',
        text: d.titel + ' · Wähle eine Diagrammart und schreibe deine Daten-Story.' }));
      container.appendChild(el('div', { class: 'field-row' }, [el('label', { text: 'Diagrammart:' }), typeSel]));
      container.appendChild(chartBox);
      container.appendChild(el('div', { class: 'field-row' }, [el('label', { text: 'Daten-Story:' }), storyInput]));
      container.appendChild(el('div', { class: 'task-actions' }, [publishBtn]));

      render();
      ctx.markTask(0);

      function palette() {
        return ['#35e6ff', '#39ff88', '#ffd21f', '#b25cff', '#ff2fb0'];
      }

      function render() {
        if (typeof window.Chart !== 'function') {
          chartBox.innerHTML = '<p class="hint">Diagramm-Bibliothek konnte nicht geladen werden ' +
            '(Internetverbindung für CDN nötig).</p>';
          publishBtn.disabled = false; // don't hard-block the game offline
          return;
        }
        if (chart) { chart.destroy(); chart = null; }
        var isPie = currentType === 'pie';
        chart = new window.Chart(canvas.getContext('2d'), {
          type: currentType,
          data: {
            labels: d.labels,
            datasets: [{
              label: 'PM10 (µg/m³)',
              data: d.values,
              backgroundColor: isPie ? palette() : 'rgba(53,230,255,0.45)',
              borderColor: isPie ? '#0a1020' : '#35e6ff',
              borderWidth: 2,
              fill: currentType === 'line' ? false : true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: true,
            plugins: {
              legend: { labels: { color: '#d7e6ff', font: { family: 'Rajdhani' } } },
              title: { display: true, text: d.titel, color: '#39ff88', font: { family: 'Orbitron', size: 14 } }
            },
            scales: isPie ? {} : {
              x: { ticks: { color: '#7f93b5' }, grid: { color: 'rgba(120,220,255,0.08)' } },
              y: { ticks: { color: '#7f93b5' }, grid: { color: 'rgba(120,220,255,0.08)' }, beginAtZero: true }
            }
          }
        });
      }

      function publish() {
        if (solved) return;
        if (storyInput.value.trim().length < 10 && typeof window.Chart === 'function') {
          ui.toast('Schreibe zuerst eine kurze Daten-Story.', 'warn'); return;
        }
        solved = true;
        ctx.markTask(3);
        ctx.audio.play('success');
        ui.toast('Dashboard veröffentlicht – das Wissen ist frei! 🌐', 'ok');
        ctx.complete(100);
      }
    },

    unmount: function () { if (chart) { chart.destroy(); chart = null; } }
  });
})(window.NX);
