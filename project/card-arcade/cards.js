/* ==========================================================================
   Skogai Arcade — Card Arcade runtime
   Fills .sk-playing-card placeholders, lays out fans and mounts the shared
   table header. Plain script, no build step. Exposes window.SkCards.
   ========================================================================== */
(function () {
  'use strict';

  var SUITS = {
    hearts:   { d: 'M1 0h2v1h-2zM4 0h2v1h-2zM0 1h7v2h-7zM1 3h5v1h-5zM2 4h3v1h-3zM3 5h1v1h-1z', vb: '0 -0.5 7 7', glyph: '♥' },
    diamonds: { d: 'M3 0h1v1h-1zM2 1h3v1h-3zM1 2h5v1h-5zM0 3h7v1h-7zM1 4h5v1h-5zM2 5h3v1h-3zM3 6h1v1h-1z', vb: '0 0 7 7', glyph: '♦' },
    spades:   { d: 'M3 0h1v1h-1zM2 1h3v1h-3zM1 2h5v1h-5zM0 3h7v2h-7zM3 5h1v1h-1zM2 6h3v1h-3z', vb: '0 0 7 7', glyph: '♠' },
    clubs:    { d: 'M2 0h3v2h-3zM0 2h7v2h-7zM0 4h2v1h-2zM3 4h1v1h-1zM5 4h2v1h-2zM3 5h1v1h-1zM2 6h3v1h-3z', vb: '0 0 7 7', glyph: '♣' }
  };
  var COURT = { A: 'ACE', J: 'JACK', Q: 'QUEEN', K: 'KING' };
  var NAMES = { A: 'Ace', J: 'Jack', Q: 'Queen', K: 'King' };
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function suitSvg(suit, label) {
    var s = SUITS[suit];
    var a = label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"';
    return '<svg viewBox="' + s.vb + '" ' + a + '><path d="' + s.d + '"></path></svg>';
  }

  function ensurePattern() {
    if (document.getElementById('sk-card-back-pattern')) return;
    var holder = document.createElementNS(SVG_NS, 'svg');
    holder.setAttribute('aria-hidden', 'true');
    holder.setAttribute('width', '0');
    holder.setAttribute('height', '0');
    holder.style.position = 'absolute';
    holder.innerHTML =
      '<defs><pattern id="sk-card-back-pattern" width="8" height="8" patternUnits="userSpaceOnUse">' +
      '<rect x="0" y="0" width="2" height="2" fill="currentColor"></rect>' +
      '<rect x="4" y="4" width="2" height="2" fill="currentColor"></rect>' +
      '</pattern></defs>';
    document.body.prepend(holder);
  }

  function cardName(rank, suit) {
    return (NAMES[rank] || rank) + ' of ' + suit;
  }

  /** Render one card element in place from its data-* attributes. */
  function renderCard(el) {
    var faceDown = el.hasAttribute('data-face-down');
    if (faceDown) {
      ensurePattern();
      el.innerHTML =
        '<div class="sk-card-back"><div class="sk-card-back-inner">' +
        '<svg class="sk-card-back-tile" aria-hidden="true"><rect width="100%" height="100%" fill="url(#sk-card-back-pattern)"></rect></svg>' +
        '<div class="sk-card-emblem">' + suitSvg('diamonds') + '</div>' +
        '</div></div>';
      return el;
    }
    var suit = SUITS[el.dataset.suit] ? el.dataset.suit : 'spades';
    var rank = el.dataset.rank || 'A';
    el.dataset.suit = suit;
    var center = COURT[rank]
      ? '<div class="sk-card-court"><span class="sk-card-court-label">' + COURT[rank] + '</span>' + suitSvg(suit) + '</div>'
      : suitSvg(suit);
    el.innerHTML =
      '<div class="sk-card-face">' +
      '<div class="sk-card-index"><span class="sk-card-rank">' + rank + '</span>' + suitSvg(suit, suit) + '</div>' +
      '<div class="sk-card-center">' + center + '</div>' +
      '<div class="sk-card-index sk-card-index-end"><span class="sk-card-rank">' + rank + '</span>' + suitSvg(suit) + '</div>' +
      '</div>';
    return el;
  }

  /** Build a card element. opts: { rank, suit, faceDown, size: 'sm', glow } */
  function makeCard(opts) {
    var el = document.createElement('div');
    el.className = 'sk-playing-card' + (opts.size === 'sm' ? ' sk-playing-card-sm' : '');
    if (opts.faceDown) el.setAttribute('data-face-down', '');
    if (opts.rank) el.dataset.rank = opts.rank;
    if (opts.suit) el.dataset.suit = opts.suit;
    if (opts.glow && opts.glow !== 'none') el.dataset.glow = opts.glow;
    return renderCard(el);
  }

  /**
   * Fan curve for a hand of n cards. spread = total rotation in degrees,
   * lift = vertical drop in px at the ends (negative arcs the other way).
   */
  function fan(i, n, spread, lift) {
    var norm = n > 1 ? i / (n - 1) - 0.5 : 0;
    return { rot: +(norm * spread).toFixed(2), dy: Math.round(Math.pow(norm * 2, 2) * lift) };
  }

  function setFan(el, f) {
    el.style.setProperty('--rot', f.rot);
    el.style.setProperty('--dy', f.dy);
  }

  /** Fill a container with n face-down cards fanned as an AI seat. */
  function aiFan(container, n) {
    container.textContent = '';
    for (var i = 0; i < n; i++) {
      var f = fan(i, n, -12, -6);
      var c = makeCard({ faceDown: true, size: 'sm' });
      setFan(c, f);
      container.appendChild(c);
    }
  }

  /* ---------------- Header ---------------- */
  var TABS = [
    { id: 'gin', label: 'GIN RUMMY', href: 'gin.html' },
    { id: 'hearts', label: 'HEARTS', href: 'hearts.html' },
    { id: 'sandbox', label: 'SANDBOX', href: 'sandbox.html' }
  ];

  function mountHeader(el) {
    var mode = el.dataset.mode || 'gin';
    var tabs = TABS.map(function (t) {
      var on = t.id === mode;
      return '<a href="' + t.href + '" class="sk-btn ' + (on ? 'sk-btn-primary' : 'sk-btn-ghost') + '"' +
        (on ? ' aria-current="page"' : '') + '>' + t.label + '</a>';
    }).join('');
    el.classList.add('sk-table-header');
    el.innerHTML =
      '<div class="sk-table-brand">' +
        '<div class="sk-table-logo"><svg viewBox="0 0 7 7" aria-hidden="true"><path d="' + SUITS.spades.d + '"></path></svg></div>' +
        '<div class="sk-table-brand-text"><span class="sk-table-brand-name">CARD ARCADE</span>' +
        '<span class="sk-table-brand-meta">SKOGAI · TABLE 01</span></div>' +
      '</div>' +
      '<nav class="sk-mode-tabs" aria-label="Game mode">' + tabs + '</nav>' +
      '<p class="sk-table-status"><span class="sk-badge sk-badge-success">▣ LIVE</span>' +
        '<span class="sk-table-status-text"></span></p>' +
      '<div class="sk-table-actions">' +
        '<a href="scoreboard.html" class="sk-btn sk-btn-outline sk-table-score" aria-label="Open scoreboard"></a>' +
        '<button type="button" class="sk-btn sk-btn-ghost sk-icon-btn" aria-pressed="true" aria-label="Mute card sounds">' +
          '<svg class="sk-sound-on" viewBox="0 0 8 8" aria-hidden="true"><path d="M0 2h2v4h-2zM2 1h1v6h-1zM3 0h1v8h-1zM5 2h1v4h-1zM7 1h1v6h-1z"></path></svg>' +
          '<svg class="sk-sound-off" viewBox="0 0 8 8" aria-hidden="true"><path d="M0 2h2v4h-2zM2 1h1v6h-1zM3 0h1v8h-1zM5 2h1v1h-1zM7 2h1v1h-1zM6 3h1v2h-1zM5 5h1v1h-1zM7 5h1v1h-1z"></path></svg>' +
        '</button>' +
        '<a href="rules.html" class="sk-btn sk-btn-ghost sk-icon-btn sk-display" style="font-size: var(--sk-text-12);" aria-label="Rules and controls">?</a>' +
      '</div>';
    el.querySelector('.sk-table-status-text').textContent = el.dataset.status || '';
    el.querySelector('.sk-table-score').textContent = el.dataset.score || '';
    var sound = el.querySelector('.sk-icon-btn[aria-pressed]');
    sound.addEventListener('click', function () {
      var on = sound.getAttribute('aria-pressed') !== 'true';
      sound.setAttribute('aria-pressed', String(on));
      sound.setAttribute('aria-label', on ? 'Mute card sounds' : 'Unmute card sounds');
    });
  }

  function init() {
    document.querySelectorAll('[data-sk-table-header]').forEach(mountHeader);
    document.querySelectorAll('.sk-playing-card').forEach(function (el) {
      if (!el.firstChild) renderCard(el);
    });
    document.querySelectorAll('[data-ai-fan]').forEach(function (el) {
      aiFan(el, parseInt(el.dataset.aiFan, 10) || 10);
    });
  }

  window.SkCards = {
    SUITS: SUITS, cardName: cardName, makeCard: makeCard, renderCard: renderCard,
    fan: fan, setFan: setFan, aiFan: aiFan
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
