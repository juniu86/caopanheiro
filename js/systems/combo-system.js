var Game = Game || {};

Game.ComboSystem = (function () {
  function init() {
    Game.EventBus.on('action:performed', onActionPerformed);
    Game.EventBus.on('tick', onTick);
  }

  function getGameMinute() {
    var gt = Game.State.gameTime;
    return gt.day * 24 * 60 + gt.hour * 60 + gt.minute;
  }

  function onActionPerformed(data) {
    if (!Game.State || !data.actionId) return;
    var p = Game.State.player;
    var now = getGameMinute();

    // Reset combo if expired
    if (now > p.comboExpiry && p.comboActions.length > 0) {
      p.comboActions = [];
    }

    // Add action if distinct
    if (p.comboActions.indexOf(data.actionId) === -1) {
      p.comboActions.push(data.actionId);
    }

    // Extend expiry window
    p.comboExpiry = now + Game.Config.COMBO_WINDOW_MINUTES;

    // Track max combo for achievement
    if (p.comboActions.length > p.maxCombo) {
      p.maxCombo = p.comboActions.length;
    }

    // Notify if combo reached threshold
    var count = p.comboActions.length;
    if (count === 3 || count === 5 || count === 7) {
      var mult = getMultiplier();
      Game.EventBus.emit('notification', {
        text: '\uD83D\uDCA5 Combo x' + count + '! +' + Math.round(mult * 100) + '% b\u00f4nus!',
        type: 'coins'
      });
      Game.Audio.play('coin');
      Game.Achievements.checkAll();
    }
  }

  function onTick() {
    if (!Game.State) return;
    var p = Game.State.player;
    if (p.comboActions.length > 0 && getGameMinute() > p.comboExpiry) {
      p.comboActions = [];
      Game.EventBus.emit('combo:expired');
    }
  }

  function getMultiplier() {
    if (!Game.State) return 0;
    var count = Game.State.player.comboActions.length;
    var thresholds = Game.Config.COMBO_THRESHOLDS;
    var mult = 0;
    for (var i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i].count) {
        mult = thresholds[i].multiplier;
        break;
      }
    }
    return mult;
  }

  function isActive() {
    return Game.State && Game.State.player.comboActions.length >= 3 &&
           getGameMinute() <= Game.State.player.comboExpiry;
  }

  function getCount() {
    return Game.State ? Game.State.player.comboActions.length : 0;
  }

  return { init: init, getMultiplier: getMultiplier, isActive: isActive, getCount: getCount };
})();
