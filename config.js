// Everything that must be filled in or switched before the page goes live is in this one file.
// See ~/Developer/app-gauntlet/pieces/landing/LEGAL-LANDING.md items 7, 8 and 9.
// Do NOT go live with any PLACEHOLDER or [bracketed] value left in.

window.FORM = {
  // The Google Form's "formResponse" address, e.g. https://docs.google.com/forms/d/e/<id>/formResponse
  action: "PLACEHOLDER_FORM_ACTION_URL",
  // Each question's entry id from the Form's pre-filled link, e.g. "entry.123456789"
  entries: {
    email: "entry.PLACEHOLDER_EMAIL",
    test: "entry.PLACEHOLDER_TEST",            // optional answer
    language: "entry.PLACEHOLDER_LANGUAGE",    // optional answer
    source: "entry.PLACEHOLDER_SOURCE",        // fixed in the HTML: "site" here, "google-ads" on /go/
    notice: "entry.PLACEHOLDER_NOTICE",        // the notice version below
    honeypot: "entry.PLACEHOLDER_HONEYPOT",    // real visitors never see it; delete posts that fill it
    adConsent: "entry.PLACEHOLDER_AD_CONSENT"  // only used if GTAG.enabled (option 4B): "granted" / "denied"
  },
  // Change this whenever the words beside the button or the full notice change.
  notice: "2026-10-16b"
};

window.CONTACT = {
  email: "hsande@protonmail.com",
  address: "68 Woodland Avenue, Hutton, Brentwood, Essex CM13 1HH"
};

window.SITE = {
  // OFF, as the legal kit recommends (item 8: "The page never reads the URL"). The ads link to /go/,
  // whose HTML fixes source = "google-ads". If switched on, ?src= or ?utm_source= (letters, digits,
  // - and _ only, 40 at most) replaces the hidden source value. Check with the legal kit first.
  readSourceFromAddress: false
};

// Google tag. OFF: the legal kit recommends option 4A (no gtag.js, no Tag Manager, no banner, and
// no Consent Mode "denied" pings: option 4C is rejected). If Andy chooses option 4B, set enabled: true
// and fill the ids. Then NOTHING from Google loads until the visitor taps Allow on the banner;
// ad_personalization stays denied; enhanced conversions must be OFF in Google Ads (the page never
// sends user_data); the choice is posted in the hidden ad_consent field; the footer gets
// "Ad measurement settings". noticeCookies must hold the 4B notice wording, or the tag stays off.
window.GTAG = {
  enabled: false,
  id: "AW-PLACEHOLDER",
  sendTo: "AW-PLACEHOLDER/PLACEHOLDER_LABEL",   // the sign-up conversion
  noticeCookies: ""                              // replaces "This page sets no cookies and uses no tracking."
};
