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
  // LEGACY decoration HTML — kept as a graceful fallback if a
  // new SVG function throws. Not used in the normal path.
  // ============================================================
  function legacyDecorations(housingId) {
    var html = '';
    if (housingId >= 1) {
      html += '<div class="room__window-legacy"></div>';
      html += '<div class="room__plant-legacy">\uD83E\uDEB4</div>';
    }
    if (housingId >= 2) {
      html += '<div class="room__rug-legacy"></div>';
      html += '<div class="room__painting-legacy"></div>';
    }
    if (housingId >= 3) {
      html += '<div class="room__clock-legacy">\uD83D\uDD70\uFE0F</div>';
      html += '<div class="room__shelf-legacy"></div>';
      html += '<div class="room__fireplace-legacy"></div>';
    }
    return html;
  }

  // ============================================================
  // DETAILED SVG ILLUSTRATIONS
  // Each function returns an HTML string (a positioned div
  // containing an inline <svg>) ready to be injected into
  // .room__decor-static. Animations are CSS-driven via the
  // classes attached.
  // ============================================================

  // ----- Window with sky cutout (sky gradient set via CSS var) -----
  function windowSvg(tier) {
    var w = (tier >= 2) ? 78 : 60;   // bigger frame at higher tiers
    var h = (tier >= 2) ? 60 : 50;
    var garden = (tier >= 2)
      ? '<g class="room__window-garden">' +
          '<ellipse cx="20" cy="86" rx="14" ry="6" fill="#5A8C3A"/>' +
          '<ellipse cx="55" cy="86" rx="16" ry="7" fill="#4F7D33"/>' +
          '<ellipse cx="85" cy="88" rx="12" ry="5" fill="#5A8C3A"/>' +
          '<rect x="14" y="74" width="3" height="14" fill="#6B4423"/>' +
          '<circle cx="15" cy="72" r="6" fill="#3D6B25"/>' +
          '<rect x="80" y="76" width="3" height="12" fill="#6B4423"/>' +
          '<circle cx="81" cy="74" r="5" fill="#3D6B25"/>' +
        '</g>'
      : '';
    var mountains = (tier >= 3)
      ? '<g class="room__window-mountains">' +
          '<path d="M0,68 L25,38 L40,52 L55,30 L78,55 L100,42 L100,75 L0,75 Z" fill="#8B7BA8" opacity="0.7"/>' +
          '<path d="M0,72 L20,52 L35,62 L55,48 L75,65 L100,55 L100,80 L0,80 Z" fill="#6B5C8A" opacity="0.6"/>' +
        '</g>'
      : '';

    return '' +
      '<div class="room__window" style="--win-w:' + w + 'px;--win-h:' + h + 'px;">' +
        '<svg viewBox="0 0 100 100" preserveAspectRatio="none" class="room__window-svg">' +
          // Sky pane (background gradient set by renderSky via CSS var)
          '<rect class="room__window-pane" x="6" y="6" width="88" height="88"/>' +
          // Sun + moon positioned via CSS vars
          '<circle class="room__window-sun" cx="50" cy="50" r="8"/>' +
          '<circle class="room__window-moon" cx="50" cy="50" r="7"/>' +
          // Cloud
          '<ellipse class="room__window-cloud" cx="30" cy="28" rx="12" ry="5" fill="white" opacity="0.8"/>' +
          '<ellipse class="room__window-cloud" cx="65" cy="38" rx="14" ry="5" fill="white" opacity="0.7"/>' +
          mountains +
          garden +
          // Wooden frame (drawn last so it sits on top)
          '<rect x="0" y="0" width="100" height="6" fill="#6B4423"/>' +
          '<rect x="0" y="94" width="100" height="6" fill="#6B4423"/>' +
          '<rect x="0" y="0" width="6" height="100" fill="#6B4423"/>' +
          '<rect x="94" y="0" width="6" height="100" fill="#6B4423"/>' +
          // Mullion cross
          '<rect x="48" y="6" width="4" height="88" fill="#8B6914"/>' +
          '<rect x="6" y="48" width="88" height="4" fill="#8B6914"/>' +
          // Curtains
          '<path class="room__window-curtain-l" d="M6,6 Q14,30 8,55 Q14,80 6,94 L6,6 Z" fill="#C44569" opacity="0.85"/>' +
          '<path class="room__window-curtain-r" d="M94,6 Q86,30 92,55 Q86,80 94,94 L94,6 Z" fill="#C44569" opacity="0.85"/>' +
        '</svg>' +
      '</div>';
  }

  // ----- Lush potted plant -----
  function plantLushSvg() {
    return '' +
      '<div class="room__plant">' +
        '<svg viewBox="0 0 60 80" class="room__plant-svg">' +
          // Pot
          '<path d="M14,55 L46,55 L42,78 L18,78 Z" fill="#A0522D"/>' +
          '<rect x="12" y="52" width="36" height="6" fill="#8B4513"/>' +
          '<ellipse cx="30" cy="55" rx="18" ry="2" fill="#6B3410"/>' +
          // Leaves (back layer)
          '<g class="room__plant-leaves">' +
            '<ellipse cx="20" cy="38" rx="8" ry="14" fill="#3D6B25" transform="rotate(-30 20 38)"/>' +
            '<ellipse cx="42" cy="36" rx="8" ry="14" fill="#3D6B25" transform="rotate(28 42 36)"/>' +
            '<ellipse cx="14" cy="28" rx="7" ry="12" fill="#5A8C3A" transform="rotate(-45 14 28)"/>' +
            '<ellipse cx="46" cy="26" rx="7" ry="12" fill="#5A8C3A" transform="rotate(40 46 26)"/>' +
            '<ellipse cx="30" cy="20" rx="8" ry="14" fill="#4F7D33"/>' +
            '<ellipse cx="22" cy="14" rx="6" ry="10" fill="#5A8C3A" transform="rotate(-15 22 14)"/>' +
            '<ellipse cx="38" cy="14" rx="6" ry="10" fill="#5A8C3A" transform="rotate(15 38 14)"/>' +
          '</g>' +
        '</svg>' +
      '</div>';
  }

  // ----- Analog clock -----
  function clockSvg() {
    return '' +
      '<div class="room__clock">' +
        '<svg viewBox="0 0 80 80" class="room__clock-svg">' +
          // Bezel
          '<circle cx="40" cy="40" r="36" fill="#6B4423"/>' +
          '<circle cx="40" cy="40" r="32" fill="#F5DEB3"/>' +
          '<circle cx="40" cy="40" r="32" fill="none" stroke="#8B6914" stroke-width="1.5"/>' +
          // Hour ticks
          '<g fill="#2D3436">' +
            '<rect x="39" y="10" width="2" height="6"/>' +
            '<rect x="39" y="64" width="2" height="6"/>' +
            '<rect x="10" y="39" width="6" height="2"/>' +
            '<rect x="64" y="39" width="6" height="2"/>' +
            '<circle cx="55" cy="15" r="1.2"/><circle cx="65" cy="25" r="1.2"/>' +
            '<circle cx="65" cy="55" r="1.2"/><circle cx="55" cy="65" r="1.2"/>' +
            '<circle cx="25" cy="65" r="1.2"/><circle cx="15" cy="55" r="1.2"/>' +
            '<circle cx="15" cy="25" r="1.2"/><circle cx="25" cy="15" r="1.2"/>' +
          '</g>' +
          // Hour hand
          '<line class="hh" x1="40" y1="40" x2="40" y2="22" stroke="#2D3436" stroke-width="3" stroke-linecap="round"/>' +
          // Minute hand
          '<line class="mh" x1="40" y1="40" x2="40" y2="14" stroke="#2D3436" stroke-width="2" stroke-linecap="round"/>' +
          // Center pin
          '<circle cx="40" cy="40" r="2.5" fill="#8B6914"/>' +
        '</svg>' +
      '</div>';
  }

  // ----- Stone fireplace with animated flames + smoke -----
  function fireplaceSvg(tier) {
    var w = (tier >= 3) ? 100 : 80;
    return '' +
      '<div class="room__fireplace" style="--fire-w:' + w + 'px;">' +
        '<svg viewBox="0 0 100 110" class="room__fireplace-svg">' +
          // Stone base bricks (4 rows)
          '<g fill="#8B7563">' +
            '<rect x="2" y="0" width="96" height="14" stroke="#5C4A38" stroke-width="0.5"/>' +
            '<rect x="2" y="14" width="48" height="14" stroke="#5C4A38" stroke-width="0.5"/>' +
            '<rect x="50" y="14" width="48" height="14" stroke="#5C4A38" stroke-width="0.5"/>' +
            '<rect x="2" y="80" width="48" height="14" stroke="#5C4A38" stroke-width="0.5"/>' +
            '<rect x="50" y="80" width="48" height="14" stroke="#5C4A38" stroke-width="0.5"/>' +
            '<rect x="2" y="94" width="96" height="14" stroke="#5C4A38" stroke-width="0.5"/>' +
          '</g>' +
          // Mantle shadow
          '<rect x="0" y="13" width="100" height="2" fill="#3D2A1C"/>' +
          // Hearth opening
          '<path d="M20,28 L80,28 L80,80 L20,80 Z" fill="#1A1A1A"/>' +
          '<path d="M20,28 Q50,22 80,28 L80,80 L20,80 Z" fill="#0A0A0A"/>' +
          // Log
          '<rect x="28" y="68" width="44" height="8" rx="3" fill="#6B4423"/>' +
          '<rect x="28" y="68" width="44" height="3" fill="#8B6914"/>' +
          // Flames (3 layers)
          '<g class="room__fireplace-flame">' +
            '<path d="M30,68 Q26,50 38,42 Q34,55 44,38 Q42,55 50,30 Q52,55 58,40 Q56,55 64,42 Q72,52 70,68 Z" fill="#FF6B35"/>' +
            '<path d="M34,68 Q32,52 42,46 Q40,56 48,40 Q50,56 54,42 Q56,56 62,48 Q68,55 66,68 Z" fill="#FFB037"/>' +
            '<path d="M40,68 Q40,56 46,50 Q48,58 52,48 Q54,58 58,52 Q60,60 60,68 Z" fill="#FFE66D"/>' +
          '</g>' +
          // Smoke wisp (drifts up via CSS animation)
          '<ellipse class="room__fireplace-smoke" cx="50" cy="20" rx="6" ry="3" fill="#888" opacity="0.4"/>' +
        '</svg>' +
      '</div>';
  }

  // ----- Floor lamp with night glow -----
  function lampSvg(tier) {
    return '' +
      '<div class="room__lamp">' +
        '<svg viewBox="0 0 40 100" class="room__lamp-svg">' +
          // Glow (fades in at night via .room--night)
          '<radialGradient id="lampGlow' + tier + '">' +
            '<stop offset="0%" stop-color="#FFE66D" stop-opacity="0.9"/>' +
            '<stop offset="100%" stop-color="#FFE66D" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<circle class="room__lamp-glow" cx="20" cy="20" r="22" fill="url(#lampGlow' + tier + ')"/>' +
          // Shade
          '<path d="M8,18 L32,18 L28,32 L12,32 Z" fill="#E8C99B"/>' +
          '<path d="M8,18 L32,18 L28,32 L12,32 Z" fill="none" stroke="#8B6914" stroke-width="0.8"/>' +
          // Bulb
          '<circle cx="20" cy="22" r="3" fill="#FFE66D" opacity="0.7"/>' +
          // Post
          '<rect x="19" y="32" width="2" height="56" fill="#3D2A1C"/>' +
          // Base
          '<ellipse cx="20" cy="92" rx="10" ry="3" fill="#1A1A1A"/>' +
          '<rect x="12" y="86" width="16" height="6" rx="2" fill="#3D2A1C"/>' +
        '</svg>' +
      '</div>';
  }

  // ----- Wooden shelf with toys -----
  function shelfSvg() {
    return '' +
      '<div class="room__shelf">' +
        '<svg viewBox="0 0 100 30" class="room__shelf-svg">' +
          // Toys above the shelf
          '<g>' +
            // Bone
            '<ellipse cx="18" cy="14" rx="3" ry="3" fill="#F5DEB3"/>' +
            '<ellipse cx="34" cy="14" rx="3" ry="3" fill="#F5DEB3"/>' +
            '<rect x="18" y="12" width="16" height="4" fill="#F5DEB3"/>' +
            // Tennis ball
            '<circle cx="55" cy="14" r="6" fill="#B5C800"/>' +
            '<path d="M49,14 Q55,8 61,14 M49,14 Q55,20 61,14" stroke="white" stroke-width="0.8" fill="none"/>' +
            // Trophy placeholder slot (actual trophies inserted here)
          '</g>' +
          // Plank
          '<rect x="0" y="20" width="100" height="4" fill="#6B4423"/>' +
          '<rect x="0" y="24" width="100" height="2" fill="#3D2A1C"/>' +
          // Brackets
          '<path d="M5,24 L5,28 L9,24 Z" fill="#3D2A1C"/>' +
          '<path d="M91,24 L95,24 L95,28 Z" fill="#3D2A1C"/>' +
          // Trophy items slot — populated by Game.RoomRenderer.renderShelfTrophies
          '<g class="room__shelf-items"></g>' +
        '</svg>' +
      '</div>';
  }

  // ----- Round patterned rug -----
  function rugSvg() {
    return '<div class="room__rug"></div>'; // CSS-only, see room.css
  }

  // ----- Wall painting with embedded dog portrait -----
  function paintingSvg() {
    var dogPortrait = getFavoriteDogPortrait();
    return '' +
      '<div class="room__painting">' +
        '<svg viewBox="0 0 60 50" class="room__painting-svg">' +
          // Outer wooden frame
          '<rect x="0" y="0" width="60" height="50" fill="#6B4423"/>' +
          '<rect x="3" y="3" width="54" height="44" fill="#8B6914"/>' +
          // Inner canvas
          '<rect x="6" y="6" width="48" height="38" fill="#FAF3E8"/>' +
          // Dog portrait (clipped)
          (dogPortrait
            ? '<g transform="translate(8,4) scale(0.36)" clip-path="inset(0 0 0 0)">' + dogPortrait + '</g>'
            : '<text x="30" y="28" text-anchor="middle" font-size="14" fill="#8B6914">\uD83D\uDC36</text>') +
          // Title placard
          '<rect x="20" y="44" width="20" height="4" fill="#3D2A1C"/>' +
        '</svg>' +
      '</div>';
  }

  // ============================================================
  // BUILD DECORATIONS — tier-cumulative, used by RoomRenderer.
  // ============================================================
  function buildDecorations(housingId) {
    var html = '';
    if (housingId >= 1) {
      html += windowSvg(housingId);
      html += plantLushSvg();
      html += lampSvg(housingId);
    }
    if (housingId >= 2) {
      html += rugSvg();
      html += paintingSvg();
      html += clockSvg();
      html += fireplaceSvg(housingId);
    }
    if (housingId >= 3) {
      html += shelfSvg();
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
    // legacy decor (graceful fallback)
    legacyDecorations: legacyDecorations,
    // detailed SVG decorations (Commit B+)
    buildDecorations: buildDecorations,
    windowSvg: windowSvg,
    plantLushSvg: plantLushSvg,
    clockSvg: clockSvg,
    fireplaceSvg: fireplaceSvg,
    lampSvg: lampSvg,
    shelfSvg: shelfSvg,
    paintingSvg: paintingSvg,
    rugSvg: rugSvg,
    // sky
    getSkyKey: getSkyKey,
    getSkyGradient: getSkyGradient,
    // dog portrait
    getFavoriteDogPortrait: getFavoriteDogPortrait
  };
})();
