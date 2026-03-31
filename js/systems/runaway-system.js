var Game = Game || {};

Game.RunawaySystem = (function () {
  function init() {
    Game.EventBus.on('hourTick', checkAll);
  }

  function checkAll() {
    if (!Game.State) return;
    var toRemove = [];

    Game.State.dogs.forEach(function (dog) {
      if (dog.hasRunAway) return;

      if (Game.TimeEngine.checkNeglect(dog)) {
        dog.neglectCounter++;

        // Warnings
        Game.Config.NEGLECT_WARNING_INTERVALS.forEach(function (threshold) {
          if (dog.neglectCounter === threshold) {
            var urgency = dog.neglectCounter >= 36 ? 'danger' : 'warning';
            Game.EventBus.emit('notification', {
              text: dog.name + ' est\u00e1 muito triste e abandonado!',
              type: urgency
            });
          }
        });

        // Runaway
        if (dog.neglectCounter >= Game.Config.NEGLECT_RUNAWAY_THRESHOLD) {
          dog.hasRunAway = true;
          toRemove.push(dog);
          Game.EventBus.emit('notification', {
            text: dog.name + ' fugiu! Voc\u00ea pode buscar no abrigo.',
            type: 'danger'
          });
          Game.EventBus.emit('dog:ranaway', { dog: dog });
        }
      } else {
        // Reset counter if dog is being cared for
        if (dog.neglectCounter > 0) {
          dog.neglectCounter = Math.max(0, dog.neglectCounter - 0.5);
        }
      }
    });

    toRemove.forEach(function (dog) {
      Game.State.runawayDogs.push(dog);
    });
    Game.State.dogs = Game.State.dogs.filter(function (d) { return !d.hasRunAway; });
  }

  return { init: init };
})();
