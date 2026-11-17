/* CrossFit Shimshon — cookie consent banner (shared by every page).
 *
 * The site itself sets no tracking cookies. The only third party that does is
 * the embedded Google Maps, so the choice here actually gates it:
 *   "all"       -> map iframes load normally.
 *   "essential" -> maps stay unloaded behind a click-to-load placeholder.
 * Map iframes carry `data-consent-src` instead of `src`, so nothing reaches
 * Google before the visitor decides. The choice is kept in localStorage for
 * 180 days; any element with [data-consent-open] reopens the banner.
 */
(function () {
  'use strict';
  var KEY = 'cfs-consent', MAX_AGE = 180 * 24 * 3600 * 1000, VERSION = 1;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && v.v === VERSION && (v.choice === 'all' || v.choice === 'essential') && Date.now() - v.ts < MAX_AGE) return v.choice;
    } catch (e) {}
    return null;
  }
  function save(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, choice: choice, ts: Date.now() })); } catch (e) {}
  }

  var css =
    '#cfs-consent{position:fixed;z-index:1000000;inset-inline:1rem;bottom:1rem;margin-inline:auto;max-width:640px;direction:rtl;' +
    'background:#00005A;color:#E2E4F5;border:1px solid rgba(139,139,255,.35);border-radius:1.25rem;padding:1.25rem 1.35rem;' +
    'box-shadow:0 24px 60px -18px rgba(0,0,40,.65);font-family:Assistant,Heebo,system-ui,sans-serif;line-height:1.6;' +
    'transform:translateY(calc(100% + 2rem));opacity:0;transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .3s ease}' +
    '#cfs-consent.is-in{transform:none;opacity:1}' +
    '#cfs-consent h2{margin:0 0 .35rem;font-family:Heebo,Assistant,sans-serif;font-weight:900;font-size:1.1rem;color:#fff}' +
    '#cfs-consent p{margin:0;font-size:.92rem}' +
    '#cfs-consent a{color:#F15A24;font-weight:700;text-decoration:underline;text-underline-offset:3px}' +
    '#cfs-consent .cfs-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}' +
    '#cfs-consent button{flex:1 1 9rem;cursor:pointer;border-radius:.8rem;padding:.7rem 1rem;font:inherit;font-weight:800;font-size:.95rem;transition:background-color .2s,color .2s,transform .2s}' +
    '#cfs-consent button:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '#cfs-consent .cfs-all{background:#F15A24;color:#0E1030;border:1px solid #F15A24}' +
    '#cfs-consent .cfs-all:hover{background:#ff6d39;transform:translateY(-1px)}' +
    '#cfs-consent .cfs-ess{background:transparent;color:#fff;border:1px solid rgba(226,228,245,.45)}' +
    '#cfs-consent .cfs-ess:hover{background:rgba(255,255,255,.08)}' +
    '.cfs-map-ph{display:grid;place-items:center;gap:.6rem;min-height:240px;padding:1.25rem;text-align:center;direction:rtl;' +
    'background:rgb(var(--c-surface-2,238 241 246));color:rgb(var(--c-muted,86 94 117));font-size:.9rem}' +
    '.cfs-map-ph button{cursor:pointer;border:0;border-radius:.75rem;background:#F15A24;color:#0E1030;padding:.6rem 1.1rem;font:inherit;font-weight:800}' +
    '.cfs-map-ph a{color:inherit;font-weight:700;text-decoration:underline}' +
    '@media (prefers-reduced-motion:reduce){#cfs-consent{transition:none}}';

  function addStyle() {
    if (document.getElementById('cfs-consent-style')) return;
    var s = document.createElement('style'); s.id = 'cfs-consent-style'; s.textContent = css;
    document.head.appendChild(s);
  }

  /* ── Google Maps gating ── */
  function loadMap(f) {
    var ph = f.previousElementSibling;
    if (ph && ph.classList.contains('cfs-map-ph')) ph.remove();
    f.hidden = false;
    if (!f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-consent-src'));
  }
  function gateMaps(choice) {
    var maps = document.querySelectorAll('iframe[data-consent-src]');
    for (var i = 0; i < maps.length; i++) {
      var f = maps[i];
      if (choice === 'all') { loadMap(f); continue; }
      if (f.getAttribute('src')) continue;                  /* already shown on request */
      if (f.previousElementSibling && f.previousElementSibling.classList.contains('cfs-map-ph')) continue;
      f.hidden = true;
      var ph = document.createElement('div');
      ph.className = 'cfs-map-ph';
      ph.innerHTML = '<span>המפה מוצגת באמצעות Google Maps, שעשויה לשמור עוגיות.</span>' +
        '<button type="button">הצגת המפה</button>' +
        '<a href="https://maps.google.com/?q=' + encodeURIComponent('נחל אלכסנדר 19, צור יצחק') + '" target="_blank" rel="noopener">או פתיחה ב-Google Maps</a>';
      (function (frame) { ph.querySelector('button').addEventListener('click', function () { loadMap(frame); }); })(f);
      f.parentNode.insertBefore(ph, f);
    }
  }

  /* ── Banner ── */
  var lastFocus = null;
  function close(el) {
    el.classList.remove('is-in');
    setTimeout(function () { el.remove(); }, 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function choose(choice, el) {
    save(choice); gateMaps(choice); close(el);
  }
  function show(focus) {
    addStyle();
    var old = document.getElementById('cfs-consent'); if (old) old.remove();
    var el = document.createElement('section');
    el.id = 'cfs-consent';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-labelledby', 'cfs-consent-title');
    el.innerHTML =
      '<h2 id="cfs-consent-title">האתר משתמש בעוגיות</h2>' +
      '<p>אנחנו משתמשים רק באחסון הדרוש לתפקוד האתר (למשל שמירת הגדרות הנגישות שבחרתם) ולא בעוגיות פרסום או מעקב. ' +
      'המפה באתר מוצגת באמצעות Google Maps, שעשויה לשמור עוגיות משלה, ולכן נטען אותה רק באישורכם. ' +
      '<a href="privacy.html">למדיניות הפרטיות</a></p>' +
      '<div class="cfs-actions">' +
      '<button type="button" class="cfs-all">אישור הכל</button>' +
      '<button type="button" class="cfs-ess">חיוניות בלבד</button>' +
      '</div>';
    el.querySelector('.cfs-all').addEventListener('click', function () { choose('all', el); });
    el.querySelector('.cfs-ess').addEventListener('click', function () { choose('essential', el); });
    document.body.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-in'); }); });
    if (focus) { lastFocus = document.activeElement; el.querySelector('.cfs-all').focus({ preventScroll: true }); }
  }

  function init() {
    addStyle();
    var choice = read();
    gateMaps(choice);
    if (!choice) show(false);
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-consent-open]');
      if (t) { e.preventDefault(); show(true); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
