var Game = Game || {};

Game.TimeEngine = (function () {
  var tickTimer = null;
  var minuteCounter = 0;

  function start() {
    if (tickTimer) return;
    tickTimer = setInterval(tick, Game.Config.TICK_INTERVAL_MS);
  }

  function stop() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  function tick() {
    if (!Game.State) return;

    minuteCounter++;
    Game.State.gameTime.minute++;

    // Hour tick - check BEFORE emitting tick so display never shows :60
    if (Game.State.gameTime.minute >= Game.Config.GAME_MINUTES_PER_HOUR) {
      Game.State.gameTime.minute = 0;
      Game.State.gameTime.hour++;
      Game.EventBus.emit('hourTick', { hour: Game.State.gameTime.hour });

      // Day tick
      if (Game.State.gameTime.hour >= Game.Config.GAME_HOURS_PER_DAY) {
        Game.State.gameTime.hour = 0;
        Game.State.gameTime.day++;
        Game.State.player.dailyBonusClaimed = false;
        Game.EventBus.emit('dayTick', { day: Game.State.gameTime.day });
      }
    }

    Game.EventBus.emit('tick', { minute: minuteCounter });

    // Auto-save check
    if (minuteCounter % Game.Config.AUTO_SAVE_INTERVAL === 0) {
      Game.EventBus.emit('autoSave');
    }

    // Update last timestamp for offline calc
    Game.State.lastTimestamp = Date.now();
  }

  // Calculate and apply offline time when game loads
  function processOfflineTime() {
    if (!Game.State || !Game.State.lastTimestamp) return null;

    var elapsed = (Date.now() - Game.State.lastTimestamp) / 1000; // real seconds
    var gameHoursElapsed = elapsed / Game.Config.REAL_SECONDS_PER_GAME_HOUR;

    // Cap offline time
    if (gameHoursElapsed > Game.Config.MAX_OFFLINE_HOURS) {
      gameHoursElapsed = Game.Config.MAX_OFFLINE_HOURS;
    }

    // Minimum 1 game-minute to matter
    if (gameHoursElapsed < 1 / 60) return null;

    var events = [];

    // Apply stat decay for each dog
    Game.State.dogs.forEach(function (dog) {
      if (dog.hasRunAway) return;

      var breed = Game.Breeds ? Game.Breeds.getById(dog.breedId) : null;
      var hoursToProcess = gameHoursElapsed;

      while (hoursToProcess > 0) {
        var chunk = Math.min(hoursToProcess, 1);
        applyHourlyDecay(dog, breed, chunk);
        hoursToProcess -= chunk;

        // Check runaway
        if (checkNeglect(dog)) {
          dog.neglectCounter += chunk;
          if (dog.neglectCounter >= Game.Config.NEGLECT_RUNAWAY_THRESHOLD) {
            dog.hasRunAway = true;
            events.push({ type: 'runaway', dogName: dog.name });
            break;
          }
        }
      }
    });

    // Remove runaway dogs
    var ranAway = Game.State.dogs.filter(function (d) { return d.hasRunAway; });
    ranAway.forEach(function (d) {
      Game.State.runawayDogs.push(d);
    });
    Game.State.dogs = Game.State.dogs.filter(function (d) { return !d.hasRunAway; });

    // Advance game time
    var totalMinutes = Math.floor(gameHoursElapsed * 60);
    advanceGameTime(totalMinutes);

    Game.State.lastTimestamp = Date.now();

    return {
      realHours: Math.round(elapsed / 3600 * 10) / 10,
      gameHours: Math.round(gameHoursElapsed),
      gameDays: Math.round(gameHoursElapsed / 24 * 10) / 10,
      events: events
    };
  }

  function isDaytime() {
    if (!Game.State) return true;
    var hour = Game.State.gameTime.hour;
    return hour >= Game.Config.DAY_START_HOUR && hour < Game.Config.DAY_END_HOUR;
  }

  function getTimeMultiplier(dog) {
    var day = isDaytime();
    var tm = Game.Config.TIME_MULTIPLIERS;
    if (day && !dog.isAsleep) return tm.day_awake;
    if (day && dog.isAsleep) return tm.day_sleeping;
    if (!day && !dog.isAsleep) return tm.night_awake;
    return tm.night_sleeping; // night + sleeping
  }

  function applyHourlyDecay(dog, breed, fraction) {
    var cfg = Game.Config.DECAY_RATES;
    var stats = dog.stats;
    var timeMult = getTimeMultiplier(dog);

    // Skip energy decay if sleeping, give recovery instead
    if (dog.isAsleep) {
      var recovery = Game.Config.SLEEP_ENERGY_RECOVERY * fraction * timeMult;
      stats.energy = clampStat(stats.energy + recovery);
      if (stats.energy >= 90) {
        dog.isAsleep = false;
      }
    } else {
      var energyMult = breed ? (breed.attributes.energy / 5) : 1;
      stats.energy = clampStat(stats.energy + cfg.energy * energyMult * fraction * timeMult);
    }

    var hungerMult = breed ? (breed.attributes.hunger / 5) : 1;
    var happinessMult = breed ? (breed.attributes.happiness / 5) : 1;
    var hygieneMult = breed ? (breed.attributes.hygiene / 5) : 1;
    var learningMult = 1;

    stats.hunger = clampStat(stats.hunger + cfg.hunger * hungerMult * fraction * timeMult);
    stats.happiness = clampStat(stats.happiness + cfg.happiness * happinessMult * fraction * timeMult);
    stats.hygiene = clampStat(stats.hygiene + cfg.hygiene * hygieneMult * fraction * timeMult);
    stats.learning = clampStat(stats.learning + cfg.learning * learningMult * fraction * timeMult);

    // Health decays faster if hunger or hygiene are critical
    var healthDecay = cfg.health;
    var healthMult = breed ? (breed.attributes.health / 5) : 1;
    if (stats.hunger < Game.Config.HEALTH_CRITICAL_THRESHOLD ||
        stats.hygiene < Game.Config.HEALTH_CRITICAL_THRESHOLD) {
      healthDecay = Game.Config.HEALTH_CRITICAL_DECAY;
    }
    stats.health = clampStat(stats.health + healthDecay * healthMult * fraction * timeMult);
  }

  function checkNeglect(dog) {
    var criticalCount = 0;
    var threshold = Game.Config.NEGLECT_STAT_THRESHOLD;
    var stats = dog.stats;
    if (stats.hunger < threshold) criticalCount++;
    if (stats.happiness < threshold) criticalCount++;
    if (stats.energy < threshold) criticalCount++;
    if (stats.hygiene < threshold) criticalCount++;
    if (stats.health < threshold) criticalCount++;
    return criticalCount >= Game.Config.NEGLECT_MIN_CRITICAL_STATS;
  }

  function advanceGameTime(totalMinutes) {
    var gt = Game.State.gameTime;
    gt.minute += totalMinutes;
    while (gt.minute >= 60) {
      gt.minute -= 60;
      gt.hour++;
    }
    while (gt.hour >= 24) {
      gt.hour -= 24;
      gt.day++;
    }
  }

  function clampStat(value) {
    return Math.max(Game.Config.STAT_MIN, Math.min(Game.Config.STAT_MAX, value));
  }

  function getFormattedTime() {
    if (!Game.State) return '00:00';
    var h = Game.State.gameTime.hour;
    var m = Game.State.gameTime.minute;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function getFormattedDay() {
    if (!Game.State) return 'Dia 1';
    return 'Dia ' + Game.State.gameTime.day;
  }

  return {
    start: start,
    stop: stop,
    processOfflineTime: processOfflineTime,
    getFormattedTime: getFormattedTime,
    getFormattedDay: getFormattedDay,
    applyHourlyDecay: applyHourlyDecay,
    checkNeglect: checkNeglect
  };
})();
