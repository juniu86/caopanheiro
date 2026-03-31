var Game = Game || {};

Game.State = null;

Game.createDefaultState = function () {
  return {
    version: Game.Config.SAVE_VERSION,
    lastTimestamp: Date.now(),
    gameTime: { day: 1, hour: 8, minute: 0 },
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
      maxPataCoins: 50
    },
    dogs: [],
    runawayDogs: [],
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
