var Game = Game || {};

Game.RandomEventsSystem = (function () {
  var EVENTS = [
    {
      id: 'cat_window', name: 'Gato na janela!', weight: 12,
      icon: '\uD83D\uDC31', desc: 'Um gato apareceu na janela! O cachorro latiu!',
      apply: function () {
        applyStatToSelected('happiness', 15);
        Game.Player.addCoins(10, 'Gato na janela');
      }
    },
    {
      id: 'sofa_coin', name: 'Moeda no sof\u00e1!', weight: 12,
      icon: '\uD83D\uDCB0', desc: 'Encontrou moedas perdidas no sof\u00e1!',
      apply: function () {
        var amount = Math.floor(Math.random() * 26) + 25;
        Game.Player.addCoins(amount, 'Moeda no sof\u00e1');
      }
    },
    {
      id: 'neighbor_treat', name: 'Vizinho trouxe petisco!', weight: 12,
      icon: '\uD83C\uDF56', desc: 'O vizinho trouxe um petisco gostoso!',
      apply: function () {
        applyStatToSelected('hunger', 20);
        Game.Player.addCoins(15, 'Petisco do vizinho');
      }
    },
    {
      id: 'mailman', name: 'Carteiro passou!', weight: 12,
      icon: '\uD83D\uDCEE', desc: 'O carteiro passou e o cachorro correu!',
      apply: function () {
        applyStatToSelected('happiness', 10);
        Game.Player.addCoins(5, 'Carteiro');
      }
    },
    {
      id: 'butterfly', name: 'Borboleta no jardim!', weight: 12,
      icon: '\uD83E\uDD8B', desc: 'Uma borboleta apareceu! Que lindo!',
      apply: function () {
        applyStatToSelected('happiness', 10);
        Game.Player.addCoins(10, 'Borboleta');
      }
    },
    {
      id: 'found_toy', name: 'Achado: brinquedo!', weight: 10,
      icon: '\uD83E\uDDF8', desc: 'Encontrou um brinquedo escondido!',
      apply: function () {
        var toys = Game.Items.getByCategory('toys');
        if (toys.length > 0) {
          var toy = toys[Math.floor(Math.random() * toys.length)];
          Game.Player.addItem(toy.id, 1);
          Game.EventBus.emit('notification', { text: 'Ganhou: ' + toy.name + '!', type: 'success' });
        }
      }
    },
    {
      id: 'coin_rain', name: 'Chuva de PataCoins!', weight: 5,
      icon: '\uD83C\uDF1F', desc: 'Choveu PataCoins do c\u00e9u!',
      apply: function () {
        var amount = Math.floor(Math.random() * 71) + 80;
        Game.Player.addCoins(amount, 'Chuva de PataCoins!');
      }
    },
    {
      id: 'solo_trick', name: 'Truque sozinho!', weight: 10,
      icon: '\uD83C\uDFAA', desc: 'O cachorro fez um truque sozinho!',
      apply: function () {
        applyStatToSelected('learning', 20);
        Game.Player.addCoins(20, 'Truque solo');
      }
    },
    {
      id: 'surprise_visit', name: 'Visita surpresa!', weight: 10,
      icon: '\uD83C\uDF89', desc: 'Um amigo veio visitar! Todos ficaram felizes!',
      apply: function () {
        Game.State.dogs.forEach(function (dog) {
          if (dog.hasRunAway) return;
          var stats = ['hunger', 'happiness', 'energy', 'hygiene', 'health'];
          stats.forEach(function (s) { Game.StatsSystem.applyStat(dog, s, 5); });
        });
        Game.Player.addCoins(15, 'Visita surpresa');
      }
    },
    {
      id: 'good_dream', name: 'Sonho bom!', weight: 10,
      icon: '\uD83D\uDCA4', desc: 'O cachorro teve um sonho lindo!',
      condition: function () {
        return Game.State.dogs.some(function (d) { return d.isAsleep; });
      },
      apply: function () {
        var sleeper = Game.State.dogs.find(function (d) { return d.isAsleep; });
        if (sleeper) {
          Game.StatsSystem.applyStat(sleeper, 'happiness', 25);
        }
        Game.Player.addCoins(10, 'Sonho bom');
      }
    }
  ];

  function applyStatToSelected(stat, amount) {
    var dog = Game.UI && Game.UI.getSelectedDog ? Game.UI.getSelectedDog() : null;
    if (!dog) dog = Game.State.dogs[0];
    if (dog) Game.StatsSystem.applyStat(dog, stat, amount);
  }

  function getTotalWeight() {
    var total = 0;
    EVENTS.forEach(function (e) {
      if (!e.condition || e.condition()) total += e.weight;
    });
    return total;
  }

  function pickRandomEvent() {
    var available = EVENTS.filter(function (e) { return !e.condition || e.condition(); });
    var totalWeight = 0;
    available.forEach(function (e) { totalWeight += e.weight; });
    var roll = Math.random() * totalWeight;
    var cumulative = 0;
    for (var i = 0; i < available.length; i++) {
      cumulative += available[i].weight;
      if (roll <= cumulative) return available[i];
    }
    return available[available.length - 1];
  }

  function init() {
    Game.EventBus.on('hourTick', onHourTick);
  }

  function onHourTick() {
    if (!Game.State || Game.State.dogs.length === 0) return;
    if (Math.random() < Game.Config.RANDOM_EVENT_CHANCE) {
      triggerEvent();
    }
  }

  function triggerEvent() {
    var event = pickRandomEvent();
    if (!event) return;

    event.apply();

    Game.EventBus.emit('notification', {
      text: event.icon + ' ' + event.desc,
      type: 'info'
    });
    Game.Audio.play('coin');
  }

  // For offline processing
  function processOfflineEvents(gameHoursElapsed) {
    var events = [];
    var hours = Math.floor(gameHoursElapsed);
    for (var i = 0; i < hours; i++) {
      if (Math.random() < Game.Config.RANDOM_EVENT_CHANCE) {
        var event = pickRandomEvent();
        if (event) {
          event.apply();
          events.push({ type: 'random_event', text: event.icon + ' ' + event.desc });
        }
      }
    }
    return events;
  }

  return { init: init, processOfflineEvents: processOfflineEvents };
})();
