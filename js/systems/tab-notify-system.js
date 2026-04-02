var Game = Game || {};

Game.TabNotifySystem = (function () {
  var originalTitle = 'Meu C\u00e3opanheiro';
  var isHidden = false;
  var blinkTimer = null;
  var notifyTimer = null;
  var messages = [];
  var currentMsgIndex = 0;

  function init() {
    document.addEventListener('visibilitychange', onVisibilityChange);
    Game.EventBus.on('stat:critical', onStatCritical);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      isHidden = true;
      startNotifying();
    } else {
      isHidden = false;
      stopNotifying();
      document.title = originalTitle;
    }
  }

  function startNotifying() {
    // Start checking dog states after 30 seconds away
    if (notifyTimer) clearTimeout(notifyTimer);
    notifyTimer = setTimeout(function () {
      if (!isHidden || !Game.State) return;
      updateMessages();
      startBlinking();
    }, 30000);
  }

  function updateMessages() {
    messages = [];
    if (!Game.State || Game.State.dogs.length === 0) return;

    var dog = Game.State.dogs[0]; // Primary dog
    var name = dog.name;
    var mood = Game.DogRenderer ? Game.DogRenderer.getDogMood(dog) : 'feliz';

    var moodMsgs = {
      com_fome: [
        '\uD83C\uDF56 ' + name + ' t\u00e1 com fome!',
        '\uD83D\uDC36 ' + name + ' quer ra\u00e7\u00e3o!',
        'A tigela de ' + name + ' t\u00e1 vazia!'
      ],
      doente: [
        '\uD83C\uDFE5 ' + name + ' precisa do vet!',
        '\uD83E\uDD12 ' + name + ' n\u00e3o t\u00e1 bem...',
        '\uD83D\uDC36 ' + name + ' t\u00e1 dod\u00f3i!'
      ],
      triste: [
        '\uD83D\uDC36 ' + name + ' t\u00e1 com saudade!',
        '\uD83D\uDE22 ' + name + ' precisa de voc\u00ea!',
        'Volta! ' + name + ' sente sua falta!'
      ],
      dormindo: [
        '\uD83D\uDE34 ' + name + ' t\u00e1 dormindo...',
        '\uD83D\uDCA4 ' + name + ' sonhando com voc\u00ea'
      ],
      feliz: [
        '\uD83D\uDC36 ' + name + ' t\u00e1 te esperando!',
        '\u2764 ' + name + ' quer brincar!',
        'Volte logo! ' + name + ' sente falta!'
      ]
    };

    messages = moodMsgs[mood] || moodMsgs.feliz;
  }

  function startBlinking() {
    if (blinkTimer) clearInterval(blinkTimer);
    if (messages.length === 0) {
      updateMessages();
      if (messages.length === 0) return;
    }

    var showOriginal = false;
    blinkTimer = setInterval(function () {
      if (!isHidden) {
        stopNotifying();
        return;
      }

      if (showOriginal) {
        document.title = originalTitle;
      } else {
        document.title = messages[currentMsgIndex % messages.length];
        currentMsgIndex++;
      }
      showOriginal = !showOriginal;
    }, 2000);
  }

  function stopNotifying() {
    if (blinkTimer) {
      clearInterval(blinkTimer);
      blinkTimer = null;
    }
    if (notifyTimer) {
      clearTimeout(notifyTimer);
      notifyTimer = null;
    }
    currentMsgIndex = 0;
  }

  function onStatCritical(data) {
    // If tab is hidden and a stat is critical, update messages and start blinking immediately
    if (isHidden && !blinkTimer) {
      updateMessages();
      startBlinking();
    }
  }

  // Browser notification (asks permission once)
  function sendBrowserNotification(text) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('Meu C\u00e3opanheiro', { body: text, icon: 'img/breeds/caramelo_feliz.png' });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }

  return { init: init };
})();
