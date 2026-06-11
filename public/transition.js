// ===== PAGE LOADER =====
(function () {
  function hideLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.add('pl-hide');
    setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    hideLoader();
  }
})();

// ===== PAGE TRANSITION =====
(function () {
  const COVER_DURATION = 420; // ms slide-in (covering)
  const LEAVE_DURATION = 400; // ms slide-out (leaving)

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  // ── PAGE ENTER ──
  // Overlay starts off-screen right (translateX(100%) via CSS default).
  // Force it to slide OUT to the left so the page is revealed.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('leaving');
      setTimeout(() => overlay.classList.add('gone'), LEAVE_DURATION + 50);
    });
  });

  // ── LINK CLICK — slide IN, navigate, new page slides OUT ──
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    const isExternal   = anchor.target === '_blank' ||
                         (anchor.hostname && anchor.hostname !== location.hostname);
    const isHashOnly   = href.startsWith('#');
    const isJavascript = href.startsWith('javascript');
    if (isExternal || isHashOnly || isJavascript) return;

    e.preventDefault();

    // Reset to off-screen right, then slide in
    overlay.classList.remove('gone', 'leaving', 'covering');
    // Force reflow so transition fires
    overlay.offsetHeight; // eslint-disable-line no-unused-expressions

    requestAnimationFrame(() => {
      overlay.classList.add('covering');
      setTimeout(() => {
        window.location.href = href;
      }, COVER_DURATION);
    });
  });
})();
