var Game = Game || {};

Game.DogRenderer = (function () {
  var currentActionScene = null;
  var transparencyCache = {}; // cache processed data URLs by src

  // ===== REMOVE WHITE BACKGROUND VIA CANVAS =====
  // Detects and removes both pure-white backgrounds AND the photoshop
  // transparency-checker pattern (alternating white + ~#CCCCCC gray) that some
  // exported PNGs accidentally bake into pixel data.
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

      // ----- Detect photoshop checker by sampling 4x4 patches in each corner.
      // Only enable checker-removal if at least one corner contains BOTH
      // pure white AND a near-grayscale pixel in the ~#CCCCCC band.
      function cornerHasChecker(x0, y0) {
        var hasWhite = false;
        var hasCheckerGray = false;
        for (var dy = 0; dy < 4; dy++) {
          for (var dx = 0; dx < 4; dx++) {
            var idx = ((y0 + dy) * w + (x0 + dx)) * 4;
            var r = d[idx], g = d[idx + 1], b = d[idx + 2];
            if (r > 235 && g > 235 && b > 235) hasWhite = true;
            if (Math.abs(r - g) <= 4 && Math.abs(g - b) <= 4 && r >= 195 && r <= 215) {
              hasCheckerGray = true;
            }
          }
        }
        return hasWhite && hasCheckerGray;
      }
      var isCheckerImage =
        cornerHasChecker(0, 0) ||
        cornerHasChecker(w - 4, 0) ||
        cornerHasChecker(0, h - 4) ||
        cornerHasChecker(w - 4, h - 4);

      // ----- Pass 1: white removal (always) + checker gray removal (conditional)
      for (var i = 0; i < d.length; i += 4) {
        var pr = d[i], pg = d[i + 1], pb = d[i + 2];
        if (pr > 235 && pg > 235 && pb > 235) {
          d[i + 3] = 0;
          continue;
        }
        if (pr > 210 && pg > 210 && pb > 210) {
          var maxC = Math.max(pr, pg, pb);
          d[i + 3] = Math.round(255 * (1 - (maxC - 210) / (255 - 210)));
          continue;
        }
        if (isCheckerImage) {
          var minC = Math.min(pr, pg, pb);
          var maxC2 = Math.max(pr, pg, pb);
          var chroma = maxC2 - minC;
          // Strict grayscale in checker-gray band (real fur has tint → chroma > 6)
          if (chroma <= 6 && pr >= 190 && pr <= 220) {
            d[i + 3] = 0;
          }
        }
      }

      // ----- Pass 2: edge softening — fade near-checker pixels touching transparency
      if (isCheckerImage) {
        var orig = new Uint8ClampedArray(d); // snapshot for neighbor check
        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var p = (y * w + x) * 4;
            if (orig[p + 3] === 0) continue;
            var r2 = orig[p], g2 = orig[p + 1], b2 = orig[p + 2];
            var ch2 = Math.max(r2, g2, b2) - Math.min(r2, g2, b2);
            if (ch2 > 8 || r2 < 175 || r2 > 230) continue;
            // Check 4-connectivity for transparent neighbor
            var hasTransparentNeighbor = false;
            if (x > 0     && orig[p - 4 + 3] === 0) hasTransparentNeighbor = true;
            else if (x < w - 1 && orig[p + 4 + 3] === 0) hasTransparentNeighbor = true;
            else if (y > 0     && orig[p - w * 4 + 3] === 0) hasTransparentNeighbor = true;
            else if (y < h - 1 && orig[p + w * 4 + 3] === 0) hasTransparentNeighbor = true;
            if (hasTransparentNeighbor) {
              d[p + 3] = Math.round(d[p + 3] * 0.4);
            }
          }
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
  // Distributes dogs evenly across the room (or near bed/bowl when sleeping/eating).
  // Applies a crowd class so CSS can scale sprites down when 3+ dogs are present.
  function renderDogsInRoom(roomEl) {
    if (!roomEl || !Game.State) return;
    var existing = roomEl.querySelectorAll('.dog-in-room');
    existing.forEach(function (el) { el.remove(); });

    var selectedDog = Game.UI && Game.UI.getSelectedDog ? Game.UI.getSelectedDog() : null;
    var selectedDogId = selectedDog ? selectedDog.id : null;

    var dogs = Game.State.dogs.filter(function (d) { return !d.hasRunAway; });

    // Apply crowd class so CSS can scale sprites for 3+ dogs
    roomEl.classList.remove('room--crowd-1', 'room--crowd-2', 'room--crowd-3', 'room--crowd-4');
    if (dogs.length > 0) {
      roomEl.classList.add('room--crowd-' + Math.min(4, dogs.length));
    }

    var idleDogs = dogs.filter(function (d) {
      return !d.isAsleep && d.actionAnimation !== 'eating';
    });
    var sleepingDogs = dogs.filter(function (d) { return d.isAsleep; });
    var eatingDogs = dogs.filter(function (d) { return d.actionAnimation === 'eating'; });

    // Idle dogs: evenly spaced across the band 18%–82% (reserves room for bed/bowl)
    function getIdleSlot(idx, count) {
      if (count <= 1) return 50;
      return 18 + idx * (64 / (count - 1));
    }

    var sleepLefts = [4, 11, 6, 13];
    var sleepBottoms = [6, 10, 14, 8];
    var eatLefts = [62, 70, 66, 74];
    var eatBottoms = [10, 14, 8, 12];

    function placeDog(dog, leftPct, bottomPct, modifier) {
      var wrapper = document.createElement('div');
      wrapper.className = 'dog-in-room';
      if (dog.id === selectedDogId) {
        wrapper.classList.add('dog-in-room--selected');
      }
      if (modifier) {
        wrapper.classList.add('dog-in-room--' + modifier);
      }
      wrapper.innerHTML = renderDogSprite(dog);
      wrapper.setAttribute('data-dog-id', dog.id);
      wrapper.addEventListener('click', function () {
        Game.EventBus.emit('dog:selected', { dogId: dog.id });
      });
      wrapper.style.left = leftPct + '%';
      wrapper.style.bottom = bottomPct + '%';
      roomEl.appendChild(wrapper);
    }

    idleDogs.forEach(function (dog, i) {
      placeDog(dog, getIdleSlot(i, idleDogs.length), 12);
    });
    sleepingDogs.forEach(function (dog, i) {
      placeDog(dog, sleepLefts[i % 4], sleepBottoms[i % 4], 'on-bed');
    });
    eatingDogs.forEach(function (dog, i) {
      placeDog(dog, eatLefts[i % 4], eatBottoms[i % 4], 'at-bowl');
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
