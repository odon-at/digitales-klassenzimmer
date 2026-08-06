/* =========================================================================
   app.js — bootstrap: load state, wire global controls, show first screen.
   ========================================================================= */
(function (NX) {
  'use strict';

  var booted = false;
  function boot() {
    // Gegen doppelte Verdrahtung absichern: zwei Klick-Listener auf demselben
    // Knopf würden jeden Schalter zweimal umlegen – also gar nicht.
    if (booted) return;
    booted = true;
    NX.state.load();

    // Ton-Hauptschalter: Effekte, Sprachausgabe UND Musik
    var audioBtn = document.getElementById('audio-toggle');
    var musicBtn = document.getElementById('music-toggle');
    var music = NX.audio.music;

    function syncIcon() {
      var m = NX.audio.isMuted();
      audioBtn.textContent = m ? '🔇' : '🔊';
      audioBtn.setAttribute('aria-pressed', m ? 'false' : 'true');
      // Bei Stummschaltung ist der Musik-Knopf wirkungslos – das zeigen wir auch
      if (musicBtn) musicBtn.disabled = m;
    }
    function syncMusicIcon() {
      if (!musicBtn || !music) return;
      var on = music.isOn();
      /* Zustand hängt nicht am Emoji allein: .is-off legt sichtbar einen
         Schrägstrich darüber und dimmt, aria-pressed sagt es vorlesbar. */
      musicBtn.classList.toggle('is-off', !on);
      musicBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      musicBtn.title = on ? 'Hintergrundmusik ausschalten' : 'Hintergrundmusik einschalten';
    }

    syncIcon();
    audioBtn.addEventListener('click', function () {
      NX.audio.toggle();
      syncIcon();
      // Stummschalten beendet auch eine laufende Sprachausgabe (Funk-Kanal)
      if (NX.audio.isMuted()) { if (NX.audio.voice) NX.audio.voice.stop(); }
      else NX.audio.play('click');
    });

    /* Musik-Knopf: erscheint erst, wenn die Datei wirklich da ist. Fehlt sie,
       bleibt er aus und niemand klickt ins Leere (story/allgemein.md). */
    if (music && musicBtn) {
      syncMusicIcon();
      musicBtn.addEventListener('click', function () {
        music.toggle();
        syncMusicIcon();
        if (music.isOn() && !NX.audio.isMuted()) NX.audio.play('click');
      });
      music.onReady(function (ok) {
        musicBtn.hidden = !ok;
        if (ok) { showAttrib(); syncIcon(); }
      });
      // Browser lassen Ton erst nach einer Nutzeraktion zu
      music.arm();
    }

    /* Namensnennung (CC BY) – nur bei tatsächlich vorhandener Musik. */
    function showAttrib() {
      var txt = NX.musicCredit;
      if (!txt) return;
      ['start-attrib', 'fin-attrib'].forEach(function (id) {
        var n = document.getElementById(id);
        if (n) { n.textContent = '♪ ' + txt; n.hidden = false; }
      });
    }

    // wire all screens and show the start screen
    NX.screens.init();
    NX.screens.route('screen-start');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.NX);
