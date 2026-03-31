var Game = Game || {};

// Attributes from GDD: E=Energy, F=Hunger(Fome), H=Hygiene, S=Health(Saude), A=Learning(Aprendizado), Fe=Happiness(Felicidade)
// Higher number = that stat DECAYS faster (needs more attention)
// Learning (A) high = learns tricks FASTER (inverted for learning)

Game.BreedsData = [
  // ===== PORTE PEQUENO =====
  {
    id: 'poodle', name: 'Poodle Toy', group: 'small', size: 1,
    difficulty: 'easy', personality: 'Inteligente e elegante',
    attributes: { energy: 6, hunger: 5, hygiene: 3, health: 7, learning: 9, happiness: 7 },
    specialTrick: { id: 'danca_duas_patas', name: 'Dan\u00e7a em duas patas' },
    exclusiveItem: { id: 'lacinho_cetim', name: 'Lacinho de cetim', category: 'clothes', price: 80 },
    spriteClass: 'dog-poodle', emoji: '\uD83E\uDDA9', earType: 'floppy'
  },
  {
    id: 'shih_tzu', name: 'Shih Tzu', group: 'small', size: 1,
    difficulty: 'easy', personality: 'Carinhoso e calmo',
    attributes: { energy: 4, hunger: 5, hygiene: 2, health: 6, learning: 5, happiness: 8 },
    specialTrick: { id: 'rola_tapete', name: 'Rola no tapete' },
    exclusiveItem: { id: 'gravata_borboleta', name: 'Gravata borboleta', category: 'clothes', price: 60 },
    spriteClass: 'dog-shih-tzu', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'yorkshire', name: 'Yorkshire', group: 'small', size: 1,
    difficulty: 'medium', personality: 'Corajoso apesar do tamanho',
    attributes: { energy: 7, hunger: 4, hygiene: 2, health: 6, learning: 6, happiness: 7 },
    specialTrick: { id: 'late_grande', name: 'Late como grande' },
    exclusiveItem: { id: 'tiarinha', name: 'Tiarinha brilhante', category: 'clothes', price: 100 },
    spriteClass: 'dog-yorkshire', emoji: '\uD83D\uDC29', earType: 'pointy'
  },
  {
    id: 'chihuahua', name: 'Chihuahua', group: 'small', size: 1,
    difficulty: 'medium', personality: 'Nervoso e protetor',
    attributes: { energy: 8, hunger: 3, hygiene: 7, health: 5, learning: 5, happiness: 6 },
    specialTrick: { id: 'tremida_dramatica', name: 'Tremida dram\u00e1tica' },
    exclusiveItem: { id: 'camiseta_mexicana', name: 'Camiseta mexicana', category: 'clothes', price: 70 },
    spriteClass: 'dog-chihuahua', emoji: '\uD83D\uDC36', earType: 'pointy'
  },
  {
    id: 'pinscher', name: 'Pinscher', group: 'small', size: 1,
    difficulty: 'medium', personality: 'Agitado e barulhento',
    attributes: { energy: 9, hunger: 4, hygiene: 7, health: 7, learning: 6, happiness: 6 },
    specialTrick: { id: 'pulo_giratorio', name: 'Pulo girat\u00f3rio' },
    exclusiveItem: { id: 'coleira_espinhos', name: 'Coleira com espinhos (de mentira)', category: 'clothes', price: 90 },
    spriteClass: 'dog-pinscher', emoji: '\uD83D\uDC36', earType: 'pointy'
  },
  {
    id: 'lhasa_apso', name: 'Lhasa Apso', group: 'small', size: 1,
    difficulty: 'medium', personality: 'Independente e leal',
    attributes: { energy: 5, hunger: 5, hygiene: 2, health: 7, learning: 4, happiness: 7 },
    specialTrick: { id: 'olhar_hipnotico', name: 'Olhar hipn\u00f3tico' },
    exclusiveItem: { id: 'manta_tibetana', name: 'Manta tibetana', category: 'comfort', price: 85 },
    spriteClass: 'dog-lhasa-apso', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'maltes', name: 'Malt\u00eas', group: 'small', size: 1,
    difficulty: 'medium', personality: 'Doce e brincalh\u00e3o',
    attributes: { energy: 5, hunger: 4, hygiene: 1, health: 6, learning: 6, happiness: 8 },
    specialTrick: { id: 'beijo_nariz', name: 'Beijo no nariz' },
    exclusiveItem: { id: 'laco_fita_rosa', name: 'La\u00e7o de fita rosa', category: 'clothes', price: 50 },
    spriteClass: 'dog-maltes', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'pug', name: 'Pug', group: 'small', size: 1,
    difficulty: 'easy', personality: 'Engra\u00e7ado e pregui\u00e7oso',
    attributes: { energy: 3, hunger: 8, hygiene: 5, health: 4, learning: 4, happiness: 9 },
    specialTrick: { id: 'ronco_musical', name: 'Ronco musical' },
    exclusiveItem: { id: 'fantasia_abelha', name: 'Fantasia de abelha', category: 'clothes', price: 120 },
    spriteClass: 'dog-pug', emoji: '\uD83D\uDC36', earType: 'floppy'
  },

  // ===== PORTE MEDIO =====
  {
    id: 'beagle', name: 'Beagle', group: 'medium', size: 2,
    difficulty: 'easy', personality: 'Farejador e guloso',
    attributes: { energy: 8, hunger: 8, hygiene: 6, health: 7, learning: 5, happiness: 8 },
    specialTrick: { id: 'encontra_petisco', name: 'Encontra petisco escondido' },
    exclusiveItem: { id: 'mochila_explorador', name: 'Mochila de explorador', category: 'clothes', price: 100 },
    spriteClass: 'dog-beagle', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'cocker', name: 'Cocker Spaniel', group: 'medium', size: 2,
    difficulty: 'easy', personality: 'D\u00f3cil e amoroso',
    attributes: { energy: 7, hunger: 6, hygiene: 3, health: 6, learning: 7, happiness: 8 },
    specialTrick: { id: 'orelhas_vento', name: 'Orelhas ao vento' },
    exclusiveItem: { id: 'bandana_floral', name: 'Bandana floral', category: 'clothes', price: 60 },
    spriteClass: 'dog-cocker', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'border_collie', name: 'Border Collie', group: 'medium', size: 2,
    difficulty: 'hard', personality: 'G\u00eanio e hiperativo',
    attributes: { energy: 10, hunger: 6, hygiene: 5, health: 8, learning: 10, happiness: 6 },
    specialTrick: { id: 'organiza_brinquedos', name: 'Organiza brinquedos' },
    exclusiveItem: { id: 'frisbee_dourado', name: 'Frisbee dourado', category: 'toys', price: 150 },
    spriteClass: 'dog-border-collie', emoji: '\uD83D\uDC15', earType: 'pointy'
  },
  {
    id: 'bulldog_frances', name: 'Bulldog Franc\u00eas', group: 'medium', size: 2,
    difficulty: 'easy', personality: 'Palha\u00e7o e companheiro',
    attributes: { energy: 3, hunger: 7, hygiene: 5, health: 4, learning: 5, happiness: 9 },
    specialTrick: { id: 'senta_humano', name: 'Senta como humano' },
    exclusiveItem: { id: 'boina_francesa', name: 'Boina francesa', category: 'clothes', price: 90 },
    spriteClass: 'dog-bulldog-frances', emoji: '\uD83D\uDC36', earType: 'pointy'
  },
  {
    id: 'bull_terrier', name: 'Bull Terrier', group: 'medium', size: 2,
    difficulty: 'medium', personality: 'Forte e brincalh\u00e3o',
    attributes: { energy: 8, hunger: 7, hygiene: 6, health: 7, learning: 5, happiness: 7 },
    specialTrick: { id: 'gira_rabo', name: 'Gira atr\u00e1s do rabo' },
    exclusiveItem: { id: 'colete_listrado', name: 'Colete listrado', category: 'clothes', price: 75 },
    spriteClass: 'dog-bull-terrier', emoji: '\uD83D\uDC36', earType: 'pointy'
  },
  {
    id: 'basenji', name: 'Basenji', group: 'medium', size: 2,
    difficulty: 'hard', personality: 'Silencioso e independente',
    attributes: { energy: 8, hunger: 5, hygiene: 8, health: 8, learning: 3, happiness: 5 },
    specialTrick: { id: 'iodel', name: 'N\u00e3o late (faz iodel)' },
    exclusiveItem: { id: 'colar_africano', name: 'Colar africano', category: 'clothes', price: 110 },
    spriteClass: 'dog-basenji', emoji: '\uD83D\uDC36', earType: 'pointy'
  },
  {
    id: 'schnauzer', name: 'Schnauzer', group: 'medium', size: 2,
    difficulty: 'medium', personality: 'Esperto e bigodudo',
    attributes: { energy: 7, hunger: 6, hygiene: 4, health: 7, learning: 7, happiness: 7 },
    specialTrick: { id: 'pose_bigode', name: 'Pose de bigode' },
    exclusiveItem: { id: 'bigode_postico', name: 'Bigode posti\u00e7o extra', category: 'clothes', price: 65 },
    spriteClass: 'dog-schnauzer', emoji: '\uD83D\uDC36', earType: 'pointy'
  },
  {
    id: 'corgi', name: 'Corgi', group: 'medium', size: 2,
    difficulty: 'medium', personality: 'Baixinho e feliz',
    attributes: { energy: 8, hunger: 7, hygiene: 5, health: 6, learning: 7, happiness: 9 },
    specialTrick: { id: 'bumbum_balancante', name: 'Bumbum balan\u00e7ante' },
    exclusiveItem: { id: 'coroa_rainha', name: 'Coroa da rainha', category: 'clothes', price: 130 },
    spriteClass: 'dog-corgi', emoji: '\uD83D\uDC36', earType: 'pointy'
  },

  // ===== PORTE GRANDE =====
  {
    id: 'golden', name: 'Golden Retriever', group: 'large', size: 3,
    difficulty: 'easy', personality: 'Amig\u00e3o de todos',
    attributes: { energy: 8, hunger: 8, hygiene: 4, health: 6, learning: 9, happiness: 10 },
    specialTrick: { id: 'traz_jornal', name: 'Traz o jornal' },
    exclusiveItem: { id: 'bandana_surfista', name: 'Bandana de surfista', category: 'clothes', price: 70 },
    spriteClass: 'dog-golden', emoji: '\uD83D\uDC15', earType: 'floppy'
  },
  {
    id: 'labrador', name: 'Labrador', group: 'large', size: 3,
    difficulty: 'easy', personality: 'Comil\u00e3o e leal',
    attributes: { energy: 8, hunger: 9, hygiene: 5, health: 7, learning: 8, happiness: 10 },
    specialTrick: { id: 'mergulho_tigela', name: 'Mergulho na tigela' },
    exclusiveItem: { id: 'colete_salva_vidas', name: 'Colete salva-vidas', category: 'clothes', price: 85 },
    spriteClass: 'dog-labrador', emoji: '\uD83D\uDC15', earType: 'floppy'
  },
  {
    id: 'husky', name: 'Husky Siberiano', group: 'large', size: 3,
    difficulty: 'hard', personality: 'Dram\u00e1tico e falante',
    attributes: { energy: 10, hunger: 7, hygiene: 4, health: 8, learning: 4, happiness: 7 },
    specialTrick: { id: 'uiva_lobo', name: 'Uiva como lobo' },
    exclusiveItem: { id: 'cachecol_neve', name: 'Cachecol de neve', category: 'clothes', price: 95 },
    spriteClass: 'dog-husky', emoji: '\uD83D\uDC3A', earType: 'pointy'
  },
  {
    id: 'pastor_alemao', name: 'Pastor Alem\u00e3o', group: 'large', size: 3,
    difficulty: 'medium', personality: 'Protetor e disciplinado',
    attributes: { energy: 9, hunger: 8, hygiene: 5, health: 7, learning: 9, happiness: 7 },
    specialTrick: { id: 'guarda_casa', name: 'Guarda a casa' },
    exclusiveItem: { id: 'colete_policial', name: 'Colete policial', category: 'clothes', price: 110 },
    spriteClass: 'dog-pastor-alemao', emoji: '\uD83D\uDC15', earType: 'pointy'
  },
  {
    id: 'dalmata', name: 'D\u00e1lmata', group: 'large', size: 3,
    difficulty: 'hard', personality: 'Atleta e elegante',
    attributes: { energy: 10, hunger: 7, hygiene: 6, health: 6, learning: 6, happiness: 7 },
    specialTrick: { id: 'corrida_manchas', name: 'Corrida de manchas' },
    exclusiveItem: { id: 'capacete_bombeiro', name: 'Capacete de bombeiro', category: 'clothes', price: 120 },
    spriteClass: 'dog-dalmata', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'boxer', name: 'Boxer', group: 'large', size: 3,
    difficulty: 'medium', personality: 'Palha\u00e7o musculoso',
    attributes: { energy: 9, hunger: 8, hygiene: 6, health: 5, learning: 6, happiness: 9 },
    specialTrick: { id: 'boxeia_ar', name: 'Boxeia o ar' },
    exclusiveItem: { id: 'luvas_boxe', name: 'Luvas de boxe', category: 'clothes', price: 100 },
    spriteClass: 'dog-boxer', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'pitbull', name: 'Pitbull', group: 'large', size: 3,
    difficulty: 'medium', personality: 'Forte e carinhoso',
    attributes: { energy: 8, hunger: 7, hygiene: 6, health: 7, learning: 7, happiness: 9 },
    specialTrick: { id: 'sorriso_largo', name: 'Sorriso largo' },
    exclusiveItem: { id: 'camiseta_adote', name: "Camiseta 'Adote'", category: 'clothes', price: 60 },
    spriteClass: 'dog-pitbull', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'akita', name: 'Akita', group: 'large', size: 3,
    difficulty: 'expert', personality: 'Nobre e reservado',
    attributes: { energy: 7, hunger: 7, hygiene: 4, health: 7, learning: 4, happiness: 5 },
    specialTrick: { id: 'reverencia_japonesa', name: 'Rever\u00eancia japonesa' },
    exclusiveItem: { id: 'lenco_hachiko', name: 'Len\u00e7o Hachiko', category: 'clothes', price: 150 },
    spriteClass: 'dog-akita', emoji: '\uD83D\uDC36', earType: 'pointy'
  },

  // ===== PORTE GIGANTE =====
  {
    id: 'sao_bernardo', name: 'S\u00e3o Bernardo', group: 'giant', size: 4,
    difficulty: 'medium', personality: 'Gigante gentil e bab\u00e3o',
    attributes: { energy: 4, hunger: 10, hygiene: 3, health: 5, learning: 5, happiness: 8 },
    specialTrick: { id: 'abraco_urso', name: 'Abra\u00e7o de urso' },
    exclusiveItem: { id: 'barril_resgate', name: 'Barril de resgate', category: 'clothes', price: 140 },
    spriteClass: 'dog-sao-bernardo', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'dogue_alemao', name: 'Dogue Alem\u00e3o', group: 'giant', size: 4,
    difficulty: 'medium', personality: 'Enorme e desajeitado',
    attributes: { energy: 5, hunger: 10, hygiene: 5, health: 5, learning: 5, happiness: 7 },
    specialTrick: { id: 'senta_sofa', name: 'Senta no sof\u00e1 (e quebra)' },
    exclusiveItem: { id: 'gravata_elegante', name: 'Gravata elegante', category: 'clothes', price: 90 },
    spriteClass: 'dog-dogue-alemao', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'rottweiler', name: 'Rottweiler', group: 'giant', size: 4,
    difficulty: 'hard', personality: 'Guardi\u00e3o e fiel',
    attributes: { energy: 7, hunger: 8, hygiene: 6, health: 6, learning: 7, happiness: 6 },
    specialTrick: { id: 'olhar_intimidador', name: 'Olhar intimidador' },
    exclusiveItem: { id: 'corrente_dourada', name: 'Corrente dourada', category: 'clothes', price: 130 },
    spriteClass: 'dog-rottweiler', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'mastiff', name: 'Mastiff', group: 'giant', size: 4,
    difficulty: 'expert', personality: 'Pregui\u00e7oso e enorme',
    attributes: { energy: 3, hunger: 10, hygiene: 4, health: 5, learning: 3, happiness: 6 },
    specialTrick: { id: 'deita_nao_levanta', name: 'Deita e n\u00e3o levanta' },
    exclusiveItem: { id: 'almofada_gigante', name: 'Almofada gigante', category: 'comfort', price: 160 },
    spriteClass: 'dog-mastiff', emoji: '\uD83D\uDC36', earType: 'floppy'
  },
  {
    id: 'terra_nova', name: 'Terra Nova', group: 'giant', size: 4,
    difficulty: 'medium', personality: 'Nadador e bab\u00e1',
    attributes: { energy: 6, hunger: 9, hygiene: 2, health: 6, learning: 6, happiness: 8 },
    specialTrick: { id: 'salva_afogamento', name: 'Salva do afogamento' },
    exclusiveItem: { id: 'boia_praia', name: 'Boia de praia', category: 'clothes', price: 100 },
    spriteClass: 'dog-terra-nova', emoji: '\uD83D\uDC36', earType: 'floppy'
  },

  // ===== VIRA-LATAS =====
  {
    id: 'caramelo', name: 'Caramelo', group: 'viralata', size: 2,
    difficulty: 'easy', personality: 'Sobrevivente e amoroso',
    attributes: { energy: 7, hunger: 6, hygiene: 8, health: 9, learning: 7, happiness: 10 },
    specialTrick: { id: 'olhar_pidao', name: 'Olhar pid\u00e3o irresist\u00edvel' },
    exclusiveItem: { id: 'bone_praia', name: 'Bon\u00e9 de praia brasileiro', category: 'clothes', price: 50 },
    spriteClass: 'dog-caramelo', emoji: '\uD83D\uDC15', earType: 'floppy'
  },
  {
    id: 'pretinho', name: 'Pretinho', group: 'viralata', size: 2,
    difficulty: 'easy', personality: 'Fiel e companheiro',
    attributes: { energy: 7, hunger: 6, hygiene: 8, health: 9, learning: 7, happiness: 9 },
    specialTrick: { id: 'esconde_escuro', name: 'Esconde no escuro' },
    exclusiveItem: { id: 'capa_super_heroi', name: 'Capa de super-her\u00f3i', category: 'clothes', price: 70 },
    spriteClass: 'dog-pretinho', emoji: '\uD83D\uDC15\u200D\uD83E\uDDBA', earType: 'floppy'
  }
];

