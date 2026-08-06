/* =========================================================================
   voice.js — Audio-Zuordnungen: Sprachaufnahmen (story/stimme.md) und der
   Musik-Loop (story/allgemein.md → „Hintergrundmusik & Sound-Anforderungen")

   Der Vorlese-Knopf arbeitet nach einer einfachen Regel:
     Liegt für den Schlüssel eine MP3 hier drin  ->  die Aufnahme wird gespielt.
     Liegt keine da                              ->  die Browser-Stimme liest vor.

   Eine Aufnahme nachliefern heißt also: Datei nach game/media/voice/ legen und
   hier EINE Zeile eintragen. Kein Code-Eingriff, kein Build.

   Schlüssel-Schema
     tip-<levelId>-<index>        Tipp Nr. <index> (0-basiert) in Level <levelId>
     info-<levelId>-<avatarId>    Info-Fenster, avatar-spezifische Variante
     help-<levelId>-<station>     Hilfe-Fenster an einer Station (url|method|token|json)
     l3-tip-<frageId>             Level 3 rechnet seine Tipps frageweise selbst ab
     l3-info-<frageId>

   Offen: game/media/buerger-ki-stimme.mp3 (35 s) liegt bereit, ist aber NICHT
   eingetragen – der gesprochene Text ist nicht dokumentiert, und eine Aufnahme
   an der falschen Stelle sagt schlicht etwas anderes als auf dem Bildschirm
   steht. Sobald das Transkript vorliegt, kommt sie in die passende Zeile.
   ========================================================================= */
window.NX = window.NX || {};
window.NX.voiceClips = {
  // 'info-1-lennox': 'media/voice/lennox-info-1.mp3',
  // 'tip-1-0':       'media/voice/tip-1-0.mp3',
};

/* -------------------------------------------------------------------------
   Hintergrundmusik. Erwartet wird der Loop „Loopix" (fonoskop, Freesound
   ID 849265, CC BY 4.0) unter diesem Pfad. Solange die Datei fehlt, bleibt
   der Musik-Knopf im Kopfbereich ausgeblendet und das Spiel unverändert.
   Auf null setzen schaltet die Musik dauerhaft ab.
   ------------------------------------------------------------------------- */
window.NX.musicTrack = 'media/musik-loop.mp3';

/* Namensnennung laut Lizenz. Wird NUR angezeigt, wenn die Datei wirklich
   vorhanden ist – für einen nicht ausgelieferten Track wäre sie falsch. */
window.NX.musicCredit = '„Loopix" by fonoskop (freesound.org/s/849265) · CC BY 4.0';
