var Game = Game || {};

Game.State = null;

Game.createDefaultState = function () {
  return {
    version: Game.Config.SAVE_VERSION,
    lastTimestamp: Date.now(),
    gameTime: { day: 1, hour: 8, minute: 0 },
    weather: { type: 'sunny', intensity: 0.5, since: 1 },
    player: {
      name: '',
      pataCoins: 50,
      housingLevel: 0,
      inventory: [],
      achievements: [],
      totalDogsAdopted: 0,
      totalBreedsAdopted: [],
      totalTricksLearned: 0,
      totalDaysPlayed: 0,
      totalItemsBought: 0,
      dailyBonusClaimed: false,
      maxPataCoins: 50,
      // Streak system
      streak: 0,
      lastStreakDate: null,
      // Daily missions
      dailyMissions: [],
      lastMissionDay: null,
      allMissionsBonus: false,
      // Combo system
      comboActions: [],
      comboExpiry: 0,
      // Tracking
      maxCombo: 0
    },
    dogs: [],
    runawayDogs: [],
    pendingEvents: [],
    settings: {
      soundEnabled: true,
      volume: 0.7
    }
  };
};

Game.initState = function (savedState) {
  if (savedState) {
    Game.State = savedState;
  } else {
    Game.State = Game.createDefaultState();
  }
};
