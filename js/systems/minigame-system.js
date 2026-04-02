var Game = Game || {};

Game.MinigameSystem = (function () {
  var isPlaying = false;
  var gameTimer = null;
  var score = 0;
  var targetCount = 0;
  var maxTime = 5000; // 5 seconds to play

  // Minigame types per action
  var GAMES = {
    play: {
      name: 'Pega a Bolinha!',
      instruction: 'Clique na bolinha o m\u00e1ximo que conseguir!',
      emoji: '\u26BD',
      maxHits: 8,
      timeMs: 5000,
      render: renderCatchGame,
      bonusMultiplier: 2.5
    },
    teach: {
      name: 'Repita a Sequ\u00eancia!',
      instruction: 'Clique nos \u00edcones na ordem certa!',
      emoji: '\uD83C\uDFAA',
      maxHits: 4,
      timeMs: 6000,
      render: renderSequenceGame,
      bonusMultiplier: 3
    }
  };

  function canPlay(actionId) {
    return GAMES[actionId] !== undefined;
  }

  function startMinigame(actionId, dog, callback) {
    var game = GAMES[actionId];
    if (!game || isPlaying) {
      if (callback) callback(0);
      return;
    }

    isPlaying = true;
    score = 0;
    targetCount = 0;

    var overlay = document.getElementById('minigame-overlay');
    if (!overlay) {
      if (callback) callback(0);
      isPlaying = false;
      return;
    }

    overlay.style.display = 'flex';
    overlay.innerHTML = '';

    game.render(overlay, game, function (finalScore) {
      isPlaying = false;
      overlay.style.display = 'none';
      overlay.innerHTML = '';

      // Bonus coins based on score
      var maxScore = game.maxHits;
      var percent = Math.min(1, finalScore / maxScore);
      var bonusCoins = Math.round(percent * game.bonusMultiplier * 10);

      if (bonusCoins > 0) {
        Game.Player.addCoins(bonusCoins, 'Minigame: ' + game.name);
        Game.EventBus.emit('notification', {
          text: '\uD83C\uDFAE ' + finalScore + '/' + maxScore + ' acertos! +' + bonusCoins + ' PataCoins!',
          type: 'success'
        });
      } else {
        Game.EventBus.emit('notification', {
          text: '\uD83C\uDFAE Tente de novo na pr\u00f3xima!',
          type: 'info'
        });
      }

      // Extra stat bonus for good performance
      if (percent >= 0.5 && dog) {
        var bonusStat = actionId === 'play' ? 'happiness' : 'learning';
        Game.StatsSystem.applyStat(dog, bonusStat, Math.round(percent * 15));
      }

      if (callback) callback(bonusCoins);
    });
  }

  // ===== CATCH GAME (for "play" action) =====
  function renderCatchGame(overlay, game, callback) {
    var hits = 0;
    var timeLeft = game.timeMs;

    var html = '<div class="minigame">' +
      '<div class="minigame__title">' + game.name + '</div>' +
      '<div class="minigame__instruction">' + game.instruction + '</div>' +
      '<div class="minigame__timer" id="mg-timer">' + (timeLeft / 1000).toFixed(1) + 's</div>' +
      '<div class="minigame__score">Acertos: <span id="mg-score">0</span>/' + game.maxHits + '</div>' +
      '<div class="minigame__area" id="mg-area" style="width:280px;height:200px;position:relative;background:#F8F8F8;border-radius:12px;overflow:hidden;"></div>' +
    '</div>';

    overlay.innerHTML = html;

    var area = document.getElementById('mg-area');
    var timerEl = document.getElementById('mg-timer');
    var scoreEl = document.getElementById('mg-score');

    function spawnBall() {
      if (timeLeft <= 0) return;
      var ball = document.createElement('div');
      ball.className = 'minigame__target';
      ball.textContent = game.emoji;
      ball.style.left = Math.floor(Math.random() * 230) + 'px';
      ball.style.top = Math.floor(Math.random() * 160) + 'px';

      ball.addEventListener('click', function () {
        hits++;
        if (scoreEl) scoreEl.textContent = hits;
        ball.style.transform = 'scale(0)';
        setTimeout(function () {
          if (ball.parentNode) ball.parentNode.removeChild(ball);
          if (timeLeft > 0 && hits < game.maxHits) spawnBall();
        }, 150);
        Game.Audio.play('click');
      });

      area.appendChild(ball);

      // Ball disappears after 1.2s if not clicked
      setTimeout(function () {
        if (ball.parentNode) {
          ball.parentNode.removeChild(ball);
          if (timeLeft > 0 && hits < game.maxHits) spawnBall();
        }
      }, 1200);
    }

    // Countdown timer
    var timerInterval = setInterval(function () {
      timeLeft -= 100;
      if (timerEl) timerEl.textContent = Math.max(0, timeLeft / 1000).toFixed(1) + 's';
      if (timeLeft <= 0 || hits >= game.maxHits) {
        clearInterval(timerInterval);
        setTimeout(function () { callback(hits); }, 500);
      }
    }, 100);

    // Start spawning
    spawnBall();
  }

  // ===== SEQUENCE GAME (for "teach" action) =====
  function renderSequenceGame(overlay, game, callback) {
    var ICONS = ['\uD83D\uDC3E', '\u2B50', '\u2764\uFE0F', '\uD83C\uDF1F', '\uD83C\uDF56', '\u26BD'];
    var seqLength = game.maxHits;
    var sequence = [];
    for (var i = 0; i < seqLength; i++) {
      sequence.push(ICONS[Math.floor(Math.random() * ICONS.length)]);
    }

    var playerIndex = 0;
    var hits = 0;
    var phase = 'showing'; // showing, playing, done

    var html = '<div class="minigame">' +
      '<div class="minigame__title">' + game.name + '</div>' +
      '<div class="minigame__instruction" id="mg-instruct">Memorize a sequ\u00eancia!</div>' +
      '<div class="minigame__sequence" id="mg-sequence" style="font-size:2rem;margin:12px 0;min-height:50px;"></div>' +
      '<div class="minigame__buttons" id="mg-buttons" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;"></div>' +
    '</div>';

    overlay.innerHTML = html;

    var seqEl = document.getElementById('mg-sequence');
    var btnEl = document.getElementById('mg-buttons');
    var instructEl = document.getElementById('mg-instruct');

    // Show sequence one by one
    var showIndex = 0;
    seqEl.textContent = '';
    var showInterval = setInterval(function () {
      if (showIndex < sequence.length) {
        seqEl.textContent += sequence[showIndex] + ' ';
        showIndex++;
      } else {
        clearInterval(showInterval);
        // Wait a moment then hide and let player repeat
        setTimeout(function () {
          seqEl.textContent = '';
          instructEl.textContent = 'Agora repita!';
          phase = 'playing';
          showButtons();
        }, 1000);
      }
    }, 700);

    function showButtons() {
      // Shuffle icons for buttons (include sequence icons + extras)
      var buttonIcons = ICONS.slice().sort(function () { return Math.random() - 0.5; });
      btnEl.innerHTML = '';
      buttonIcons.forEach(function (icon) {
        var btn = document.createElement('button');
        btn.className = 'minigame__btn';
        btn.textContent = icon;
        btn.addEventListener('click', function () {
          if (phase !== 'playing') return;
          if (icon === sequence[playerIndex]) {
            hits++;
            playerIndex++;
            seqEl.textContent += icon + ' ';
            Game.Audio.play('click');

            if (playerIndex >= sequence.length) {
              phase = 'done';
              instructEl.textContent = 'Perfeito!';
              setTimeout(function () { callback(hits); }, 800);
            }
          } else {
            // Wrong! End game
            phase = 'done';
            instructEl.textContent = 'Errou! Acertou ' + hits + '/' + seqLength;
            seqEl.textContent += '\u274C';
            setTimeout(function () { callback(hits); }, 1000);
          }
        });
        btnEl.appendChild(btn);
      });
    }
  }

  return {
    canPlay: canPlay,
    startMinigame: startMinigame
  };
})();
