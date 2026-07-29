/* =========================================================================
   Level 3 — Das Labyrinth der Lügen
   Mini-task: among 4 dataset cards, pick the one trustworthy dataset by
   checking source, license, metadata and plausibility.
   Teaches: source check (fake servers), license (CC-BY), metadata, plausibility.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  NX.levelDefs.push({
    id: 3,
    num: 'LEVEL 3',
    title: 'Das Labyrinth der Lügen',
    subtitle: 'Daten prüfen & hinterfragen',
    accent: 'yellow',
    story: 'Der Hacker flutet das Netz mit Lügen: das Wasser sei vergiftet, die Brücken unsicher. ' +
           'Vier Datensätze behaupten die Wahrheit – doch nur einer trägt das Siegel der Wahrheit. ' +
           'Prüfe Quelle, Lizenz, Metadaten und Plausibilität und wähle den echten Datensatz.',
    tasks: ['Quellen-Check (Fake-Server)', 'Lizenz-Prüfung (CC-BY)', 'Metadaten-Analyse', 'Plausibilitätstest'],
    quality: null,
    maxScore: 100,
    info: {
      title: 'INFO · VERTRAUENSWÜRDIGE DATEN',
      html: '<p>Verlässliche offene Daten erkennst du an vier Merkmalen:</p><ul>' +
            '<li><b>Quelle</b>: eine offizielle Stelle (z.&nbsp;B. <code>daten.nexus.gv.at</code>), kein dubioser Server.</li>' +
            '<li><b>Lizenz</b>: eine offene Lizenz wie <b>CC-BY</b> erlaubt die Nutzung mit Namensnennung.</li>' +
            '<li><b>Metadaten</b>: Angaben wie das Aktualisierungsdatum sind vorhanden.</li>' +
            '<li><b>Plausibilität</b>: die Werte sind realistisch (keine unmöglichen Zahlen).</li></ul>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level3;
      var selected = null, wrong = 0, solved = false;

      var intro = el('p', { class: 'hint', style: 'text-align:left;margin:0 0 8px',
        text: 'Wähle den vertrauenswürdigen Datensatz und bestätige ihn als echt.' });

      var grid = el('div', { class: 'choice-grid' });
      d.cards.forEach(function (card) {
        var meta = el('div', { class: 'meta', html:
          'Quelle: ' + checkMark(card.quelleOk) + ' ' + ui.escapeHtml(card.quelle) + '<br>' +
          'Lizenz: ' + checkMark(card.lizenzOk) + ' ' + ui.escapeHtml(card.lizenz) + '<br>' +
          'Aktualisiert: ' + checkMark(card.metaOk) + ' ' + ui.escapeHtml(card.aktualisiert) + '<br>' +
          'Wert: ' + checkMark(card.wertOk) + ' ' + ui.escapeHtml(card.wert) });
        var el_card = el('div', { class: 'choice-card', dataset: { id: card.id } }, [
          el('h4', { text: 'Datensatz ' + card.id + ' · ' + card.titel }),
          meta
        ]);
        el_card.addEventListener('click', function () {
          if (solved) return;
          ctx.audio.play('click');
          selected = card;
          ui.$$('.choice-card', grid).forEach(function (n) { n.classList.remove('selected'); });
          el_card.classList.add('selected');
          confirmBtn.disabled = false;
        });
        grid.appendChild(el_card);
      });

      var confirmBtn = el('button', { class: 'btn btn-neon', text: 'Als echt bestätigen ✓', disabled: 'disabled',
        onclick: confirm });
      var actions = el('div', { class: 'task-actions' }, [confirmBtn]);

      container.appendChild(intro);
      container.appendChild(grid);
      container.appendChild(actions);

      function checkMark(ok) {
        return ok ? '<span class="chk">✔</span>' : '<span class="xmk">✘</span>';
      }

      function confirm() {
        if (solved || !selected) return;
        if (selected.trust) {
          solved = true;
          ctx.audio.play('success');
          ['0', '1', '2', '3'].forEach(function (i) { ctx.markTask(parseInt(i, 10)); });
          var score = Math.max(40, 100 - wrong * 20);
          ctx.complete(score);
        } else {
          wrong++;
          ctx.audio.play('error');
          ui.showModal('LÜGE ENTLARVT', '<p>Datensatz <b>' + selected.id + '</b> ist <b>nicht</b> vertrauenswürdig:</p>' +
            '<p style="color:#ff9ecf">' + ui.escapeHtml(selected.grund) + '</p>' +
            '<p>Prüfe die anderen Datensätze weiter.</p>');
        }
      }
    }
  });
})(window.NX);
