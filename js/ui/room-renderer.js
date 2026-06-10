var Game = Game || {};

// ============================================================
// Game.RoomRenderer — splits the room into a static decor layer
// (rebuilt only on housing/weather/hour change) and a dynamic
// content layer (dogs, owner, particles, on action). Replaces
// the old monolithic Game.UI.updateRoom which rebuilt everything
// on every event.
// ============================================================
Game.RoomRenderer = (function () {

  var cache = {
    housingId: null,
    skyKey: null,
    weatherKey: null,
    achievementHash: null,
    portraitDogId: null,
    layerRefs: {},
    mounted: false
  };

  // ----- helpers -----
  function getRoom() { return document.getElementById('game-room'); }

  function getCurrentHousing() {
    if (!Game.Player || !Game.Player.getCurrentHousing) {
      return { id: 0, bgClass: 'room--apt-small' };
    }
    return Game.Player.getCurrentHousing();
  }

  // ============================================================
  // mount(roomEl) — builds the layered scaffold ONCE per session
  // (or on housing change via invalidateAll). Stores DOM refs to
  // each layer in cache.layerRefs so subsequent partial updates
  // can target them directly without re-querying.
  // ============================================================
  function mount(roomEl) {
    roomEl = roomEl || getRoom();
    if (!roomEl || !Game.State) return;

    var housing = getCurrentHousing();

    // Set the root class with bgClass
    roomEl.className = 'home-screen__room ' + housing.bgClass;

    // Build the layered scaffold. Layers in z-order (back to front):
    var html = '' +
      '<div class="room__sky"></div>' +
      '<div class="room__wall"></div>' +
      '<div class="room__floor"></div>' +
      '<div class="room__decor-static"></div>' +
      '<div class="room__weather"></div>' +
      '<div class="room__furniture">' +
        '<div class="room__bed">' + Game.SvgRoom.BED_SVG + '</div>' +
        '<div class="room__bowl">' + Game.SvgRoom.BOWL_SVG + '</div>' +
      '</div>' +
      '<div class="room__dogs"></div>' +
      '<div class="room__particles"></div>' +
      '<div class="room__foreground"></div>' +
      '<div id="speech-bubble" class="speech-bubble"></div>' +
      '<div id="owner-sprite" class="owner-sprite owner-sprite--hidden"></div>' +
      '<div id="action-scene" class="action-scene"></div>';
    roomEl.innerHTML = html;

    // Cache layer refs
    cache.layerRefs = {
      root:       roomEl,
      sky:        roomEl.querySelector('.room__sky'),
      wall:       roomEl.querySelector('.room__wall'),
      floor:      roomEl.querySelector('.room__floor'),
      decor:      roomEl.querySelector('.room__decor-static'),
      weather:    roomEl.querySelector('.room__weather'),
      furniture:  roomEl.querySelector('.room__furniture'),
      dogs:       roomEl.querySelector('.room__dogs'),
      particles:  roomEl.querySelector('.room__particles'),
      foreground: roomEl.querySelector('.room__foreground')
    };

    cache.mounted = true;
    cache.housingId = housing.id;

    // Initial passes
    renderStaticDecor(housing.id);
    if (Game.State.gameTime) {
      renderAmbientLights(Game.State.gameTime.hour);
    }
    if (Game.State.weather) {
      renderWeatherLayer(Game.State.weather);
    }
    renderDynamic();
  }

  // ============================================================
  // invalidateAll — full reset, used when housing changes (so
  // tier-specific decor + bgClass are rebuilt).
  // ============================================================
  function invalidateAll() {
    cache.housingId = null;
    cache.skyKey = null;
    cache.weatherKey = null;
    cache.portraitDogId = null;
    cache.mounted = false;
    mount();
  }

  // ============================================================
  // renderStaticDecor(housingId) — populates the .room__decor-static
  // layer with tier-cumulative detailed SVG decoration HTML.
  // Falls back to the legacy emoji version if the SVG builder
  // throws (defensive — never crash the game over decoration).
  // ============================================================
  function renderStaticDecor(housingId) {
    var layer = cache.layerRefs.decor;
    if (!layer) return;
    try {
      layer.innerHTML = Game.SvgRoom.buildDecorations(housingId);
    } catch (e) {
      try { layer.innerHTML = Game.SvgRoom.legacyDecorations(housingId); }
      catch (e2) { layer.innerHTML = ''; }
    }
    // After rebuilding decor, refresh the sky + clock + trophies
    // so the new window pane, clock hands, and shelf are accurate.
    if (Game.State && Game.State.gameTime) {
      cache.skyKey = null; // force re-render
      cache.achievementHash = null; // force re-render
      renderSky(Game.State.gameTime.hour, Game.State.weather);
      renderClockHands(Game.State.gameTime.hour, Game.State.gameTime.minute);
      renderShelfTrophies();
    }
  }

  // ============================================================
  // renderSky(hour, weather) — sets the window pane gradient and
  // sun/moon position via CSS variables. Early-returns when the
  // sky bucket key is unchanged (max 4 updates per game-day).
  // ============================================================
  function renderSky(hour, weather) {
    var key = Game.SvgRoom.getSkyKey(hour);
    var weatherKey = (weather && weather.type) || 'sunny';
    if (cache.skyKey === key && cache.weatherKey === weatherKey) return;
    cache.skyKey = key;
    cache.weatherKey = weatherKey;

    var info = Game.SvgRoom.getSkyGradient(hour);
    var pane = cache.layerRefs.decor && cache.layerRefs.decor.querySelector('.room__window-pane');
    if (pane) {
      pane.style.fill = 'url(#room-sky-grad)';
      // Use a CSS variable for the gradient on the parent <div>
      var win = cache.layerRefs.decor.querySelector('.room__window');
      if (win) {
        win.style.setProperty('--sky-gradient', info.gradient);
      }
    }
    // Position sun/moon
    var sun = cache.layerRefs.decor && cache.layerRefs.decor.querySelector('.room__window-sun');
    var moon = cache.layerRefs.decor && cache.layerRefs.decor.querySelector('.room__window-moon');
    if (sun) {
      sun.setAttribute('cx', info.sun.x);
      sun.setAttribute('cy', info.sun.y);
      sun.style.opacity = info.sun.visible ? 1 : 0;
    }
    if (moon) {
      moon.setAttribute('cx', info.moon.x);
      moon.setAttribute('cy', info.moon.y);
      moon.style.opacity = info.moon.visible ? 1 : 0;
    }
  }

  // ============================================================
  // renderClockHands(hour, minute) — rotates the SVG clock hands
  // by setting --hour-deg / --min-deg on the .room__clock-svg.
  // Cheap (2 setProperty calls). Only runs when tier ≥ 2.
  // ============================================================
  function renderClockHands(hour, minute) {
    var clock = cache.layerRefs.decor && cache.layerRefs.decor.querySelector('.room__clock-svg');
    if (!clock) return;
    var hourDeg = ((hour % 12) + minute / 60) * 30;
    var minDeg = minute * 6;
    clock.style.setProperty('--hour-deg', hourDeg + 'deg');
    clock.style.setProperty('--min-deg', minDeg + 'deg');
  }

  // ============================================================
  // renderAmbientLights(hour) — toggles .room--night / .room--dusk
  // classes for CSS-driven lamp glow and night tint.
  // ============================================================
  function renderAmbientLights(hour) {
    var root = cache.layerRefs.root;
    if (!root) return;
    var isNight = (hour < 6 || hour >= 19);
    var isDusk = (hour >= 17 && hour < 19);
    root.classList.toggle('room--night', isNight);
    root.classList.toggle('room--dusk', isDusk);
  }

  // ============================================================
  // renderWeatherLayer(weather) — toggles weather modifier class.
  // ============================================================
  function renderWeatherLayer(weather) {
    var root = cache.layerRefs.root;
    if (!root) return;
    root.classList.remove('room--sunny', 'room--cloudy', 'room--rainy', 'room--snowy');
    var type = (weather && weather.type) || 'sunny';
    root.classList.add('room--' + type);
  }

  // ============================================================
  // renderShelfTrophies — populates the shelf items <g> with one
  // trophy SVG per unlocked achievement. First 3 are gold/silver/
  // bronze cups, the rest are stars.
  // ============================================================
  var TROPHY_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
  function renderShelfTrophies() {
    if (!Game.State || !Game.State.player) return;
    var slot = cache.layerRefs.decor && cache.layerRefs.decor.querySelector('.room__shelf-items');
    if (!slot) return; // shelf not present at this tier
    var unlocked = Game.State.player.achievements || [];
    var hash = unlocked.join('|');
    if (cache.achievementHash === hash) return;
    cache.achievementHash = hash;

    var html = '';
    var maxSlots = 6;
    var n = Math.min(unlocked.length, maxSlots);
    var startX = 70;
    var stepX = 5;
    for (var i = 0; i < n; i++) {
      var x = startX + i * stepX;
      if (i < 3) {
        // Gold/silver/bronze cup
        var col = TROPHY_COLORS[i];
        html += '<g class="room__trophy room__trophy--cup" transform="translate(' + x + ',8)">' +
          '<rect x="0" y="6" width="4" height="2" fill="' + col + '"/>' +
          '<path d="M-1,0 L5,0 L4,5 L0,5 Z" fill="' + col + '"/>' +
          '</g>';
      } else {
        // Star
        html += '<text x="' + x + '" y="14" font-size="6" fill="#FFD700">\u2605</text>';
      }
    }
    slot.innerHTML = html;
  }

  // ============================================================
  // renderDynamic — re-renders ONLY the dynamic content (dogs,
  // poop indicator). Owner sprite and action scene live in
  // their own elements created by mount() and managed by
  // dog-renderer's playActionScene / showOwner.
  // ============================================================
  function renderDynamic() {
    if (!cache.mounted) { mount(); return; }
    var roomEl = cache.layerRefs.root;
    if (!roomEl || !Game.State) return;

    // Poop indicator on floor — append to particles layer for cleanup
    var floorLayer = cache.layerRefs.floor;
    var existingPoop = roomEl.querySelector('.room__poop');
    if (Game.State.dogs.some(function (d) { return d.poopOnFloor; })) {
      if (!existingPoop) {
        var poop = document.createElement('div');
        poop.className = 'room__poop';
        poop.textContent = '\uD83D\uDCA9';
        roomEl.appendChild(poop);
      }
    } else if (existingPoop) {
      existingPoop.remove();
    }

    // Render dogs into the dedicated dogs layer
    if (Game.DogRenderer && Game.DogRenderer.renderDogsInRoom) {
      Game.DogRenderer.renderDogsInRoom(cache.layerRefs.dogs || roomEl);
    }
  }

  // ============================================================
  // spawnParticles(actionId) — Commit C implements visible
  // particle bursts. Stub for now (no-op).
  // ============================================================
  var PARTICLE_CONFIGS = {
    feed:    { glyph: '\uD83C\uDF5E', count: 5, anim: 'crumb-fall' },
    petisco: { glyph: '\uD83C\uDF6C', count: 4, anim: 'crumb-fall' },
    play:    { glyph: '\u2728',       count: 6, anim: 'sparkle-pop' },
    carinho: { glyph: '\u2764',       count: 5, anim: 'heart-rise' },
    bathe:   { glyph: '\u25CB',       count: 8, anim: 'bubble-rise' },
    walk:    { glyph: '\uD83D\uDC3E', count: 4, anim: 'paw-print' },
    teach:   { glyph: '\uD83C\uDFB5', count: 4, anim: 'note-rise' }
  };

  function spawnParticles(actionId) {
    var layer = cache.layerRefs.particles;
    if (!layer || layer.childElementCount > 30) return;
    var cfg = PARTICLE_CONFIGS[actionId];
    if (!cfg) return;
    for (var i = 0; i < cfg.count; i++) {
      var el = document.createElement('span');
      el.className = 'particle particle--' + actionId;
      el.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      el.style.animationDelay = (i * 60) + 'ms';
      el.textContent = cfg.glyph;
      layer.appendChild(el);
      el.addEventListener('animationend', function () { this.remove(); });
    }
  }

  return {
    mount: mount,
    invalidateAll: invalidateAll,
    renderStaticDecor: renderStaticDecor,
    renderSky: renderSky,
    renderClockHands: renderClockHands,
    renderAmbientLights: renderAmbientLights,
    renderWeatherLayer: renderWeatherLayer,
    renderShelfTrophies: renderShelfTrophies,
    renderDynamic: renderDynamic,
    spawnParticles: spawnParticles
  };
})();
