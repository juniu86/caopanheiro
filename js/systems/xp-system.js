var Game = Game || {};

Game.XPSystem = (function () {
  function init() {
    Game.EventBus.on('action:performed', onActionPerformed);
  }

  function onActionPerformed(data) {
    if (!Game.State || !data.actionId) return;
    var xpAmount = Game.Config.XP_PER_ACTION[data.actionId];
    if (!xpAmount) return;

    var dog = Game.State.dogs.find(function (d) { return d.id === data.dogId; });
    if (!dog) return;

    addXP(dog, xpAmount);
  }

  function addXP(dog, amount) {
    if (dog.level >= Game.Config.MAX_DOG_LEVEL) return;
    dog.xp += amount;
    checkLevelUp(dog);
  }

  function getXPForLevel(level) {
    return level * Game.Config.XP_PER_LEVEL_MULTIPLIER;
  }

  function checkLevelUp(dog) {
    var leveled = false;
    while (dog.level < Game.Config.MAX_DOG_LEVEL && dog.xp >= getXPForLevel(dog.level)) {
      dog.xp -= getXPForLevel(dog.level);
      dog.level++;
      leveled = true;

      var reward = dog.level * Game.Config.LEVEL_UP_COIN_MULTIPLIER;
      Game.Player.addCoins(reward, dog.name + ' subiu pro n\u00edvel ' + dog.level + '!');

      // Milestone bonus every 5 levels
      if (dog.level % Game.Config.LEVEL_MILESTONE_INTERVAL === 0) {
        Game.Player.addCoins(Game.Config.LEVEL_MILESTONE_BONUS, 'B\u00f4nus marco n\u00edvel ' + dog.level + '!');
        Game.EventBus.emit('notification', {
          text: '\u2B50 ' + dog.name + ' chegou ao n\u00edvel ' + dog.level + '! B\u00f4nus especial!',
          type: 'success'
        });
      } else {
        Game.EventBus.emit('notification', {
          text: '\uD83C\uDF89 ' + dog.name + ' subiu pro n\u00edvel ' + dog.level + '!',
          type: 'success'
        });
      }

      Game.EventBus.emit('dog:levelUp', { dogId: dog.id, level: dog.level });
    }

    if (leveled) {
      Game.Achievements.checkAll();
    }
  }

  function getProgress(dog) {
    if (!dog) return { current: 0, needed: 50, percent: 0, level: 1 };
    if (dog.level >= Game.Config.MAX_DOG_LEVEL) {
      return { current: 0, needed: 0, percent: 100, level: dog.level };
    }
    var needed = getXPForLevel(dog.level);
    var percent = Math.min(100, Math.round((dog.xp / needed) * 100));
    return { current: dog.xp, needed: needed, percent: percent, level: dog.level };
  }

  return { init: init, addXP: addXP, getProgress: getProgress };
})();
