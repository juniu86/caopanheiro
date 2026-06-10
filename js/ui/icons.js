var Game = Game || {};

// ============================================================
// Game.Icons — biblioteca de ícones SVG próprios do jogo.
// Substitui emojis nos elementos principais de UI (nav, action
// bar, HUD). Todos os ícones usam currentColor, viewBox 24x24,
// formas arredondadas e preenchidas — linguagem cozy consistente.
// ============================================================
Game.Icons = (function () {

  var PATHS = {
    // Pata (marca do jogo, moedas, abrigo)
    paw:
      '<circle cx="6.4" cy="9" r="2.1"/>' +
      '<circle cx="10.1" cy="6.2" r="2.2"/>' +
      '<circle cx="13.9" cy="6.2" r="2.2"/>' +
      '<circle cx="17.6" cy="9" r="2.1"/>' +
      '<path d="M12 10.2c2.6 0 5 2.1 5 4.6 0 2.1-1.6 3.4-3.2 3.4-.7 0-1.2-.2-1.8-.2s-1.1.2-1.8.2c-1.6 0-3.2-1.3-3.2-3.4 0-2.5 2.4-4.6 5-4.6z"/>',

    // Casa (nav + housing)
    home:
      '<path d="M12 3.2 21 10.4v9.4a1 1 0 0 1-1 1h-5.2v-6.4H9.2v6.4H4a1 1 0 0 1-1-1v-9.4L12 3.2z"/>',

    // Carrinho (loja)
    cart:
      '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M3 4.5h2.4l2.2 10.6h10l2.2-7.6H7"/>' +
      '</g>' +
      '<circle cx="9.4" cy="19.4" r="1.7"/><circle cx="16.6" cy="19.4" r="1.7"/>',

    // Mochila (inventário)
    backpack:
      '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="6" y="7" width="12" height="13" rx="3"/>' +
      '<path d="M9 7V5.4a3 3 0 0 1 6 0V7M6 13h12"/>' +
      '</g>',

    // Troféu (conquistas)
    trophy:
      '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/>' +
      '<path d="M16 5.5h2.6c-.1 2.8-1.5 4.4-3.4 5M8 5.5H5.4c.1 2.8 1.5 4.4 3.4 5M12 13.4v2.8"/>' +
      '<path d="M9 19.4h6M10 16.2h4"/>' +
      '</g>',

    // Tigela (alimentar)
    bowl:
      '<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0z"/>' +
      '<circle cx="9" cy="8.4" r="1.4"/><circle cx="13" cy="7.2" r="1.5"/><circle cx="16" cy="8.8" r="1.3"/>',

    // Bola (brincar)
    ball:
      '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="8.4"/>' +
      '<path d="M4.6 8.6c4 2.4 10.8 2.4 14.8 0M4.6 15.4c4-2.4 10.8-2.4 14.8 0"/>' +
      '</g>',

    // Gota (banho)
    drop:
      '<path d="M12 3c3.4 4.4 5.9 7.7 5.9 10.9a5.9 5.9 0 0 1-11.8 0C6.1 10.7 8.6 7.4 12 3z"/>',

    // Lua (dormir)
    moon:
      '<path d="M20 14.6A8.6 8.6 0 1 1 9.4 4a7 7 0 0 0 10.6 10.6z"/>',

    // Sol (acordar)
    sun:
      '<circle cx="12" cy="12" r="4.4"/>' +
      '<g stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5 5l1.6 1.6M17.4 17.4 19 19M19 5l-1.6 1.6M6.6 17.4 5 19"/>' +
      '</g>',

    // Coração (carinho)
    heart:
      '<path d="M12 20.4C7.2 16.5 3.6 13.2 3.6 9.5 3.6 6.7 5.8 4.6 8.5 4.6c1.4 0 2.7.6 3.5 1.7.8-1.1 2.1-1.7 3.5-1.7 2.7 0 4.9 2.1 4.9 4.9 0 3.7-3.6 7-8.4 10.9z"/>',

    // Pegadas (passear)
    pawprints:
      '<g transform="translate(2,2) scale(0.55)">' +
      '<circle cx="6.4" cy="9" r="2.1"/><circle cx="10.1" cy="6.2" r="2.2"/>' +
      '<circle cx="13.9" cy="6.2" r="2.2"/><circle cx="17.6" cy="9" r="2.1"/>' +
      '<path d="M12 10.2c2.6 0 5 2.1 5 4.6 0 2.1-1.6 3.4-3.2 3.4-.7 0-1.2-.2-1.8-.2s-1.1.2-1.8.2c-1.6 0-3.2-1.3-3.2-3.4 0-2.5 2.4-4.6 5-4.6z"/>' +
      '</g>' +
      '<g transform="translate(11,11) scale(0.55)">' +
      '<circle cx="6.4" cy="9" r="2.1"/><circle cx="10.1" cy="6.2" r="2.2"/>' +
      '<circle cx="13.9" cy="6.2" r="2.2"/><circle cx="17.6" cy="9" r="2.1"/>' +
      '<path d="M12 10.2c2.6 0 5 2.1 5 4.6 0 2.1-1.6 3.4-3.2 3.4-.7 0-1.2-.2-1.8-.2s-1.1.2-1.8.2c-1.6 0-3.2-1.3-3.2-3.4 0-2.5 2.4-4.6 5-4.6z"/>' +
      '</g>',

    // Estrela (truques)
    star:
      '<path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z"/>',

    // Cruz (veterinário)
    cross:
      '<path d="M9.2 3.5h5.6a1 1 0 0 1 1 1v3.7h3.7a1 1 0 0 1 1 1v5.6a1 1 0 0 1-1 1h-3.7v3.7a1 1 0 0 1-1 1H9.2a1 1 0 0 1-1-1v-3.7H4.5a1 1 0 0 1-1-1V9.2a1 1 0 0 1 1-1h3.7V4.5a1 1 0 0 1 1-1z"/>',

    // Osso (petisco)
    bone:
      '<circle cx="5.6" cy="8.2" r="2.5"/><circle cx="8.2" cy="5.6" r="2.5"/>' +
      '<circle cx="18.4" cy="15.8" r="2.5"/><circle cx="15.8" cy="18.4" r="2.5"/>' +
      '<path d="M6.4 9.9 14.1 17.6 17.6 14.1 9.9 6.4z"/>',

    // Vassoura (limpar)
    broom:
      '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<path d="M14.5 3 9.8 11.6"/>' +
      '</g>' +
      '<path d="M5.2 13.6l7.6-2.9 3 5.7c-3.8 2.4-7.7 2.6-11.6 1.2l1-4z"/>',

    // Raio (energia)
    bolt:
      '<path d="M13.2 2.5 5.6 13.4h4.9l-1.7 8.1 7.6-10.9h-4.9l1.7-8.1z"/>',

    // Sorriso (felicidade)
    smile:
      '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="8.6"/>' +
      '<path d="M8.4 14.2c.9 1.4 2.1 2.1 3.6 2.1s2.7-.7 3.6-2.1"/>' +
      '</g>' +
      '<circle cx="9" cy="9.6" r="1.2"/><circle cx="15" cy="9.6" r="1.2"/>',

    // Moeda (PataCoins)
    coin:
      '<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.6"/></g>' +
      '<g transform="translate(5.4,5.6) scale(0.55)">' +
      '<circle cx="6.4" cy="9" r="2.1"/><circle cx="10.1" cy="6.2" r="2.2"/>' +
      '<circle cx="13.9" cy="6.2" r="2.2"/><circle cx="17.6" cy="9" r="2.1"/>' +
      '<path d="M12 10.2c2.6 0 5 2.1 5 4.6 0 2.1-1.6 3.4-3.2 3.4-.7 0-1.2-.2-1.8-.2s-1.1.2-1.8.2c-1.6 0-3.2-1.3-3.2-3.4 0-2.5 2.4-4.6 5-4.6z"/>' +
      '</g>'
  };

  // Mapa ação do jogo → ícone
  var ACTION_ICONS = {
    feed: 'bowl',
    play: 'ball',
    bathe: 'drop',
    sleep: 'moon',
    wake: 'sun',
    carinho: 'heart',
    walk: 'pawprints',
    teach: 'star',
    vet: 'cross',
    petisco: 'bone',
    cleanPoop: 'broom'
  };

  // Mapa stat → ícone
  var STAT_ICONS = {
    hunger: 'bowl',
    happiness: 'smile',
    energy: 'bolt',
    hygiene: 'drop',
    health: 'heart',
    learning: 'star'
  };

  // Mapa navegação → ícone
  var NAV_ICONS = {
    home: 'home',
    shelter: 'paw',
    shop: 'cart',
    inventory: 'backpack',
    achievements: 'trophy',
    housing: 'home'
  };

  function get(name, opts) {
    opts = opts || {};
    var path = PATHS[name];
    if (!path) return '';
    var size = opts.size || 24;
    var cls = opts.className ? ' class="' + opts.className + '"' : '';
    return '<svg' + cls + ' width="' + size + '" height="' + size + '" viewBox="0 0 24 24" ' +
      'fill="currentColor" aria-hidden="true" focusable="false">' + path + '</svg>';
  }

  function getActionIcon(actionId, opts) {
    var name = ACTION_ICONS[actionId];
    return name ? get(name, opts) : '';
  }

  function getNavIcon(navId, opts) {
    var name = NAV_ICONS[navId];
    return name ? get(name, opts) : '';
  }

  function getStatIcon(statKey, opts) {
    var name = STAT_ICONS[statKey];
    return name ? get(name, opts) : '';
  }

  return {
    get: get,
    getActionIcon: getActionIcon,
    getNavIcon: getNavIcon,
    getStatIcon: getStatIcon
  };
})();
