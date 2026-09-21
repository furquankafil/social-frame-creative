/* Social Frame Creative — contact.js
   Production enquiry delivery via EmailJS (static-site safe: public key only,
   never Gmail/SMTP passwords or private keys in frontend code).
   Setup guide: see EMAIL_SETUP.md in the project root.
   Destination inbox: socialframecreative@gmail.com
   Success UI is shown ONLY after EmailJS returns a genuine success response. */
(function () {
  'use strict';

  /* ============ EmailJS CONFIG (public values only — no secrets) ============ */
  const EMAIL_SERVICE_ID = 'service_dgyfx4r';
  const EMAIL_TEMPLATE_ID = 'template_wd00e7j';
  const EMAIL_PUBLIC_KEY = 'I7aiuzpGqo6DHAvdE';
  const DESTINATION = 'socialframecreative@gmail.com';
  const WA_LINK = 'https://wa.me/919911445939';
  const whatsappUrl =
    WA_LINK +
    '?text=' +
    encodeURIComponent(
      "Hi Social Frame Creative, I'd like to discuss a creative project."
    );
  const MIN_RESUBMIT_MS = 60 * 1000; // submission throttling: 1 per minute
  const DEBUG = true; // development-only logs: IDs + field names only, never values/secrets

  var form = document.getElementById('contactForm');
  if (!form) return;
  form.setAttribute('novalidate', 'true');

  var okBox = document.getElementById('formOk');
  var badBox = document.getElementById('formBad');
  var submitBtn = document.getElementById('cfSubmit');
  var lastSubmitAt = 0;
  var sending = false;
  var BTN_DEFAULT = 'Send Enquiry <span class="arr" aria-hidden="true">&rarr;</span>';

  function isConfigured() {
    var vals = [EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_PUBLIC_KEY];
    for (var i = 0; i < vals.length; i++) {
      var v = (vals[i] || '').trim();
      if (!v || v === '...' || v.indexOf('YOUR_') === 0) return false;
    }
    return typeof window.emailjs !== 'undefined';
  }

  // Initialise EmailJS exactly once (SDK loads before this script via defer).
  try {
    if (typeof window.emailjs !== 'undefined') window.emailjs.init({ publicKey: EMAIL_PUBLIC_KEY });
  } catch (err) { /* SDK initialisation failed — submit path will show honest failure */ }

  if (DEBUG && typeof window.console !== 'undefined') {
    window.console.log({ serviceId: EMAIL_SERVICE_ID, templateId: EMAIL_TEMPLATE_ID,
      fields: ['name', 'email', 'phone', 'business', 'service', 'budget', 'message'] });
  }

  function show(el) {
    if (!el) return;
    el.classList.add('show');
    try { el.focus({ preventScroll: false }); } catch (e) { if (el.focus) el.focus(); }
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function hide(el) { if (el) el.classList.remove('show'); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function setErr(input, errEl, valid) {
    input.classList.toggle('invalid', !valid);
    input.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if (errEl) errEl.style.display = valid ? 'none' : 'block';
    return valid;
  }

  function validate() {
    var ok = true;
    var name = document.getElementById('cfName');
    var email = document.getElementById('cfEmail');
    var phone = document.getElementById('cfPhone');
    var msg = document.getElementById('cfMsg');
    if (!setErr(name, document.getElementById('cfNameErr'), name.value.trim().length >= 2)) ok = false;
    if (!setErr(email, document.getElementById('cfEmailErr'), /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()))) ok = false;
    if (!setErr(phone, document.getElementById('cfPhoneErr'), (phone.value.replace(/\D/g, '').length) >= 7)) ok = false;
    if (!setErr(msg, document.getElementById('cfMsgErr'), msg.value.trim().length >= 10)) ok = false;
    return ok;
  }

  function setSending(on) {
    sending = on;
    submitBtn.disabled = on;
    submitBtn.innerHTML = on
      ? '<span class="spinner" aria-hidden="true"></span> Sending&hellip;'
      : BTN_DEFAULT;
  }

  function showFailure(reason) {
    badBox.innerHTML =
      '<strong>We couldn&rsquo;t send your enquiry right now.</strong><br>' +
      (reason ? escapeHtml(reason) + '<br>' : '') +
      'Please contact us directly:<br>' +
      '<a href="tel:+919911445939" style="color:inherit;font-weight:800">+91 9911445939</a> &middot; ' +
      '<a href="mailto:' + DESTINATION + '" style="color:inherit;font-weight:800">' + DESTINATION + '</a>' +
      '<div class="fallback-actions">' +
      '<a class="btn btn-primary" href="tel:+919911445939" aria-label="Call Social Frame Creative now">Call Now</a>' +
      '<a class="btn btn-secondary" href="' + whatsappUrl + '" target="_blank" rel="noopener" aria-label="Chat with Social Frame Creative on WhatsApp">Chat on WhatsApp</a>' +
      '<a class="btn btn-secondary" href="mailto:' + DESTINATION + '" aria-label="Email Social Frame Creative">Send Email</a>' +
      '</div>';
    show(badBox);
  }

  // Re-arm the button if the user edits after a successful send
  form.addEventListener('input', function () {
    if (!sending && submitBtn.innerHTML.indexOf('Enquiry Sent') !== -1) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = BTN_DEFAULT;
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return; // double-submit prevention
    hide(okBox); hide(badBox);

    // Honeypot: bots fill it, humans can't see it — silently ignore
    var hp = document.getElementById('cfWebsite');
    if (hp && hp.value) return;

    if (!validate()) return; // no request, no success

    // Throttling
    var now = Date.now();
    if (now - lastSubmitAt < MIN_RESUBMIT_MS) {
      badBox.innerHTML = '<strong>Please wait a moment before sending again.</strong><br>For anything urgent, call <a href="tel:+919911445939" style="color:inherit;font-weight:800">+91 9911445939</a>.';
      show(badBox);
      return;
    }

    if (!isConfigured()) {
      // Credentials missing or SDK blocked — honest failure, never fake success.
      showFailure('');
      return;
    }

    lastSubmitAt = now;
    setSending(true);

    /* Official sendForm(): collects the form's own fields by name attribute
       (name/email/phone/business/service/budget/message). Recipient, subject
       ("New Social Frame Creative Enquiry — {{name}}") and Reply-To ({{email}})
       are set in the EmailJS template dashboard (template_wd00e7j). */
    window.emailjs.sendForm(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, form).then(
      function () {
        setSending(false);
        form.reset();
        okBox.innerHTML = '<strong>Your enquiry has been sent successfully.</strong><br>We&rsquo;ll review your details and get back to you.';
        show(okBox);
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enquiry Sent &#10003;';
      },
      function (error) {
        setSending(false);
        if (DEBUG && typeof window.console !== 'undefined') {
          window.console.error('EmailJS failed:', (error && error.status) || 'unknown',
            (error && error.text) || error);
        }
        showFailure(''); // genuine failure — fallback actions included
      }
    );
  });
})();
