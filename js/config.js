var Game = Game || {};

Game.Config = {
  // Time system: 1 real second = 0.4 game-minutes
  // 2.5 real seconds = 1 game-minute
  // 150 real seconds = 1 game-hour
  // 3600 real seconds = 1 game-day
  TICK_INTERVAL_MS: 2500,
  GAME_MINUTES_PER_HOUR: 60,
  GAME_HOURS_PER_DAY: 24,
  REAL_SECONDS_PER_GAME_HOUR: 150,
  MAX_OFFLINE_HOURS: 2880,

  // Stat decay rates per game-hour (before breed multiplier)
  DECAY_RATES: {
    hunger: -3,
    happiness: -2,
    energy: -2.5,
    hygiene: -1.5,
    health: -0.5,
    learning: -0.3
  },

  HEALTH_CRITICAL_THRESHOLD: 20,
  HEALTH_CRITICAL_DECAY: -2,
  SLEEP_ENERGY_RECOVERY: 5,

  // Day/Night cycle (real-world clock)
  DAY_START_HOUR: 6,
  DAY_END_HOUR: 20,
  TIME_MULTIPLIERS: {
    day_awake: 1.25,
    day_sleeping: 2.30,
    night_awake: 0.70,
    night_sleeping: 0.34
  },

  STAT_MIN: 0,
  STAT_MAX: 100,

  // Action effects
  ACTIONS: {
    feed: { hunger: 25 },
    feedPremium: { hunger: 40 },
    play: { happiness: 20, energy: -15 },
    bathe: { hygiene: 35 },
    sleep: { energy: 0 },
    carinho: { happiness: 15 },
    walk: { happiness: 20, energy: -20 },
    teach: { learning: 15, energy: -10 },
    vet: { health: 40 },
    petisco: { happiness: 30, hunger: 10 },
    cleanPoop: { hygiene: 10 }
  },

  ACTION_COOLDOWNS: {
    feed: 30, play: 15, bathe: 120, carinho: 5,
    walk: 60, teach: 30, vet: 120, petisco: 60, cleanPoop: 0
  },

  ACTION_COSTS: {
    vet: 30
  },

  // ===== PATACOINS ECONOMY (rebalanced 3x) =====
  COINS: {
    GOOD_CARE_BONUS: 25,
    GOOD_CARE_THRESHOLD: 70,
    TRICK_LEARNED: 30,
    DAILY_BONUS: 50,
    CLEAN_POOP_BONUS: 8,
    SPECIAL_TRICK_BONUS: 75,
    BASE_ACTION_REWARD: 4    // each action gives 3-5 random coins
  },

  // Housing levels
  HOUSING: [
    { id: 0, name: 'Apartamento Pequeno', maxDogs: 1, upgradeCost: 0, bgClass: 'room--apt-small', icon: '\uD83C\uDFE2' },
    { id: 1, name: 'Apartamento Grande', maxDogs: 2, upgradeCost: 500, bgClass: 'room--apt-large', icon: '\uD83C\uDFE2' },
    { id: 2, name: 'Casa com Quintal', maxDogs: 3, upgradeCost: 1500, bgClass: 'room--house-small', icon: '\uD83C\uDFE1' },
    { id: 3, name: 'Casa Grande', maxDogs: 4, upgradeCost: 4000, bgClass: 'room--house-large', icon: '\uD83C\uDFE0' }
  ],

  // Neglect / Runaway
  NEGLECT_STAT_THRESHOLD: 15,
  NEGLECT_MIN_CRITICAL_STATS: 3,
  NEGLECT_RUNAWAY_THRESHOLD: 48,
  NEGLECT_WARNING_INTERVALS: [12, 24, 36],

  // Tricks
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

  // ===== STREAK SYSTEM =====
  STREAK_REWARDS: [30, 50, 80, 120, 200, 300, 500],

  // ===== XP / LEVEL SYSTEM =====
  XP_PER_ACTION: {
    feed: 10, play: 15, bathe: 10, carinho: 5,
    walk: 20, teach: 25, petisco: 8, vet: 5
  },
  XP_PER_LEVEL_MULTIPLIER: 50,
  MAX_DOG_LEVEL: 20,
  LEVEL_UP_COIN_MULTIPLIER: 15,
  LEVEL_MILESTONE_BONUS: 100,
  LEVEL_MILESTONE_INTERVAL: 5,

  // ===== COMBO SYSTEM =====
  COMBO_WINDOW_MINUTES: 5,
  COMBO_THRESHOLDS: [
    { count: 3, multiplier: 0.5 },
    { count: 5, multiplier: 1.0 },
    { count: 7, multiplier: 1.5 }
  ],

  // ===== RANDOM EVENTS =====
  RANDOM_EVENT_CHANCE: 0.4,

  // Save
  SAVE_KEY: 'caopanheiro_save',
  SAVE_VERSION: 2,
  AUTO_SAVE_INTERVAL: 60
};
