var Game = Game || {};

Game.Dog = (function () {
  var idCounter = 0;

  function create(breedId, name) {
    idCounter++;
    return {
      id: 'dog_' + Date.now() + '_' + idCounter,
      name: name,
      breedId: breedId,
      adoptedOnDay: Game.State ? Game.State.gameTime.day : 1,
      stats: {
        hunger: 80,
        happiness: 80,
        energy: 80,
        hygiene: 80,
        health: 100,
        learning: 0
      },
      tricksLearned: [],
      wearing: null,
      isAsleep: false,
      neglectCounter: 0,
      hasRunAway: false,
      lastActions: {},   // { actionId: gameMinuteTimestamp } for cooldowns
      poopOnFloor: false,
      actionAnimation: null
    };
  }

  function getMood(dog) {
    var s = dog.stats;
    if (dog.isAsleep) return 'sleeping';
    if (s.health < 20) return 'sick';

    var avg = (s.hunger + s.happiness + s.energy + s.hygiene + s.health) / 5;
    if (avg >= 70) return 'happy';
    if (avg >= 50) return 'neutral';
    if (avg >= 30) return 'sad';
    return 'very_sad';
  }

  function getMoodEmoji(mood) {
    var map = {
      happy: '\uD83D\uDE0A',
      neutral: '\uD83D\uDE10',
      sad: '\uD83D\uDE1F',
      very_sad: '\uD83D\uDE22',
      sick: '\uD83E\uDD12',
      sleeping: '\uD83D\uDE34'
    };
    return map[mood] || '\uD83D\uDC36';
  }

  function getMoodText(mood) {
    var map = {
      happy: 'Feliz!',
      neutral: 'Normal',
      sad: 'Tristinho',
      very_sad: 'Muito triste!',
      sick: 'Doentinho',
      sleeping: 'Dormindo...'
    };
    return map[mood] || '';
  }

  function getAnimationClass(dog) {
    if (dog.actionAnimation) return 'dog-sprite--' + dog.actionAnimation;
    var mood = getMood(dog);
    if (mood === 'sleeping') return 'dog-sprite--sleeping';
    if (mood === 'sad' || mood === 'very_sad') return 'dog-sprite--sad';
    return 'dog-sprite--idle';
  }

  function canDoAction(dog, actionId) {
    if (dog.hasRunAway) return false;
    if (dog.isAsleep && actionId !== 'wake') return false;

    var cooldown = Game.Config.ACTION_COOLDOWNS[actionId];
    if (cooldown && dog.lastActions[actionId]) {
      var totalMinutes = Game.State.gameTime.day * 24 * 60 +
                         Game.State.gameTime.hour * 60 +
                         Game.State.gameTime.minute;
      if (totalMinutes - dog.lastActions[actionId] < cooldown) {
        return false;
      }
    }
    return true;
  }

  function markActionDone(dog, actionId) {
    dog.lastActions[actionId] = Game.State.gameTime.day * 24 * 60 +
                                 Game.State.gameTime.hour * 60 +
                                 Game.State.gameTime.minute;
  }

  function getDaysWithOwner(dog) {
    if (!Game.State) return 0;
    return Game.State.gameTime.day - dog.adoptedOnDay;
  }

  return {
    create: create,
    getMood: getMood,
    getMoodEmoji: getMoodEmoji,
    getMoodText: getMoodText,
    getAnimationClass: getAnimationClass,
    canDoAction: canDoAction,
    markActionDone: markActionDone,
    getDaysWithOwner: getDaysWithOwner
  };
})();
