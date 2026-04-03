var Game = Game || {};

Game.DogRenderer = (function () {
  var currentActionScene = null;
  var transparencyCache = {}; // cache processed data URLs by src

  // ===== REMOVE WHITE BACKGROUND VIA CANVAS =====
  function removeWhiteBackground(imgEl) {
    var src = imgEl.src;
    if (transparencyCache[src]) {
      imgEl.src = transparencyCache[src];
      return;
    }
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var w = imgEl.naturalWidth || imgEl.width;
    var h = imgEl.naturalHeight || imgEl.height;
    if (!w || !h) return;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(imgEl, 0, 0, w, h);
    try {
      var imageData = ctx.getImageData(0, 0, w, h);
      var d = imageData.data;
      var threshold = 235; // pixels with R,G,B all above this → transparent
      for (var i = 0; i < d.length; i += 4) {
        if (d[i] > threshold && d[i + 1] > threshold && d[i + 2] > threshold) {
          d[i + 3] = 0; // set alpha to 0
        } else if (d[i] > 210 && d[i + 1] > 210 && d[i + 2] > 210) {
          // Near-white: fade alpha proportionally for smooth edges
          var maxC = Math.max(d[i], d[i + 1], d[i + 2]);
          d[i + 3] = Math.round(255 * (1 - (maxC - 210) / (255 - 210)));
        }
      }
      ctx.putImageData(imageData, 0, 0);
      var dataUrl = canvas.toDataURL('image/png');
      transparencyCache[src] = dataUrl;
      imgEl.src = dataUrl;
    } catch (e) {
      // CORS or security error — leave image as-is
    }
  }

  // ===== BREED ID → PNG FILE PREFIX MAPPING =====
  var BREED_TO_PNG = {
    poodle: 'poodle_toy',
    shih_tzu: 'shih_tzu',
    yorkshire: 'yorkshire',
    chihuahua: 'chihuahua',
    pinscher: 'pinscher',
    lhasa_apso: 'lhasa_apso',
    maltes: 'malt\u00eas',
    pug: 'pug',
    beagle: 'beagle',
    cocker: 'cocker_spaniel',
    border_collie: 'border_collie',
    bulldog_frances: 'bulldog_franc\u00eas',
    bull_terrier: 'bull_terrier',
    basenji: 'basenji',
    schnauzer: 'schnauzer',
    corgi: 'corgi',
    golden: 'golden_retriever',
    labrador: 'labrador',
    husky: 'husky_siberiano',
    pastor_alemao: 'pastor_alemao',
    dalmata: 'dalmata',
    boxer: 'boxer',
    pitbull: 'pitbull',
    akita: 'akita',
    sao_bernardo: 'sao_bernardo',
    dogue_alemao: 'dogue_alemao',
    rottweiler: 'rottweiler',
    mastiff: 'mastiff',
    terra_nova: 'terra_nova',
    caramelo: 'caramelo',
    pretinho: 'pretinho'
  };

  // ===== getDogMood: determines PNG mood from dog stats =====
  function getDogMood(dog) {
    var s = dog.stats;
    if (dog.isAsleep) return 'dormindo';
    if (s.health < 25) return 'doente';
    if (s.hunger < 25) return 'com_fome';
    var avg = (s.hunger + s.happiness + s.energy + s.hygiene + s.health) / 5;
    if (avg < 35) return 'triste';
    return 'feliz';
  }

  // ===== getBreedImg: returns PNG path =====
  function getBreedImg(breedId, mood) {
    var prefix = BREED_TO_PNG[breedId] || breedId;
    return 'img/breeds/' + prefix + '_' + mood + '.png';
  }

  // ===== SVG FALLBACK: generates SVG HTML for breeds without PNGs =====
  function getSvgFallback(breedId, mood) {
    if (Game.SvgDogs && Game.SvgDogs.generate) {
      return Game.SvgDogs.generate(breedId, { mood: mood });
    }
    return '';
  }

  // ===== RENDER DOG SPRITE (main function) =====
  function renderDogSprite(dog, options) {
    options = options || {};
    var breed = Game.Breeds.getById(dog.breedId);
    if (!breed) return '';

    var sizeClass = 'dog-sprite-png--' + breed.group;
    if (breed.group === 'viralata') sizeClass = 'dog-sprite-png--medium';

    // Get PNG mood for image and CSS mood class
    var pngMood = getDogMood(dog);
    var imgSrc = getBreedImg(dog.breedId, pngMood);

    // Map PNG mood to CSS mood class
    var moodClass = '';
    if (!options.static) {
      var moodMap = {
        feliz: 'mood-feliz',
        triste: 'mood-triste',
        dormindo: 'mood-dormindo',
        com_fome: 'mood-com-fome',
        doente: 'mood-doente'
      };
      moodClass = moodMap[pngMood] || 'mood-feliz';
    }

    // Build SVG fallback for onerror
    var svgFallbackHtml = getSvgFallback(dog.breedId, Game.Dog.getMood(dog));
    var fallbackEscaped = svgFallbackHtml.replace(/'/g, "\\'").replace(/"/g, '&quot;');

    // Extras (flies for dirty dogs only — Zzz is now CSS ::after on .mood-dormindo)
    var extras = '';
    if (dog.stats.hygiene < 20 && !dog.isAsleep) {
      extras += '<span class="dog-flies"><span>\uD83E\uDEB0</span><span>\uD83E\uDEB0</span><span>\uD83E\uDEB0</span></span>';
    }

    return '<div class="dog-sprite-png ' + sizeClass + ' ' + moodClass + '">' +
      '<img src="' + imgSrc + '" alt="' + (breed.name || '') + '" ' +
        'draggable="false" ' +
        'onload="Game.DogRenderer._onImgLoad(this);" ' +
        'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline-block\';" />' +
      '<div class="dog-sprite-png__fallback" style="display:none;">' + svgFallbackHtml + '</div>' +
      extras +
    '</div>';
  }

  // ===== RENDER DOGS IN ROOM =====
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

      // Position dog based on state
      if (dog.isAsleep) {
        // Sleeping: on/near the bed (left side), staggered per dog
        var bedOffsets = [3, 20, 10, 28];
        wrapper.style.left = bedOffsets[index % 4] + '%';
        wrapper.style.bottom = '8%';
        wrapper.classList.add('dog-in-room--on-bed');
      } else if (dog.actionAnimation === 'eating') {
        // Eating: near the bowl (right side), staggered
        var bowlOffsets = [62, 72, 58, 68];
        wrapper.style.left = bowlOffsets[index % 4] + '%';
        wrapper.style.bottom = '10%';
        wrapper.classList.add('dog-in-room--at-bowl');
      } else {
        // Default positions in the room
        var positions = [30, 55, 15, 70];
        wrapper.style.left = positions[index % 4] + '%';
      }

      roomEl.appendChild(wrapper);
    });
  }

  // ===== RENDER BREED PREVIEW (shelter, detail modal, adoption) =====
  function renderBreedPreview(breedId) {
    var imgSrc = getBreedImg(breedId, 'feliz');
    var svgFallbackHtml = getSvgFallback(breedId, 'happy');

    return '<div class="dog-sprite-png dog-sprite-png--preview">' +
      '<img src="' + imgSrc + '" alt="" draggable="false" ' +
        'style="width:90px;height:90px;object-fit:contain;" ' +
        'onload="Game.DogRenderer._onImgLoad(this);" ' +
        'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline-block\';" />' +
      '<div class="dog-sprite-png__fallback" style="display:none;">' + svgFallbackHtml + '</div>' +
    '</div>';
  }

  // ===== OWNER CHARACTER (unchanged - still uses SVG) =====
  function showOwner(roomEl, action) {
    var ownerEl = document.getElementById('owner-sprite');
    if (!ownerEl) return;

    var ownerSvg = Game.SvgDogs.generateOwner({ action: action });
    ownerEl.innerHTML = ownerSvg;
    ownerEl.className = 'owner-sprite';

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

  // ===== ACTION SCENES (unchanged) =====
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

    showOwner(roomEl, actionId === 'feed' ? 'feeding' :
                       actionId === 'play' ? 'playing' :
                       actionId === 'bathe' ? 'bathing' :
                       actionId === 'carinho' ? 'carinho' : 'feeding');

    sceneEl.innerHTML =
      '<div class="action-scene__text">' + info.text + '</div>' +
      '<div class="action-scene__item" style="top:30%;left:45%;">' + info.emoji + '</div>';
    sceneEl.classList.add('action-scene--active');

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
    getDogMood: getDogMood,
    getBreedImg: getBreedImg,
    renderDogSprite: renderDogSprite,
    renderDogsInRoom: renderDogsInRoom,
    renderBreedPreview: renderBreedPreview,
    playActionScene: playActionScene,
    showOwner: showOwner,
    hideOwner: hideOwner,
    _onImgLoad: function (img) {
      // Skip if already processed (data URL)
      if (img.src.indexOf('data:') === 0) return;
      removeWhiteBackground(img);
    }
  };
})();
