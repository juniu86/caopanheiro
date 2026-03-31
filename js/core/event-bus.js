var Game = Game || {};

Game.EventBus = (function () {
  var listeners = {};

  function on(event, callback) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
  }

  function off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(function (cb) {
      return cb !== callback;
    });
  }

  function emit(event, data) {
    if (!listeners[event]) return;
    listeners[event].forEach(function (cb) {
      try {
        cb(data);
      } catch (e) {
        console.error('EventBus error on "' + event + '":', e);
      }
    });
  }

  function clear() {
    listeners = {};
  }

  return { on: on, off: off, emit: emit, clear: clear };
})();
