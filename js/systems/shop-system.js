var Game = Game || {};

Game.ShopSystem = (function () {
  function buyItem(itemId) {
    var item = Game.Items.getById(itemId);
    if (!item) return { success: false, message: 'Item n\u00e3o encontrado.' };

    if (!Game.Player.canAfford(item.price)) {
      return { success: false, message: 'PataCoins insuficientes!' };
    }

    Game.Player.spendCoins(item.price, 'Compra: ' + item.name);
    Game.Player.addItem(itemId, 1);
    Game.State.player.totalItemsBought++;

    Game.EventBus.emit('item:bought', { item: item });
    Game.Achievements.checkAll();
    Game.SaveManager.save();

    return { success: true, message: 'Comprou ' + item.name + '!' };
  }

  function getShopItems(category) {
    var items = Game.Items.getByCategory(category);

    // Add breed exclusive items if player has that breed
    if (Game.State && Game.State.dogs.length > 0) {
      Game.State.dogs.forEach(function (dog) {
        var exclusives = Game.Items.getExclusiveForBreed(dog.breedId);
        exclusives.forEach(function (item) {
          if (item.category === category) {
            items.push(item);
          }
        });
      });
    }

    return items;
  }

  return { buyItem: buyItem, getShopItems: getShopItems };
})();
