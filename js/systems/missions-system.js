var Game = Game || {};

Game.MissionsSystem = (function () {
  var TEMPLATES = [
    { type: 'action', actionId: 'feed', minTarget: 2, maxTarget: 5, verb: 'Alimentar' },
    { type: 'action', actionId: 'play', minTarget: 2, maxTarget: 4, verb: 'Brincar' },
    { type: 'action', actionId: 'bathe', minTarget: 1, maxTarget: 3, verb: 'Dar banho' },
    { type: 'action', actionId: 'walk', minTarget: 1, maxTarget: 3, verb: 'Passear' },
    { type: 'action', actionId: 'teach', minTarget: 1, maxTarget: 3, verb: 'Ensinar truques' },
    { type: 'action', actionId: 'carinho', minTarget: 3, maxTarget: 6, verb: 'Dar carinho' },
    { type: 'action', actionId: 'petisco', minTarget: 1, maxTarget: 3, verb: 'Dar petisco' },
    { type: 'earn_coins', minTarget: 50, maxTarget: 150, verb: 'Ganhar' },
    { type: 'stats_above', minThreshold: 60, maxThreshold: 80, verb: 'Manter stats acima de' }
  ];

  function init() {
    Game.EventBus.on('action:performed', onActionPerformed);
    Game.EventBus.on('coins:earned', onCoinsEarned);
    Game.EventBus.on('hourTick', onHourTick);
    checkAndGenerateMissions();
  }

  function getTodayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function checkAndGenerateMissions() {
    if (!Game.State) return;
    var today = getTodayStr();
    if (Game.State.player.lastMissionDay !== today) {
      generateDailyMissions();
    }
  }

  function generateDailyMissions() {
    var p = Game.State.player;
    p.lastMissionDay = getTodayStr();
    p.allMissionsBonus = false;
    p.dailyMissions = [];

    // Pick 3 distinct templates
    var shuffled = TEMPLATES.slice().sort(function () { return Math.random() - 0.5; });
    var picked = shuffled.slice(0, 3);

    picked.forEach(function (tmpl, index) {
      var mission = {
        id: 'mission_' + index,
        type: tmpl.type,
        progress: 0,
        completed: false,
        reward: randInt(40, 60)
      };

      if (tmpl.type === 'action') {
        mission.actionId = tmpl.actionId;
        mission.target = randInt(tmpl.minTarget, tmpl.maxTarget);
        mission.description = tmpl.verb + ' ' + mission.target + ' vezes';
        mission.icon = getActionIcon(tmpl.actionId);
      } else if (tmpl.type === 'earn_coins') {
        mission.target = randInt(tmpl.minTarget, tmpl.maxTarget);
        mission.description = tmpl.verb + ' ' + mission.target + ' PataCoins';
        mission.icon = '\uD83D\uDCB0';
      } else if (tmpl.type === 'stats_above') {
        mission.threshold = randInt(tmpl.minThreshold, tmpl.maxThreshold);
        mission.target = 1; // 1 hour with all stats above threshold
        mission.description = tmpl.verb + ' ' + mission.threshold + ' por 1h';
        mission.icon = '\uD83D\uDCCA';
      }

      p.dailyMissions.push(mission);
    });
  }

  function getActionIcon(actionId) {
    var icons = {
      feed: '\uD83C\uDF56', play: '\u26BD', bathe: '\uD83D\uDEC1',
      walk: '\uD83D\uDEB6', teach: '\uD83C\uDFAA', carinho: '\u2764\uFE0F',
      petisco: '\uD83E\uDD5C'
    };
    return icons[actionId] || '\uD83D\uDC3E';
  }

  function onActionPerformed(data) {
    if (!Game.State) return;
    Game.State.player.dailyMissions.forEach(function (m) {
      if (m.completed) return;
      if (m.type === 'action' && m.actionId === data.actionId) {
        m.progress++;
        checkCompletion(m);
      }
    });
  }

  function onCoinsEarned(data) {
    if (!Game.State || !data.amount) return;
    Game.State.player.dailyMissions.forEach(function (m) {
      if (m.completed) return;
      if (m.type === 'earn_coins') {
        m.progress += data.amount;
        checkCompletion(m);
      }
    });
  }

  function onHourTick() {
    if (!Game.State || Game.State.dogs.length === 0) return;
    Game.State.player.dailyMissions.forEach(function (m) {
      if (m.completed || m.type !== 'stats_above') return;
      var allAbove = Game.State.dogs.every(function (dog) {
        if (dog.hasRunAway) return true;
        var s = dog.stats;
        return s.hunger >= m.threshold && s.happiness >= m.threshold &&
               s.energy >= m.threshold && s.hygiene >= m.threshold && s.health >= m.threshold;
      });
      if (allAbove) {
        m.progress++;
        checkCompletion(m);
      }
    });
  }

  function checkCompletion(mission) {
    if (mission.progress >= mission.target && !mission.completed) {
      mission.completed = true;
      Game.Player.addCoins(mission.reward, 'Miss\u00e3o: ' + mission.description);
      Game.EventBus.emit('notification', {
        text: '\u2705 Miss\u00e3o completa: ' + mission.description + '!',
        type: 'success'
      });
      Game.Audio.play('achievement');

      // Check all 3 complete bonus
      var p = Game.State.player;
      if (!p.allMissionsBonus) {
        var allDone = p.dailyMissions.every(function (m) { return m.completed; });
        if (allDone) {
          p.allMissionsBonus = true;
          Game.Player.addCoins(100, 'Todas as miss\u00f5es completas!');
          Game.EventBus.emit('notification', {
            text: '\uD83C\uDF1F TODAS as miss\u00f5es completas! +100 b\u00f4nus!',
            type: 'success'
          });
        }
      }
    }
  }

  function getMissions() {
    return Game.State ? Game.State.player.dailyMissions : [];
  }

  return { init: init, getMissions: getMissions, checkAndGenerateMissions: checkAndGenerateMissions };
})();
