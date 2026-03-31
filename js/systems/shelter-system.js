var Game = Game || {};

Game.ShelterSystem = (function () {
  function adoptDog(breedId, name) {
    if (!Game.Player.canAdoptMore()) {
      return { success: false, message: 'Sua casa est\u00e1 cheia! Melhore sua moradia.' };
    }

    var breed = Game.Breeds.getById(breedId);
    if (!breed) {
      return { success: false, message: 'Ra\u00e7a n\u00e3o encontrada.' };
    }

    var dog = Game.Dog.create(breedId, name);
    Game.State.dogs.push(dog);
    Game.State.player.totalDogsAdopted++;

    if (Game.State.player.totalBreedsAdopted.indexOf(breedId) === -1) {
      Game.State.player.totalBreedsAdopted.push(breedId);
    }

    Game.EventBus.emit('dog:adopted', { dog: dog, breed: breed });
    Game.Achievements.checkAll();
    Game.SaveManager.save();

    return { success: true, dog: dog };
  }

  function rescueRunaway(dogId) {
    var idx = -1;
    for (var i = 0; i < Game.State.runawayDogs.length; i++) {
      if (Game.State.runawayDogs[i].id === dogId) { idx = i; break; }
    }
    if (idx === -1) return { success: false, message: 'Cachorro n\u00e3o encontrado.' };
    if (!Game.Player.canAdoptMore()) {
      return { success: false, message: 'Sua casa est\u00e1 cheia!' };
    }

    var dog = Game.State.runawayDogs.splice(idx, 1)[0];
    dog.hasRunAway = false;
    dog.neglectCounter = 0;
    dog.stats.hunger = 50;
    dog.stats.happiness = 50;
    dog.stats.energy = 50;
    dog.stats.hygiene = 50;
    dog.stats.health = 60;
    Game.State.dogs.push(dog);

    Game.EventBus.emit('dog:rescued', { dog: dog });
    Game.Achievements.checkAll();
    Game.SaveManager.save();

    return { success: true, dog: dog };
  }

  return { adoptDog: adoptDog, rescueRunaway: rescueRunaway };
})();
