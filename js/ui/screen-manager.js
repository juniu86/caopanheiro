var Game = Game || {};

Game.ScreenManager = (function () {
  var currentScreen = null;
  var screens = {};

  function init() {
    var els = document.querySelectorAll('.screen');
    els.forEach(function (el) {
      screens[el.id] = el;
    });
  }

  function show(screenId) {
    if (currentScreen === screenId) return;

    // Hide all
    Object.keys(screens).forEach(function (id) {
      screens[id].classList.remove('screen--active');
    });

    // Show target
    if (screens[screenId]) {
      screens[screenId].classList.add('screen--active');
      currentScreen = screenId;
      Game.EventBus.emit('screen:changed', { screen: screenId });
    }
  }

  function getCurrent() {
    return currentScreen;
  }

  return { init: init, show: show, getCurrent: getCurrent };
})();
