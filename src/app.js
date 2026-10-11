(function () {
  'use strict';

  // The address of the staff portal. Change it here if the site ever moves.
  var STAFF_URL = 'https://staff.ochst.edu.ng/';
  var SPLASH_MS = 2800;
  var KEY = 'ochst.desktop.onboarded';

  var $ = function (id) { return document.getElementById(id); };
  var screens = { splash: $('splash'), onboarding: $('onboarding'), connect: $('connect') };

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].classList.toggle('active', k === name); });
  }
  function seen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  /* ---- Ripple on buttons (like Flutter's InkWell) ---- */
  document.querySelectorAll('.filled-btn,.tonal-btn,.text-btn').forEach(function (b) {
    b.classList.add('ripple');
    b.addEventListener('pointerdown', function (e) {
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
      var s = document.createElement('span'); s.className = 'r';
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s); setTimeout(function () { s.remove(); }, 650);
    });
  });

  /* ---- Onboarding ---- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var arts = Array.prototype.slice.call(document.querySelectorAll('.slide-art'));
  var dots = Array.prototype.slice.call($('dots').children);
  var idx = 0;

  function go(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, i) { s.classList.toggle('show', i === n); s.classList.toggle('out', i < n); });
    arts.forEach(function (a, i) { a.classList.toggle('show', i === n); });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === n); });
    $('back').hidden = n === 0;
    $('nextLabel').textContent = n === slides.length - 1 ? 'Get started' : 'Next';
    idx = n;
  }
  function finish() { markSeen(); connect(); }

  $('next').addEventListener('click', function () { idx === slides.length - 1 ? finish() : go(idx + 1); });
  $('back').addEventListener('click', function () { go(idx - 1); });
  $('skip').addEventListener('click', finish);
  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
  document.addEventListener('keydown', function (e) {
    if (!screens.onboarding.classList.contains('active')) return;
    if (e.key === 'ArrowRight') $('next').click();
    if (e.key === 'ArrowLeft' && idx > 0) go(idx - 1);
    if (e.key === 'Escape') finish();
  });
  var x0 = null;   // swipe / drag
  $('onboarding').addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  $('onboarding').addEventListener('pointerup', function (e) {
    if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
    if (dx < -60) idx === slides.length - 1 ? finish() : go(idx + 1); else if (dx > 60) go(idx - 1);
  });

  /* ---- Open the staff portal (after checking the internet) ---- */
  function setState(name) {
    document.querySelector('.state.loading').hidden = name !== 'loading';
    document.querySelector('.state.offline').hidden = name !== 'offline';
  }
  function reachable() {
    return new Promise(function (resolve) {
      var ctl = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); resolve(false); }, 9000);
      fetch(STAFF_URL, { mode: 'no-cors', cache: 'no-store', signal: ctl ? ctl.signal : undefined })
        .then(function () { clearTimeout(t); resolve(true); })
        .catch(function () { clearTimeout(t); resolve(false); });
    });
  }
  function connect() {
    setState('loading'); show('connect');
    var started = Date.now();
    reachable().then(function (ok) {
      var wait = Math.max(0, 700 - (Date.now() - started));   // never flash by too fast
      setTimeout(function () {
        if (ok) { document.body.style.transition = 'opacity .3s'; document.body.style.opacity = 0; setTimeout(function () { location.replace(STAFF_URL); }, 280); }
        else setState('offline');
      }, wait);
    });
  }
  $('retry').addEventListener('click', connect);
  window.addEventListener('online', function () { if (screens.connect.classList.contains('active')) connect(); });

  /* ---- Start ---- */
  go(0);
  setTimeout(function () { seen() ? connect() : show('onboarding'); }, SPLASH_MS);
})();
