// HS&E Test Practice: the 10-question taster and the launch-list sign-up.
// No cookies, no browser storage, no tracking, and the page never reads its own address.
(function () {
  "use strict";

  var Q = window.TASTER || [];
  var LETTERS = ["A", "B", "C", "D", "E"];
  var state = { i: 0, picked: [], lang: "" };

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function help(text, cls) {
    var p = el("p", "help " + (cls || ""), text);
    p.lang = state.lang;
    return p;
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
  function signFigure(kind) {
    var s = SIGNS[kind];
    if (!s) return null;
    var fig = el("div", "sign");
    fig.innerHTML = '<svg viewBox="0 0 100 100" role="img" aria-label="Safety sign. ' + s.looks + '">' +
      s.svg("clip-" + kind + "-" + state.i) + "</svg>";
    return fig;
  }

  // ---- Help language ----
  function setLang(code) {
    state.lang = code || "";
    document.querySelectorAll(".chip").forEach(function (c) {
      var on = c.getAttribute("data-lang") === state.lang;
      c.classList.toggle("on", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
    $("langSelect").value = state.lang;
    if (!$("quiz").hidden) render();
  }
  document.querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () { setLang(c.getAttribute("data-lang")); });
  });
  $("langSelect").addEventListener("change", function (e) { setLang(e.target.value); });

  // ---- The taster ----
  function show(section) {
    ["intro", "quiz", "score"].forEach(function (s) { $(s).hidden = s !== section; });
    $("nextBar").hidden = true;
    window.scrollTo(0, 0);
  }

  function start() {
    state.i = 0;
    state.picked = [];
    show("quiz");
    render();
  }
  $("start").addEventListener("click", start);
  $("again").addEventListener("click", start);

  function segs() {
    var box = $("segs");
    box.innerHTML = "";
    Q.forEach(function (q, n) {
      var s = el("span", "seg");
      if (n < state.picked.length) s.classList.add(state.picked[n] === Q[n].correct ? "right" : "wrong");
      if (n === state.i) s.classList.add("now");
      box.appendChild(s);
    });
  }

  function render() {
    var q = Q[state.i];
    var t = state.lang ? q.help[state.lang] : null;
    var picked = state.picked[state.i];
    var answered = picked != null;
    var body = $("qbody");
    body.innerHTML = "";
    $("qcount").textContent = "Question " + (state.i + 1) + " of " + Q.length;
    segs();

    var card = el("div", "qcard" + (answered ? " done" : ""));
    var head = el("div", "qhead" + (q.sign ? " has-sign" : ""));
    var fig = q.sign ? signFigure(q.sign) : null;
    if (fig) head.appendChild(fig);
    var words = el("div", "qwords");
    words.appendChild(el("p", "area", q.area));
    words.appendChild(el("h2", "qtext", q.question));
    if (t) words.appendChild(help(t.question, "qhelp"));
    head.appendChild(words);
    card.appendChild(head);

    var list = el("div", "opts");
    list.setAttribute("role", "group");
    list.setAttribute("aria-label", "Answers");
    q.options.forEach(function (text, n) {
      var b = el("button", "opt");
      b.type = "button";
      var badge = el("span", "badge", LETTERS[n]);
      var w = el("span", "otext");
      w.appendChild(el("span", "oen", text));
      if (t) { var h = el("span", "help ohelp", t.options[n]); h.lang = state.lang; w.appendChild(h); }
      b.appendChild(badge);
      b.appendChild(w);
      if (answered) {
        b.disabled = true;
        if (n === q.correct) {
          b.classList.add(n === picked ? "right-chosen" : "right-missed");
          w.appendChild(el("span", "onote", n === picked ? "Your answer: right" : "Right answer"));
        } else if (n === picked) {
          b.classList.add("wrong-chosen");
          w.appendChild(el("span", "onote", "Your answer: wrong"));
        } else {
          b.classList.add("other");
        }
      } else {
        b.addEventListener("click", function () { answer(n); });
      }
      list.appendChild(b);
    });
    card.appendChild(list);
    body.appendChild(card);

    if (answered) {
      var right = picked === q.correct;
      var fb = el("div", "feedback " + (right ? "is-right" : "is-wrong"));
      fb.setAttribute("role", "status");
      fb.appendChild(el("p", "verdict", right ? "Right" : "Wrong · The right answer is " + LETTERS[q.correct] + "."));

      if (!right && q.why_not[String(picked)]) {
        var not = el("div", "why why-not-first");
        not.appendChild(el("p", "why-h", "Why " + LETTERS[picked] + " is wrong"));
        not.appendChild(el("p", "why-t", q.why_not[String(picked)]));
        if (t && t.why_not[String(picked)]) not.appendChild(help(t.why_not[String(picked)]));
        fb.appendChild(not);
      }

      var why = el("div", "why" + (right ? "" : " why-after"));
      why.appendChild(el("p", "why-h", right ? "Why" : "Why " + LETTERS[q.correct] + " is right"));
      why.appendChild(el("p", "why-t", q.explanation));
      if (t) why.appendChild(help(t.explanation));
      fb.appendChild(why);

      var src = el("p", "source");
      src.appendChild(document.createTextNode("Source: "));
      var a = el("a", null, q.source_title);
      a.href = q.source_url;
      a.rel = "noopener noreferrer";
      a.target = "_blank";
      src.appendChild(a);
      fb.appendChild(src);
      body.appendChild(fb);

      $("next").textContent = state.i === Q.length - 1 ? "See your score" : "Next question";
      $("nextBar").hidden = false;
    } else {
      $("nextBar").hidden = true;
    }
  }

  function answer(n) {
    if (state.picked[state.i] != null) return;
    state.picked[state.i] = n;
    render();
  }

  $("next").addEventListener("click", function () {
    if (state.i < Q.length - 1) {
      state.i += 1;
      render();
      window.scrollTo(0, 0);
    } else {
      finish();
    }
  });

  function finish() {
    var got = state.picked.filter(function (p, n) { return p === Q[n].correct; }).length;
    $("scoreLine").textContent = "You got " + got + " of " + Q.length + ".";
    var dots = $("scoreDots");
    dots.innerHTML = "";
    Q.forEach(function (q, n) {
      dots.appendChild(el("span", "dot " + (state.picked[n] === q.correct ? "right" : "wrong")));
    });
    show("score");
  }

  // ---- Header button and notice ----
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () {
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
    if (!cfg.action || /PLACEHOLDER/.test(cfg.action + JSON.stringify(en))) {
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
    if (f.website.value) body.append(en.honeypot, f.website.value);

    $("send").disabled = true;
    fetch(cfg.action, {
      method: "POST", mode: "no-cors", credentials: "omit", referrerPolicy: "no-referrer", body: body
    }).then(function () {
      f.querySelectorAll("input, select, button").forEach(function (x) { x.disabled = true; });
      $("thanks").hidden = false;
      $("sendErr").hidden = true;
    }).catch(function () {
      $("send").disabled = false;
      $("sendErr").textContent = "That did not send. Please check your connection and try again.";
      $("sendErr").hidden = false;
    });
  });
})();
