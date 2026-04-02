var Game = Game || {};

Game.AchievementsData = [
  {
    id: 'primeiro_au_au', name: 'Primeiro Au Au', icon: '\uD83D\uDC3E',
    description: 'Adotou o primeiro cachorro',
    reward: 200,
    check: function (s) { return s.player.totalDogsAdopted >= 1; }
  },
  {
    id: 'casa_cheia', name: 'Casa Cheia', icon: '\uD83C\uDFE0',
    description: 'Ter 4 cachorros ao mesmo tempo',
    reward: 1000,
    check: function (s) { return s.dogs.length >= 4; }
  },
  {
    id: 'mestre_truques', name: 'Mestre dos Truques', icon: '\uD83C\uDFAA',
    description: 'Ensinou todos os truques a um cachorro',
    reward: 600,
    check: function (s) {
      var totalTricks = Game.Config.TRICKS.length + 1;
      return s.dogs.some(function (d) { return d.tricksLearned.length >= totalTricks; });
    }
  },
  {
    id: 'veterano', name: 'Veterano', icon: '\u2B50',
    description: 'Cuidou de um cachorro por 30 dias',
    reward: 400,
    check: function (s) {
      return s.dogs.some(function (d) {
        return (s.gameTime.day - d.adoptedOnDay) >= 30;
      });
    }
  },
  {
    id: 'colecionador_racas', name: 'Colecionador de Ra\u00e7as', icon: '\uD83D\uDCDA',
    description: 'Adotou 10 ra\u00e7as diferentes',
    reward: 800,
    check: function (s) { return s.player.totalBreedsAdopted.length >= 10; }
  },
  {
    id: 'mansao_canina', name: 'Mans\u00e3o Canina', icon: '\uD83C\uDFF0',
    description: 'Comprou a casa grande',
    reward: 1000,
    check: function (s) { return s.player.housingLevel >= 3; }
  },
  {
    id: 'fashionista_pet', name: 'Fashionista Pet', icon: '\uD83D\uDC57',
    description: 'Comprou 20 roupinhas',
    reward: 400,
    check: function (s) { return s.player.totalItemsBought >= 20; }
  },
  {
    id: 'heroi_abrigo', name: 'Her\u00f3i do Abrigo', icon: '\uD83E\uDDB8',
    description: 'Resgatou um cachorro que fugiu',
    reward: 300,
    check: function (s) { return s.runawayDogs && s.runawayDogs.length > 0 && s.player.totalDogsAdopted > s.dogs.length; }
  },
  {
    id: 'caramelo_lover', name: 'Caramelo Lover', icon: '\uD83E\uDD0E',
    description: 'Completou tudo com o Caramelo',
    reward: 2000,
    check: function (s) {
      var caramelo = s.dogs.find(function (d) { return d.breedId === 'caramelo'; });
      if (!caramelo) return false;
      var totalTricks = Game.Config.TRICKS.length + 1;
      return caramelo.tricksLearned.length >= totalTricks && caramelo.stats.happiness >= 90;
    }
  },
  {
    id: 'milionario_pata', name: 'Milion\u00e1rio Pata', icon: '\uD83D\uDCB0',
    description: 'Juntou 10.000 PataCoins',
    reward: 0,
    check: function (s) { return s.player.maxPataCoins >= 10000; }
  },
  // ===== NEW ACHIEVEMENTS =====
  {
    id: 'streak_7', name: '7 Dias Seguidos', icon: '\uD83D\uDD25',
    description: 'Manter um streak de 7 dias',
    reward: 200,
    check: function (s) { return s.player.streak >= 7; }
  },
  {
    id: 'level_10', name: 'N\u00edvel 10', icon: '\uD83C\uDF1F',
    description: 'Um cachorro chegou ao n\u00edvel 10',
    reward: 300,
    check: function (s) { return s.dogs.some(function (d) { return d.level >= 10; }); }
  },
  {
    id: 'level_20', name: 'Mestre Supremo', icon: '\uD83C\uDFC6',
    description: 'Um cachorro chegou ao n\u00edvel 20',
    reward: 500,
    check: function (s) { return s.dogs.some(function (d) { return d.level >= 20; }); }
  },
  {
    id: 'combo_7', name: 'Combo M\u00e1ximo', icon: '\uD83D\uDCA5',
    description: 'Fez um combo de 7 a\u00e7\u00f5es diferentes',
    reward: 200,
    check: function (s) { return s.player.maxCombo >= 7; }
  }
];

Game.Achievements = (function () {
  function checkAll() {
    if (!Game.State) return;
    Game.AchievementsData.forEach(function (ach) {
      if (Game.State.player.achievements.indexOf(ach.id) !== -1) return;
      if (ach.check(Game.State)) {
        Game.State.player.achievements.push(ach.id);
        if (ach.reward > 0) {
          Game.Player.addCoins(ach.reward, 'Conquista: ' + ach.name);
        }
        Game.EventBus.emit('achievement:unlocked', ach);
      }
    });
  }

  function isUnlocked(achId) {
    return Game.State && Game.State.player.achievements.indexOf(achId) !== -1;
  }

  function getAll() {
    return Game.AchievementsData;
  }

  return { checkAll: checkAll, isUnlocked: isUnlocked, getAll: getAll };
})();
