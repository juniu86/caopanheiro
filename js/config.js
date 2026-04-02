var Game = Game || {};

Game.Config = {
  // Time system: 1 real second = 0.4 game-minutes
  // 2.5 real seconds = 1 game-minute
  // 150 real seconds = 1 game-hour
  // 3600 real seconds = 1 game-day
  TICK_INTERVAL_MS: 2500,        // ms between ticks (1 game-minute)
  GAME_MINUTES_PER_HOUR: 60,
  GAME_HOURS_PER_DAY: 24,
  REAL_SECONDS_PER_GAME_HOUR: 150,
  MAX_OFFLINE_HOURS: 2880,       // 48 real hours cap

  // Stat decay rates per game-hour (before breed multiplier)
  DECAY_RATES: {
    hunger: -3,
    happiness: -2,
    energy: -2.5,
    hygiene: -1.5,
    health: -0.5,
    learning: -0.3
  },

  // Health decays faster when other stats are critical
  HEALTH_CRITICAL_THRESHOLD: 20,
  HEALTH_CRITICAL_DECAY: -2,

  // Energy recovery while sleeping per game-hour
  SLEEP_ENERGY_RECOVERY: 5,

  // Day/Night cycle multipliers for energy recovery/decay
  // Day = 6h-20h game time, Night = 20h-6h
  DAY_START_HOUR: 6,
  DAY_END_HOUR: 20,
  TIME_MULTIPLIERS: {
    day_awake: 1.25,     // +25% energy recovery speed during day awake
    day_sleeping: 2.30,  // +130% energy recovery speed during day sleeping
    night_awake: 0.70,   // -30% energy recovery speed at night awake
    night_sleeping: 0.34 // -66% energy recovery speed at night sleeping
  },

  // Stat limits
  STAT_MIN: 0,
  STAT_MAX: 100,

  // Action effects (base values)
  ACTIONS: {
    feed: { hunger: 25 },
    feedPremium: { hunger: 40 },
    play: { happiness: 20, energy: -15 },
    bathe: { hygiene: 35 },
    sleep: { energy: 0 },  // handled by sleep system
    carinho: { happiness: 15 },
    walk: { happiness: 20, energy: -20 },
    teach: { learning: 15, energy: -10 },
    vet: { health: 40 },
    petisco: { happiness: 30, hunger: 10 },
    cleanPoop: { hygiene: 10 }
  },

  // Action cooldowns in game-minutes
  ACTION_COOLDOWNS: {
    feed: 30,
    play: 15,
    bathe: 120,
    carinho: 5,
    walk: 60,
    teach: 30,
    vet: 120,
    petisco: 60,
    cleanPoop: 0
  },

  // Action costs in PataCoins
  ACTION_COSTS: {
    vet: 30
  },

  // PataCoins economy
  COINS: {
    GOOD_CARE_BONUS: 5,           // per game-hour with all stats > 70
    GOOD_CARE_THRESHOLD: 70,
    TRICK_LEARNED: 10,
    DAILY_BONUS: 20,
    CLEAN_POOP_BONUS: 2,
    SPECIAL_TRICK_BONUS: 25
  },

  // Housing levels
  HOUSING: [
    { id: 0, name: 'Apartamento Pequeno', maxDogs: 1, upgradeCost: 0, bgClass: 'room--apt-small', icon: '\uD83C\uDFE2' },
    { id: 1, name: 'Apartamento Grande', maxDogs: 2, upgradeCost: 500, bgClass: 'room--apt-large', icon: '\uD83C\uDFE2' },
    { id: 2, name: 'Casa com Quintal', maxDogs: 3, upgradeCost: 1500, bgClass: 'room--house-small', icon: '\uD83C\uDFE1' },
    { id: 3, name: 'Casa Grande', maxDogs: 4, upgradeCost: 4000, bgClass: 'room--house-large', icon: '\uD83C\uDFE0' }
  ],

  // Neglect / Runaway
  NEGLECT_STAT_THRESHOLD: 15,    // stats below this count as critical
  NEGLECT_MIN_CRITICAL_STATS: 3, // how many stats must be critical
  NEGLECT_RUNAWAY_THRESHOLD: 48, // game-hours of neglect before runaway
  NEGLECT_WARNING_INTERVALS: [12, 24, 36],

  // Tricks available to learn
  TRICKS: [
    { id: 'senta', name: 'Senta', difficulty: 1 },
    { id: 'pata', name: 'D\u00e1 a Pata', difficulty: 1 },
    { id: 'deita', name: 'Deita', difficulty: 2 },
    { id: 'rola', name: 'Rola', difficulty: 2 },
    { id: 'finge_morto', name: 'Finge de Morto', difficulty: 3 },
    { id: 'gira', name: 'Gira', difficulty: 3 },
    { id: 'late', name: 'Late no Comando', difficulty: 2 },
    { id: 'busca', name: 'Busca', difficulty: 2 }
  ],

  // Save
  SAVE_KEY: 'caopanheiro_save',
  SAVE_VERSION: 1,
  AUTO_SAVE_INTERVAL: 60  // game-minutes
};
