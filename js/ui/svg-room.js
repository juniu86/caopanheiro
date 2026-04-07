var Game = Game || {};

// ============================================================
// Game.SvgRoom — inline SVG illustration library for the room.
// All functions return SVG/HTML strings that get injected by
// Game.RoomRenderer. Stateless except for color helpers.
// ============================================================
Game.SvgRoom = (function () {

  // ----- Color helpers (mirror svg-dogs.js darken/lighten) -----
  function clamp(n) { return Math.max(0, Math.min(255, n | 0)); }
  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    return { r: parseInt(h.substr(0, 2), 16), g: parseInt(h.substr(2, 2), 16), b: parseInt(h.substr(4, 2), 16) };
  }
  function rgbToHex(r, g, b) {
    function p(n) { var s = clamp(n).toString(16); return s.length === 1 ? '0' + s : s; }
    return '#' + p(r) + p(g) + p(b);
  }
  function darken(hex, amt) { var c = hexToRgb(hex); return rgbToHex(c.r - amt, c.g - amt, c.b - amt); }
  function lighten(hex, amt) { var c = hexToRgb(hex); return rgbToHex(c.r + amt, c.g + amt, c.b + amt); }

  // ============================================================
  // BED + BOWL — moved verbatim from ui-updater.js so the legacy
  // visual is preserved at parity in Commit A.
  // ============================================================
  var BOWL_SVG = '<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="30" cy="32" rx="28" ry="8" fill="#C0C0C0"/>' +
    '<path d="M4,24 Q4,32 30,32 Q56,32 56,24 L56,20 Q56,12 30,12 Q4,12 4,20 Z" fill="#E8E8E8"/>' +
    '<path d="M4,20 Q4,12 30,12 Q56,12 56,20 Q56,28 30,28 Q4,28 4,20" fill="#D4D4D4"/>' +
    '<ellipse cx="30" cy="20" rx="26" ry="8" fill="#F0F0F0"/>' +
    '<circle cx="20" cy="19" r="3" fill="#8B6914"/><circle cx="30" cy="17" r="3.5" fill="#A0782C"/>' +
    '<circle cx="38" cy="19" r="3" fill="#8B6914"/><circle cx="25" cy="22" r="2.5" fill="#A0782C"/>' +
    '<circle cx="34" cy="21" r="2.8" fill="#8B6914"/>' +
    '<ellipse cx="30" cy="20" rx="26" ry="8" fill="none" stroke="#B0B0B0" stroke-width="0.8"/>' +
  '</svg>';

  var BED_SVG = '<svg viewBox="0 0 80 45" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="40" cy="38" rx="38" ry="7" fill="rgba(0,0,0,0.08)"/>' +
    '<path d="M5,35 Q5,20 40,18 Q75,20 75,35 Z" fill="#E8A87C"/>' +
    '<path d="M5,35 Q5,20 40,18 Q75,20 75,35 Q75,40 40,42 Q5,40 5,35" fill="#F0C4A0"/>' +
    '<path d="M8,33 Q8,22 40,20 Q72,22 72,33 Q72,36 40,38 Q8,36 8,33" fill="#F5D5B8"/>' +
    '<ellipse cx="18" cy="26" rx="12" ry="8" fill="#E8A87C" opacity="0.7"/>' +
    '<path d="M10,28 Q10,18 22,18 Q30,18 28,26" fill="#F0C4A0"/>' +
  '</svg>';

  // ============================================================
  // LEGACY decoration HTML — current emoji+CSS shapes, used as
  // fallback in Commit A (and as the actual decor until Commit B
  // wires the new SVG functions).
  // ============================================================
  function legacyDecorations(housingId) {
    var html = '';
    if (housingId >= 1) {
      html += '<div class="room__window"></div>';
      html += '<div class="room__plant">\uD83E\uDEB4</div>';
    }
    if (housingId >= 2) {
      html += '<div class="room__rug"></div>';
      html += '<div class="room__painting"></div>';
    }
    if (housingId >= 3) {
      html += '<div class="room__clock">\uD83D\uDD70\uFE0F</div>';
      html += '<div class="room__shelf"></div>';
      html += '<div class="room__fireplace"></div>';
    }
    return html;
  }

  // ============================================================
  // SKY GRADIENT — used by renderSky for the window pane.
  // Returns { gradient, key, sun, moon }.
  // ============================================================
  function getSkyKey(hour) {
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 17) return 'day';
    if (hour >= 17 && hour < 19) return 'dusk';
    return 'night';
  }

  function getSkyGradient(hour) {
    var key = getSkyKey(hour);
    var grad;
    switch (key) {
      case 'dawn':
        grad = 'linear-gradient(180deg, #FF8E72 0%, #FFC4A0 40%, #87CEEB 100%)';
        break;
      case 'day':
        grad = 'linear-gradient(180deg, #87CEEB 0%, #B5DCEF 60%, #E0F0F8 100%)';
        break;
      case 'dusk':
        grad = 'linear-gradient(180deg, #4A2C5A 0%, #C44569 40%, #FF8E54 80%, #FFB778 100%)';
        break;
      default: // night
        grad = 'linear-gradient(180deg, #0A0E2C 0%, #1B2455 50%, #2D3470 100%)';
    }
    // Sun arcs across the sky during day; moon during night.
    var t = ((hour - 6) / 12); // 0..1 across daytime
    var sunX = Math.max(5, Math.min(95, t * 100));
    var sunY = 30 - Math.sin(t * Math.PI) * 20; // arc
    var moonX = Math.max(5, Math.min(95, ((hour - 18 + 24) % 24) / 12 * 100));
    return {
      key: key,
      gradient: grad,
      sun: { x: sunX, y: sunY, visible: key === 'day' || key === 'dawn' },
      moon: { x: moonX, y: 30, visible: key === 'night' || key === 'dusk' }
    };
  }

  // ============================================================
  // FAVORITE DOG PORTRAIT — used by paintingSvg in Commit B.
  // Returns an SVG string of the player's first dog (or empty).
  // ============================================================
  function getFavoriteDogPortrait() {
    if (!Game.State || !Game.State.dogs || !Game.State.dogs.length) return '';
    if (!Game.SvgDogs || !Game.SvgDogs.generate) return '';
    var dog = Game.State.dogs[0];
    return Game.SvgDogs.generate(dog.breedId, { mood: 'feliz' });
  }

  return {
    // helpers
    darken: darken,
    lighten: lighten,
    // furniture
    BED_SVG: BED_SVG,
    BOWL_SVG: BOWL_SVG,
    // legacy decor (Commit A parity)
    legacyDecorations: legacyDecorations,
    // sky
    getSkyKey: getSkyKey,
    getSkyGradient: getSkyGradient,
    // dog portrait
    getFavoriteDogPortrait: getFavoriteDogPortrait
  };
})();
