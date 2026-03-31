var Game = Game || {};

Game.ItemsData = [
  // ===== ALIMENTACAO =====
  { id: 'racao_basica', name: 'Ra\u00e7\u00e3o B\u00e1sica', category: 'food', price: 10,
    effect: { hunger: 20 }, description: 'Restaura 20 de fome', icon: '\uD83C\uDF5A' },
  { id: 'racao_premium', name: 'Ra\u00e7\u00e3o Premium', category: 'food', price: 25,
    effect: { hunger: 40 }, description: 'Restaura 40 de fome', icon: '\uD83C\uDF56' },
  { id: 'racao_super', name: 'Ra\u00e7\u00e3o Super Premium', category: 'food', price: 50,
    effect: { hunger: 60 }, description: 'Restaura 60 de fome', icon: '\uD83E\uDD69' },
  { id: 'petisco_basico', name: 'Petisco', category: 'food', price: 15,
    effect: { happiness: 15, hunger: 10 }, description: 'Agrado gostoso', icon: '\uD83E\uDD5C' },
  { id: 'petisco_especial', name: 'Petisco Especial', category: 'food', price: 35,
    effect: { happiness: 30, hunger: 15 }, description: 'Agrado delicioso!', icon: '\uD83C\uDF96\uFE0F' },
  { id: 'osso', name: 'Osso', category: 'food', price: 20,
    effect: { happiness: 20, hunger: 10 }, description: 'Cachorro adora roer', icon: '\uD83E\uDDB4' },
  { id: 'agua_fresca', name: '\u00c1gua Fresca', category: 'food', price: 5,
    effect: { hunger: 10, health: 5 }, description: 'Hidrata\u00e7\u00e3o!', icon: '\uD83D\uDCA7' },

  // ===== BRINQUEDOS =====
  { id: 'bolinha', name: 'Bolinha', category: 'toys', price: 20,
    effect: { happiness: 20, energy: -10 }, description: 'Brinca de buscar', icon: '\u26BD' },
  { id: 'corda', name: 'Corda', category: 'toys', price: 25,
    effect: { happiness: 20, energy: -12 }, description: 'Cabo de guerra!', icon: '\uD83E\uDDF6' },
  { id: 'frisbee', name: 'Frisbee', category: 'toys', price: 30,
    effect: { happiness: 25, energy: -15 }, description: 'Voa longe!', icon: '\uD83E\uDD4F' },
  { id: 'osso_borracha', name: 'Osso de Borracha', category: 'toys', price: 15,
    effect: { happiness: 15 }, description: 'Bom pra morder', icon: '\uD83D\uDC36' },
  { id: 'pelúcia', name: 'Pel\u00facia', category: 'toys', price: 35,
    effect: { happiness: 20 }, description: 'Amiguinho de pel\u00facia', icon: '\uD83E\uDDF8' },
  { id: 'bola_tenis', name: 'Bola de T\u00eanis', category: 'toys', price: 18,
    effect: { happiness: 18, energy: -8 }, description: 'Cl\u00e1ssica!', icon: '\uD83C\uDFBE' },

  // ===== ROUPINHAS E ACESSORIOS =====
  { id: 'bandana_basica', name: 'Bandana B\u00e1sica', category: 'clothes', price: 30,
    effect: {}, description: 'Visual estiloso', icon: '\uD83E\uDDE3', wearable: true },
  { id: 'coleira_simples', name: 'Coleira Simples', category: 'clothes', price: 20,
    effect: {}, description: 'Coleira b\u00e1sica', icon: '\u2B55', wearable: true },
  { id: 'coleira_luxo', name: 'Coleira de Luxo', category: 'clothes', price: 80,
    effect: {}, description: 'Brilha muito!', icon: '\uD83D\uDCAE', wearable: true },
  { id: 'camiseta_basica', name: 'Camiseta', category: 'clothes', price: 40,
    effect: {}, description: 'Roupinha b\u00e1sica', icon: '\uD83D\uDC55', wearable: true },
  { id: 'chapeu', name: 'Chap\u00e9u', category: 'clothes', price: 45,
    effect: {}, description: 'Fofura de chap\u00e9u', icon: '\uD83E\uDDE2', wearable: true },
  { id: 'gravata', name: 'Gravata', category: 'clothes', price: 35,
    effect: {}, description: 'Elegante!', icon: '\uD83D\uDC54', wearable: true },
  { id: 'oculos_sol', name: '\u00d3culos de Sol', category: 'clothes', price: 50,
    effect: {}, description: 'Cool demais!', icon: '\uD83D\uDD76\uFE0F', wearable: true },

  // ===== CASA E CONFORTO =====
  { id: 'caminha_basica', name: 'Caminha B\u00e1sica', category: 'comfort', price: 40,
    effect: { energy: 10 }, description: 'Descansa melhor', icon: '\uD83D\uDECF\uFE0F' },
  { id: 'caminha_luxo', name: 'Caminha de Luxo', category: 'comfort', price: 120,
    effect: { energy: 20, happiness: 5 }, description: 'Sono de rei!', icon: '\uD83D\uDC51' },
  { id: 'cobertor', name: 'Cobertor Quentinho', category: 'comfort', price: 30,
    effect: { energy: 8, happiness: 5 }, description: 'Aconchego!', icon: '\uD83E\uDDE1' },
  { id: 'casinha', name: 'Casinha', category: 'comfort', price: 100,
    effect: { happiness: 10 }, description: 'Cantinho especial', icon: '\uD83C\uDFE0' },
  { id: 'tigela_premium', name: 'Tigela Premium', category: 'comfort', price: 50,
    effect: { hunger: 5 }, description: 'Comida rende mais', icon: '\uD83C\uDF7D\uFE0F' },
  { id: 'tapete', name: 'Tapete Macio', category: 'comfort', price: 60,
    effect: { happiness: 8 }, description: 'Fofo de pisar', icon: '\uD83E\uDDF6' },
  { id: 'ventilador', name: 'Ventilador', category: 'comfort', price: 80,
    effect: { health: 5 }, description: 'Refresca no calor', icon: '\uD83C\uDF2C\uFE0F' }
];

