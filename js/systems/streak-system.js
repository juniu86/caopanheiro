var Game = Game || {};

Game.StreakSystem = (function () {
  function init() {
    if (!Game.State) return;
    checkStreak();
  }

  function getTodayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getYesterdayStr() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function checkStreak() {
    var p = Game.State.player;
    var today = getTodayStr();

    // Same day - already claimed
    if (p.lastStreakDate === today) return;

    var yesterday = getYesterdayStr();

    if (p.lastStreakDate === yesterday) {
      // Consecutive day!
      p.streak++;
    } else {
      // Streak broken or first login
      p.streak = 1;
    }

    p.lastStreakDate = today;

    var reward = getReward(p.streak);
    Game.Player.addCoins(reward, 'Streak dia ' + p.streak);

    // Show notification after a short delay so the game has time to render
    setTimeout(function () {
      var fireEmoji = '';
      for (var i = 0; i < Math.min(p.streak, 7); i++) fireEmoji += '\uD83D\uDD25';
      Game.EventBus.emit('notification', {
        text: fireEmoji + ' Dia ' + p.streak + ' seguido! +' + reward + ' PataCoins!',
        type: 'success'
      });
      Game.Audio.play('achievement');
      Game.Achievements.checkAll();
      Game.SaveManager.save();
    }, 800);
  }

  function getReward(day) {
    var rewards = Game.Config.STREAK_REWARDS;
    var index = Math.min(day - 1, rewards.length - 1);
    return rewards[Math.max(0, index)];
  }

  function getStreak() {
    return Game.State ? Game.State.player.streak : 0;
  }

  return { init: init, getStreak: getStreak, getReward: getReward };
})();
