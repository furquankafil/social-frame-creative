/* Social Frame Creative — main.js
   FAQ accordion, testimonial carousel, portfolio tilt, forms, year. */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- FAQ accordion (single-open, accessible) ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  function setItem(item, open) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    item.classList.toggle('open', open);
    if (q) q.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (a) {
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
      a.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
  }
  items.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    var id = 'faq-a-' + Math.random().toString(36).slice(2, 8);
    a.id = id; q.setAttribute('aria-controls', id);
    setItem(item, false);
    q.addEventListener('click', function () {
      var willOpen = !item.classList.contains('open');
      items.forEach(function (it) { setItem(it, false); });
      setItem(item, willOpen);
    });
  });
  window.addEventListener('resize', function () {
    items.forEach(function (item) {
      if (item.classList.contains('open')) {
        var a = item.querySelector('.faq-a');
        if (a) a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Testimonial carousel ---------- */
  var track = document.getElementById('revTrack');
  var prev = document.getElementById('revPrev');
  var next = document.getElementById('revNext');
  var dots = document.getElementById('revDots');
  if (track && prev && next) {
    var cards = Array.prototype.slice.call(track.children);
    var page = 0, perView = 1, pages = 1;
    function measure() {
      var w = track.parentElement.clientWidth;
      perView = w < 640 ? 1 : (w < 1080 ? 2 : 3);
      pages = Math.max(1, Math.ceil(cards.length / perView));
      page = Math.min(page, pages - 1);
      render();
    }
    function cardStep() {
      if (!cards.length) return 0;
      var gap = parseFloat(getComputedStyle(track).gap) || 20;
      return cards[0].getBoundingClientRect().width + gap;
    }
    function render() {
      track.style.transform = 'translateX(' + (-page * cardStep() * perView) + 'px)';
      if (dots) {
        dots.innerHTML = '';
        for (var i = 0; i < pages; i++) {
          (function (i) {
            var b = document.createElement('button');
            b.setAttribute('aria-label', 'Go to testimonial page ' + (i + 1));
            b.className = i === page ? 'on' : '';
            b.addEventListener('click', function () { page = i; render(); restart(); });
            dots.appendChild(b);
          })(i);
        }
      }
      prev.disabled = page === 0;
      next.disabled = page === pages - 1;
      prev.style.opacity = page === 0 ? '.4' : '1';
      next.style.opacity = page === pages - 1 ? '.4' : '1';
    }
    var timer = null;
    function restart() {
      if (timer) clearInterval(timer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(function () { page = (page + 1) % pages; render(); }, 6500);
    }
    prev.addEventListener('click', function () { page = (page - 1 + pages) % pages; render(); restart(); });
    next.addEventListener('click', function () { page = (page + 1) % pages; render(); restart(); });
    track.parentElement.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    track.parentElement.addEventListener('mouseleave', restart);
    // Touch swipe
    var sx = 0;
    track.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { page = (page + (dx < 0 ? 1 : -1) + pages) % pages; render(); restart(); }
    }, { passive: true });
    window.addEventListener('resize', measure);
    measure(); restart();
  }

  /* ---------- Portfolio subtle keyboard/hover support ---------- */
  document.querySelectorAll('.work-card').forEach(function (c) {
    c.setAttribute('tabindex', '0');
  });

  /* ---------- Portfolio filtering (work page) ---------- */
  var filterWrap = document.getElementById('workFilters');
  var workGrid = document.getElementById('workGrid');
  var filterCount = document.getElementById('filterCount');
  if (filterWrap && workGrid) {
    var filterBtns = Array.prototype.slice.call(filterWrap.querySelectorAll('.filter-btn'));
    var workCards = Array.prototype.slice.call(workGrid.querySelectorAll('.work-card'));
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        var shown = 0;
        workCards.forEach(function (card) {
          var cats = (card.getAttribute('data-cat') || '').split(/\s+/);
          var show = f === 'all' || cats.indexOf(f) !== -1;
          card.classList.toggle('hide', !show);
          card.classList.remove('pop');
          if (show) { shown++; void card.offsetWidth; card.classList.add('pop'); }
        });
        if (filterCount) filterCount.textContent = 'Showing ' + shown + ' of ' + workCards.length + ' concept pieces.';
      });
    });
  }

  /* ---------- Verified client reviews (data-driven, honest by default) ----------
     Fill `testimonials` ONLY with genuinely verified records. Stars render
     ONLY when rating === 5; records without quote+name are skipped; missing
     company/role are omitted, never invented. Empty = neutral section stays. */
  const testimonials = [
    /*
    {
      name: 'REAL CLIENT NAME',
      company: 'REAL COMPANY',
      role: 'REAL ROLE',
      rating: 5,
      quote: 'REAL CLIENT REVIEW'
    }
    */
  ];

  function escHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function initialsOf(name) {
    var parts = String(name).trim().split(/\s+/).slice(0, 2);
    return parts.map(function (w) { return w.charAt(0).toUpperCase(); }).join('') || '?';
  }
  var STAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
  function renderVerifiedReviews() {
    var mount = document.getElementById('verifiedReviews');
    var grid = document.getElementById('partnerPrinciples');
    if (!mount || !testimonials.length) return;
    var cards = '';
    testimonials.forEach(function (r) {
      if (!r || !r.quote || !r.name) return;
      var sub = [r.role, r.company].filter(function (v) { return !!v; }).map(escHtml).join(' \u00B7 ');
      var badge = (r.rating === 5)
        ? '<div class="vstars" role="img" aria-label="Rated 5 out of 5 stars">' + STAR_SVG + STAR_SVG + STAR_SVG + STAR_SVG + STAR_SVG + '</div>'
        : '<span class="vlabel">Client Review</span>';
      cards += '<article class="vrev">' + badge +
        '<blockquote>\u201C' + escHtml(r.quote) + '\u201D</blockquote>' +
        '<div class="vwho"><span class="vava" aria-hidden="true">' + escHtml(initialsOf(r.name)) + '</span>' +
        '<div><b>' + escHtml(r.name) + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div></div></article>';
    });
    if (!cards) return;
    mount.innerHTML = '<div class="vrevs">' + cards + '</div>';
    mount.hidden = false;
    if (grid) grid.style.display = 'none';
    var title = document.getElementById('revTitle');
    if (title) title.textContent = 'What Our Clients Say';
    var brow = mount.parentElement ? mount.parentElement.querySelector('.eyebrow') : null;
    if (brow) brow.textContent = 'WHAT OUR CLIENTS SAY';
  }
  renderVerifiedReviews();

  /* ---------- Legacy generic form note ----------
     The contact page now uses assets/js/contact.js (EmailJS delivery).
     No other page contains a form, so no generic handler lives here. */
})();
