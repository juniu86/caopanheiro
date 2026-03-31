var Game = Game || {};

Game.Audio = (function () {
  var ctx = null;
  var enabled = true;
  var volume = 0.7;

  function initContext() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  }

  function ensureContext() {
    if (!ctx) initContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function play(soundId) {
    if (!enabled || !Game.State || !Game.State.settings.soundEnabled) return;
    ensureContext();
    if (!ctx) return;

    var sounds = {
      feed: function () { playTone(300, 0.1, 'square', 0.15); setTimeout(function () { playTone(350, 0.1, 'square', 0.12); }, 100); },
      play: function () { playTone(400, 0.15, 'sawtooth', 0.1); setTimeout(function () { playTone(500, 0.15, 'sawtooth', 0.1); }, 150); },
      bathe: function () { playNoise(0.3, 0.08); },
      sleep: function () { playTone(200, 0.5, 'sine', 0.06); },
      wake: function () { playTone(400, 0.1, 'sine', 0.1); setTimeout(function () { playTone(500, 0.1, 'sine', 0.1); }, 100); },
      carinho: function () { playTone(350, 0.2, 'sine', 0.08); },
      walk: function () { playTone(250, 0.1, 'square', 0.08); setTimeout(function () { playTone(300, 0.1, 'square', 0.08); }, 200); },
      teach: function () { playTone(440, 0.1, 'sine', 0.1); setTimeout(function () { playTone(550, 0.15, 'sine', 0.1); }, 120); },
      vet: function () { playTone(500, 0.3, 'sine', 0.08); },
      petisco: function () { playTone(380, 0.1, 'square', 0.1); },
      cleanPoop: function () { playNoise(0.15, 0.06); },
      coin: function () {
        playTone(800, 0.08, 'sine', 0.12);
        setTimeout(function () { playTone(1200, 0.12, 'sine', 0.1); }, 80);
      },
      adopt: function () {
        playTone(400, 0.1, 'sine', 0.12);
        setTimeout(function () { playTone(500, 0.1, 'sine', 0.12); }, 100);
        setTimeout(function () { playTone(600, 0.1, 'sine', 0.12); }, 200);
        setTimeout(function () { playTone(800, 0.2, 'sine', 0.1); }, 300);
      },
      achievement: function () {
        [400, 500, 600, 800].forEach(function (freq, i) {
          setTimeout(function () { playTone(freq, 0.15, 'sine', 0.1); }, i * 100);
        });
      },
      bark: function () {
        playTone(200, 0.08, 'sawtooth', 0.15);
        setTimeout(function () { playTone(250, 0.1, 'sawtooth', 0.12); }, 100);
      },
      click: function () { playTone(600, 0.04, 'sine', 0.08); }
    };

    if (sounds[soundId]) {
      sounds[soundId]();
    }
  }

  function playTone(frequency, duration, type, vol) {
    if (!ctx) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = frequency;
    gain.gain.value = (vol || 0.1) * volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.05);
  }

  function playNoise(duration, vol) {
    if (!ctx) return;
    var bufferSize = ctx.sampleRate * duration;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    var source = ctx.createBufferSource();
    source.buffer = buffer;
    var gain = ctx.createGain();
    gain.gain.value = (vol || 0.08) * volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  function setEnabled(val) {
    enabled = val;
  }

  function setVolume(val) {
    volume = Math.max(0, Math.min(1, val));
  }

  // Init on first user interaction
  function setupInteractionInit() {
    var handler = function () {
      ensureContext();
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
    };
    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
  }

  return {
    play: play,
    setEnabled: setEnabled,
    setVolume: setVolume,
    setupInteractionInit: setupInteractionInit
  };
})();
