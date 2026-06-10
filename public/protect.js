(function () {
  function protect(el) {
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
    el.addEventListener('dragstart',   function (e) { e.preventDefault(); return false; });
    el.addEventListener('mousedown',   function (e) { if (e.button === 2) e.preventDefault(); });
    el.addEventListener('touchstart',  function (e) { e.preventDefault(); }, { passive: false });
  }

  function applyAll() {
    document.querySelectorAll('.logo-avatar, .iwx-logo').forEach(protect);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll);
  } else {
    applyAll();
  }
})();
