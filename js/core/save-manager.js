var Game = Game || {};

Game.SaveManager = (function () {
  function save() {
    if (!Game.State) return false;
    try {
      Game.State.lastTimestamp = Date.now();
      var data = JSON.stringify(Game.State);
      localStorage.setItem(Game.Config.SAVE_KEY, data);
      Game.EventBus.emit('game:saved');
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }

  function load() {
    try {
      var data = localStorage.getItem(Game.Config.SAVE_KEY);
      if (!data) return null;
      var state = JSON.parse(data);
      if (!state || !state.version) return null;
      state = migrate(state);
      return state;
    } catch (e) {
      console.error('Load failed:', e);
      return null;
    }
  }

  function migrate(state) {
    // Defensive default for weather (added post-v2)
    if (!state.weather) {
      state.weather = {
        type: 'sunny',
        intensity: 0.5,
        since: (state.gameTime && state.gameTime.day) || 1
      };
    }
    if (state.version < 2) {
      // v1 → v2: Add engagement features fields
      var p = state.player;
      if (p.streak === undefined) p.streak = 0;
      if (p.lastStreakDate === undefined) p.lastStreakDate = null;
      if (p.dailyMissions === undefined) p.dailyMissions = [];
      if (p.lastMissionDay === undefined) p.lastMissionDay = null;
      if (p.allMissionsBonus === undefined) p.allMissionsBonus = false;
      if (p.comboActions === undefined) p.comboActions = [];
      if (p.comboExpiry === undefined) p.comboExpiry = 0;
      if (p.maxCombo === undefined) p.maxCombo = 0;
      if (state.pendingEvents === undefined) state.pendingEvents = [];
      // Add xp/level to existing dogs
      if (state.dogs) {
        state.dogs.forEach(function (dog) {
          if (dog.xp === undefined) dog.xp = 0;
          if (dog.level === undefined) dog.level = 1;
        });
      }
      if (state.runawayDogs) {
        state.runawayDogs.forEach(function (dog) {
          if (dog.xp === undefined) dog.xp = 0;
          if (dog.level === undefined) dog.level = 1;
        });
      }
      state.version = 2;
    }
    return state;
  }

  function hasSave() {
    return localStorage.getItem(Game.Config.SAVE_KEY) !== null;
  }

  function deleteSave() {
    localStorage.removeItem(Game.Config.SAVE_KEY);
  }

  function setupAutoSave() {
    Game.EventBus.on('autoSave', function () {
      save();
    });

    // Save on browser close
    window.addEventListener('beforeunload', function () {
      save();
    });
  }

  return {
    save: save,
    load: load,
    hasSave: hasSave,
    deleteSave: deleteSave,
    setupAutoSave: setupAutoSave
  };
})();
