// HS&E Test Practice: the free 50-question mock, the 10-question taster and the launch-list sign-up.
// No cookies, no tracking and no browser storage (unless option 4B is switched on in config.js),
// and the page does not read its own address (unless SITE.readSourceFromAddress is switched on).
(function () {
  "use strict";

  var BASE = document.currentScript ? document.currentScript.src : location.href;
  var TASTER = window.TASTER || [];
  var LETTERS = ["A", "B", "C", "D", "E"];
  var TOPICS = ["Working environment", "Occupational health", "Safety", "High risk activities", "Specialist"];
  var MOCK_SIZE = 50, PER_TOPIC = 10, MOCK_SECONDS = 45 * 60;
  var lang = "";

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function help(text, cls) {
    var p = el("p", "help " + (cls || ""), text);
    p.lang = lang;
    return p;
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function loadScript(file, done) {
    var s = document.createElement("script");
    s.src = new URL(file, BASE).href;
    s.onload = function () { done(true); };
    s.onerror = function () { done(false); };
    document.head.appendChild(s);
  }

  // ---- Contact placeholders (filled from config.js) ----
  var contact = window.CONTACT || {};
  document.querySelectorAll("[data-fill]").forEach(function (s) {
    var v = contact[s.getAttribute("data-fill")];
    if (v) s.textContent = v;
  });

  // ---- Safety signs: the app's own drawings (SafetySign.swift), as SVG in a 100 x 100 box ----
  var C = { red: "#CC0D1A", blue: "#00549E", black: "#141414" };
  function tongue(x, y, w, h) {
    function p(u, v) { return (x + u * w).toFixed(2) + " " + (y + v * h).toFixed(2); }
    return "M" + p(.48, 1) + "C" + p(.18, 1) + " " + p(.02, .8) + " " + p(.06, .58) +
      "C" + p(.1, .4) + " " + p(.3, .32) + " " + p(.4, .22) +
      "C" + p(.5, .14) + " " + p(.62, .08) + " " + p(.66, 0) +
      "C" + p(.74, .12) + " " + p(.6, .24) + " " + p(.66, .36) +
      "C" + p(.76, .44) + " " + p(.96, .46) + " " + p(.94, .62) +
      "C" + p(.92, .86) + " " + p(.74, 1) + " " + p(.48, 1) + "Z";
  }
  var HEAD = "M50 74C60 74 66 63 67 50C68 33 61 19 50 19C39 19 32 33 33 50C34 63 40 74 50 74Z";
  var TORSO = "M43.5 68L43.5 77C35 81 14 80 10 96L90 96C86 80 65 81 56.5 77L56.5 68Z";
  var SIGNS = {
    "no-naked-flames": {
      looks: "Round sign, red edge and red line across, black picture of a lit match above a cigarette",
      svg: function (id) {
        var k = C.black, smoke = "";
        [61, 67, 73].forEach(function (x) { smoke += "M" + x + " 59C" + (x - 4) + " 55 " + (x + 5) + " 50 " + (x + 1) + " 45"; });
        return '<defs><clipPath id="' + id + '"><circle cx="50" cy="50" r="38"/></clipPath></defs>' +
          '<circle cx="50" cy="50" r="48" fill="' + C.red + '"/><circle cx="50" cy="50" r="38" fill="#fff"/>' +
          '<g clip-path="url(#' + id + ')" fill="' + k + '">' +
          '<rect x="46.5" y="35" width="4" height="23" rx="2"/><circle cx="48.5" cy="35" r="3.5"/>' +
          '<path d="' + tongue(41.5, 13.5, 14, 19) + '"/>' +
          '<rect x="21" y="63" width="10" height="9" rx="1.2"/>' +
          '<rect x="31" y="64.1" width="25" height="6.8" fill="none" stroke="' + k + '" stroke-width="2.2"/>' +
          '<rect x="57" y="63" width="7.5" height="9" rx="1.2"/>' +
          '<path d="' + smoke + '" fill="none" stroke="' + k + '" stroke-width="2.4" stroke-linecap="round"/></g>' +
          '<path d="M22.5 22.5L77.5 77.5" stroke="' + C.red + '" stroke-width="8.5"/>';
      }
    },
    "wear-eye-protection": {
      looks: "Round blue sign, white picture of a head, seen from the front, wearing goggles",
      svg: function (id) {
        var b = C.blue;
        return '<defs><clipPath id="' + id + '"><circle cx="50" cy="50" r="44.5"/></clipPath></defs>' +
          '<circle cx="50" cy="50" r="48" fill="' + b + '"/>' +
          '<path clip-path="url(#' + id + ')" d="' + TORSO + '" fill="#fff"/>' +
          '<path d="' + HEAD + '" fill="#fff" stroke="' + b + '" stroke-width="3" paint-order="stroke"/>' +
          '<ellipse cx="32" cy="54" rx="3.5" ry="6" fill="#fff"/><ellipse cx="68" cy="54" rx="3.5" ry="6" fill="#fff"/>' +
          '<rect x="29.5" y="36" width="41" height="16" rx="7" fill="#fff" stroke="' + b + '" stroke-width="5" paint-order="stroke"/>' +
          '<ellipse cx="40.5" cy="44" rx="6.5" ry="5.5" fill="none" stroke="' + b + '" stroke-width="2.6"/>' +
          '<ellipse cx="59.5" cy="44" rx="6.5" ry="5.5" fill="none" stroke="' + b + '" stroke-width="2.6"/>' +
          '<path d="M25 44H29M71 44H75" stroke="#fff" stroke-width="3" stroke-linecap="round"/>';
      }
    }
  };
  var signN = 0;
  function signFigure(kind) {
    var s = SIGNS[kind];
    if (!s) return null;
    var fig = el("div", "sign");
    fig.innerHTML = '<svg viewBox="0 0 100 100" role="img" aria-label="Safety sign. ' + s.looks + '">' +
      s.svg("clip-" + kind + "-" + (++signN)) + "</svg>";
    return fig;
  }

  // ---- The mock's bank and help languages load after the first screen, so it shows at once ----
  var bankWaiters = [];
  function withBank(fn) {
    if (window.BANK) return fn();
    bankWaiters.push(fn);
    if (bankWaiters.length === 1) loadScript("bank.js", function (ok) {
      if (!ok) { bankWaiters = []; alert("The mock did not load. Please check your connection and try again."); return; }
      var w = bankWaiters; bankWaiters = [];
      w.forEach(function (f) { f(); });
    });
  }
  window.addEventListener("load", function () { setTimeout(function () { withBank(function () {
    $("poolCount").textContent = String(window.BANK.length);
  }); }, 300); });

  var helpLoading = {};
  function needHelp(code) {
    if (!code || (window.HELP && window.HELP[code]) || helpLoading[code]) return;
    helpLoading[code] = true;
    loadScript("help/" + code + ".js", function () { helpLoading[code] = false; refresh(); });
  }

  // ---- One question, in any order. item = { q, order, help(code) } ----
  function view(item) {
    var q = item.q, o = item.order;
    var t = lang ? item.help(lang) : null;
    function wn(map) { var r = {}; Object.keys(map || {}).forEach(function (k) { r[o.indexOf(+k)] = map[k]; }); return r; }
    return {
      q: q, options: o.map(function (i) { return q.options[i]; }), correct: o.indexOf(q.correct), whyNot: wn(q.why_not),
      t: t ? { question: t.question, options: o.map(function (i) { return t.options[i]; }), explanation: t.explanation, whyNot: wn(t.why_not) } : null
    };
  }
  function tasterItem(q) { return { q: q, order: range(q.options.length), help: function (c) { return q.help[c]; } }; }
  function bankItem(q) {
    return { q: q, order: shuffle(range(q.options.length)),
      help: function (c) { return window.HELP && window.HELP[c] ? window.HELP[c][q.id] : null; } };
  }

  // mode: "ask" (tap to answer, the answer shows at once), "mock" (tap to choose, no marks), "done" (marked)
  function questionCard(v, mode, picked, onPick) {
    var card = el("div", "qcard" + (mode === "done" ? " done" : ""));
    var head = el("div", "qhead" + (v.q.sign ? " has-sign" : ""));
    var fig = v.q.sign ? signFigure(v.q.sign) : null;
    if (fig) head.appendChild(fig);
    var words = el("div", "qwords");
    words.appendChild(el("p", "area", v.q.area || v.q.topic));
    words.appendChild(el("h2", "qtext", v.q.question));
    if (v.t) words.appendChild(help(v.t.question, "qhelp"));
    head.appendChild(words);
    card.appendChild(head);

    var list = el("div", "opts");
    list.setAttribute("role", "group");
    list.setAttribute("aria-label", "Answers");
    v.options.forEach(function (text, n) {
      var b = el("button", "opt");
      b.type = "button";
      var w = el("span", "otext");
      w.appendChild(el("span", "oen", text));
      if (v.t) { var h = el("span", "help ohelp", v.t.options[n]); h.lang = lang; w.appendChild(h); }
      b.appendChild(el("span", "badge", LETTERS[n]));
      b.appendChild(w);
      if (mode === "done") {
        b.disabled = true;
        if (n === v.correct) {
          b.classList.add(n === picked ? "right-chosen" : "right-missed");
          w.appendChild(el("span", "onote", n === picked ? "Your answer: right" : "Right answer"));
        } else if (n === picked) {
          b.classList.add("wrong-chosen");
          w.appendChild(el("span", "onote", "Your answer: wrong"));
        } else {
          b.classList.add("other");
        }
      } else {
        if (n === picked) { b.classList.add("chosen"); b.setAttribute("aria-pressed", "true"); }
        b.addEventListener("click", function () { onPick(n); });
      }
      list.appendChild(b);
    });
    card.appendChild(list);
    return card;
  }

  function feedback(v, picked) {
    var right = picked === v.correct, none = picked == null;
    var fb = el("div", "feedback " + (right ? "is-right" : "is-wrong"));
    fb.setAttribute("role", "status");
    fb.appendChild(el("p", "verdict", right ? "Right" :
      (none ? "Not answered · " : "Wrong · ") + "The right answer is " + LETTERS[v.correct] + "."));
    if (!right && !none && v.whyNot[picked]) {
      var not = el("div", "why why-not-first");
      not.appendChild(el("p", "why-h", "Why " + LETTERS[picked] + " is wrong"));
      not.appendChild(el("p", "why-t", v.whyNot[picked]));
      if (v.t && v.t.whyNot[picked]) not.appendChild(help(v.t.whyNot[picked]));
      fb.appendChild(not);
    }
    var why = el("div", "why" + (right || none ? "" : " why-after"));
    why.appendChild(el("p", "why-h", right ? "Why" : "Why " + LETTERS[v.correct] + " is right"));
    why.appendChild(el("p", "why-t", v.q.explanation));
    if (v.t) why.appendChild(help(v.t.explanation));
    fb.appendChild(why);
    var src = el("p", "source");
    src.appendChild(document.createTextNode("Source: "));
    var a = el("a", null, v.q.source_title);
    a.href = v.q.source_url;
    a.rel = "noopener noreferrer";
    a.target = "_blank";
    src.appendChild(a);
    fb.appendChild(src);
    return fb;
  }

  function segs(box, n, cls) {
    box.innerHTML = "";
    for (var i = 0; i < n; i++) box.appendChild(el("span", "seg " + (cls(i) || "")));
  }

  // ---- Screens ----
  var SECTIONS = ["intro", "quiz", "score", "mock", "mockScore", "review"];
  var current = "intro";
  function show(section) {
    current = section;
    SECTIONS.forEach(function (s) { $(s).hidden = s !== section; });
    $("nextBar").hidden = true;
    $("signup").hidden = section === "mock" || section === "review";
    window.scrollTo(0, 0);
  }
  function refresh() {
    if (current === "quiz") renderTaster();
    else if (current === "mock") renderMock();
    else if (current === "review") renderReview();
  }

  // ---- Help language ----
  var LANG_NAMES = [["", "English only"], ["pl", "Polski"], ["ro", "Română"], ["bg", "Български"], ["lt", "Lietuvių"], ["pa", "ਪੰਜਾਬੀ"], ["pt", "Português"]];
  document.querySelectorAll(".langSelect").forEach(function (sel) {
    LANG_NAMES.forEach(function (l) {
      var o = el("option", null, l[1]);
      o.value = l[0];
      if (l[0]) o.lang = l[0];
      sel.appendChild(o);
    });
    sel.addEventListener("change", function (e) { setLang(e.target.value); });
  });
  function setLang(code) {
    lang = code || "";
    document.querySelectorAll(".chip").forEach(function (c) {
      var on = c.getAttribute("data-lang") === lang;
      c.classList.toggle("on", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.querySelectorAll(".langSelect").forEach(function (s) { s.value = lang; });
    if (current === "mock" || current === "review") needHelp(lang);
    refresh();
  }
  document.querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () { setLang(c.getAttribute("data-lang")); });
  });

  // ---- The 10-question taster: the answer and the reason after each one ----
  var taster = { items: TASTER.map(tasterItem), i: 0, picked: [] };
  function startTaster() {
    taster.i = 0;
    taster.picked = [];
    show("quiz");
    renderTaster();
  }
  $("start").addEventListener("click", startTaster);
  $("again").addEventListener("click", startTaster);
  $("mockToTaster").addEventListener("click", startTaster);

  function renderTaster() {
    var item = taster.items[taster.i], v = view(item), picked = taster.picked[taster.i], answered = picked != null;
    var body = $("qbody");
    body.innerHTML = "";
    $("qcount").textContent = "Question " + (taster.i + 1) + " of " + taster.items.length;
    segs($("segs"), taster.items.length, function (n) {
      if (n === taster.i) return "now";
      if (n < taster.picked.length) return taster.picked[n] === view(taster.items[n]).correct ? "right" : "wrong";
    });
    body.appendChild(questionCard(v, answered ? "done" : "ask", picked, function (n) {
      if (taster.picked[taster.i] != null) return;
      taster.picked[taster.i] = n;
      renderTaster();
    }));
    if (answered) {
      body.appendChild(feedback(v, picked));
      $("next").textContent = taster.i === taster.items.length - 1 ? "See your score" : "Next question";
    }
    $("nextBar").hidden = !answered;
  }
  $("next").addEventListener("click", function () {
    if (taster.i < taster.items.length - 1) {
      taster.i += 1;
      renderTaster();
      window.scrollTo(0, 0);
    } else {
      var got = 0;
      $("scoreDots").innerHTML = "";
      taster.items.forEach(function (it, n) {
        var ok = taster.picked[n] === view(it).correct;
        if (ok) got++;
        $("scoreDots").appendChild(el("span", "dot " + (ok ? "right" : "wrong")));
      });
      $("scoreLine").textContent = "You got " + got + " of " + taster.items.length + ".";
      show("score");
    }
  });

  // ---- The timed 50-question mock: no marks until the end ----
  var mock = null, tick = null;
  function buildMock() {
    var byTopic = {};
    window.BANK.forEach(function (q) { (byTopic[q.topic] = byTopic[q.topic] || []).push(q); });
    var picked = [];
    TOPICS.forEach(function (t) { picked = picked.concat(shuffle((byTopic[t] || []).slice()).slice(0, PER_TOPIC)); });
    return shuffle(picked).slice(0, MOCK_SIZE).map(bankItem);
  }
  function startMock() {
    withBank(function () {
      mock = { items: buildMock(), answers: [], i: 0, endAt: Date.now() + MOCK_SECONDS * 1000, confirming: false, timeUp: false };
      needHelp(lang);
      show("mock");
      renderMock();
      clearInterval(tick);
      tick = setInterval(updateTimer, 1000);
      updateTimer();
    });
  }
  $("startMock").addEventListener("click", startMock);
  $("scoreToMock").addEventListener("click", startMock);
  $("mockAgain").addEventListener("click", startMock);

  function secondsLeft() { return Math.max(0, Math.round((mock.endAt - Date.now()) / 1000)); }
  function updateTimer() {
    if (!mock || current !== "mock") return;
    var s = secondsLeft();
    $("timer").textContent = Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2) + " left";
    $("timer").classList.toggle("low", s <= 5 * 60);
    if (s === 0) { mock.timeUp = true; finishMock(); }
  }

  function answeredCount() { return mock.answers.filter(function (a) { return a != null; }).length; }
  function renderMock() {
    var body = $("mbody");
    body.innerHTML = "";
    $("mcount").textContent = (mock.i + 1) + " of " + mock.items.length;
    segs($("msegs"), mock.items.length, function (n) {
      return n === mock.i ? "now" : (mock.answers[n] != null ? "done" : "");
    });
    if (mock.confirming) return renderConfirm(body);
    var v = view(mock.items[mock.i]);
    body.appendChild(questionCard(v, "mock", mock.answers[mock.i], function (n) {
      mock.answers[mock.i] = n;
      renderMock();
    }));
    body.appendChild(el("p", "mock-hint", mock.answers[mock.i] == null
      ? "Tap an answer. You can change it until you finish. Marks and reasons come at the end."
      : "Answer saved. You can change it until you finish."));
    $("mback").disabled = mock.i === 0;
    $("mnext").textContent = mock.i === mock.items.length - 1 ? "Finish the mock" : "Next";
    $("mockBar").hidden = false;
  }
  function renderConfirm(body) {
    $("mockBar").hidden = true;
    var box = el("div", "confirm");
    var left = mock.items.length - answeredCount();
    box.appendChild(el("h2", null, "Finish the mock?"));
    box.appendChild(el("p", null, "You have answered " + answeredCount() + " of " + mock.items.length + "." +
      (left ? " " + left + " not answered yet:" : "")));
    if (left) {
      var jumps = el("div", "jumps");
      mock.items.forEach(function (it, n) {
        if (mock.answers[n] != null) return;
        var b = el("button", "jump", String(n + 1));
        b.type = "button";
        b.setAttribute("aria-label", "Go to question " + (n + 1));
        b.addEventListener("click", function () { mock.confirming = false; mock.i = n; renderMock(); window.scrollTo(0, 0); });
        jumps.appendChild(b);
      });
      box.appendChild(jumps);
    }
    var fin = el("button", "big", "Finish and see my score");
    fin.type = "button";
    fin.addEventListener("click", finishMock);
    var keep = el("button", "again", "Keep going");
    keep.type = "button";
    keep.addEventListener("click", function () { mock.confirming = false; renderMock(); });
    box.appendChild(fin);
    box.appendChild(keep);
    body.appendChild(box);
  }
  $("mback").addEventListener("click", function () { if (mock.i > 0) { mock.i--; renderMock(); window.scrollTo(0, 0); } });
  $("mnext").addEventListener("click", function () {
    if (mock.i < mock.items.length - 1) { mock.i++; renderMock(); window.scrollTo(0, 0); }
    else { mock.confirming = true; renderMock(); window.scrollTo(0, 0); }
  });
  $("mfinish").addEventListener("click", function () { mock.confirming = true; renderMock(); window.scrollTo(0, 0); });

  function finishMock() {
    clearInterval(tick);
    var got = 0, per = {};
    TOPICS.forEach(function (t) { per[t] = [0, 0]; });
    mock.wrong = [];
    mock.items.forEach(function (it, n) {
      var ok = mock.answers[n] === view(it).correct;
      per[it.q.topic][1]++;
      if (ok) { got++; per[it.q.topic][0]++; } else mock.wrong.push(n);
    });
    $("timeUp").hidden = !mock.timeUp;
    $("mScoreLine").textContent = "You got " + got + " of " + mock.items.length + ".";
    var box = $("mTopics");
    box.innerHTML = "";
    TOPICS.forEach(function (t) {
      var row = el("div", "trow");
      row.appendChild(el("span", "tname", t));
      var cells = el("span", "tcells");
      for (var i = 0; i < per[t][1]; i++) cells.appendChild(el("span", "tcell" + (i < per[t][0] ? " ok" : "")));
      row.appendChild(cells);
      row.appendChild(el("span", "tnum", per[t][0] + " of " + per[t][1]));
      box.appendChild(row);
    });
    var w = mock.wrong.length;
    $("toReview").hidden = w === 0;
    $("toReview").textContent = "Go over your " + w + " wrong answer" + (w === 1 ? "" : "s");
    show("mockScore");
  }

  // ---- Going over the mock: the right answer, why yours is wrong, and why the right one is right ----
  var rev = { i: 0 };
  $("toReview").addEventListener("click", function () { rev.i = 0; needHelp(lang); show("review"); renderReview(); });
  function renderReview() {
    var n = mock.wrong[rev.i], v = view(mock.items[n]), picked = mock.answers[n];
    var body = $("rbody");
    body.innerHTML = "";
    $("rcount").textContent = "Wrong answer " + (rev.i + 1) + " of " + mock.wrong.length;
    body.appendChild(el("p", "rnum", "Mock question " + (n + 1) + " of " + mock.items.length));
    body.appendChild(questionCard(v, "done", picked));
    body.appendChild(feedback(v, picked));
    $("rback").disabled = rev.i === 0;
    $("rnext").textContent = rev.i === mock.wrong.length - 1 ? "Back to your score" : "Next wrong answer";
  }
  $("rback").addEventListener("click", function () { if (rev.i > 0) { rev.i--; renderReview(); window.scrollTo(0, 0); } });
  $("rnext").addEventListener("click", function () {
    if (rev.i < mock.wrong.length - 1) { rev.i++; renderReview(); window.scrollTo(0, 0); }
    else show("mockScore");
  });

  // ---- Header button and notice ----
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (current === "mock" && !confirm("Leave the mock? Your answers will not be marked.")) return;
      if (current === "mock" || current === "review") { clearInterval(tick); show("intro"); }
      $(b.getAttribute("data-go")).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  $("noticeLink").addEventListener("click", function (e) {
    e.preventDefault();
    $("notice").hidden = false;
    $("notice").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("noticeClose").addEventListener("click", function () {
    $("notice").hidden = true;
    $("noticeLink").focus();
  });

  // ---- Where the visitor came from: fixed in the HTML unless switched on in config.js ----
  var site = window.SITE || {};
  if (site.readSourceFromAddress) {
    try {
      var qs = new URLSearchParams(location.search);
      var src = (qs.get("src") || qs.get("utm_source") || "").trim();
      if (/^[A-Za-z0-9_-]{1,40}$/.test(src)) $("form").source.value = src;
    } catch (e) { /* keep the fixed value */ }
  }

  // ---- Option 4B (OFF unless config.js GTAG.enabled): nothing from Google loads before Allow ----
  var G = window.GTAG || {};
  var tagOn = !!(G.enabled && G.noticeCookies && !/PLACEHOLDER/.test(G.id + G.sendTo));
  var adConsent = "";
  function loadTag() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { ad_storage: "granted", ad_user_data: "granted", analytics_storage: "granted", ad_personalization: "denied" });
    window.gtag("js", new Date());
    window.gtag("config", G.id);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(G.id);
    document.head.appendChild(s);
  }
  function choose(c) {
    adConsent = c;
    try { localStorage.setItem("ad-consent", c); } catch (e) { /* ask again next visit */ }
    $("consent").hidden = true;
    if (c === "granted") loadTag();
    else if (window.gtag) window.gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", analytics_storage: "denied" });
  }
  if (G.enabled && !tagOn) console.warn("GTAG.enabled is set but ids or noticeCookies are missing: the tag stays off.");
  if (tagOn) {
    document.querySelector("[data-cookies]").textContent = G.noticeCookies;
    $("adSettingsWrap").hidden = false;
    $("adSettings").addEventListener("click", function (e) { e.preventDefault(); $("consent").hidden = false; });
    $("cAllow").addEventListener("click", function () { choose("granted"); });
    $("cDeny").addEventListener("click", function () { choose("denied"); });
    $("cMore").addEventListener("click", function () { $("consentMore").hidden = false; });
    var saved = "";
    try { saved = localStorage.getItem("ad-consent") || ""; } catch (e) { saved = ""; }
    if (saved === "granted" || saved === "denied") { adConsent = saved; if (saved === "granted") loadTag(); }
    else $("consent").hidden = false;
  }

  // ---- Sign-up: posts to the Google Form (config.js). No cookies are sent, and no page address. ----
  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var email = f.email.value.trim();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    $("emailErr").hidden = ok;
    if (!ok) { f.email.focus(); return; }

    var cfg = window.FORM || {};
    var en = cfg.entries || {};
    if (!cfg.action || /PLACEHOLDER/.test(cfg.action + en.email + en.test + en.language + en.source + en.notice + en.honeypot)) {
      $("sendErr").textContent = "Sign-up is not switched on yet. Please try again later.";
      $("sendErr").hidden = false;
      return;
    }
    var body = new URLSearchParams();
    body.append(en.email, email);
    if (f.test.value) body.append(en.test, f.test.value);
    if (f.language.value) body.append(en.language, f.language.value);
    body.append(en.source, f.source.value);
    body.append(en.notice, cfg.notice);
    if (tagOn && en.adConsent && !/PLACEHOLDER/.test(en.adConsent)) body.append(en.adConsent, adConsent || "not asked");
    if (f.website.value) body.append(en.honeypot, f.website.value);

    $("send").disabled = true;
    fetch(cfg.action, {
      method: "POST", mode: "no-cors", credentials: "omit", referrerPolicy: "no-referrer", body: body
    }).then(function () {
      f.querySelectorAll("input, select, button").forEach(function (x) { x.disabled = true; });
      $("thanks").hidden = false;
      $("sendErr").hidden = true;
      if (tagOn && adConsent === "granted" && window.gtag) window.gtag("event", "conversion", { send_to: G.sendTo });
    }).catch(function () {
      $("send").disabled = false;
      $("sendErr").textContent = "That did not send. Please check your connection and try again.";
      $("sendErr").hidden = false;
    });
  });
})();
