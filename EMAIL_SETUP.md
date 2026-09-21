# Email Delivery Setup — Social Frame Creative contact form

The contact form (`pages/contact.html` + `assets/js/contact.js`) sends enquiries to
**socialframecreative@gmail.com** via **EmailJS** (static-site safe: only the public
key lives in frontend code — never a Gmail password, SMTP password, or private key).

> Current status: LIVE — `service_dgyfx4r` / `template_wd00e7j` / public key,
> official `emailjs.sendForm()` with exact field names
> (name/email/phone/business/service/budget/message).
> A real browser test submission returned HTTP 200 OK from the EmailJS API
> with the success UI shown. Confirm arrival in the socialframecreative@gmail.com
> inbox (check Spam/Promotions too) and EmailJS dashboard history.

## The 3 values required

Open `assets/js/contact.js` and fill these exact constants:

```javascript
const EMAIL_SERVICE_ID = '...';   // e.g. 'service_xxxxxxx'
const EMAIL_TEMPLATE_ID = '...';  // e.g. 'template_xxxxxxx'
const EMAIL_PUBLIC_KEY = '...';   // e.g. 'xxxxxxxxxxxxxx'
```

## Setup steps

1. Create/configure an EmailJS account at https://www.emailjs.com.
2. Connect the email service: Email Services → Add Service → connect the Gmail
   account `socialframecreative@gmail.com`. Copy the **Service ID**.
3. Create the email template: Email Templates → New template with:
   - **To Email:** `{{to_email}}`
   - **Reply-To:** `{{reply_to}}`
   - **Subject:** `{{subject}}` (sent as `New Social Frame Creative Enquiry — {{name}}`)
   - **Body variables:** `{{name}} {{email}} {{phone}} {{business}} {{service}} {{budget}} {{message}}`
   - **Body layout:**
     ```text
     New Website Enquiry

     Name: {{name}}
     Email: {{email}}
     Phone: {{phone}}
     Business: {{business}}
     Service: {{service}}
     Budget: {{budget}}

     Message:
     {{message}}
     ```
   Copy the **Template ID**.
4. Set recipient: the code always sends `to_email = socialframecreative@gmail.com`,
   so enquiries land in that inbox regardless of template defaults.
5. Copy Service ID.
6. Copy Template ID.
7. Copy Public Key (Account → General → Public Key).
8. Place all three in the documented configuration fields in `assets/js/contact.js`.
9. Run the website: `python -m http.server 8000` → `http://localhost:8000/pages/contact.html`.
10. Submit a real test enquiry (Name: Social Frame Test, valid email/phone,
    Business: Social Frame Creative, Service: Social Media Creatives, Budget: Test,
    Message: Production contact form delivery test.).
11. Verify the Gmail inbox `socialframecreative@gmail.com` receives the message —
    only then is delivery VERIFIED.

## Behaviour reference

- **Empty/invalid submit:** inline validation errors, no request, no success.
- **Honeypot filled:** submission silently ignored (spam).
- **Sending:** button shows spinner + `Sending…`, disabled (double-submit prevention).
- **Genuine EmailJS success:** `Your enquiry has been sent successfully. We'll review
  your details and get back to you.` + button becomes `Enquiry Sent ✓`.
- **Any failure / missing credentials / blocked SDK:** `We couldn't send your enquiry
  right now. Please contact us directly…` with working **Call Now** (`tel:`),
  **Chat on WhatsApp** (`wa.me`) and **Send Email** (`mailto:`) actions.
- **Throttling:** max 1 submission per minute per browser; all fields have
  `maxlength` limits and values are HTML-escaped before sending.
