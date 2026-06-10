(function () {
  var btn  = document.getElementById('fabBtn');
  var menu = document.getElementById('fabMenu');
  var wrap = document.getElementById('fabSupport');
  if (!btn || !menu) return;

  function open() {
    wrap.classList.add('fab-open');
    btn.setAttribute('aria-expanded', 'true');
    menu.removeAttribute('inert');
  }
  function close() {
    wrap.classList.remove('fab-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('inert', '');
  }
  function toggle() {
    wrap.classList.contains('fab-open') ? close() : open();
  }

  btn.addEventListener('click', toggle);

  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  menu.setAttribute('inert', '');
})();