Game.Items = (function () {
  var itemMap = {};
  Game.ItemsData.forEach(function (item) {
    itemMap[item.id] = item;
  });

  // Add breed exclusive items to the map
  Game.BreedsData.forEach(function (breed) {
    if (breed.exclusiveItem && !itemMap[breed.exclusiveItem.id]) {
      var item = {
        id: breed.exclusiveItem.id,
        name: breed.exclusiveItem.name,
        category: breed.exclusiveItem.category,
        price: breed.exclusiveItem.price,
        effect: {},
        description: 'Exclusivo: ' + breed.name,
        icon: '\u2B50',
        wearable: breed.exclusiveItem.category === 'clothes',
        breedExclusive: breed.id
      };
      Game.ItemsData.push(item);
      itemMap[item.id] = item;
    }
  });

  function getAll() {
    return Game.ItemsData;
  }

  function getById(id) {
    return itemMap[id] || null;
  }

  function getByCategory(category) {
    return Game.ItemsData.filter(function (item) {
      return item.category === category && !item.breedExclusive;
    });
  }

  function getExclusiveForBreed(breedId) {
    return Game.ItemsData.filter(function (item) {
      return item.breedExclusive === breedId;
    });
  }

  function getCategories() {
    return [
      { id: 'food', name: 'Alimenta\u00e7\u00e3o', icon: '\uD83C\uDF56' },
      { id: 'toys', name: 'Brinquedos', icon: '\u26BD' },
      { id: 'clothes', name: 'Roupinhas', icon: '\uD83D\uDC55' },
      { id: 'comfort', name: 'Conforto', icon: '\uD83C\uDFE0' }
    ];
  }

  return {
    getAll: getAll,
    getById: getById,
    getByCategory: getByCategory,
    getExclusiveForBreed: getExclusiveForBreed,
    getCategories: getCategories
  };
})();
