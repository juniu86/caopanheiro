var Game = Game || {};

// Breed-specific sprite configurations for SVG generation
Game.BreedSprites = {
  // ===== SMALL =====
  poodle:        { body:'#F5F0E8', sec:'#E8E0D0', headS:'round', snout:8,  earT:'floppy', earS:11, legH:14, tailT:'pompom', mark:'none', tongue:false },
  shih_tzu:      { body:'#F0E6D3', sec:'#C4A882', headS:'round', snout:5,  earT:'floppy', earS:14, legH:10, tailT:'bushy',  mark:'bicolor', tongue:false },
  yorkshire:     { body:'#8B7355', sec:'#C4A574', headS:'round', snout:9,  earT:'pointy', earS:9,  legH:12, tailT:'medium', mark:'bicolor', tongue:false },
  chihuahua:     { body:'#E8C99B', sec:'#D4A574', headS:'round', snout:7,  earT:'bat',    earS:16, legH:11, tailT:'thin',   mark:'none', tongue:false },
  pinscher:      { body:'#2D2D2D', sec:'#8B4513', headS:'round', snout:10, earT:'pointy', earS:10, legH:14, tailT:'thin',   mark:'tuxedo', tongue:false },
  lhasa_apso:    { body:'#F5DEB3', sec:'#DEB887', headS:'round', snout:5,  earT:'floppy', earS:13, legH:9,  tailT:'bushy',  mark:'none', tongue:false },
  maltes:        { body:'#FEFEFE', sec:'#F0F0F0', headS:'round', snout:7,  earT:'floppy', earS:12, legH:10, tailT:'bushy',  mark:'none', tongue:false },
  pug:           { body:'#E8D5B7', sec:'#2D2D2D', headS:'flat',  snout:3,  earT:'floppy', earS:8,  legH:11, tailT:'curly',  mark:'mask', tongue:true },

  // ===== MEDIUM =====
  beagle:        { body:'#F5F5F5', sec:'#8B4513', headS:'round', snout:12, earT:'floppy', earS:14, legH:16, tailT:'medium', mark:'tricolor', tongue:false },
  cocker:        { body:'#D4A574', sec:'#B8860B', headS:'round', snout:11, earT:'floppy', earS:18, legH:15, tailT:'medium', mark:'none', tongue:false },
  border_collie: { body:'#2D2D2D', sec:'#FFFFFF', headS:'oval',  snout:14, earT:'pointy', earS:10, legH:17, tailT:'bushy',  mark:'bicolor', tongue:true },
  bulldog_frances:{ body:'#E8D5B7', sec:'#D4A574', headS:'flat', snout:4,  earT:'bat',    earS:14, legH:12, tailT:'stub',   mark:'none', tongue:false },
  bull_terrier:  { body:'#F5F5F5', sec:'#2D2D2D', headS:'oval',  snout:16, earT:'pointy', earS:9,  legH:16, tailT:'thin',   mark:'none', tongue:false },
  basenji:       { body:'#CD853F', sec:'#FFF5E6', headS:'round', snout:12, earT:'pointy', earS:11, legH:18, tailT:'curly',  mark:'bicolor', tongue:false },
  schnauzer:     { body:'#808080', sec:'#A9A9A9', headS:'round', snout:12, earT:'pointy', earS:9,  legH:15, tailT:'stub',   mark:'beard', tongue:false },
  corgi:         { body:'#F4A460', sec:'#FFFFFF', headS:'round', snout:11, earT:'pointy', earS:12, legH:8,  tailT:'stub',   mark:'bicolor', tongue:true },

  // ===== LARGE =====
  golden:        { body:'#DAA520', sec:'#C8960F', headS:'round', snout:13, earT:'floppy', earS:12, legH:20, tailT:'bushy',  mark:'none', tongue:true },
  labrador:      { body:'#F5DEB3', sec:'#E8C99B', headS:'round', snout:13, earT:'floppy', earS:11, legH:20, tailT:'medium', mark:'none', tongue:true },
  husky:         { body:'#B0C4DE', sec:'#FFFFFF', headS:'round', snout:13, earT:'pointy', earS:11, legH:20, tailT:'bushy',  mark:'mask', tongue:false },
  pastor_alemao: { body:'#C4954A', sec:'#2D2D2D', headS:'oval',  snout:15, earT:'pointy', earS:13, legH:21, tailT:'bushy',  mark:'saddle', tongue:false },
  dalmata:       { body:'#F5F5F5', sec:'#2D2D2D', headS:'round', snout:13, earT:'floppy', earS:11, legH:21, tailT:'thin',   mark:'spots', tongue:false },
  boxer:         { body:'#CD853F', sec:'#2D2D2D', headS:'flat',  snout:6,  earT:'floppy', earS:10, legH:19, tailT:'stub',   mark:'mask', tongue:true },
  pitbull:       { body:'#D4A574', sec:'#C49362', headS:'round', snout:10, earT:'rose',   earS:9,  legH:18, tailT:'medium', mark:'none', tongue:true },
  akita:         { body:'#F4A460', sec:'#FFFFFF', headS:'round', snout:11, earT:'pointy', earS:12, legH:19, tailT:'curly',  mark:'bicolor', tongue:false },

  // ===== GIANT =====
  sao_bernardo:  { body:'#CD853F', sec:'#FFFFFF', headS:'round', snout:12, earT:'floppy', earS:13, legH:20, tailT:'bushy',  mark:'bicolor', tongue:true },
  dogue_alemao:  { body:'#F5DEB3', sec:'#E8C99B', headS:'round', snout:14, earT:'floppy', earS:11, legH:28, tailT:'thin',   mark:'none', tongue:false },
  rottweiler:    { body:'#2D2D2D', sec:'#8B4513', headS:'round', snout:11, earT:'floppy', earS:10, legH:19, tailT:'stub',   mark:'tuxedo', tongue:false },
  mastiff:       { body:'#E8C99B', sec:'#B8956A', headS:'flat',  snout:8,  earT:'floppy', earS:12, legH:18, tailT:'medium', mark:'mask', tongue:true },
  terra_nova:    { body:'#2D2D2D', sec:'#1A1A1A', headS:'round', snout:12, earT:'floppy', earS:13, legH:19, tailT:'bushy',  mark:'none', tongue:false },

  // ===== VIRALATA =====
  caramelo:      { body:'#DAA520', sec:'#C8960F', headS:'round', snout:12, earT:'floppy', earS:11, legH:17, tailT:'medium', mark:'none', tongue:true },
  pretinho:      { body:'#2D2D2D', sec:'#4A4A4A', headS:'round', snout:11, earT:'floppy', earS:11, legH:16, tailT:'medium', mark:'none', tongue:false }
};

