var Game = Game || {};

Game.Notifications = (function () {
  var container = null;

  function init() {
    container = document.getElementById('toast-container');
    Game.EventBus.on('notification', show);
    Game.EventBus.on('coins:earned', function (data) {
      show({ text: '+' + data.amount + ' PataCoins! ' + (data.reason || ''), type: 'coins' });
    });
    Game.EventBus.on('achievement:unlocked', function (ach) {
      show({ text: '\uD83C\uDFC6 Conquista: ' + ach.name + '!', type: 'success' });
    });
  }

  function show(data) {
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + (data.type || 'info');
    toast.textContent = data.text;
    container.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3200);
  }

  return { init: init, show: show };
})();