Game.Breeds = (function () {
  var breedMap = {};
  Game.BreedsData.forEach(function (b) {
    breedMap[b.id] = b;
  });

  function getAll() {
    return Game.BreedsData;
  }

  function getById(id) {
    return breedMap[id] || null;
  }

  function getByGroup(group) {
    return Game.BreedsData.filter(function (b) { return b.group === group; });
  }

  function getGroups() {
    return [
      { id: 'small', name: 'Pequeno', icon: '\uD83D\uDC36' },
      { id: 'medium', name: 'M\u00e9dio', icon: '\uD83D\uDC15' },
      { id: 'large', name: 'Grande', icon: '\uD83D\uDC15\u200D\uD83E\uDDBA' },
      { id: 'giant', name: 'Gigante', icon: '\uD83E\uDDAE' },
      { id: 'viralata', name: 'Vira-Lata', icon: '\u2B50' }
    ];
  }

  function getDifficultyLabel(diff) {
    var map = {
      easy: 'F\u00e1cil',
      medium: 'M\u00e9dio',
      hard: 'Dif\u00edcil',
      expert: 'Expert'
    };
    return map[diff] || diff;
  }

  function getSizeLabel(size) {
    var map = { 1: 'Pequeno', 2: 'M\u00e9dio', 3: 'Grande', 4: 'Gigante' };
    return map[size] || '';
  }

  return {
    getAll: getAll,
    getById: getById,
    getByGroup: getByGroup,
    getGroups: getGroups,
    getDifficultyLabel: getDifficultyLabel,
    getSizeLabel: getSizeLabel
  };
})();