Game.SvgDogs = (function () {

  var D = {
    bodyW: 42, bodyH: 28,
    bodyX: 62, bodyY: 52,
    headR: 15,
    headX: 30, headY: 38,
    snout: 12, snoutH: 7,
    earS: 11,
    legH: 17, legW: 7,
    tailLen: 18
  };

  function darken(hex, amt) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    r = Math.max(0, r - amt); g = Math.max(0, g - amt); b = Math.max(0, b - amt);
    return '#' + ((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
  }

  function lighten(hex, amt) {
    var r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    r = Math.min(255, r + amt); g = Math.min(255, g + amt); b = Math.min(255, b + amt);
    return '#' + ((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
  }

  function generate(breedId, options) {
    options = options || {};
    var sp = Game.BreedSprites[breedId];
    if (!sp) sp = Game.BreedSprites.caramelo;

    var c = sp.body;
    var c2 = sp.sec;
    var cd = darken(c, 30);
    var cl = lighten(c, 20);

    var bW = D.bodyW, bH = D.bodyH, bX = D.bodyX, bY = D.bodyY;
    var hR = D.headR, hX = D.headX, hY = D.headY;
    var sn = sp.snout, snH = D.snoutH;
    var lH = sp.legH, lW = D.legW;

    // Head shape adjustments
    var hRx = hR, hRy = hR;
    if (sp.headS === 'flat') { hRx = hR + 2; hRy = hR + 1; hX -= 2; }
    if (sp.headS === 'oval') { hRx = hR + 4; hRy = hR - 2; }

    var svg = '<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">';

    // === TAIL ===
    svg += drawTail(sp, c, cd, bX, bY, bW, bH);

    // === BACK LEGS (behind body) ===
    var legY = bY + bH * 0.6;
    var leg1X = bX + bW * 0.25;
    var leg2X = bX - bW * 0.2;
    svg += '<rect x="' + (leg1X) + '" y="' + legY + '" width="' + lW + '" height="' + lH + '" rx="3" fill="' + cd + '"/>';
    svg += '<rect x="' + (leg2X) + '" y="' + legY + '" width="' + lW + '" height="' + lH + '" rx="3" fill="' + cd + '"/>';

    // === BODY ===
    svg += '<ellipse cx="' + bX + '" cy="' + bY + '" rx="' + bW + '" ry="' + bH + '" fill="' + c + '"/>';

    // === MARKINGS ON BODY ===
    svg += drawMarkings(sp, c, c2, cd, bX, bY, bW, bH, hX, hY, hRx, hRy);

    // === FRONT LEGS ===
    var fleg1X = bX - bW * 0.35;
    var fleg2X = bX - bW * 0.6;
    var flegColor = (sp.mark === 'bicolor' || sp.mark === 'tricolor') ? c2 : c;
    svg += '<rect x="' + (fleg1X) + '" y="' + legY + '" width="' + lW + '" height="' + lH + '" rx="3" fill="' + flegColor + '"/>';
    svg += '<rect x="' + (fleg2X) + '" y="' + legY + '" width="' + lW + '" height="' + lH + '" rx="3" fill="' + flegColor + '"/>';
    // Paws
    svg += '<ellipse cx="' + (fleg1X + lW/2) + '" cy="' + (legY + lH) + '" rx="' + (lW*0.7) + '" ry="3" fill="' + cd + '"/>';
    svg += '<ellipse cx="' + (fleg2X + lW/2) + '" cy="' + (legY + lH) + '" rx="' + (lW*0.7) + '" ry="3" fill="' + cd + '"/>';

    // === NECK connection ===
    var neckX = bX - bW * 0.55;
    svg += '<ellipse cx="' + (neckX + 8) + '" cy="' + (bY - 5) + '" rx="12" ry="15" fill="' + c + '"/>';

    // === HEAD ===
    svg += '<ellipse cx="' + hX + '" cy="' + hY + '" rx="' + hRx + '" ry="' + hRy + '" fill="' + c + '"/>';

    // Head markings (mask, etc)
    if (sp.mark === 'mask') {
      svg += '<ellipse cx="' + hX + '" cy="' + (hY - 2) + '" rx="' + (hRx * 0.7) + '" ry="' + (hRy * 0.5) + '" fill="' + c2 + '" opacity="0.8"/>';
    }

    // === SNOUT ===
    var snX = hX - hRx - sn + 4;
    var snY = hY + 2;
    svg += '<ellipse cx="' + (snX + sn/2) + '" cy="' + (snY + 1) + '" rx="' + (sn/2 + 2) + '" ry="' + (snH/2 + 1) + '" fill="' + cl + '"/>';

    // Nose
    svg += '<ellipse cx="' + snX + '" cy="' + snY + '" rx="3.5" ry="2.8" fill="#1A1A1A"/>';
    // Nose highlight
    svg += '<ellipse cx="' + (snX - 1) + '" cy="' + (snY - 1) + '" rx="1.2" ry="0.8" fill="#444" opacity="0.5"/>';

    // Mouth line
    svg += '<path d="M' + (snX + 2) + ',' + (snY + 2.5) + ' Q' + (snX + sn*0.4) + ',' + (snY + 5) + ' ' + (snX + sn*0.7) + ',' + (snY + 3) + '" stroke="#6B4226" fill="none" stroke-width="0.8"/>';

    // === TONGUE ===
    if (sp.tongue) {
      svg += '<ellipse cx="' + (snX + sn * 0.3) + '" cy="' + (snY + 6) + '" rx="3" ry="5" fill="#FF6B8A"/>';
      svg += '<line x1="' + (snX + sn * 0.3) + '" y1="' + (snY + 3) + '" x2="' + (snX + sn * 0.3) + '" y2="' + (snY + 8) + '" stroke="#E05070" stroke-width="0.5"/>';
    }

    // === EYE ===
    var eyeX = hX - hRx * 0.3;
    var eyeY = hY - hRy * 0.15;
    // Eye white
    svg += '<ellipse cx="' + eyeX + '" cy="' + eyeY + '" rx="4" ry="4.5" fill="white"/>';
    // Iris
    svg += '<ellipse cx="' + (eyeX - 0.5) + '" cy="' + eyeY + '" rx="2.8" ry="3" fill="#3D2B1F"/>';
    // Pupil
    svg += '<circle cx="' + (eyeX - 1) + '" cy="' + (eyeY - 0.3) + '" r="1.5" fill="#1A1A1A"/>';
    // Highlight
    svg += '<circle cx="' + (eyeX - 2) + '" cy="' + (eyeY - 1.5) + '" r="1" fill="white"/>';

    // Sleeping eyes
    if (options.mood === 'sleeping') {
      svg += '<rect x="' + (eyeX - 5) + '" y="' + (eyeY - 5) + '" width="10" height="10" fill="' + c + '"/>';
      svg += '<line x1="' + (eyeX - 3.5) + '" y1="' + eyeY + '" x2="' + (eyeX + 3.5) + '" y2="' + eyeY + '" stroke="#3D2B1F" stroke-width="1.5" stroke-linecap="round"/>';
    }

    // Sad eyes (half closed)
    if (options.mood === 'sad' || options.mood === 'very_sad') {
      svg += '<path d="M' + (eyeX - 4) + ',' + (eyeY - 3) + ' L' + (eyeX + 4) + ',' + (eyeY - 1) + '" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>';
    }

    // Eyebrow
    svg += '<path d="M' + (eyeX - 3.5) + ',' + (eyeY - 5.5) + ' Q' + eyeX + ',' + (eyeY - 7.5) + ' ' + (eyeX + 4) + ',' + (eyeY - 5) + '" stroke="' + cd + '" fill="none" stroke-width="1" stroke-linecap="round"/>';

    // === EARS ===
    svg += drawEars(sp, c, cd, c2, hX, hY, hRx, hRy);

    // === BEARD for schnauzer ===
    if (sp.mark === 'beard') {
      svg += '<rect x="' + (snX + 2) + '" y="' + (snY + 3) + '" width="' + (sn * 0.6) + '" height="8" rx="4" fill="' + lighten(c, 40) + '"/>';
    }

    // Cheek blush
    if (options.mood === 'happy' || sp.tongue) {
      svg += '<ellipse cx="' + (hX + 2) + '" cy="' + (hY + 4) + '" rx="3" ry="2" fill="#FFB6C1" opacity="0.4"/>';
    }

    svg += '</svg>';
    return svg;
  }

  function drawTail(sp, c, cd, bX, bY, bW, bH) {
    var tx = bX + bW * 0.85;
    var ty = bY - bH * 0.3;
    var svg = '';

    switch (sp.tailT) {
      case 'bushy':
        svg += '<path d="M' + tx + ',' + ty + ' C' + (tx+8) + ',' + (ty-18) + ' ' + (tx+18) + ',' + (ty-15) + ' ' + (tx+15) + ',' + (ty-5) + '" stroke="' + c + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
        svg += '<circle cx="' + (tx+15) + '" cy="' + (ty-7) + '" r="5" fill="' + c + '"/>';
        break;
      case 'curly':
        svg += '<path d="M' + tx + ',' + ty + ' C' + (tx+5) + ',' + (ty-20) + ' ' + (tx+15) + ',' + (ty-18) + ' ' + (tx+10) + ',' + (ty-8) + ' C' + (tx+8) + ',' + (ty-2) + ' ' + (tx+14) + ',' + (ty-12) + ' ' + (tx+12) + ',' + (ty-15) + '" stroke="' + c + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
        break;
      case 'thin':
        svg += '<path d="M' + tx + ',' + ty + ' Q' + (tx+12) + ',' + (ty-20) + ' ' + (tx+8) + ',' + (ty-12) + '" stroke="' + c + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
        break;
      case 'stub':
        svg += '<ellipse cx="' + (tx+3) + '" cy="' + (ty+2) + '" rx="5" ry="4" fill="' + c + '"/>';
        break;
      case 'pompom':
        svg += '<line x1="' + tx + '" y1="' + ty + '" x2="' + (tx+8) + '" y2="' + (ty-12) + '" stroke="' + c + '" stroke-width="3"/>';
        svg += '<circle cx="' + (tx+8) + '" cy="' + (ty-14) + '" r="5" fill="' + c + '"/>';
        break;
      default: // medium
        svg += '<path d="M' + tx + ',' + ty + ' Q' + (tx+10) + ',' + (ty-22) + ' ' + (tx+14) + ',' + (ty-10) + '" stroke="' + c + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
    }
    return svg;
  }

  function drawEars(sp, c, cd, c2, hX, hY, hRx, hRy) {
    var svg = '';
    var eS = sp.earS;
    var earColor = c;
    var earInner = lighten(c, 30);

    switch (sp.earT) {
      case 'pointy':
        // Triangle ears pointing up
        var eX = hX + hRx * 0.1;
        var eY = hY - hRy;
        svg += '<polygon points="' + eX + ',' + eY + ' ' + (eX + eS*0.5) + ',' + (eY - eS) + ' ' + (eX + eS) + ',' + eY + '" fill="' + earColor + '"/>';
        svg += '<polygon points="' + (eX+2) + ',' + eY + ' ' + (eX + eS*0.5) + ',' + (eY - eS + 3) + ' ' + (eX + eS - 2) + ',' + eY + '" fill="' + earInner + '" opacity="0.5"/>';
        // Second ear (behind)
        svg += '<polygon points="' + (eX - 4) + ',' + eY + ' ' + (eX + eS*0.5 - 4) + ',' + (eY - eS + 1) + ' ' + (eX + eS - 4) + ',' + eY + '" fill="' + cd + '"/>';
        break;

      case 'bat':
        // Large bat-like ears (french bulldog, chihuahua)
        var bX1 = hX + hRx * 0.2;
        var bY1 = hY - hRy + 2;
        svg += '<ellipse cx="' + (bX1 + eS*0.35) + '" cy="' + (bY1 - eS*0.6) + '" rx="' + (eS*0.45) + '" ry="' + (eS*0.7) + '" fill="' + earColor + '"/>';
        svg += '<ellipse cx="' + (bX1 + eS*0.35) + '" cy="' + (bY1 - eS*0.55) + '" rx="' + (eS*0.25) + '" ry="' + (eS*0.45) + '" fill="' + earInner + '" opacity="0.4"/>';
        // Second ear
        svg += '<ellipse cx="' + (bX1 + eS*0.35 - 5) + '" cy="' + (bY1 - eS*0.6 + 1) + '" rx="' + (eS*0.4) + '" ry="' + (eS*0.65) + '" fill="' + cd + '"/>';
        break;

      case 'rose':
        // Small folded ears (pitbull)
        var rX = hX + hRx * 0.3;
        var rY = hY - hRy + 2;
        svg += '<path d="M' + rX + ',' + rY + ' Q' + (rX + eS*0.3) + ',' + (rY - eS*0.5) + ' ' + (rX + eS*0.7) + ',' + (rY + 2) + '" fill="' + earColor + '" stroke="' + cd + '" stroke-width="0.5"/>';
        svg += '<path d="M' + (rX-5) + ',' + (rY+1) + ' Q' + (rX + eS*0.3 - 5) + ',' + (rY - eS*0.5 + 1) + ' ' + (rX + eS*0.7 - 5) + ',' + (rY + 3) + '" fill="' + cd + '"/>';
        break;

      default: // floppy
        var fX = hX + hRx * 0.4;
        var fY = hY - hRy * 0.2;
        svg += '<path d="M' + fX + ',' + fY + ' Q' + (fX + eS*0.6) + ',' + (fY - 3) + ' ' + (fX + eS*0.3) + ',' + (fY + eS) + '" fill="' + earColor + '" stroke="' + cd + '" stroke-width="0.5"/>';
        svg += '<ellipse cx="' + (fX + eS*0.3) + '" cy="' + (fY + eS - 2) + '" rx="' + (eS*0.35) + '" ry="' + (eS*0.25) + '" fill="' + earColor + '"/>';
        // Second ear (behind)
        svg += '<path d="M' + (fX - 6) + ',' + (fY + 1) + ' Q' + (fX + eS*0.6 - 6) + ',' + (fY - 2) + ' ' + (fX + eS*0.3 - 6) + ',' + (fY + eS + 1) + '" fill="' + cd + '"/>';
    }
    return svg;
  }

  function drawMarkings(sp, c, c2, cd, bX, bY, bW, bH, hX, hY, hRx, hRy) {
    var svg = '';
    switch (sp.mark) {
      case 'spots':
        var spots = [
          { dx: -10, dy: -8, r: 4 }, { dx: 8, dy: -5, r: 3 },
          { dx: -5, dy: 5, r: 3.5 }, { dx: 15, dy: 2, r: 4 },
          { dx: 0, dy: -12, r: 3 }, { dx: 20, dy: -10, r: 3.5 },
          { dx: -15, dy: 0, r: 2.5 }, { dx: 12, dy: 8, r: 3 },
          { dx: 25, dy: -5, r: 2.5 }
        ];
        spots.forEach(function (s) {
          svg += '<circle cx="' + (bX + s.dx) + '" cy="' + (bY + s.dy) + '" r="' + s.r + '" fill="' + c2 + '"/>';
        });
        // Head spots
        svg += '<circle cx="' + (hX + 3) + '" cy="' + (hY - 5) + '" r="3" fill="' + c2 + '"/>';
        svg += '<circle cx="' + (hX - 5) + '" cy="' + (hY + 3) + '" r="2.5" fill="' + c2 + '"/>';
        break;

      case 'bicolor':
        // White belly/chest
        svg += '<ellipse cx="' + (bX - bW*0.2) + '" cy="' + (bY + bH*0.3) + '" rx="' + (bW*0.5) + '" ry="' + (bH*0.55) + '" fill="' + c2 + '"/>';
        // White chest on head
        svg += '<ellipse cx="' + (hX + 2) + '" cy="' + (hY + hRy*0.5) + '" rx="' + (hRx*0.5) + '" ry="' + (hRy*0.4) + '" fill="' + c2 + '"/>';
        break;

      case 'tricolor':
        // White belly
        svg += '<ellipse cx="' + (bX - bW*0.15) + '" cy="' + (bY + bH*0.3) + '" rx="' + (bW*0.45) + '" ry="' + (bH*0.5) + '" fill="' + c2 + '"/>';
        // Dark back patches
        svg += '<ellipse cx="' + (bX + bW*0.1) + '" cy="' + (bY - bH*0.35) + '" rx="' + (bW*0.5) + '" ry="' + (bH*0.35) + '" fill="#2D2D2D"/>';
        break;

      case 'saddle':
        // Dark saddle on back
        svg += '<path d="M' + (bX - bW*0.2) + ',' + (bY - bH*0.7) + ' Q' + bX + ',' + (bY - bH) + ' ' + (bX + bW*0.7) + ',' + (bY - bH*0.5) + ' L' + (bX + bW*0.6) + ',' + (bY + bH*0.1) + ' Q' + bX + ',' + (bY + bH*0.2) + ' ' + (bX - bW*0.3) + ',' + bY + ' Z" fill="' + c2 + '"/>';
        break;

      case 'tuxedo':
        // Light chest/belly V shape
        svg += '<path d="M' + (bX - bW*0.6) + ',' + (bY - bH*0.2) + ' L' + (bX - bW*0.3) + ',' + (bY + bH*0.5) + ' L' + bX + ',' + (bY + bH*0.6) + ' L' + (bX - bW*0.1) + ',' + (bY + bH*0.5) + ' L' + (bX - bW*0.5) + ',' + (bY + bH*0.2) + ' Z" fill="' + c2 + '"/>';
        // Eyebrow dots for rottweiler
        svg += '<circle cx="' + (hX - hRx*0.2) + '" cy="' + (hY - hRy*0.4) + '" r="2.5" fill="' + c2 + '"/>';
        break;

      case 'mask':
        // This is drawn on the head separately in main generate
        break;
    }
    return svg;
  }

  // ===== OWNER CHARACTER =====
  function generateOwner(options) {
    options = options || {};
    var skin = options.skinColor || '#FDBCB4';
    var hair = options.hairColor || '#6B4226';
    var shirt = '#5B9BD5';
    var pants = '#4A6FA5';
    var action = options.action || 'idle';

    var svg = '<svg viewBox="0 0 50 90" xmlns="http://www.w3.org/2000/svg">';

    // Legs
    svg += '<rect x="15" y="58" width="8" height="28" rx="3" fill="' + pants + '"/>';
    svg += '<rect x="27" y="58" width="8" height="28" rx="3" fill="' + pants + '"/>';
    // Shoes
    svg += '<ellipse cx="19" cy="87" rx="6" ry="3" fill="#5C4033"/>';
    svg += '<ellipse cx="31" cy="87" rx="6" ry="3" fill="#5C4033"/>';

    // Body / shirt
    svg += '<rect x="12" y="35" width="26" height="26" rx="5" fill="' + shirt + '"/>';

    // Arms
    var armAngle = '';
    if (action === 'feeding') {
      // Arm reaching down with bowl
      svg += '<path d="M12,40 Q2,50 8,60" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
      svg += '<circle cx="7" cy="62" r="4" fill="#C0C0C0"/>'; // bowl
      svg += '<path d="M38,40 Q42,48 38,55" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
    } else if (action === 'playing') {
      // Arm throwing
      svg += '<path d="M12,40 Q0,30 5,22" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
      svg += '<circle cx="4" cy="20" r="4" fill="#FF6347"/>'; // ball
      svg += '<path d="M38,40 Q42,48 38,55" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
    } else if (action === 'bathing') {
      // Arms scrubbing
      svg += '<path d="M12,40 Q4,48 8,55" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
      svg += '<rect x="3" y="53" width="8" height="4" rx="2" fill="#87CEEB"/>'; // sponge
      svg += '<path d="M38,40 Q44,48 40,55" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
    } else if (action === 'carinho') {
      // Hand reaching to pet
      svg += '<path d="M12,40 Q2,45 6,55" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
      // Heart
      svg += '<text x="0" y="52" font-size="8">\u2764\uFE0F</text>';
      svg += '<path d="M38,40 Q42,48 38,55" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
    } else {
      // Default arms at sides
      svg += '<path d="M12,40 Q8,50 12,58" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
      svg += '<path d="M38,40 Q42,50 38,58" stroke="' + skin + '" stroke-width="6" fill="none" stroke-linecap="round"/>';
    }

    // Neck
    svg += '<rect x="20" y="28" width="10" height="10" rx="3" fill="' + skin + '"/>';

    // Head
    svg += '<circle cx="25" cy="20" r="14" fill="' + skin + '"/>';

    // Hair
    svg += '<path d="M11,18 Q12,6 25,6 Q38,6 39,18 L38,14 Q35,8 25,8 Q15,8 12,14 Z" fill="' + hair + '"/>';

    // Face - eye
    svg += '<circle cx="19" cy="19" r="2" fill="#2D2D2D"/>';
    svg += '<circle cx="18.5" cy="18.5" r="0.7" fill="white"/>';

    // Smile
    svg += '<path d="M18,25 Q22,29 27,25" stroke="#C07060" stroke-width="1.2" fill="none" stroke-linecap="round"/>';

    // Blush
    svg += '<ellipse cx="17" cy="24" rx="3" ry="1.5" fill="#FFB6C1" opacity="0.4"/>';

    svg += '</svg>';
    return svg;
  }

  return {
    generate: generate,
    generateOwner: generateOwner
  };
})();
