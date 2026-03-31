var Game = Game || {};

Game.DogRenderer = (function () {
  function renderDogSprite(dog, options) {
    options = options || {};
    var breed = Game.Breeds.getById(dog.breedId);
    if (!breed) return '';

    var sizeClass = 'dog-sprite--' + breed.group;
    if (breed.group === 'viralata') sizeClass = 'dog-sprite--medium';
    var earClass = breed.earType === 'pointy' ? 'dog-sprite--pointy-ears' : '';
    var animClass = options.static ? '' : Game.Dog.getAnimationClass(dog);
    var breedClass = breed.spriteClass;

    var mood = Game.Dog.getMood(dog);
    var extras = '';
    if (dog.stats.hygiene < 20 && mood !== 'sleeping') {
      extras += '<span class="flies">\uD83E\uDEB0</span>';
    }
    if (dog.isAsleep) {
      extras += '<span class="zzz">ZZZ</span>';
    }

    return '<div class="dog-sprite ' + sizeClass + ' ' + earClass + ' ' + animClass + ' ' + breedClass + '">' +
      '<div class="dog-sprite__body">' +
        '<div class="dog-sprite__head">' +
          '<div class="dog-sprite__nose"></div>' +
          '<div class="dog-sprite__ear-left"></div>' +
          '<div class="dog-sprite__ear-right"></div>' +
        '</div>' +
        '<div class="dog-sprite__tail"></div>' +
        '<div class="dog-sprite__legs">' +
          '<div class="dog-sprite__leg"></div>' +
          '<div class="dog-sprite__leg"></div>' +
          '<div class="dog-sprite__leg"></div>' +
          '<div class="dog-sprite__leg"></div>' +
        '</div>' +
      '</div>' +
      extras +
    '</div>';
  }

  function renderDogsInRoom(roomEl) {
    if (!roomEl || !Game.State) return;
    // Clear existing dogs
    var existing = roomEl.querySelectorAll('.dog-in-room');
    existing.forEach(function (el) { el.remove(); });

    var selectedDog = Game.UI && Game.UI.getSelectedDog ? Game.UI.getSelectedDog() : null;
    var selectedDogId = selectedDog ? selectedDog.id : null;

    Game.State.dogs.forEach(function (dog, index) {
      if (dog.hasRunAway) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'dog-in-room';
      if (dog.id === selectedDogId) {
        wrapper.classList.add('dog-in-room--selected');
      }
      wrapper.innerHTML = renderDogSprite(dog);
      wrapper.setAttribute('data-dog-id', dog.id);
      wrapper.addEventListener('click', function () {
        Game.EventBus.emit('dog:selected', { dogId: dog.id });
      });

      // Position based on index
      var positions = [30, 55, 15, 70];
      wrapper.style.left = positions[index % 4] + '%';

      roomEl.appendChild(wrapper);
    });
  }

  function renderBreedPreview(breedId) {
    var breed = Game.Breeds.getById(breedId);
    if (!breed) return '';

    // Use emoji for simpler preview in shelter
    return '<div class="breed-emoji" style="font-size: 4rem;">' + breed.emoji + '</div>';
  }

  return {
    renderDogSprite: renderDogSprite,
    renderDogsInRoom: renderDogsInRoom,
    renderBreedPreview: renderBreedPreview
  };
})();
