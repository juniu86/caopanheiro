var Game = Game || {};

Game.StatsSystem = (function () {
  function init() {
    Game.EventBus.on('hourTick', onHourTick);
  }

  function onHourTick() {
    if (!Game.State) return;
    Game.State.dogs.forEach(function (dog) {
      if (dog.hasRunAway) return;
      var breed = Game.Breeds.getById(dog.breedId);
      Game.TimeEngine.applyHourlyDecay(dog, breed, 1);
      checkThresholds(dog);
      checkPoopRandom(dog);
    });

    // PataCoins bonus for good care
    checkGoodCareBonus();
  }

  function checkThresholds(dog) {
    var stats = dog.stats;
    var statNames = ['hunger', 'happiness', 'energy', 'hygiene', 'health'];
    statNames.forEach(function (stat) {
      if (stats[stat] <= 15) {
        Game.EventBus.emit('stat:critical', { dogId: dog.id, stat: stat, value: stats[stat] });
      }
    });

    // Auto-sleep when energy hits 0 (dog collapses from exhaustion)
    if (stats.energy <= 0 && !dog.isAsleep) {
      dog.isAsleep = true;
      Game.EventBus.emit('dog:sleep', { dogId: dog.id });
      Game.EventBus.emit('notification', {
        text: dog.name + ' desmaiou de cansa\u00e7o!',
        type: 'warning'
      });
    }
  }

  function checkPoopRandom(dog) {
    // Random chance of poop on floor each game-hour
    if (!dog.poopOnFloor && Math.random() < 0.15) {
      dog.poopOnFloor = true;
      Game.EventBus.emit('dog:poop', { dogId: dog.id });
    }
  }

  function checkGoodCareBonus() {
    if (!Game.State) return;
    var allGood = Game.State.dogs.every(function (dog) {
      if (dog.hasRunAway) return true;
      var s = dog.stats;
      var threshold = Game.Config.COINS.GOOD_CARE_THRESHOLD;
      return s.hunger >= threshold && s.happiness >= threshold &&
             s.energy >= threshold && s.hygiene >= threshold && s.health >= threshold;
    });
    if (allGood && Game.State.dogs.length > 0) {
      Game.Player.addCoins(Game.Config.COINS.GOOD_CARE_BONUS, 'Bom cuidado!');
    }
  }

  function applyStat(dog, stat, amount) {
    dog.stats[stat] = Math.max(Game.Config.STAT_MIN,
      Math.min(Game.Config.STAT_MAX, dog.stats[stat] + amount));
    Game.EventBus.emit('stat:changed', {
      dogId: dog.id, stat: stat, value: dog.stats[stat]
    });
  }

  return { init: init, applyStat: applyStat };
})();
