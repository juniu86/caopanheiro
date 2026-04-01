var Game = Game || {};

Game.DogRenderer = (function () {
  var currentActionScene = null;

  function renderDogSprite(dog, options) {
    options = options || {};
    var breed = Game.Breeds.getById(dog.breedId);
    if (!breed) return '';

    var sizeClass = 'dog-sprite-svg--' + breed.group;
    if (breed.group === 'viralata') sizeClass = 'dog-sprite-svg--medium';
    var animClass = options.static ? '' : Game.Dog.getAnimationClass(dog);

    var mood = Game.Dog.getMood(dog);
    var svgOpts = { mood: mood };
    if (dog.isAsleep) svgOpts.mood = 'sleeping';

    var svgHtml = Game.SvgDogs.generate(dog.breedId, svgOpts);

    var extras = '';
    if (dog.stats.hygiene < 20 && mood !== 'sleeping') {
      extras += '<span class="dog-flies"><span>\uD83E\uDEB0</span><span>\uD83E\uDEB0</span><span>\uD83E\uDEB0</span></span>';
    }
    if (dog.isAsleep) {
      extras += '<span class="dog-zzz">Z<span style="font-size:0.7em;animation-delay:0.6s;">z</span><span style="font-size:0.5em;animation-delay:1.2s;">z</span></span>';
    }

    return '<div class="dog-sprite-svg ' + sizeClass + ' ' + animClass + '">' +
      svgHtml + extras +
    '</div>';
  }

  function renderDogsInRoom(roomEl) {
    if (!roomEl || !Game.State) return;
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

      var positions = [35, 60, 15, 75];
      wrapper.style.left = positions[index % 4] + '%';

      roomEl.appendChild(wrapper);
    });
  }

  function renderBreedPreview(breedId) {
    var svgHtml = Game.SvgDogs.generate(breedId, { mood: 'happy' });
    return '<div class="dog-sprite-svg dog-sprite-svg--medium dog-sprite-svg--idle">' + svgHtml + '</div>';
  }

  // ===== OWNER CHARACTER =====
  function showOwner(roomEl, action) {
    var ownerEl = document.getElementById('owner-sprite');
    if (!ownerEl) return;

    var ownerSvg = Game.SvgDogs.generateOwner({ action: action });
    ownerEl.innerHTML = ownerSvg;
    ownerEl.className = 'owner-sprite';

    // Position owner next to selected dog
    var selectedDogEl = roomEl.querySelector('.dog-in-room--selected');
    if (selectedDogEl) {
      var dogLeft = parseInt(selectedDogEl.style.left) || 35;
      ownerEl.style.left = Math.max(5, dogLeft - 18) + '%';
      ownerEl.style.bottom = '10%';
    } else {
      ownerEl.style.left = '15%';
      ownerEl.style.bottom = '10%';
    }

    if (action) {
      ownerEl.classList.add('owner-sprite--' + action);
    }
  }

  function hideOwner() {
    var ownerEl = document.getElementById('owner-sprite');
    if (ownerEl) {
      ownerEl.className = 'owner-sprite owner-sprite--hidden';
      ownerEl.innerHTML = '';
    }
  }

  // ===== ACTION SCENES =====
  var actionSceneItems = {
    feed: { emoji: '\uD83C\uDF56', text: 'Nhom nhom!' },
    play: { emoji: '\u26BD', text: 'Vamos brincar!' },
    bathe: { emoji: '\uD83D\uDEC1', text: 'Banho time!' },
    sleep: { emoji: '\uD83D\uDE34', text: 'Boa noite...' },
    carinho: { emoji: '\u2764\uFE0F', text: 'Cafun\u00e9!' },
    walk: { emoji: '\uD83D\uDEB6', text: 'Passeio!' },
    teach: { emoji: '\uD83C\uDFAA', text: 'Bom garoto!' },
    vet: { emoji: '\uD83C\uDFE5', text: 'Veterin\u00e1rio!' },
    petisco: { emoji: '\uD83E\uDD5C', text: 'Petisco!' },
    cleanPoop: { emoji: '\uD83E\uDDF9', text: 'Limpinho!' }
  };

  function playActionScene(roomEl, actionId, callback) {
    var sceneEl = document.getElementById('action-scene');
    if (!sceneEl) { if (callback) callback(); return; }

    var info = actionSceneItems[actionId];
    if (!info) { if (callback) callback(); return; }

    // Show owner
    showOwner(roomEl, actionId === 'feed' ? 'feeding' :
                       actionId === 'play' ? 'playing' :
                       actionId === 'bathe' ? 'bathing' :
                       actionId === 'carinho' ? 'carinho' : 'feeding');

    // Show action scene
    sceneEl.innerHTML =
      '<div class="action-scene__text">' + info.text + '</div>' +
      '<div class="action-scene__item" style="top:30%;left:45%;">' + info.emoji + '</div>';
    sceneEl.classList.add('action-scene--active');

    // Clear after animation
    if (currentActionScene) clearTimeout(currentActionScene);
    currentActionScene = setTimeout(function () {
      sceneEl.classList.remove('action-scene--active');
      sceneEl.innerHTML = '';
      hideOwner();
      currentActionScene = null;
      if (callback) callback();
    }, 2000);
  }

  return {
    renderDogSprite: renderDogSprite,
    renderDogsInRoom: renderDogsInRoom,
    renderBreedPreview: renderBreedPreview,
    playActionScene: playActionScene,
    showOwner: showOwner,
    hideOwner: hideOwner
  };
})();
