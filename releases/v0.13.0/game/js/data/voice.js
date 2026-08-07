/* =========================================================================
   voice.js — Audio-Zuordnungen: benannte Sprachaufnahmen und der Musik-Loop.

   WICHTIG (story/allgemein.md, „Nutzung der Browser-Stimme"):
   Der Knopf **VORLESEN** nutzt ausnahmslos die native Browser-Sprachausgabe
   (Web Speech API) – für ALLE Avatare, in Tipps, Hilfen und Info-Fenstern.
   Dort wird keine MP3 mehr abgespielt.

   Die Tabelle unten ist deshalb KEINE Vorlese-Zuordnung mehr, sondern eine
   kurze Liste fest vertonter Stellen. Aktuell genau eine:

     intro   Die Einleitung „Der große Nebel" (story/einleitung.md) wird
             unabhängig vom gewählten Avatar laut vorgelesen.
             Quelle: story/audio/luvvoice.com-20260805-MomwB7.mp3
   ========================================================================= */
window.NX = window.NX || {};
window.NX.voiceClips = {
  intro: 'media/einleitung.mp3'
};

/* -------------------------------------------------------------------------
   Hintergrundmusik (story/levels/musik.md). Geliefert wurde eine 13,3 s lange
   Stereo-WAV mit .mp3-Endung (2,2 MB); ausgeliefert wird die daraus erzeugte
   AAC-Fassung mit rund einem Zehntel der Größe. Die Originaldatei liegt
   weiterhin als media/musik-loop.mp3 im Repo.
   Auf null setzen schaltet die Musik dauerhaft ab.
   ------------------------------------------------------------------------- */
window.NX.musicTrack = 'media/musik-loop.m4a';

/* Namensnennung laut Lizenz. Wird NUR angezeigt, wenn die Datei wirklich
   vorhanden ist – für einen nicht ausgelieferten Track wäre sie falsch. */
window.NX.musicCredit = '„Loopix" by fonoskop (freesound.org/s/849265) · CC BY 4.0';
