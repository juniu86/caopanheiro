var Game = Game || {};

// ============================================================
// Game.WeatherSystem — manages a daily-rolled weather state
// (sunny / cloudy / rainy / snowy) that the room visuals react
// to via .room--{type} CSS classes.
//
// State shape: Game.State.weather = { type, intensity, since }
//   - type:      'sunny' | 'cloudy' | 'rainy' | 'snowy'
//   - intensity: 0..1 (used by CSS for stronger/weaker effects)
//   - since:     game day the current weather started
//
// Persisted via the existing save system (it's just part of
// Game.State). Defensive default in init() handles old saves.
// ============================================================
Game.WeatherSystem = (function () {

  var WEATHERS = [
    { type: 'sunny',  weight: 50 },
    { type: 'cloudy', weight: 25 },
    { type: 'rainy',  weight: 15 },
    { type: 'snowy',  weight: 10 }
  ];

  var CHANGE_CHANCE = 0.6; // 60% chance per day to roll a new weather

  function pickWeighted(arr) {
    var total = 0;
    for (var i = 0; i < arr.length; i++) total += arr[i].weight;
    var r = Math.random() * total;
    for (var j = 0; j < arr.length; j++) {
      r -= arr[j].weight;
      if (r <= 0) return arr[j];
    }
    return arr[0];
  }

  function init() {
    if (!Game.State) return;
    if (!Game.State.weather) {
      Game.State.weather = {
        type: 'sunny',
        intensity: 0.5,
        since: (Game.State.gameTime && Game.State.gameTime.day) || 1
      };
    }
    Game.EventBus.on('dayTick', maybeRoll);
  }

  function maybeRoll() {
    if (Math.random() > CHANGE_CHANCE) return;
    var next = pickWeighted(WEATHERS);
    if (next.type === Game.State.weather.type) return;
    Game.State.weather = {
      type: next.type,
      intensity: 0.4 + Math.random() * 0.6,
      since: Game.State.gameTime.day
    };
    Game.EventBus.emit('weather:changed', { weather: Game.State.weather });
  }

  function force(type) {
    if (!Game.State) return;
    Game.State.weather = {
      type: type,
      intensity: 0.7,
      since: (Game.State.gameTime && Game.State.gameTime.day) || 1
    };
    Game.EventBus.emit('weather:changed', { weather: Game.State.weather });
  }

  function getCurrent() {
    return Game.State && Game.State.weather;
  }

  return {
    init: init,
    maybeRoll: maybeRoll,
    force: force,
    getCurrent: getCurrent
  };
})();
