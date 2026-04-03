var Game = Game || {};

Game.ActionSystem = (function () {
  var ACTIONS = {
    feed: {
      label: 'Alimentar', icon: '\uD83C\uDF56', statEffects: { hunger: 25 },
      animation: 'eating', animDuration: 2000,
      message: function (dog) { return dog.name + ' comeu!'; }
    },
    play: {
      label: 'Brincar', icon: '\u26BD', statEffects: { happiness: 20, energy: -15 },
      animation: 'playing', animDuration: 3000,
      message: function (dog) { return dog.name + ' brincou muito!'; }
    },
    bathe: {
      label: 'Banho', icon: '\uD83D\uDEC1', statEffects: { hygiene: 35 },
      animation: 'bathing', animDuration: 2500,
      message: function (dog) { return dog.name + ' est\u00e1 limpinho!'; }
    },
    sleep: {
      label: 'Dormir', icon: '\uD83D\uDE34',
      animation: 'sleeping', animDuration: 0,
      message: function (dog) { return dog.name + ' foi dormir...'; },
      custom: function (dog) {
        dog.isAsleep = true;
        Game.EventBus.emit('dog:sleep', { dogId: dog.id });
      }
    },
    wake: {
      label: 'Acordar', icon: '\u2600\uFE0F',
      animation: null, animDuration: 0,
      message: function (dog) { return dog.name + ' acordou!'; },
      custom: function (dog) {
        dog.isAsleep = false;
        Game.EventBus.emit('dog:wake', { dogId: dog.id });
      },
      showWhen: function (dog) { return dog.isAsleep; }
    },
    carinho: {
      label: 'Carinho', icon: '\u2764\uFE0F', statEffects: { happiness: 15 },
      animation: null, animDuration: 1500,
      message: function (dog) { return dog.name + ' adorou o cafun\u00e9!'; }
    },
    walk: {
      label: 'Passear', icon: '\uD83D\uDEB6', statEffects: { happiness: 20, energy: -20 },
      animation: 'walking', animDuration: 4000,
      message: function (dog) { return dog.name + ' adorou o passeio!'; }
    },
    teach: {
      label: 'Truque', icon: '\uD83C\uDFAA', statEffects: { energy: -10 },
      animation: null, animDuration: 2000,
      message: function (dog) { return dog.name + ' est\u00e1 aprendendo!'; },
      custom: function (dog) {
        attemptLearnTrick(dog);
      }
    },
    vet: {
      label: 'Veterin\u00e1rio', icon: '\uD83C\uDFE5', statEffects: { health: 40 },
      animation: null, animDuration: 2000,
      cost: 30,
      message: function (dog) { return dog.name + ' foi ao vet e melhorou!'; }
    },
    petisco: {
      label: 'Petisco', icon: '\uD83E\uDD5C', statEffects: { happiness: 30, hunger: 10 },
      animation: 'eating', animDuration: 1500,
      message: function (dog) { return dog.name + ' amou o petisco!'; }
    },
    cleanPoop: {
      label: 'Limpar', icon: '\uD83E\uDDF9', statEffects: { hygiene: 10 },
      animation: null, animDuration: 1000,
      message: function () { return 'Limpinho!'; },
      custom: function (dog) {
        dog.poopOnFloor = false;
        Game.Player.addCoins(Game.Config.COINS.CLEAN_POOP_BONUS, 'Limpeza');
      },
      showWhen: function (dog) { return dog.poopOnFloor; }
    }
  };

  function getAction(actionId) {
    return ACTIONS[actionId] || null;
  }

  function getAvailableActions(dog) {
    if (!dog) return [];
    var result = [];
    var actionIds = ['feed', 'play', 'bathe', 'carinho', 'walk', 'teach', 'petisco', 'vet'];

    // If sleeping, only show wake
    if (dog.isAsleep) {
      result.push({ id: 'wake', action: ACTIONS.wake, canDo: true });
      return result;
    }

    actionIds.forEach(function (id) {
      var action = ACTIONS[id];
      if (action.showWhen && !action.showWhen(dog)) return;
      result.push({
        id: id,
        action: action,
        canDo: Game.Dog.canDoAction(dog, id)
      });
    });

    // Sleep option
    if (!dog.isAsleep) {
      result.push({ id: 'sleep', action: ACTIONS.sleep, canDo: true });
    }

    // Clean poop if needed
    if (dog.poopOnFloor) {
      result.push({ id: 'cleanPoop', action: ACTIONS.cleanPoop, canDo: true });
    }

    return result;
  }

  function performAction(dog, actionId) {
    var action = ACTIONS[actionId];
    if (!action) return { success: false, message: 'A\u00e7\u00e3o inv\u00e1lida' };

    // Check cooldown
    if (actionId !== 'wake' && actionId !== 'sleep' && !Game.Dog.canDoAction(dog, actionId)) {
      return { success: false, message: 'Ainda n\u00e3o pode fazer isso!' };
    }

    // Check cost
    if (action.cost && !Game.Player.canAfford(action.cost)) {
      return { success: false, message: 'PataCoins insuficientes!' };
    }

    // Spend cost
    if (action.cost) {
      Game.Player.spendCoins(action.cost, actionId);
    }

    // Apply stat effects
    if (action.statEffects) {
      Object.keys(action.statEffects).forEach(function (stat) {
        Game.StatsSystem.applyStat(dog, stat, action.statEffects[stat]);
      });
    }

    // Force sleep if energy depleted by action
    if (dog.stats.energy <= 0 && !dog.isAsleep) {
      dog.isAsleep = true;
      Game.EventBus.emit('dog:sleep', { dogId: dog.id });
      Game.EventBus.emit('notification', {
        text: dog.name + ' desmaiou de cansa\u00e7o!',
        type: 'warning'
      });
    }

    // Custom logic
    if (action.custom) {
      action.custom(dog);
    }

    // Set animation
    if (action.animation) {
      dog.actionAnimation = action.animation;
      if (action.animDuration > 0) {
        setTimeout(function () {
          dog.actionAnimation = null;
          Game.EventBus.emit('dog:animationEnd', { dogId: dog.id });
        }, action.animDuration);
      }
    }

    // Mark cooldown
    Game.Dog.markActionDone(dog, actionId);

    // Base action coin reward (3-5 random) with combo multiplier
    var baseReward = Math.floor(Math.random() * 3) + 3;
    var comboMult = Game.ComboSystem ? Game.ComboSystem.getMultiplier() : 0;
    var totalReward = Math.round(baseReward * (1 + comboMult));
    if (totalReward > 0) {
      Game.Player.addCoins(totalReward, comboMult > 0 ? 'A\u00e7\u00e3o (combo x' + (Game.ComboSystem.getCount()) + ')' : 'A\u00e7\u00e3o');
    }

    // Daily bonus
    if (!Game.State.player.dailyBonusClaimed) {
      Game.State.player.dailyBonusClaimed = true;
      Game.Player.addCoins(Game.Config.COINS.DAILY_BONUS, 'B\u00f4nus di\u00e1rio!');
    }

    // Emit event
    Game.EventBus.emit('action:performed', { actionId: actionId, dogId: dog.id });

    // Check achievements
    Game.Achievements.checkAll();

    // Auto-save
    Game.SaveManager.save();

    return {
      success: true,
      message: action.message(dog)
    };
  }

  function attemptLearnTrick(dog) {
    var breed = Game.Breeds.getById(dog.breedId);
    var learningAttr = breed ? breed.attributes.learning : 5;
    var successChance = (learningAttr / 10) * 0.5 + (dog.stats.energy / 100) * 0.3 + 0.1;

    // Find next unlearned trick
    var availableTricks = Game.Config.TRICKS.filter(function (t) {
      return dog.tricksLearned.indexOf(t.id) === -1;
    });

    // Also check special trick
    if (breed && breed.specialTrick && dog.tricksLearned.indexOf(breed.specialTrick.id) === -1) {
      // Special trick available after learning at least 4 regular tricks
      if (dog.tricksLearned.length >= 4) {
        availableTricks.push(breed.specialTrick);
      }
    }

    if (availableTricks.length === 0) {
      Game.EventBus.emit('notification', { text: dog.name + ' j\u00e1 sabe todos os truques!', type: 'info' });
      return;
    }

    // Sort by difficulty
    availableTricks.sort(function (a, b) { return (a.difficulty || 1) - (b.difficulty || 1); });
    var trick = availableTricks[0];

    // Apply learning stat increase
    Game.StatsSystem.applyStat(dog, 'learning', 15);

    if (Math.random() < successChance) {
      dog.tricksLearned.push(trick.id);
      Game.State.player.totalTricksLearned++;
      var coins = breed && trick.id === breed.specialTrick.id ?
        Game.Config.COINS.SPECIAL_TRICK_BONUS : Game.Config.COINS.TRICK_LEARNED;
      Game.Player.addCoins(coins, 'Truque: ' + trick.name);
      Game.EventBus.emit('notification', {
        text: dog.name + ' aprendeu: ' + trick.name + '!',
        type: 'success'
      });
    } else {
      Game.EventBus.emit('notification', {
        text: dog.name + ' quase conseguiu... tente de novo!',
        type: 'info'
      });
    }
  }

  function useItem(dog, itemId) {
    var item = Game.Items.getById(itemId);
    if (!item) return { success: false, message: 'Item n\u00e3o encontrado' };

    // Check breed exclusive
    if (item.breedExclusive && item.breedExclusive !== dog.breedId) {
      return { success: false, message: 'Item exclusivo de outra ra\u00e7a!' };
    }

    // Check inventory
    if (!Game.Player.hasItem(itemId)) {
      return { success: false, message: 'Voc\u00ea n\u00e3o tem esse item!' };
    }

    // Wearable items
    if (item.wearable) {
      dog.wearing = itemId;
      Game.EventBus.emit('notification', {
        text: dog.name + ' vestiu ' + item.name + '!',
        type: 'success'
      });
      return { success: true, message: dog.name + ' est\u00e1 estiloso!' };
    }

    // Consumable items - remove from inventory
    Game.Player.removeItem(itemId, 1);

    // Apply effects
    if (item.effect) {
      Object.keys(item.effect).forEach(function (stat) {
        Game.StatsSystem.applyStat(dog, stat, item.effect[stat]);
      });
    }

    // Animation
    if (item.category === 'food') {
      dog.actionAnimation = 'eating';
      setTimeout(function () { dog.actionAnimation = null; }, 1500);
    }

    Game.EventBus.emit('action:performed', { actionId: 'useItem', dogId: dog.id, itemId: itemId });
    Game.SaveManager.save();

    return { success: true, message: dog.name + ' usou ' + item.name + '!' };
  }

  return {
    getAction: getAction,
    getAvailableActions: getAvailableActions,
    performAction: performAction,
    useItem: useItem
  };
})();
