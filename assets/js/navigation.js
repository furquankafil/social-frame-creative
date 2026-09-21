/* Social Frame Creative — navigation.js
   Mobile menu, navbar scroll state, smooth scrolling, active links. */
(function () {
  'use strict';
  var header = document.getElementById('siteHeader');
  var panel = document.getElementById('mobilePanel');
  var openBtn = document.getElementById('menuOpen');
  var lastFocus = null;

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu() {
    if (!panel) return;
    lastFocus = document.activeElement;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var close = panel.querySelector('.mobile-close');
    if (close) close.focus();
  }
  function closeMenu() {
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (panel) {
    panel.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) closeMenu();
      if (e.key === 'Tab' && panel.classList.contains('open')) {
        var f = panel.querySelectorAll('a, button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // Floating contact system — ONE control per viewport, plain anchors only.
  // Desktop/tablet (CSS >=1024px): vertical icon rail (WhatsApp/Call/Mail/IG).
  // Mobile (CSS <1024px): one compact centered 4-icon pill. Both hide while
  // the footer OR the enquiry form is on screen so they never cover actions.
  var WA_URL = 'https://wa.me/919911445939?text=Hi%20Social%20Frame%20Creative%2C%20I%27d%20like%20to%20discuss%20a%20creative%20project.';
  var WA_PLAIN = 'https://wa.me/919911445939';
  var TEL_URL = 'tel:+919911445939';
  var MAIL_URL = 'mailto:socialframecreative@gmail.com';
  var IG_URL = 'https://www.instagram.com/socialframe__/';
  var SVG_WA = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#1FA855" d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 2 6.5L4 29l7.7-2c1.8 1 3.9 1.6 6.1 1.6h.2c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-4.6 1.2 1.2-4.5-.3-.4c-1.1-1.7-1.7-3.7-1.7-5.8C4.9 9.4 9.4 5 16 5s11.1 4.5 11.1 10S22.6 24.8 16 24.8zm6.1-7.4c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-.9-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.5L13.3 9c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.6-.2.3-.9 2.2-.9 5.4s1 3.7 1.1 3.9c.1.2 1.9 3 4.7 4.1 2.4 1 3 .8 3.5.7.6-.1 2-1 2.3-1.9.3-.9.3-1.7.2-1.9-.1-.1-.3-.2-.6-.3z"/></svg>';
  var SVG_CALL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2z"/></svg>';
  var SVG_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 6L22 7"/></svg>';
  var SVG_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg>';
  function contactLinks(prefilled) {
    var wa = prefilled ? WA_URL : WA_PLAIN;
    return '<a href="' + wa + '" target="_blank" rel="noopener noreferrer" data-tip="Chat on WhatsApp" title="Chat on WhatsApp" aria-label="Chat with Social Frame Creative on WhatsApp">' + SVG_WA + '</a>' +
      '<a href="' + TEL_URL + '" data-tip="Call Social Frame Creative" title="Call Social Frame Creative" aria-label="Call Social Frame Creative at +91 9911445939">' + SVG_CALL + '</a>' +
      '<a href="' + MAIL_URL + '" data-tip="Email Social Frame Creative" title="Email Social Frame Creative" aria-label="Email Social Frame Creative at socialframecreative@gmail.com">' + SVG_MAIL + '</a>' +
      '<a href="' + IG_URL + '" target="_blank" rel="noopener noreferrer" data-tip="Open Instagram" title="Open Instagram" aria-label="Open Social Frame Creative on Instagram">' + SVG_IG + '</a>';
  }
  var rail = document.createElement('aside');
  rail.className = 'contact-rail';
  rail.setAttribute('aria-label', 'Quick contact');
  rail.innerHTML = contactLinks(true);
  document.body.appendChild(rail);
  var bar = document.createElement('nav');
  bar.className = 'stickybar';
  bar.setAttribute('aria-label', 'Quick contact actions');
  bar.innerHTML = contactLinks(true);
  document.body.appendChild(bar);
  function syncFloats(show) {
    rail.classList.toggle('hide', !show);
    bar.classList.toggle('hide', !show);
    document.body.classList.toggle('has-stickybar', show);
  }
  var hideTargets = [];
  var footerEl = document.querySelector('footer.site');
  var formEl = document.getElementById('contactForm');
  if (footerEl) hideTargets.push(footerEl);
  if (formEl) hideTargets.push(formEl);
  if (hideTargets.length && 'IntersectionObserver' in window) {
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        visible[en.target === formEl ? 'form' : 'footer'] = en.isIntersecting;
      });
      syncFloats(!(visible.form || visible.footer));
    }, { threshold: 0.05 });
    hideTargets.forEach(function (t) { io.observe(t); });
  } else {
    syncFloats(true);
  }

  // Smooth anchor scrolling (respects reduced motion via CSS)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Active nav highlighting on scroll for in-page anchors
  var map = [['#reviews', 'Reviews']];
  var links = Array.prototype.slice.call(document.querySelectorAll('#navLinks a'));
  if ('IntersectionObserver' in window) {
    map.forEach(function (pair) {
      var sec = document.querySelector(pair[0]);
      if (!sec) return;
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) {
              var on = l.textContent.trim() === pair[1];
              l.classList.toggle('active', on);
              if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
            });
          }
        });
      }, { threshold: 0.3 }).observe(sec);
    });
  }
})();
