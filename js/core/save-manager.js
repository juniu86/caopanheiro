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
    // Future migration logic
    // if (state.version < 2) { ... state.version = 2; }
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
