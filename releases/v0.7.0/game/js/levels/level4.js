/* =========================================================================
   Level 4 — Die Daten-Metropole
   Phase 1 · Bürger-Dashboard: drei Datensätze werden aufbereitet. Je Aufgabe
   erst den richtigen Diagrammtyp WÄHLEN (bewertet), dann den Daten-Chip per
   Drag & Drop (oder Klick-Fallback) ins freigeschaltete Zielfeld ziehen
   (Aktivierung, nicht bewertet) → Chart.js baut das Diagramm auf.
   Phase 2 · Die lebendige Cyber-Stadt: ein 360°-Panorama (reines CSS/SVG,
   Streifen-Technik) mit 10 Hotspots. Jedes Objekt wird einzeln bewertet:
   [🟢 FREIGEBEN] oder [🔴 SPERREN] – alle 10 werden erklärt, auch die
   privaten. Alle 10 richtig → Open-Data-Hero-Award, dann ctx.complete().
   Teaches: Diagrammtypen, Data-Storytelling, Open Data vs. DSGVO.
   ========================================================================= */
window.NX = window.NX || {};
NX.levelDefs = NX.levelDefs || [];
(function (NX) {
  'use strict';

  // Aufräum-Infrastruktur (Muster aus level3.js): unmount() killt alles.
  var lb = { timers: [], alive: false, raf: null, keyDown: null, keyUp: null,
             onResize: null, pointerId: null, captureEl: null, charts: [], root: null };
  function later(fn, ms) {
    var id = setTimeout(function () { if (lb.alive) fn(); }, ms);
    lb.timers.push(id);
    return id;
  }
  function reduceMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  var PX_PER_DEG = 10;
  var TW_CITY = PX_PER_DEG * 360;                 // 3600
  var TW_SKY  = Math.round(TW_CITY * 0.25);       // 900
  var TW_FAR  = Math.round(TW_CITY * 0.5);        // 1800
  var TW_FORE = Math.round(TW_CITY * 1.6);        // 5760

  function norm(a) { return ((a % 360) + 360) % 360; }
  function shortestDelta(from, to) { return norm(to - from + 180) - 180; }

  /* Isometrisch angehauchte Stadt-Kulisse (ein voller 360°-Umlauf), reines
     Inline-SVG. Fenster/Rankgitter als kleine Rechtecke gestaffelter Opazität
     (Muster aus der Level-1-Stadtkarte) statt Pattern-Fills – einfacher zu
     warten und ausreichend für dieses Motiv. */
  function cityArtMarkup() {
    var s = [];
    s.push('<svg viewBox="0 0 2400 400" preserveAspectRatio="none" aria-hidden="true">');
    var towers = [
      [40, 120, 60], [140, 210, 44], [230, 90, 70], [330, 160, 52], [430, 260, 40],
      [520, 110, 66], [610, 200, 48], [700, 90, 74], [800, 240, 42], [890, 150, 60],
      [980, 100, 68], [1080, 220, 46], [1170, 90, 72], [1270, 180, 50], [1360, 260, 40],
      [1450, 120, 64], [1540, 210, 46], [1630, 90, 70], [1730, 160, 52], [1820, 250, 40],
      [1910, 110, 66], [2000, 200, 48], [2090, 90, 74], [2180, 240, 42], [2280, 150, 58]
    ];
    towers.forEach(function (t, n) {
      var x = t[0], h = t[1], w = t[2];
      s.push('<polygon class="city-twr-top" points="' + (x + w / 2) + ',' + (400 - h - w / 4) +
        ' ' + (x + w) + ',' + (400 - h) + ' ' + (x + w / 2) + ',' + (400 - h + w / 4) +
        ' ' + x + ',' + (400 - h) + '"/>');
      s.push('<rect class="city-twr-l" x="' + x + '" y="' + (400 - h) + '" width="' + (w / 2) + '" height="' + h + '"/>');
      s.push('<rect class="city-twr-r" x="' + (x + w / 2) + '" y="' + (400 - h) + '" width="' + (w / 2) + '" height="' + h + '"/>');
      // Fenster
      for (var k = 0; k < 4; k++) {
        s.push('<rect class="city-win" x="' + (x + 4) + '" y="' + (400 - h + 8 + k * 13) +
          '" width="4" height="6" opacity="' + (0.3 + ((n + k) % 3) * 0.22).toFixed(2) + '"/>');
        s.push('<rect class="city-win" x="' + (x + w - 8) + '" y="' + (400 - h + 12 + k * 13) +
          '" width="4" height="6" opacity="' + (0.25 + ((n + k) % 4) * 0.18).toFixed(2) + '"/>');
      }
      // vertikaler Garten (Rankgitter) auf jedem dritten Turm
      if (n % 3 === 0) {
        for (var v = 0; v < 5; v++) {
          s.push('<rect class="city-vine" x="' + (x + w / 2 - 2) + '" y="' + (400 - h + 6 + v * 16) + '" width="4" height="9" opacity=".8"/>');
        }
      }
    });
    // Bäume und Blumenbeete am Boden
    for (var i = 60; i < 2400; i += 150) {
      s.push('<circle class="city-tree-c" cx="' + i + '" cy="378" r="16"/>');
      s.push('<circle class="city-tree-c2" cx="' + (i - 5) + '" cy="372" r="10"/>');
      s.push('<rect class="city-tree-trunk" x="' + (i - 2) + '" y="386" width="4" height="12"/>');
    }
    for (var j = 110; j < 2400; j += 150) {
      s.push('<circle class="city-flower-a" cx="' + j + '" cy="394" r="3"/>');
      s.push('<circle class="city-flower-b" cx="' + (j + 8) + '" cy="392" r="3"/>');
      s.push('<circle class="city-flower-c" cx="' + (j + 16) + '" cy="395" r="3"/>');
    }
    s.push('</svg>');
    return s.join('');
  }

  NX.levelDefs.push({
    id: 4,
    num: 'LEVEL 4',
    title: 'Die Daten-Metropole',
    subtitle: 'Das Bürger-Portal & die lebendige Cyber-Stadt',
    accent: 'blue',
    story: 'Die Daten sind wahr, die Boten sind zurückgekehrt – doch rohe Zahlen retten keine Leben. ' +
           'Baue das Bürger-Dashboard: Wähle für jeden Datensatz das passende Diagramm und ziehe ihn ins ' +
           'Portal. Danach öffnet sich die Stadt selbst: Dreh dich um 360° und entscheide, welche Daten ' +
           'offen bleiben dürfen – und welche die DSGVO schützt.',
    tasks: ['Datenkompetenz', 'Wahl des richtigen Diagrammtyps', 'Interaktive Anwendung',
            'Medienkompetenz', 'Eigenverantwortung'],
    quality: 0,
    maxScore: 100,
    minScore: 40,
    tips: [
      'Frage dich zuerst: Zeigen die Daten einen <b>Verlauf über die Zeit</b>, einen ' +
      '<b>Vergleich getrennter Kategorien</b> oder <b>Anteile an einem Ganzen</b>? ' +
      'Die Antwort nennt dir den Diagrammtyp.',
      'In der 360°-Stadt gilt eine einzige Frage: Kann man aus diesen Daten eine ' +
      '<b>einzelne Person</b> erkennen? Wenn ja → sperren. Wenn nur Summen und ' +
      'Mittelwerte sichtbar sind → freigeben.'
    ],
    info: {
      title: 'INFO · DIAGRAMME & OPEN DATA VS. DSGVO',
      html: '<p><b>Liniendiagramm:</b> zeitliche Verläufe · <b>Säulendiagramm:</b> Mengenvergleich ' +
            'getrennter Kategorien · <b>Kreisdiagramm:</b> Anteile an einem geschlossenen Ganzen (100 %).</p>' +
            '<p><b>Open Data</b> darf offen sein, wenn keine einzelne Person erkennbar ist. ' +
            '<b>DSGVO-geschützte Daten</b> (Name, Kontostand, Gesundheit, Zugangscodes …) müssen ' +
            'gesperrt bleiben.</p>'
    },

    mount: function (container, ctx) {
      var ui = ctx.ui, el = ui.el, d = ctx.data.level4, sc = d.scoring;
      lb = { timers: [], alive: true, raf: null, keyDown: null, keyUp: null,
             onResize: null, pointerId: null, captureEl: null, charts: [], root: null };

      var avatar = ctx.data.avatars.filter(function (a) { return a.id === ctx.state.avatarId; })[0] ||
                   ctx.data.avatars[0];

      /* ---------------- Phase-1-Zustand ---------------- */
      var chartIdx = 0;
      var correctTypeCount = 0;
      var builtCount = 0;
      var wrongType = 0;

      /* ---------------- Phase-2-Zustand ---------------- */
      var wrongDecision = 0, decided = 0, openDecided = 0;
      var awardGranted = false;

      var hudTask = el('span', {});
      var hudScore = el('span', { class: 'l4-score' });
      var live = el('div', { class: 'l4-live', 'aria-live': 'polite' });
      var hud = el('div', { class: 'l4-hud' }, [hudTask, hudScore, live]);
      var body = el('div', { class: 'l4-body' });
      var root = el('div', { class: 'l4-root' }, [hud, body]);
      container.appendChild(root);
      lb.root = root;

      function announce(msg) { live.textContent = msg; }
      function scoreNow() {
        return Math.max(sc.floor, 100 - wrongType * sc.wrongType - wrongDecision * sc.wrongDecision);
      }
      function updateHud(taskLabel) {
        hudTask.innerHTML = '';
        if (taskLabel) hudTask.appendChild(el('b', { text: taskLabel }));
        hudScore.textContent = 'Punktestand: ' + scoreNow();
      }
      function updateQuality() {
        ctx.setQuality(Math.round(builtCount / 3 * 40 + decided / 10 * 60));
      }

      askChart(0);

      /* ================= Phase 1: Bürger-Dashboard ================= */
      function askChart(i) {
        chartIdx = i;
        body.innerHTML = '';
        var c = d.charts[i];
        updateHud('Aufgabe ' + (i + 1) + ' / 3 · ' + c.titel);
        announce('Aufgabe ' + (i + 1) + ' von 3: ' + c.titel + '. ' + c.merkmal);

        var picked = false;      // Chip per Klick aufgenommen?
        var dragJustHappened = false;
        var armedSlot = null;
        var slotEls = [];
        var typeBtns = [];

        var task = el('div', { class: 'l4-task' });
        task.appendChild(el('div', { class: 'l4-task-head' }, [
          el('div', { class: 'l4-task-title', text: c.titel }),
          el('div', { class: 'l4-task-quelle', text: c.quelle })
        ]));
        task.appendChild(el('div', { class: 'l4-task-merkmal', text: c.merkmal }));

        var typesRow = el('div', { class: 'l4-types' });
        d.typen.forEach(function (t) {
          var b = el('button', { type: 'button', class: 'l4-type', 'aria-keyshortcuts': t.key }, [
            el('span', { class: 'l4-type-ico', text: t.icon }),
            el('span', { text: t.label }),
            el('span', { class: 'l4-type-key', text: 'Taste ' + t.key })
          ]);
          b.addEventListener('click', function () { onTypePick(t, b); });
          typeBtns.push(b);
          typesRow.appendChild(b);
        });
        task.appendChild(typesRow);

        var chip = el('button', { type: 'button', class: 'l4-chip', text: c.chip,
          draggable: 'false', disabled: 'disabled' });
        var chipHint = el('span', { class: 'l4-chip-hint', text: 'Erst den Diagrammtyp wählen …' });
        task.appendChild(el('div', { class: 'l4-chipbar' }, [chip, chipHint]));

        var slotsRow = el('div', { class: 'l4-slots' });
        d.typen.forEach(function (t) {
          var s = el('button', { type: 'button', class: 'l4-slot is-locked',
            'aria-label': t.label + ' – noch nicht freigeschaltet' }, [
            el('span', { class: 'l4-slot-ico', text: t.icon }),
            el('span', { text: t.label })
          ]);
          s.dataset.type = t.id;
          slotEls.push(s);
          slotsRow.appendChild(s);
        });
        task.appendChild(slotsRow);

        body.appendChild(task);
        try { typeBtns[0].focus({ preventScroll: true }); } catch (e) { /* ältere Browser */ }

        /* ---- Schritt 1: Verständnis-Check (bewertet) ---- */
        function onTypePick(t, btn) {
          if (armedSlot) return; // bereits richtig gewählt
          if (t.id === c.typ) {
            ctx.audio.play('success');
            btn.classList.add('is-correct');
            typeBtns.forEach(function (b) { if (b !== btn) b.disabled = true; });
            correctTypeCount++;
            if (correctTypeCount === 1) ctx.markTask(0);
            if (correctTypeCount === 3) ctx.markTask(1);
            armSlot(t.id);
            chip.disabled = false;
            chipHint.textContent = 'Ziehe den Chip ins leuchtende Feld – oder klicke ihn an.';
            announce('Richtig: ' + t.label + '. Jetzt den Chip ins Zielfeld ziehen.');
          } else {
            wrongType++;
            ctx.audio.play('error');
            glitch(btn);
            ui.toast('✗ ' + t.hint, 'warn', 4200);
            announce(t.hint);
            updateHud('Aufgabe ' + (chartIdx + 1) + ' / 3 · ' + c.titel);
          }
        }

        function armSlot(typeId) {
          slotEls.forEach(function (s) {
            var match = s.dataset.type === typeId;
            s.classList.toggle('is-locked', !match);
            s.classList.toggle('is-armed', match);
            s.setAttribute('aria-label',
              (match ? d.typen.filter(function (t) { return t.id === typeId; })[0].label + ' – Zielfeld aktiv'
                     : s.querySelector('span:last-child').textContent + ' – gesperrt'));
            if (match) armedSlot = s;
          });
        }

        /* ---- Schritt 2: Aktivierung per Drag & Drop / Klick (nicht bewertet) ---- */
        function attemptDrop(slot) {
          if (!armedSlot) { return; }
          if (slot === armedSlot) {
            ctx.audio.play('key');
            buildChart(c, slot);
          } else {
            ctx.audio.play('error');
            glitch(slot);
            glitch(chip);
            ui.toast('✗ ' + d.slotHint, 'warn', 3000);
            announce(d.slotHint);
          }
        }

        function glitch(node) {
          node.classList.remove('is-reject');
          void node.offsetWidth; // Reflow erzwingen -> Animation startet neu
          node.classList.add('is-reject');
          later(function () { node.classList.remove('is-reject'); }, 460);
        }

        // Klick-Fallback: Chip anklicken = aufnehmen, Zielfeld anklicken = ablegen
        chip.addEventListener('click', function () {
          if (dragJustHappened) { dragJustHappened = false; return; }
          if (chip.disabled) return;
          picked = !picked;
          chip.classList.toggle('is-picked', picked);
          announce(picked ? 'Datenpaket aufgenommen. Wähle jetzt ein Zielfeld.' : 'Aufnahme abgebrochen.');
        });
        slotEls.forEach(function (s) {
          s.addEventListener('click', function () {
            if (!picked || s.classList.contains('is-built')) return;
            picked = false;
            chip.classList.remove('is-picked');
            attemptDrop(s);
          });
        });

        wireDrag(chip, slotEls, task, attemptDrop, function () { dragJustHappened = true; });

        function buildChart(cfg, slot) {
          chip.remove();
          slotEls.forEach(function (s) { if (s !== slot) s.remove(); });
          slot.className = 'l4-slot is-built';
          slot.innerHTML = '';
          slot.disabled = true;
          var canvas = el('canvas', { id: 'l4-cv-' + chartIdx });
          var chartBox = el('div', { class: 'chart-box' }, [canvas]);
          slot.appendChild(chartBox);
          renderChart(cfg, canvas, chartBox);

          builtCount++;
          if (builtCount === 3) ctx.markTask(2);
          updateQuality();
          updateHud('Aufgabe ' + (chartIdx + 1) + ' / 3 · ' + cfg.titel);

          var ki = el('div', { class: 'l4-ki' }, [
            el('span', { class: 'l4-ki-ico', text: d.ki.icon }),
            el('div', {}, [
              el('div', { class: 'l4-ki-name', text: d.ki.name }),
              el('div', { text: cfg.erfolg + ' ' + cfg.lehrsatz })
            ])
          ]);
          task.appendChild(ki);
          announce(cfg.erfolg);

          var nextBtn;
          if (chartIdx < 2) {
            nextBtn = el('button', { class: 'btn btn-neon', text: 'Weiter ›',
              onclick: function () { ctx.audio.play('click'); askChart(chartIdx + 1); } });
          } else {
            nextBtn = el('button', { class: 'btn btn-neon', text: d.city.intro.cta,
              onclick: function () { ctx.audio.play('click'); enterCity(); } });
          }
          task.appendChild(el('div', { class: 'l4-gate task-actions' }, [nextBtn]));
          try { nextBtn.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
        }
      }

      /* ---------------- Pointer-Drag (Maus + Touch) ---------------- */
      function wireDrag(chip, slots, stage, onDrop, onDragHappened) {
        var drag = { active: false, pointerId: null, sx: 0, sy: 0, moved: false, rects: [], hoverEl: null };

        chip.addEventListener('pointerdown', function (e) {
          if (chip.disabled) return;
          if (!e.isPrimary) return;
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          try { chip.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          lb.captureEl = chip; lb.pointerId = e.pointerId;
          drag.pointerId = e.pointerId; drag.sx = e.clientX; drag.sy = e.clientY; drag.moved = false;
          drag.rects = slots.map(function (s) { return s.getBoundingClientRect(); });
        });
        chip.addEventListener('pointermove', function (e) {
          if (drag.pointerId !== e.pointerId) return;
          var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
          if (!drag.moved) {
            if (dx * dx + dy * dy < 36) return; // 6px Schwelle -> ein Tippen bleibt ein Klick
            drag.moved = true; drag.active = true;
            chip.classList.remove('is-snap'); chip.classList.add('is-dragging');
          }
          chip.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
          var hover = hitTest(e.clientX, e.clientY);
          if (hover !== drag.hoverEl) {
            slots.forEach(function (s) { s.classList.remove('is-hover'); });
            if (hover) hover.classList.add('is-hover');
            drag.hoverEl = hover;
          }
        });
        function hitTest(x, y) {
          for (var i = 0; i < slots.length; i++) {
            var r = drag.rects[i];
            if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return slots[i];
          }
          return null;
        }
        function endDrag(e) {
          if (drag.pointerId === null) return;
          try { chip.releasePointerCapture(drag.pointerId); } catch (err) { /* ignore */ }
          lb.captureEl = null; lb.pointerId = null;
          var wasDrag = drag.moved;
          var target = wasDrag && e ? hitTest(e.clientX, e.clientY) : null;
          slots.forEach(function (s) { s.classList.remove('is-hover'); });
          chip.classList.remove('is-dragging');
          if (chip.parentNode) { chip.classList.add('is-snap'); chip.style.transform = ''; }
          drag.pointerId = null; drag.active = false; drag.hoverEl = null;
          if (wasDrag) {
            onDragHappened();
            if (target) onDrop(target);
          }
          drag.moved = false;
        }
        chip.addEventListener('pointerup', endDrag);
        chip.addEventListener('pointercancel', function () { endDrag(null); });
        chip.addEventListener('lostpointercapture', function () { if (drag.pointerId !== null) endDrag(null); });
      }

      /* ---------------- Chart.js (mit CSS-Offline-Fallback) ---------------- */
      var FONT_HEAD = 'Orbitron', FONT_BODY = 'Rajdhani';
      var ACC = '#00BFFF', INK = '#d7e6ff', DIM = '#7f93b5', SURF = '#0a1020';
      function pieColors() { return ['#1E8FD5', '#7357E0', '#0E9C84', '#B07E28', '#D64F86']; }

      function renderChart(cfg, canvas, box) {
        if (typeof window.Chart !== 'function') { renderFallback(cfg, box); return; }
        var isPie = cfg.typ === 'pie';
        var max = Math.max.apply(null, cfg.values);
        var chart = new window.Chart(canvas.getContext('2d'), {
          type: cfg.typ,
          data: { labels: cfg.labels, datasets: [buildDataset(cfg, isPie, max)] },
          options: baseOptions(cfg, isPie)
        });
        lb.charts.push(chart);
      }

      function buildDataset(cfg, isPie, max) {
        if (isPie) {
          return { data: cfg.values, backgroundColor: pieColors(), borderColor: SURF, borderWidth: 2, hoverOffset: 6 };
        }
        if (cfg.typ === 'bar') {
          return {
            label: cfg.einheit, data: cfg.values,
            backgroundColor: cfg.values.map(function (v) { return v === max ? 'rgba(255,107,107,.55)' : 'rgba(0,191,255,.42)'; }),
            borderColor: cfg.values.map(function (v) { return v === max ? '#FF6B6B' : ACC; }),
            borderWidth: 2, borderRadius: 4, categoryPercentage: .68, barPercentage: .9, maxBarThickness: 54
          };
        }
        return {
          label: cfg.einheit, data: cfg.values, borderColor: ACC, borderWidth: 2, tension: .35,
          fill: true, backgroundColor: 'rgba(0,191,255,.14)', pointRadius: 0, pointHoverRadius: 5,
          pointBackgroundColor: ACC, pointBorderColor: SURF, pointBorderWidth: 2
        };
      }

      function baseOptions(cfg, isPie) {
        return {
          responsive: true, maintainAspectRatio: true, aspectRatio: isPie ? 1.35 : 1.9,
          animation: reduceMotion() ? false : { duration: 800, easing: 'easeOutQuart' },
          plugins: {
            legend: isPie
              ? { position: 'bottom', labels: { color: INK, boxWidth: 10, boxHeight: 10, font: { family: FONT_BODY, size: 12 } } }
              : { display: false },
            title: { display: true, text: cfg.titel, color: ACC, padding: { bottom: 10 }, font: { family: FONT_HEAD, size: 13, weight: '700' } },
            tooltip: {
              backgroundColor: 'rgba(6,10,22,.96)', borderColor: ACC, borderWidth: 1, titleColor: ACC, bodyColor: INK,
              titleFont: { family: FONT_HEAD, size: 12 }, bodyFont: { family: FONT_BODY, size: 13 },
              callbacks: { label: function (c) { return ' ' + c.formattedValue + ' ' + cfg.einheit; } }
            }
          },
          scales: isPie ? {} : {
            x: { ticks: { color: DIM, maxRotation: 0, autoSkip: true, maxTicksLimit: 8, font: { family: FONT_BODY, size: 11 } }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { color: DIM, font: { family: FONT_BODY, size: 11 } }, grid: { color: 'rgba(0,191,255,.08)' } }
          }
        };
      }

      function renderFallback(cfg, box) {
        box.innerHTML = '';
        var max = Math.max.apply(null, cfg.values);
        var bars = el('div', { class: 'l4-fallback' }, cfg.values.map(function (v) {
          return el('i', { style: 'height:' + Math.max(3, Math.round(v / max * 100)) + '%', title: v + ' ' + cfg.einheit });
        }));
        box.appendChild(bars);
        box.appendChild(el('div', { class: 'l4-fallback-note',
          text: 'Diagramm-Bibliothek offline — Ersatzansicht aus reinem CSS: ' + cfg.titel }));
      }

      /* ================= Phase 2: Die lebendige Cyber-Stadt ================= */
      function enterCity() {
        body.innerHTML = '';
        updateHud('360°-Stadt · Open Data oder DSGVO?');
        announce('360°-Stadt. Pfeiltasten drehen die Kamera, Tabulator springt von Hotspot zu Hotspot. ' +
          '10 Szenarien zu prüfen.');

        var h = 0;                 // aktuelle Blickrichtung in Grad
        var keyDir = 0;            // -1 / 0 / 1 (Pfeiltasten halten)
        var vel = 0;               // Schwung nach dem Loslassen
        var turnTarget = null;     // aktives ‹›-Ziel (Tween)
        var spinLocked = false;    // Panel offen -> keine Drehung
        var pointerActive = false, pStartX = 0, pStartH = 0, pLastX = 0, pLastT = 0;
        var nearestIdx = -1;
        var lastFocused = null;

        var spots = d.city.spots;
        var TOTAL = spots.length;

        /* Kachelanzahl je Ebene: der Offset liegt immer in (-TW, 0], deshalb decken
           n Kacheln [x, x + n*TW) ab. Damit die Bühne lückenlos gefüllt bleibt, muss
           (n-1)*TW >= Bühnenbreite gelten. Die Level-Bühne ist durch
           `.level-frame { width: min(980px, 100%) }` gedeckelt – MAXW gibt reichlich
           Reserve, ohne dass eine Resize-Logik nötig wird. */
        var MAXW = 1600;
        function tileCount(TW) { return Math.max(2, Math.ceil(MAXW / TW) + 1); }

        function buildLayer(cls, TW, makeTile) {
          var n = tileCount(TW), tiles = [], i;
          for (i = 0; i < n; i++) tiles.push(makeTile(i));
          var node = el('div', { class: 'city-layer ' + cls }, tiles.map(function (t) { return t.tile || t; }));
          return { node: node, tiles: tiles, TW: TW };
        }
        function plainTile(w) {
          return function () { return el('div', { class: 'city-tile', style: 'width:' + w + 'px' }); };
        }

        var lSky = buildLayer('city-l-sky', TW_SKY, plainTile(TW_SKY));
        var lFar = buildLayer('city-l-far', TW_FAR, plainTile(TW_FAR));
        var lCity = buildLayer('city-l-city', TW_CITY, buildCityTile);
        var lFore = buildLayer('city-l-fore', TW_FORE, plainTile(TW_FORE));
        var cityA = lCity.tiles[0];   // Primärkopie: trägt die fokussierbaren Hotspots

        var layerSky = lSky.node, layerFar = lFar.node, layerCity = lCity.node, layerFore = lFore.node;
        var glitchEl = el('div', { class: 'city-glitch' });

        var hero = el('img', { class: 'city-hero', src: avatar.img, alt: avatar.name });
        var navPrev = el('button', { type: 'button', class: 'city-nav prev', 'aria-label': '45 Grad nach links drehen', text: '‹' });
        var navNext = el('button', { type: 'button', class: 'city-nav next', 'aria-label': '45 Grad nach rechts drehen', text: '›' });
        var progress = el('div', { class: 'city-progress', text: '0 / ' + TOTAL + ' geprüft' });
        var compassDots = spots.map(function () { return el('i', { class: 'city-compass-dot' }); });
        var compassDial = el('div', { class: 'city-compass-dial' }, compassDots);
        var compass = el('div', { class: 'city-compass', 'aria-hidden': 'true' }, [
          el('span', { class: 'city-compass-n', text: 'N' }), compassDial
        ]);

        var panel = buildPanel();

        var viewport = el('div', { class: 'city-viewport' }, [layerSky, layerFar, layerCity, layerFore]);
        var stage = el('div', { class: 'city-stage' }, [viewport, glitchEl, hero, navPrev, navNext, progress, compass, panel]);

        body.appendChild(el('p', { class: 'hint', style: 'text-align:left;margin:0 0 10px',
          text: d.city.intro.text }));
        body.appendChild(stage);

        positionCompass();
        render();

        /* ---- Kachel mit Kunst + Hotspots + Leben ---- */
        function buildCityTile(copyIdx) {
          var isPrimary = copyIdx === 0;
          var art = el('div', { class: 'city-art', html: cityArtMarkup() });
          var spotsWrap = el('div', { class: 'city-spots' });
          var spotEls = spots.map(function (sp, i) { return buildSpot(sp, i, isPrimary); });
          spotEls.forEach(function (n) { spotsWrap.appendChild(n); });
          var lifeWrap = el('div', { class: 'city-life', 'aria-hidden': 'true' }, buildLife());
          var t = el('div', { class: 'city-tile', style: 'width:' + TW_CITY + 'px' }, [art, spotsWrap, lifeWrap]);
          return { tile: t, spotEls: spotEls };
        }

        function buildSpot(sp, i, isPrimary) {
          var ring = el('div', { class: 'city-spot-ring' }, [
            el('span', { class: 'city-spot-ping', 'aria-hidden': 'true' }),
            el('span', { text: sp.icon })
          ]);
          // kurzer Tag statt Titel: der volle Titel steht im Panel und in aria-label
          var label = el('span', { class: 'city-spot-label', text: sp.tag });
          var attrs = {
            type: 'button', class: 'city-spot', style: 'left:' + (sp.angle / 360 * 100) + '%',
            'aria-label': 'Hotspot ' + (i + 1) + ' von ' + TOTAL + ': ' + sp.title + '. Noch nicht entschieden.'
          };
          if (!isPrimary) { attrs['aria-hidden'] = 'true'; attrs.tabindex = '-1'; }
          var btn = el('button', attrs, [ring, label]);
          btn.dataset.i = String(i);
          if (isPrimary) {
            btn.addEventListener('focus', function () { if (!spinLocked) turnTo(sp.angle); lastFocused = btn; });
          }
          btn.addEventListener('click', function () { openDecision(i); });
          return btn;
        }

        function buildLife() {
          var nodes = [];
          var glyphs = [
            ['🐝', 'city-bee', 3], ['🕊️', 'city-bird', 2],
            ['🚶', 'city-walker', 1], ['🧍', 'city-walker', 1], ['🚴', 'city-walker rev', 1]
          ];
          if (reduceMotion()) return nodes; // Lebens-Ebene wird gar nicht erst gebaut
          var seed = 0;
          glyphs.forEach(function (g) {
            for (var n = 0; n < g[2]; n++) {
              seed++;
              var left = (seed * 71) % 100;
              var bottom = 6 + (seed * 13) % 22;
              var dur = 6 + (seed % 5) * 2.4;
              var del = (seed % 4) * 1.1;
              var span = el('i', { class: g[1], text: g[0] });
              span.style.left = left + '%';
              span.style.bottom = bottom + '%';
              span.style.setProperty('--dur', dur.toFixed(1) + 's');
              span.style.setProperty('--del', del.toFixed(1) + 's');
              nodes.push(span);
            }
          });
          return nodes;
        }

        function positionCompass() {
          spots.forEach(function (sp, i) {
            var rad = (sp.angle - 90) * Math.PI / 180;
            compassDots[i].style.left = (50 + 42 * Math.cos(rad)) + '%';
            compassDots[i].style.top = (50 + 42 * Math.sin(rad)) + '%';
          });
        }

        /* ---- rAF-Schleife: einzige Stelle, die Transforms schreibt ---- */
        function layerX(TW, f) {
          var base = h * PX_PER_DEG * f;
          return -(((base % TW) + TW) % TW);
        }
        function placeLayer(layer, factor) {
          var x = layerX(layer.TW, factor);
          layer.tiles.forEach(function (t, i) {
            var node = t.tile || t;
            node.style.transform = 'translate3d(' + (x + i * layer.TW) + 'px,0,0)';
          });
        }
        function render() {
          placeLayer(lSky, 0.25);
          placeLayer(lFar, 0.5);
          placeLayer(lCity, 1);
          placeLayer(lFore, 1.6);
          compassDial.style.transform = 'rotate(' + (-h) + 'deg)';

          var near = -1, best = 999;
          spots.forEach(function (sp, i) {
            var dd = Math.abs(shortestDelta(h, sp.angle));
            if (dd < best) { best = dd; near = i; }
          });
          if (near !== nearestIdx) {
            nearestIdx = near;
            cityA.spotEls.forEach(function (btn, i) { btn.classList.toggle('is-near', i === near); });
          }
        }
        function loop() {
          if (!lb.alive) return;
          lb.raf = requestAnimationFrame(loop);
          var moved = false;
          if (spinLocked) { /* keine Drehung bei offenem Panel */ }
          else if (keyDir !== 0) { h = norm(h + keyDir * 1.6); moved = true; }
          else if (turnTarget !== null) {
            var dd = shortestDelta(h, turnTarget);
            if (Math.abs(dd) < 0.5 || reduceMotion()) { h = norm(turnTarget); turnTarget = null; }
            else { h = norm(h + dd * 0.18); }
            moved = true;
          } else if (Math.abs(vel) > 0.02) {
            h = norm(h + vel); vel *= 0.92; moved = true;
          }
          if (moved) render();
        }
        lb.raf = requestAnimationFrame(loop);

        function turnTo(angle) { if (!spinLocked) { turnTarget = norm(angle); vel = 0; } }

        /* ---- Eingabe: Pointer-Drag mit Schwung ---- */
        viewport.addEventListener('pointerdown', function (e) {
          if (spinLocked) return;
          if (!e.isPrimary) return;
          try { viewport.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          lb.captureEl = viewport; lb.pointerId = e.pointerId;
          pointerActive = true; turnTarget = null; vel = 0;
          pStartX = e.clientX; pStartH = h; pLastX = e.clientX; pLastT = Date.now();
        });
        viewport.addEventListener('pointermove', function (e) {
          if (!pointerActive) return;
          var dx = e.clientX - pStartX;
          h = norm(pStartH - dx / PX_PER_DEG);
          var dt = Math.max(1, Date.now() - pLastT);
          vel = -((e.clientX - pLastX) / PX_PER_DEG) * (16 / dt);
          pLastX = e.clientX; pLastT = Date.now();
          render();
        });
        function endPointer() {
          if (!pointerActive) return;
          pointerActive = false;
          try { viewport.releasePointerCapture(lb.pointerId); } catch (err) { /* ignore */ }
          lb.captureEl = null; lb.pointerId = null;
          if (reduceMotion()) vel = 0;
        }
        viewport.addEventListener('pointerup', endPointer);
        viewport.addEventListener('pointercancel', endPointer);
        viewport.addEventListener('lostpointercapture', endPointer);

        navPrev.addEventListener('click', function () { ctx.audio.play('click'); turnTo(norm(h - 45)); });
        navNext.addEventListener('click', function () { ctx.audio.play('click'); turnTo(norm(h + 45)); });

        lb.keyDown = function (e) {
          if (!lb.alive) return;
          var modal = document.getElementById('modal');
          if (modal && !modal.hidden) return;
          var t = e.target && e.target.tagName;
          if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
          if (spinLocked) return;
          if (e.key === 'ArrowLeft') { e.preventDefault(); keyDir = -1; }
          else if (e.key === 'ArrowRight') { e.preventDefault(); keyDir = 1; }
          else if (e.key === 'Home') { e.preventDefault(); turnTo(0); }
        };
        lb.keyUp = function (e) {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keyDir = 0;
        };
        document.addEventListener('keydown', lb.keyDown);
        document.addEventListener('keyup', lb.keyUp);

        // Fokus-Falle: der überflüssige Bildlauf des overflow:hidden-Containers zurücksetzen
        viewport.addEventListener('scroll', function () { viewport.scrollLeft = 0; viewport.scrollTop = 0; });

        /* ---- Entscheidungs-Panel ---- */
        function buildPanel() {
          var p = el('div', { class: 'city-panel' });
          return p;
        }

        function openDecision(i) {
          if (spinLocked) return; // auch für eine Wiederholungsansicht gesperrt ->
          var btn = cityA.spotEls[i];  // verhindert ein zweites Panel während die
          ctx.audio.play('select');    // Schließen-Animation des vorigen noch läuft
          spinLocked = true;
          keyDir = 0; vel = 0; turnTarget = null;
          showPanel(i, btn.classList.contains('is-done'));
        }

        function showPanel(i, alreadyDone) {
          var sp = spots[i];
          panel.className = 'city-panel';
          panel.innerHTML = '';
          panel.appendChild(el('div', { class: 'city-panel-head' }, [
            el('span', { class: 'city-panel-ico', text: sp.icon }),
            el('h3', { text: sp.title }),
            el('span', { class: 'city-panel-count', text: 'Szenario ' + (i + 1) + ' / ' + TOTAL })
          ]));
          panel.appendChild(el('p', { class: 'city-panel-desc', text: sp.desc }));
          panel.appendChild(el('div', { class: 'city-panel-detail', text: sp.detail }));

          if (alreadyDone) {
            panel.classList.add('is-ok');
            renderResult(sp, true, true);
            panel.appendChild(el('div', { class: 'city-panel-foot' }, [
              el('button', { class: 'btn btn-ghost btn-sm', text: '« Zurück zur Stadt', onclick: closePanel })
            ]));
          } else {
            panel.appendChild(el('p', { class: 'city-panel-q', text: 'Diese Daten sind sichtbar. Was tust du?' }));
            var btns = [];
            var choices = el('div', { class: 'city-choices' }, d.city.answers.map(function (ans) {
              var b = el('button', { class: 'city-btn', 'aria-keyshortcuts': ans.key },
                [el('span', {}, [ans.icon + ' ' + ans.label])]);
              b.style.setProperty('--c', ans.color);
              b.addEventListener('click', function () { resolveDecision(i, ans.id, b, btns); });
              btns.push(b);
              return b;
            }));
            panel.appendChild(choices);
          }

          later(function () { panel.classList.add('is-open'); }, 10);
          announce(sp.title + '. ' + sp.desc);
        }

        function resolveDecision(i, answerId, btn, allBtns) {
          var sp = spots[i];
          var ok = answerId === sp.correct;
          allBtns.forEach(function (b) { b.disabled = true; });
          panel.classList.add(ok ? 'is-ok' : 'is-bad');
          var badge = ok
            ? (sp.correct === 'open' ? 'is-open' : 'is-blocked')
            : 'is-wrong';
          cityA.spotEls[i].classList.add('is-done', badge);
          cityA.spotEls[i].dataset.mark = ok ? '✓' : '✗';
          cityA.spotEls[i].setAttribute('aria-label', sp.title + '. Entschieden: ' +
            (answerId === 'open' ? 'freigegeben' : 'gesperrt') + '. ' + (ok ? 'Richtig.' : 'Leider falsch.'));

          if (ok) {
            ctx.audio.play('success');
            hero.classList.remove('shock'); hero.classList.add('cheer');
          } else {
            wrongDecision++;
            ctx.audio.play('error');
            hero.classList.remove('cheer'); hero.classList.add('shock');
            stage.classList.remove('is-glitch'); void stage.offsetWidth; stage.classList.add('is-glitch');
            later(function () { stage.classList.remove('is-glitch'); }, 560);
          }
          decided++;
          /* Medienkompetenz hakt ab, sobald alle freigebbaren Fälle BEWERTET sind –
             nicht erst, wenn alle richtig waren. Sonst wäre der Punkt nach einem
             einzigen Fehler dauerhaft unerreichbar; die Checklisten der anderen
             Level markieren ebenfalls Fortschritt, nicht Fehlerfreiheit. */
          if (sp.correct === 'open') openDecided++;
          if (openDecided === 5) ctx.markTask(3);
          updateQuality();
          updateHud('360°-Stadt · ' + decided + ' / ' + TOTAL + ' entschieden');
          progress.textContent = decided + ' / ' + TOTAL + ' geprüft';

          renderResult(sp, ok, false);
          panel.appendChild(el('div', { class: 'city-panel-foot' }, [
            el('button', { class: 'btn btn-neon btn-sm', text: decided >= TOTAL ? 'Zum Abschluss ›' : 'Weiter ›',
              onclick: closePanel })
          ]));
          try { panel.querySelector('.city-panel-foot .btn').focus({ preventScroll: true }); } catch (e) { /* ignore */ }
        }

        /* ok=true (oder replay=true) zeigt die kanonische Erklärung (okText);
           bei einer falschen Live-Entscheidung erscheint stattdessen die Warnung.
           Der Gesetzes-Bezug (sp.law) erscheint immer – bei richtiger Sperrung als
           Bestätigung, bei falscher Freigabe als Begründung der Warnung. */
        function renderResult(sp, ok, replay) {
          var wrap = el('div', { class: 'city-feedback' });
          var text = (ok || replay) ? sp.okText : sp.warnText;
          wrap.appendChild(el('div', { class: 'city-feedback-ki', text: text }));
          if (sp.law) wrap.appendChild(el('div', { class: 'city-law', text: '§ ' + sp.law }));
          panel.appendChild(wrap);
        }

        /* spinLocked bleibt bis zum Ende der Schließen-Animation gesetzt: sonst
           könnte in diesen 340 ms ein neues Panel geöffnet werden, dessen Inhalt
           der Aufräum-Timer danach wieder leeren würde. */
        function closePanel() {
          panel.classList.remove('is-open');
          var last = decided >= TOTAL;
          later(function () {
            panel.className = 'city-panel'; panel.innerHTML = '';
            if (!last && !awardGranted) spinLocked = false;
          }, reduceMotion() ? 0 : 340);
          if (lastFocused && lastFocused.parentNode) { try { lastFocused.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
          if (last) cityFinale();
        }

        function cityFinale() {
          if (awardGranted) return;
          awardGranted = true;
          ctx.markTask(4);
          spinLocked = true;
          NX.state.grantAward('open-data-hero');
          ctx.audio.play('key');

          var fin = el('div', { class: 'city-finale' }, [
            el('h3', { class: 'city-finale-title', text: d.city.finale.title }),
            el('p', { class: 'city-finale-sub', text: d.city.finale.text })
          ]);
          stage.appendChild(fin);
          announce(d.city.finale.text);

          later(function () {
            ctx.audio.play('win');
            ui.celebrate();
          }, reduceMotion() ? 0 : 500);
          later(function () {
            ctx.complete(scoreNow());
          }, reduceMotion() ? 60 : 1600);
        }
      }
    },

    unmount: function () {
      lb.alive = false;
      lb.timers.forEach(function (id) { clearTimeout(id); });
      lb.timers = [];
      if (lb.raf) { cancelAnimationFrame(lb.raf); lb.raf = null; }
      if (lb.keyDown) { document.removeEventListener('keydown', lb.keyDown); lb.keyDown = null; }
      if (lb.keyUp) { document.removeEventListener('keyup', lb.keyUp); lb.keyUp = null; }
      if (lb.onResize) { window.removeEventListener('resize', lb.onResize); lb.onResize = null; }
      if (lb.captureEl && lb.pointerId !== null) {
        try { lb.captureEl.releasePointerCapture(lb.pointerId); } catch (e) { /* ignore */ }
      }
      lb.captureEl = null; lb.pointerId = null;
      lb.charts.forEach(function (c) { try { c.destroy(); } catch (e) { /* ignore */ } });
      lb.charts = [];
      try { NX.ui.closeModal(); } catch (e) { /* ignore */ }
      if (lb.root && lb.root.parentNode) { lb.root.parentNode.removeChild(lb.root); }
      lb.root = null;
    }
  });
})(window.NX);
