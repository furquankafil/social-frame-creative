/* Social Frame Creative — animations.js
   IntersectionObserver reveal + staggered children + subtle hero parallax. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var els = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // Subtle hero showcase drift on desktop (disabled with reduced motion / touch)
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    var stage = document.querySelector('.showcase-stage');
    var hero = document.querySelector('.hero');
    if (stage && hero) {
      var raf = null, tx = 0, ty = 0;
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      function apply() {
        raf = null;
        stage.style.transform = 'translate(' + (tx * 10).toFixed(1) + 'px,' + (ty * 8).toFixed(1) + 'px)';
      }
      hero.addEventListener('mouseleave', function () {
        if (raf) cancelAnimationFrame(raf);
        raf = null; stage.style.transform = '';
      });
    }
  }
})();
