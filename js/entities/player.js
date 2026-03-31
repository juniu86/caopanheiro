var Game = Game || {};

Game.Player = (function () {
  function addCoins(amount, reason) {
    if (!Game.State) return;
    Game.State.player.pataCoins += amount;
    if (Game.State.player.pataCoins > Game.State.player.maxPataCoins) {
      Game.State.player.maxPataCoins = Game.State.player.pataCoins;
    }
    Game.EventBus.emit('coins:earned', { amount: amount, reason: reason });
  }

  function spendCoins(amount, reason) {
    if (!Game.State) return false;
    if (Game.State.player.pataCoins < amount) return false;
    Game.State.player.pataCoins -= amount;
    Game.EventBus.emit('coins:spent', { amount: amount, reason: reason });
    return true;
  }

  function canAfford(amount) {
    return Game.State && Game.State.player.pataCoins >= amount;
  }

  function getCurrentHousing() {
    if (!Game.State) return Game.Config.HOUSING[0];
    return Game.Config.HOUSING[Game.State.player.housingLevel];
  }

  function getMaxDogs() {
    return getCurrentHousing().maxDogs;
  }

  function canAdoptMore() {
    if (!Game.State) return false;
    return Game.State.dogs.length < getMaxDogs();
  }

  function hasItem(itemId) {
    if (!Game.State) return false;
    return Game.State.player.inventory.some(function (inv) {
      return inv.itemId === itemId && inv.quantity > 0;
    });
  }

  function addItem(itemId, quantity) {
    if (!Game.State) return;
    quantity = quantity || 1;
    var existing = Game.State.player.inventory.find(function (inv) {
      return inv.itemId === itemId;
    });
    if (existing) {
      existing.quantity += quantity;
    } else {
      Game.State.player.inventory.push({ itemId: itemId, quantity: quantity });
    }
  }

  function removeItem(itemId, quantity) {
    if (!Game.State) return false;
    quantity = quantity || 1;
    var existing = Game.State.player.inventory.find(function (inv) {
      return inv.itemId === itemId;
    });
    if (!existing || existing.quantity < quantity) return false;
    existing.quantity -= quantity;
    if (existing.quantity <= 0) {
      Game.State.player.inventory = Game.State.player.inventory.filter(function (inv) {
        return inv.itemId !== itemId;
      });
    }
    return true;
  }

  function getItemCount(itemId) {
    if (!Game.State) return 0;
    var existing = Game.State.player.inventory.find(function (inv) {
      return inv.itemId === itemId;
    });
    return existing ? existing.quantity : 0;
  }

  return {
    addCoins: addCoins,
    spendCoins: spendCoins,
    canAfford: canAfford,
    getCurrentHousing: getCurrentHousing,
    getMaxDogs: getMaxDogs,
    canAdoptMore: canAdoptMore,
    hasItem: hasItem,
    addItem: addItem,
    removeItem: removeItem,
    getItemCount: getItemCount
  };
})();
