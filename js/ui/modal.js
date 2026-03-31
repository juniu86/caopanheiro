var Game = Game || {};

Game.Modal = (function () {
  var overlay = null;
  var contentEl = null;
  var onCloseCallback = null;

  function init() {
    overlay = document.getElementById('modal-overlay');
    contentEl = document.getElementById('modal-content');

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        close();
      }
    });
  }

  function open(html, onClose) {
    if (!overlay || !contentEl) return;
    contentEl.innerHTML = html;
    overlay.classList.add('modal-overlay--active');
    onCloseCallback = onClose || null;
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('modal-overlay--active');
    if (onCloseCallback) {
      onCloseCallback();
      onCloseCallback = null;
    }
  }

  function getContentEl() {
    return contentEl;
  }

  return { init: init, open: open, close: close, getContentEl: getContentEl };
})();
