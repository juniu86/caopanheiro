var Game = Game || {};

Game.ProgressionSystem = (function () {
  function canUpgrade() {
    if (!Game.State) return false;
    var current = Game.State.player.housingLevel;
    if (current >= Game.Config.HOUSING.length - 1) return false;
    var nextCost = Game.Config.HOUSING[current + 1].upgradeCost;
    return Game.Player.canAfford(nextCost);
  }

  function getNextHousing() {
    if (!Game.State) return null;
    var current = Game.State.player.housingLevel;
    if (current >= Game.Config.HOUSING.length - 1) return null;
    return Game.Config.HOUSING[current + 1];
  }

  function upgrade() {
    if (!canUpgrade()) return { success: false, message: 'N\u00e3o pode melhorar agora.' };

    var next = getNextHousing();
    Game.Player.spendCoins(next.upgradeCost, 'Moradia: ' + next.name);
    Game.State.player.housingLevel = next.id;

    Game.EventBus.emit('housing:upgraded', { level: next.id, housing: next });
    Game.Achievements.checkAll();
    Game.SaveManager.save();

    return { success: true, message: 'Bem-vindo ao ' + next.name + '!' };
  }

  return { canUpgrade: canUpgrade, getNextHousing: getNextHousing, upgrade: upgrade };
})();
