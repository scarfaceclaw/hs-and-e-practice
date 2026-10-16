// Everything that must be filled in before the page goes live is in this one file.
// See ~/Developer/app-gauntlet/pieces/landing/LEGAL-LANDING.md items 7 and 9.
// Do NOT go live with any PLACEHOLDER or [bracketed] value left in.

window.FORM = {
  // The Google Form's "formResponse" address, e.g. https://docs.google.com/forms/d/e/<id>/formResponse
  action: "PLACEHOLDER_FORM_ACTION_URL",
  // Each question's entry id from the Form's pre-filled link, e.g. "entry.123456789"
  entries: {
    email: "entry.PLACEHOLDER_EMAIL",
    test: "entry.PLACEHOLDER_TEST",          // optional answer
    language: "entry.PLACEHOLDER_LANGUAGE",  // optional answer
    source: "entry.PLACEHOLDER_SOURCE",      // fixed in the HTML: "site" here, "google-ads" on /go/
    notice: "entry.PLACEHOLDER_NOTICE",      // the notice version below
    honeypot: "entry.PLACEHOLDER_HONEYPOT"   // real visitors never see it; delete posts that fill it
  },
  // Change this whenever the words beside the button or the full notice change.
  notice: "2026-10-16a"
};

window.CONTACT = {
  email: "[business email]",
  address: "[geographic address]"
};

// Google tag: deliberately none. The legal kit's recommendation is option 4A (no gtag.js,
// no Tag Manager, no consent banner, no Consent Mode pings). Sign-ups are counted in the Form
// by the fixed "source" value instead. Option 4B (a banner, then a conversion tag) is Andy's
// decision and is not built here.
