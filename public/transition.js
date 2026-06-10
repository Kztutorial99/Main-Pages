// ===== PAGE TRANSITION =====
(function () {
  const DURATION = 380; // ms for each phase

  // Create overlay once
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  // PAGE ENTER — overlay visible → fade out
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('leaving');
      setTimeout(() => overlay.classList.add('gone'), DURATION);
    });
  });

  // LINK CLICK — fade in → navigate
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Only intercept same-origin internal links (not hash-only, not external, not new tab)
    const isExternal = anchor.target === '_blank' || anchor.hostname !== location.hostname;
    const isHashOnly = href.startsWith('#');
    const isJavascript = href.startsWith('javascript');
    if (isExternal || isHashOnly || isJavascript) return;

    e.preventDefault();

    // Fade in overlay
    overlay.classList.remove('gone', 'leaving');

    setTimeout(() => {
      window.location.href = href;
    }, DURATION);
  });
})();
