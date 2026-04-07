var Game = Game || {};

(function () {
  'use strict';

  function boot() {
    // Initialize UI components
    Game.ScreenManager.init();
    Game.Modal.init();
    Game.Notifications.init();
    Game.Audio.setupInteractionInit();

    // Check for saved game
    var savedState = Game.SaveManager.load();

    if (savedState) {
      Game.initState(savedState);
      Game.SaveManager.setupAutoSave();
      Game.StatsSystem.init();
      Game.RunawaySystem.init();
      Game.XPSystem.init();
      Game.ComboSystem.init();
      Game.RandomEventsSystem.init();
      Game.WeatherSystem.init();
      Game.MissionsSystem.init();
      Game.SpeechSystem.init();
      Game.TabNotifySystem.init();

      // Process offline time
      var offlineData = Game.TimeEngine.processOfflineTime();

      // Set selected dog
      if (Game.State.dogs.length > 0) {
        Game.UI.setSelectedDogId(Game.State.dogs[0].id);
      }

      Game.UI.init();
      Game.TimeEngine.start();
      Game.ScreenManager.show('screen-home');
      Game.UI.updateHomeScreen();

      // Check streak (shows notification after delay)
      Game.StreakSystem.init();

      // Show offline summary if significant time passed
      if (offlineData && offlineData.realHours >= 0.1) {
        setTimeout(function () {
          Game.UI.showAwaySummary(offlineData);
        }, 500);
      }
    } else {
      showTitleScreen();
    }
  }

  function showTitleScreen() {
    Game.ScreenManager.show('screen-title');

    var newGameBtn = document.getElementById('new-game-btn');
    var continueBtn = document.getElementById('continue-btn');

    if (continueBtn) {
      continueBtn.style.display = Game.SaveManager.hasSave() ? 'inline-flex' : 'none';
    }

    newGameBtn.addEventListener('click', function () {
      Game.Audio.play('click');
      showNameScreen();
    });
  }

  function showNameScreen() {
    Game.ScreenManager.show('screen-name');

    var nameInput = document.getElementById('player-name-input');
    var confirmBtn = document.getElementById('confirm-name-btn');

    var handler = function () {
      var name = nameInput.value.trim();
      if (!name) {
        Game.EventBus.emit('notification', { text: 'Digite seu nome!', type: 'warning' });
        return;
      }
      confirmBtn.removeEventListener('click', handler);

      // Initialize new game
      Game.initState(null);
      Game.State.player.name = name;
      Game.SaveManager.setupAutoSave();
      Game.StatsSystem.init();
      Game.RunawaySystem.init();
      Game.XPSystem.init();
      Game.ComboSystem.init();
      Game.RandomEventsSystem.init();
      Game.WeatherSystem.init();
      Game.MissionsSystem.init();
      Game.UI.init();
      Game.TimeEngine.start();

      // Go to shelter
      showShelterScreen();
    };

    confirmBtn.addEventListener('click', handler);
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handler();
    });
  }

  function showShelterScreen() {
    Game.ScreenManager.show('screen-shelter');
    Game.UI.renderShelterTabs();
  }

  // Navigation buttons
  function setupNavigation() {
    document.addEventListener('click', function (e) {
      var navBtn = e.target.closest('[data-nav]');
      if (!navBtn) return;

      Game.Audio.play('click');
      var screen = navBtn.getAttribute('data-nav');

      switch (screen) {
        case 'home':
          Game.ScreenManager.show('screen-home');
          Game.UI.updateHomeScreen();
          break;
        case 'shelter':
          Game.ScreenManager.show('screen-shelter');
          Game.UI.renderShelterTabs();
          break;
        case 'shop':
          Game.ScreenManager.show('screen-shop');
          Game.UI.renderShopTabs();
          Game.UI.updateTopBar();
          break;
        case 'inventory':
          Game.ScreenManager.show('screen-inventory');
          Game.UI.renderInventory();
          break;
        case 'achievements':
          Game.ScreenManager.show('screen-achievements');
          Game.UI.renderAchievements();
          break;
        case 'housing':
          Game.ScreenManager.show('screen-housing');
          Game.UI.renderHousing();
          break;
      }
    });
  }

  // Boot when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setupNavigation();
      boot();
    });
  } else {
    setupNavigation();
    boot();
  }
})();
