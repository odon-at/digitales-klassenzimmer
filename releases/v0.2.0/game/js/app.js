/* =========================================================================
   app.js — bootstrap: load state, wire global controls, show first screen.
   ========================================================================= */
(function (NX) {
  'use strict';

  function boot() {
    NX.state.load();

    // audio toggle
    var audioBtn = document.getElementById('audio-toggle');
    function syncIcon() { audioBtn.textContent = NX.audio.isMuted() ? '🔇' : '🔊'; }
    syncIcon();
    audioBtn.addEventListener('click', function () {
      NX.audio.toggle();
      syncIcon();
      if (!NX.audio.isMuted()) NX.audio.play('click');
    });

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
