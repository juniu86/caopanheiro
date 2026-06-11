var Game = Game || {};

Game.UI = (function () {
  var selectedDogId = null;
  var rafId = null;

  function init() {
    Game.EventBus.on('dog:selected', function (data) {
      selectedDogId = data.dogId;
      updateHomeScreen();
    });

    Game.EventBus.on('tick', function () {
      if (Game.ScreenManager.getCurrent() === 'screen-home') {
        updateTopBar();
        updateStatsPanel();
        // Update analog clock hands when housing tier supports it (≥ 2)
        if (Game.RoomRenderer && Game.Player) {
          var housing = Game.Player.getCurrentHousing();
          if (housing && housing.id >= 2) {
            Game.RoomRenderer.renderClockHands(
              Game.State.gameTime.hour,
              Game.State.gameTime.minute
            );
          }
        }
      }
    });

    Game.EventBus.on('action:performed', function () {
      updateHomeScreen();
    });

    Game.EventBus.on('dog:animationEnd', function () {
      Game.RoomRenderer.renderDynamic();
    });

    Game.EventBus.on('housing:upgraded', function () {
      Game.RoomRenderer.invalidateAll();
    });

    Game.EventBus.on('action:performed', function (data) {
      Game.RoomRenderer.spawnParticles(data && data.actionId);
    });

    Game.EventBus.on('hourTick', function (data) {
      Game.RoomRenderer.renderAmbientLights(data.hour);
      Game.RoomRenderer.renderSky(data.hour, Game.State.weather);
    });

    Game.EventBus.on('weather:changed', function (data) {
      Game.RoomRenderer.renderWeatherLayer(data.weather);
      Game.RoomRenderer.renderSky(Game.State.gameTime.hour, data.weather);
    });

    Game.EventBus.on('achievement:unlocked', function () {
      Game.RoomRenderer.renderShelfTrophies();
    });

    Game.EventBus.on('dog:adopted', function () {
      // Refresh decor so the painting picks up the new dog portrait
      var housing = Game.Player && Game.Player.getCurrentHousing();
      if (housing) Game.RoomRenderer.renderStaticDecor(housing.id);
    });

    // Mount the layered room scaffold once at init.
    var roomEl = document.getElementById('game-room');
    if (roomEl && Game.RoomRenderer) {
      Game.RoomRenderer.mount(roomEl);
    }

    decorateStaticIcons();
    startRenderLoop();
  }

  // Substitui os emojis estáticos do HTML (nav buttons, moedas do
  // HUD, botão de moradia) pelos ícones SVG próprios. Os emojis
  // permanecem no HTML como fallback caso o JS não carregue.
  function decorateStaticIcons() {
    if (!Game.Icons) return;

    document.querySelectorAll('.nav-btn[data-nav]').forEach(function (btn) {
      var iconEl = btn.querySelector('.nav-btn__icon');
      var navId = btn.getAttribute('data-nav');
      var svg = Game.Icons.getNavIcon(navId, { size: 22 });
      if (iconEl && svg) iconEl.innerHTML = svg;
    });

    document.querySelectorAll('.hud-coin').forEach(function (el) {
      el.innerHTML = Game.Icons.get('coin', { size: 18, className: 'hud-coin__svg' });
    });

    var housingBtn = document.querySelector('.top-bar__settings[data-nav="housing"]');
    if (housingBtn) {
      housingBtn.innerHTML = Game.Icons.get('home', { size: 20 });
    }

    // Pata grande da tela de nome
    document.querySelectorAll('.screen-pawmark').forEach(function (el) {
      el.innerHTML = Game.Icons.get('paw', { size: 64 });
    });

    // Ícones de título de tela (ex.: Abrigo)
    document.querySelectorAll('.screen-title-icon[data-icon]').forEach(function (el) {
      el.innerHTML = Game.Icons.get(el.getAttribute('data-icon'), { size: 22 });
    });
  }

  function startRenderLoop() {
    function loop() {
      rafId = requestAnimationFrame(loop);
    }
    loop();
  }

  // ===== TOP BAR =====
  function updateTopBar() {
    var coinsEl = document.getElementById('top-coins');
    var clockEl = document.getElementById('top-clock');
    var dayEl = document.getElementById('top-day');
    if (coinsEl) coinsEl.textContent = Game.State.player.pataCoins;
    if (clockEl) clockEl.textContent = Game.TimeEngine.getFormattedTime();
    if (dayEl) dayEl.textContent = Game.TimeEngine.getFormattedDay();

    // Also update coins on other screens
    var shopCoins = document.getElementById('shop-coins');
    var invCoins = document.getElementById('inv-coins');
    var housingCoins = document.getElementById('housing-coins');
    if (shopCoins) shopCoins.textContent = Game.State.player.pataCoins;
    if (invCoins) invCoins.textContent = Game.State.player.pataCoins;
    if (housingCoins) housingCoins.textContent = Game.State.player.pataCoins;

    // Streak indicator
    var streakEl = document.getElementById('top-streak');
    if (streakEl && Game.StreakSystem) {
      var streak = Game.StreakSystem.getStreak();
      streakEl.textContent = streak > 0 ? '\uD83D\uDD25' + streak : '';
      streakEl.style.display = streak > 0 ? 'inline' : 'none';
    }

    // Combo indicator
    var comboEl = document.getElementById('combo-indicator');
    if (comboEl && Game.ComboSystem) {
      if (Game.ComboSystem.isActive()) {
        var count = Game.ComboSystem.getCount();
        var mult = Game.ComboSystem.getMultiplier();
        comboEl.textContent = '\uD83D\uDCA5 Combo x' + count + ' (+' + Math.round(mult * 100) + '%)';
        comboEl.style.display = 'block';
      } else {
        comboEl.style.display = 'none';
      }
    }
  }

  // ===== HOME SCREEN =====
  function updateHomeScreen() {
    updateTopBar();
    Game.RoomRenderer.renderDynamic();
    updateStatsPanel();
    updateActionBar();
    updateDogSelector();
    updateMissionsPanel();
  }

  function getSelectedDog() {
    if (!Game.State || Game.State.dogs.length === 0) return null;
    var dog = Game.State.dogs.find(function (d) { return d.id === selectedDogId; });
    if (!dog) {
      selectedDogId = Game.State.dogs[0].id;
      dog = Game.State.dogs[0];
    }
    return dog;
  }

  function updateStatsPanel() {
    var panel = document.getElementById('stats-panel');
    if (!panel) return;

    var dog = getSelectedDog();
    if (!dog) {
      panel.innerHTML = '<p style="text-align:center;color:var(--text-secondary);">Adote um cachorro!</p>';
      return;
    }

    var mood = Game.Dog.getMood(dog);
    var moodEmoji = Game.Dog.getMoodEmoji(mood);
    var moodText = Game.Dog.getMoodText(mood);

    var stats = [
      { key: 'hunger', label: 'Fome', emoji: '\uD83C\uDF56' },
      { key: 'happiness', label: 'Felicidade', emoji: '\uD83D\uDE0A' },
      { key: 'energy', label: 'Energia', emoji: '\u26A1' },
      { key: 'hygiene', label: 'Higiene', emoji: '\uD83D\uDEC1' },
      { key: 'health', label: 'Sa\u00fade', emoji: '\u2764\uFE0F' },
      { key: 'learning', label: 'Aprendizado', emoji: '\uD83C\uDFAA' }
    ];

    // XP progress bar
    var xpHtml = '';
    if (Game.XPSystem) {
      var xp = Game.XPSystem.getProgress(dog);
      xpHtml = '<div class="xp-bar">' +
        '<span class="xp-bar__label">Nv.' + xp.level + '</span>' +
        '<div class="xp-bar__track"><div class="xp-bar__fill" style="width:' + xp.percent + '%"></div></div>' +
        '<span class="xp-bar__text">' + xp.current + '/' + xp.needed + '</span>' +
      '</div>';
    }

    var html = '<div class="stats-panel__dog-name">' +
      '<span>' + moodEmoji + '</span> ' +
      '<span>' + dog.name + '</span> ' +
      '<span class="stats-panel__mood">(' + moodText + ')</span>' +
    '</div>' + xpHtml;

    stats.forEach(function (stat) {
      var value = Math.round(dog.stats[stat.key]);
      var criticalClass = value <= 15 ? ' stat-bar__fill--critical' : '';
      // Ícone SVG próprio colorido pelo stat; emoji só como fallback
      var iconHtml = (Game.Icons && Game.Icons.getStatIcon(stat.key, { size: 14 })) || stat.emoji;
      html += '<div class="stat-bar">' +
        '<span class="stat-bar__icon stat-bar__icon--' + stat.key + '" title="' + stat.label + '">' + iconHtml + '</span>' +
        '<div class="stat-bar__track">' +
          '<div class="stat-bar__fill stat-bar__fill--' + stat.key + criticalClass + '" style="width:' + value + '%"></div>' +
        '</div>' +
        '<span class="stat-bar__value">' + value + '</span>' +
      '</div>';
    });

    panel.innerHTML = html;
  }

  function doAction(dog, actionId) {
    var result = Game.ActionSystem.performAction(dog, actionId);
    if (result.success) {
      Game.EventBus.emit('notification', { text: result.message, type: 'success' });
      Game.Audio.play(actionId);

      var roomEl = document.getElementById('game-room');
      if (roomEl) {
        var dogEl = roomEl.querySelector('.dog-in-room--selected .dog-sprite-png');
        if (dogEl) {
          var actionClass = 'action-' + actionId;
          dogEl.className = dogEl.className.replace(/\bmood-\S+/g, '').trim();
          dogEl.classList.add(actionClass);
          setTimeout(function () {
            dogEl.classList.remove(actionClass);
            Game.RoomRenderer.renderDynamic();
          }, 1500);
        }

        Game.DogRenderer.playActionScene(roomEl, actionId, function () {
          Game.RoomRenderer.renderDynamic();
        });
      }
    } else {
      Game.EventBus.emit('notification', { text: result.message, type: 'warning' });
    }
    updateHomeScreen();
  }

  function updateActionBar() {
    var bar = document.getElementById('action-bar');
    if (!bar) return;

    var dog = getSelectedDog();
    if (!dog) {
      bar.innerHTML = '';
      return;
    }

    var actions = Game.ActionSystem.getAvailableActions(dog);
    var html = '';

    actions.forEach(function (a) {
      var disabledClass = a.canDo ? '' : ' action-btn--disabled';
      // Ícone SVG próprio; emoji do action system fica como fallback
      var iconHtml = (Game.Icons && Game.Icons.getActionIcon(a.id, { size: 22 })) || a.action.icon;
      html += '<button class="action-btn' + disabledClass + '" data-action="' + a.id + '">' +
        '<span class="action-btn__icon">' + iconHtml + '</span>' +
        '<span class="action-btn__label">' + a.action.label + '</span>' +
      '</button>';
    });

    bar.innerHTML = html;

    // Attach click handlers
    bar.querySelectorAll('.action-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var actionId = btn.getAttribute('data-action');

        // Check if this action has a minigame
        if (Game.MinigameSystem && Game.MinigameSystem.canPlay(actionId)) {
          Game.MinigameSystem.startMinigame(actionId, dog, function () {
            doAction(dog, actionId);
          });
        } else {
          doAction(dog, actionId);
        }
      });
    });
  }

  function updateDogSelector() {
    var selector = document.getElementById('dog-selector');
    if (!selector || !Game.State) return;

    if (Game.State.dogs.length <= 1) {
      selector.style.display = 'none';
      return;
    }

    selector.style.display = 'flex';
    var html = '';
    Game.State.dogs.forEach(function (dog) {
      var breed = Game.Breeds.getById(dog.breedId);
      var activeClass = dog.id === selectedDogId ? ' dog-selector__btn--active' : '';
      // Avatar com a imagem real da ra\u00E7a; emoji como fallback de onerror
      var fallbackEmoji = breed ? breed.emoji : '\uD83D\uDC36';
      var imgSrc = Game.DogRenderer.getBreedImg(dog.breedId, 'feliz');
      html += '<button class="dog-selector__btn' + activeClass + '" data-dog-id="' + dog.id + '" title="' + (dog.name || '') + '">' +
        '<img src="' + imgSrc + '" alt="" draggable="false" ' +
          'onerror="this.parentNode.textContent=\'' + fallbackEmoji + '\';" />' +
      '</button>';
    });

    selector.innerHTML = html;
    selector.querySelectorAll('.dog-selector__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        Game.EventBus.emit('dog:selected', { dogId: btn.getAttribute('data-dog-id') });
      });
    });
  }

  // ===== SHELTER SCREEN =====
  function renderShelter(group) {
    var breeds = Game.Breeds.getByGroup(group || 'small');
    var grid = document.getElementById('shelter-grid');
    if (!grid) return;

    var html = '';
    breeds.forEach(function (breed) {
      var diffLabel = Game.Breeds.getDifficultyLabel(breed.difficulty);
      var preview = Game.DogRenderer.renderBreedPreview(breed.id);
      html += '<div class="breed-card" data-breed-id="' + breed.id + '">' +
        '<div class="breed-card__preview">' + preview + '</div>' +
        '<div class="breed-card__name">' + breed.name + '</div>' +
        '<div class="breed-card__difficulty">' + diffLabel + '</div>' +
      '</div>';
    });

    grid.innerHTML = html;
    grid.querySelectorAll('.breed-card').forEach(function (card) {
      card.addEventListener('click', function () {
        showBreedDetail(card.getAttribute('data-breed-id'));
      });
    });
  }

  function renderShelterTabs() {
    var tabsEl = document.getElementById('shelter-tabs');
    if (!tabsEl) return;

    var groups = Game.Breeds.getGroups();
    var html = '';
    groups.forEach(function (g, i) {
      var activeClass = i === 0 ? ' tab--active' : '';
      html += '<button class="tab' + activeClass + '" data-group="' + g.id + '">' +
        g.icon + ' ' + g.name +
      '</button>';
    });

    tabsEl.innerHTML = html;
    tabsEl.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabsEl.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('tab--active'); });
        tab.classList.add('tab--active');
        renderShelter(tab.getAttribute('data-group'));
      });
    });

    // Render first group
    renderShelter('small');
  }

  function showBreedDetail(breedId) {
    var breed = Game.Breeds.getById(breedId);
    if (!breed) return;

    var diffLabel = Game.Breeds.getDifficultyLabel(breed.difficulty);
    var diffClass = 'breed-detail__difficulty--' + breed.difficulty;

    var statsHTML = '';
    var attrLabels = [
      { key: 'energy', label: 'Energia', icon: '\u26A1' },
      { key: 'hunger', label: 'Fome', icon: '\uD83C\uDF56' },
      { key: 'hygiene', label: 'Higiene', icon: '\uD83D\uDEC1' },
      { key: 'health', label: 'Sa\u00fade', icon: '\u2764\uFE0F' },
      { key: 'learning', label: 'Aprendizado', icon: '\uD83C\uDFAA' },
      { key: 'happiness', label: 'Felicidade', icon: '\uD83D\uDE0A' }
    ];

    attrLabels.forEach(function (attr) {
      var val = breed.attributes[attr.key];
      var barWidth = val * 10;
      statsHTML += '<div class="stat-bar">' +
        '<span class="stat-bar__icon">' + attr.icon + '</span>' +
        '<div class="stat-bar__track">' +
          '<div class="stat-bar__fill stat-bar__fill--' + attr.key + '" style="width:' + barWidth + '%"></div>' +
        '</div>' +
        '<span class="stat-bar__value">' + val + '</span>' +
      '</div>';
    });

    var canAdopt = Game.Player.canAdoptMore();
    var adoptBtnClass = canAdopt ? 'btn btn--primary' : 'btn btn--primary btn--disabled';

    var html = '<div class="breed-detail">' +
      '<div class="breed-detail__sprite">' + Game.DogRenderer.renderBreedPreview(breedId) + '</div>' +
      '<div class="breed-detail__name">' + breed.name + '</div>' +
      '<div class="breed-detail__personality">' + breed.personality + '</div>' +
      '<span class="breed-detail__difficulty ' + diffClass + '">' + diffLabel + '</span>' +
      '<div class="breed-detail__stats">' + statsHTML + '</div>' +
      '<div class="breed-detail__trick">' +
        '<div class="breed-detail__trick-label">Truque Especial</div>' +
        '<div class="breed-detail__trick-name">' + breed.specialTrick.name + '</div>' +
      '</div>' +
      '<div class="breed-detail__buttons">' +
        '<button class="btn btn--secondary" id="modal-close-btn">Voltar</button>' +
        '<button class="' + adoptBtnClass + '" id="modal-adopt-btn">Adotar!</button>' +
      '</div>' +
    '</div>';

    Game.Modal.open(html);

    document.getElementById('modal-close-btn').addEventListener('click', function () {
      Game.Modal.close();
    });

    if (canAdopt) {
      document.getElementById('modal-adopt-btn').addEventListener('click', function () {
        Game.Modal.close();
        startAdoptionNaming(breedId);
      });
    }
  }

  function startAdoptionNaming(breedId) {
    var breed = Game.Breeds.getById(breedId);
    var nameScreen = document.getElementById('screen-name-dog');
    var breedPreview = document.getElementById('name-dog-breed-preview');
    var breedNameEl = document.getElementById('name-dog-breed-name');
    var nameInput = document.getElementById('dog-name-input');
    var confirmBtn = document.getElementById('confirm-dog-name-btn');

    if (breedPreview) breedPreview.innerHTML = Game.DogRenderer.renderBreedPreview(breedId);
    if (breedNameEl) breedNameEl.textContent = breed.name;
    if (nameInput) nameInput.value = '';

    Game.ScreenManager.show('screen-name-dog');

    var handler = function () {
      var name = nameInput.value.trim();
      if (!name) {
        Game.EventBus.emit('notification', { text: 'D\u00ea um nome ao cachorro!', type: 'warning' });
        return;
      }
      confirmBtn.removeEventListener('click', handler);
      var result = Game.ShelterSystem.adoptDog(breedId, name);
      if (result.success) {
        selectedDogId = result.dog.id;
        Game.ScreenManager.show('screen-home');
        updateHomeScreen();
        Game.EventBus.emit('notification', { text: name + ' foi adotado!', type: 'success' });
        Game.Audio.play('adopt');
      } else {
        Game.EventBus.emit('notification', { text: result.message, type: 'danger' });
      }
    };

    confirmBtn.addEventListener('click', handler);
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handler();
    });
  }

  // ===== SHOP SCREEN =====
  function renderShop(category) {
    var items = Game.ShopSystem.getShopItems(category || 'food');
    var listEl = document.getElementById('shop-items');
    if (!listEl) return;

    var html = '';
    items.forEach(function (item) {
      var canBuy = Game.Player.canAfford(item.price);
      var owned = Game.Player.getItemCount(item.id);
      var ownedBadge = owned > 0 ? ' (' + owned + 'x)' : '';

      html += '<div class="shop-item">' +
        '<span class="shop-item__emoji">' + item.icon + '</span>' +
        '<div class="shop-item__info">' +
          '<div class="shop-item__name">' + item.name + ownedBadge + '</div>' +
          '<div class="shop-item__desc">' + item.description + '</div>' +
        '</div>' +
        '<button class="btn btn--primary shop-item__action' + (canBuy ? '' : ' btn--disabled') + '" data-item-id="' + item.id + '">' +
          '\uD83D\uDC3E ' + item.price +
        '</button>' +
      '</div>';
    });

    if (items.length === 0) {
      html = '<p style="text-align:center;color:var(--text-secondary);padding:2rem;">Nenhum item dispon\u00edvel</p>';
    }

    listEl.innerHTML = html;
    listEl.querySelectorAll('[data-item-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var result = Game.ShopSystem.buyItem(btn.getAttribute('data-item-id'));
        if (result.success) {
          Game.EventBus.emit('notification', { text: result.message, type: 'success' });
          Game.Audio.play('coin');
          renderShop(category);
          updateTopBar();
        } else {
          Game.EventBus.emit('notification', { text: result.message, type: 'warning' });
        }
      });
    });
  }

  function renderShopTabs() {
    var tabsEl = document.getElementById('shop-tabs');
    if (!tabsEl) return;

    var categories = Game.Items.getCategories();
    var html = '';
    categories.forEach(function (c, i) {
      var activeClass = i === 0 ? ' tab--active' : '';
      html += '<button class="tab' + activeClass + '" data-category="' + c.id + '">' +
        c.icon + ' ' + c.name +
      '</button>';
    });

    tabsEl.innerHTML = html;
    tabsEl.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabsEl.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('tab--active'); });
        tab.classList.add('tab--active');
        renderShop(tab.getAttribute('data-category'));
      });
    });

    renderShop('food');
  }

  // ===== INVENTORY SCREEN =====
  function renderInventory() {
    var listEl = document.getElementById('inventory-items');
    if (!listEl || !Game.State) return;

    var dog = getSelectedDog();
    var html = '';

    Game.State.player.inventory.forEach(function (inv) {
      if (inv.quantity <= 0) return;
      var item = Game.Items.getById(inv.itemId);
      if (!item) return;

      html += '<div class="shop-item">' +
        '<span class="shop-item__emoji">' + item.icon + '</span>' +
        '<div class="shop-item__info">' +
          '<div class="shop-item__name">' + item.name + ' (' + inv.quantity + 'x)</div>' +
          '<div class="shop-item__desc">' + item.description + '</div>' +
        '</div>' +
        '<button class="btn btn--secondary shop-item__action" data-use-item="' + item.id + '">' +
          'Usar' +
        '</button>' +
      '</div>';
    });

    if (!html) {
      html = '<p style="text-align:center;color:var(--text-secondary);padding:2rem;">Invent\u00e1rio vazio</p>';
    }

    listEl.innerHTML = html;
    listEl.querySelectorAll('[data-use-item]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!dog) {
          Game.EventBus.emit('notification', { text: 'Adote um cachorro primeiro!', type: 'warning' });
          return;
        }
        var result = Game.ActionSystem.useItem(dog, btn.getAttribute('data-use-item'));
        if (result.success) {
          Game.EventBus.emit('notification', { text: result.message, type: 'success' });
        } else {
          Game.EventBus.emit('notification', { text: result.message, type: 'warning' });
        }
        renderInventory();
      });
    });
  }

  // ===== ACHIEVEMENTS SCREEN =====
  function renderAchievements() {
    var listEl = document.getElementById('achievements-list');
    if (!listEl) return;

    var html = '';
    var coinSvg = Game.Icons ? Game.Icons.get('coin', { size: 14 }) : '\uD83D\uDC3E';
    var trophySvg = Game.Icons ? Game.Icons.get('trophy', { size: 16 }) : '\uD83C\uDFC6';
    Game.Achievements.getAll().forEach(function (ach) {
      var unlocked = Game.Achievements.isUnlocked(ach.id);
      var lockedClass = unlocked ? '' : ' achievement-item--locked';
      var rewardText = ach.reward > 0
        ? '<span class="achievement-item__coin">' + coinSvg + '</span> ' + ach.reward
        : trophySvg;
      // Badge pr\u00F3pria: medalha SVG com o emoji do achievement como detalhe interno
      var badgeInner = unlocked
        ? '<span class="achievement-badge__emoji">' + ach.icon + '</span>'
        : (Game.Icons ? Game.Icons.get('paw', { size: 18 }) : '\uD83D\uDD12');

      html += '<div class="achievement-item' + lockedClass + '">' +
        '<div class="achievement-item__icon achievement-badge' + (unlocked ? ' achievement-badge--unlocked' : '') + '">' +
          badgeInner +
        '</div>' +
        '<div class="achievement-item__info">' +
          '<div class="achievement-item__name">' + ach.name + '</div>' +
          '<div class="achievement-item__desc">' + ach.description + '</div>' +
        '</div>' +
        '<div class="achievement-item__reward">' + rewardText + '</div>' +
      '</div>';
    });

    listEl.innerHTML = html;
  }

  // ===== HOUSING SCREEN =====
  function renderHousing() {
    var current = Game.Player.getCurrentHousing();
    var next = Game.ProgressionSystem.getNextHousing();

    var currentEl = document.getElementById('housing-current');
    var nextEl = document.getElementById('housing-next');

    // Badge de moradia: home SVG escalado pelo tier (emoji vira detalhe)
    function housingBadge(housing) {
      var homeSvg = Game.Icons ? Game.Icons.get('home', { size: 34 + housing.id * 6 }) : housing.icon;
      return '<div class="housing-badge housing-badge--tier' + housing.id + '">' + homeSvg + '</div>';
    }
    var coinSvgH = Game.Icons ? Game.Icons.get('coin', { size: 16 }) : '\uD83D\uDC3E';

    if (currentEl) {
      currentEl.innerHTML = housingBadge(current) +
        '<div class="housing-screen__name">' + current.name + '</div>' +
        '<div class="housing-screen__capacity">' + Game.State.dogs.length + '/' + current.maxDogs + ' cachorros</div>';
    }

    if (nextEl) {
      if (next) {
        var canUpgrade = Game.ProgressionSystem.canUpgrade();
        nextEl.innerHTML = '<h3>Pr\u00f3xima Moradia</h3>' +
          housingBadge(next) +
          '<div class="housing-screen__name">' + next.name + '</div>' +
          '<div class="housing-screen__capacity">At\u00e9 ' + next.maxDogs + ' cachorros</div>' +
          '<div class="housing-screen__price">' + coinSvgH + ' ' + next.upgradeCost + ' PataCoins</div>' +
          '<button class="btn btn--primary' + (canUpgrade ? '' : ' btn--disabled') + '" id="upgrade-btn">Melhorar!</button>';

        setTimeout(function () {
          var btn = document.getElementById('upgrade-btn');
          if (btn && canUpgrade) {
            btn.addEventListener('click', function () {
              var result = Game.ProgressionSystem.upgrade();
              if (result.success) {
                Game.EventBus.emit('notification', { text: result.message, type: 'success' });
                Game.Audio.play('achievement');
                renderHousing();
                updateTopBar();
              }
            });
          }
        }, 0);
      } else {
        var maxTrophy = Game.Icons ? Game.Icons.get('trophy', { size: 20 }) : '\uD83C\uDFC6';
        nextEl.innerHTML = '<h3 class="housing-screen__max">' + maxTrophy + ' Casa M\u00e1xima!</h3>' +
          '<p>Voc\u00ea tem a melhor moradia!</p>';
      }
    }
  }

  // ===== MISSIONS PANEL =====
  function updateMissionsPanel() {
    var panel = document.getElementById('missions-panel');
    if (!panel || !Game.MissionsSystem) return;

    var missions = Game.MissionsSystem.getMissions();
    if (missions.length === 0) {
      panel.innerHTML = '';
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'block';
    var missionIcon = Game.Icons ? Game.Icons.get('star', { size: 14 }) : '\uD83C\uDFAF';
    var html = '<div class="missions-header"><span class="missions-header__icon">' + missionIcon + '</span> Miss\u00f5es Di\u00e1rias</div>';
    missions.forEach(function (m) {
      var percent = Math.min(100, Math.round((m.progress / m.target) * 100));
      var doneClass = m.completed ? ' mission--done' : '';
      html += '<div class="mission-item' + doneClass + '">' +
        '<span class="mission-item__icon">' + (m.completed ? '\u2705' : m.icon) + '</span>' +
        '<div class="mission-item__info">' +
          '<div class="mission-item__desc">' + m.description + '</div>' +
          '<div class="mission-item__bar"><div class="mission-item__fill" style="width:' + percent + '%"></div></div>' +
        '</div>' +
        '<span class="mission-item__reward">' + (m.completed ? '\u2705' : '\uD83D\uDC3E' + m.reward) + '</span>' +
      '</div>';
    });
    panel.innerHTML = html;
  }

  // ===== AWAY SUMMARY =====
  function showAwaySummary(offlineData) {
    if (!offlineData) return;

    var eventsHTML = '';
    offlineData.events.forEach(function (evt) {
      if (evt.type === 'runaway') {
        eventsHTML += '<div class="away-screen__event">\uD83D\uDC36 ' + evt.dogName + ' fugiu!</div>';
      } else if (evt.type === 'random_event') {
        eventsHTML += '<div class="away-screen__event">' + evt.text + '</div>';
      }
    });

    if (!eventsHTML) {
      eventsHTML = '<div class="away-screen__event">Seus cachorros sentiram sua falta!</div>';
    }

    var html = '<div style="text-align:center;max-width:300px;">' +
      '<div style="font-size:3rem;margin-bottom:12px;">\uD83C\uDF19</div>' +
      '<div class="away-screen__title">Enquanto voc\u00ea estava fora...</div>' +
      '<div class="away-screen__time" style="margin:8px 0;">' +
        offlineData.realHours + ' horas reais (' + offlineData.gameDays + ' dias no jogo)' +
      '</div>' +
      '<div class="away-screen__events" style="margin:16px 0;">' + eventsHTML + '</div>' +
      '<button class="btn btn--primary" id="away-continue-btn">Continuar</button>' +
    '</div>';

    Game.Modal.open(html);
    setTimeout(function () {
      var btn = document.getElementById('away-continue-btn');
      if (btn) {
        btn.addEventListener('click', function () {
          Game.Modal.close();
        });
      }
    }, 0);
  }

  function setSelectedDogId(id) {
    selectedDogId = id;
  }

  return {
    setSelectedDogId: setSelectedDogId,
    init: init,
    updateHomeScreen: updateHomeScreen,
    updateTopBar: updateTopBar,
    renderShelter: renderShelter,
    renderShelterTabs: renderShelterTabs,
    renderShop: renderShop,
    renderShopTabs: renderShopTabs,
    renderInventory: renderInventory,
    renderAchievements: renderAchievements,
    renderHousing: renderHousing,
    showAwaySummary: showAwaySummary,
    getSelectedDog: getSelectedDog,
    startAdoptionNaming: startAdoptionNaming
  };
})();
