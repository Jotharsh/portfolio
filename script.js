(function () {
  var p = window.PORTFOLIO;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function link(href, label, cls) {
    var a = el("a", cls);
    a.appendChild(el("span", "", label));
    a.href = href;
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }
  var ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Content ---------- */
  document.title = p.name + " | " + p.title;
  $("logo").textContent = p.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
  $("hero-title").textContent = p.title;
  $("tagline").textContent = p.tagline;
  $("coords").textContent = p.coords || p.location || "";
  $("avail").textContent = p.availability || "";
  $("giant").textContent = p.name;
  $("footer").textContent = "© " + new Date().getFullYear() + " " + p.name;

  // Name decodes itself on load.
  var nameEl = $("hero-name");
  nameEl.setAttribute("aria-label", p.name);
  (function scramble(text) {
    nameEl.textContent = text;
    if (reduce) return;
    var chars = "!<>-_/[]{}=+*^?#01", start = performance.now(), dur = 1500;
    (function frame(now) {
      var t = (now - start) / dur, out = "";
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        var resolveAt = 0.2 + (i / text.length) * 0.6;
        out += (ch === " " || t >= resolveAt) ? ch : chars.charAt(Math.floor(Math.random() * chars.length));
      }
      nameEl.textContent = out;
      if (t < 1) requestAnimationFrame(frame); else nameEl.textContent = text;
    })(start);
  })(p.name);

  // Tech ticker
  var words = p.marquee || [];
  if (!words.length) { $("marquee").remove(); }
  else {
    [false, true].forEach(function (rev) {
      var track = el("div", "mrow" + (rev ? " rev" : ""));
      var list = rev ? words.slice().reverse() : words;
      for (var k = 0; k < 2; k++) list.forEach(function (w) { track.appendChild(el("span", "", w)); });
      $("marquee").appendChild(track);
    });
  }

  var stats = $("stats");
  (p.stats || []).forEach(function (s, i) {
    var t = el("div", "stat glass reveal");
    t.style.setProperty("--d", i * 0.1 + "s");
    t.appendChild(el("div", "stat-val", s.value));
    t.appendChild(el("div", "stat-label", s.label));
    stats.appendChild(t);
  });
  if (!(p.stats || []).length) document.querySelector(".stats-band").remove();

  // About: first paragraph becomes the word-by-word statement
  var statement = $("statement"), swords = [];
  (p.bio[0] || "").split(/\s+/).forEach(function (w) {
    var s = el("span", "w", w);
    swords.push(s);
    statement.appendChild(s);
    statement.appendChild(document.createTextNode(" "));
  });
  var rest = p.bio.slice(1);
  if (rest.length) rest.forEach(function (t) { $("bio").appendChild(el("p", "", t)); });
  else $("bio").remove();
  if ((p.interests || []).length) p.interests.forEach(function (t) { $("interests").appendChild(el("span", "chip", t)); });
  else $("interests").parentNode.remove();

  Object.keys(p.skills).forEach(function (group, i) {
    var g = el("div", "skill-group glass reveal");
    g.style.setProperty("--d", (i % 2) * 0.08 + "s");
    g.appendChild(el("h3", "", group));
    var chips = el("div", "chips");
    p.skills[group].forEach(function (s) { chips.appendChild(el("span", "chip", s)); });
    g.appendChild(chips);
    $("skill-groups").appendChild(g);
  });

  // Projects as a list with a live oscilloscope preview
  var plist = $("plist");
  p.projects.forEach(function (pr, i) {
    var li = el("li", "prow reveal");
    li.dataset.i = i;
    li.style.setProperty("--d", (i % 4) * 0.06 + "s");
    li.appendChild(el("h3", "ptitle", pr.name));
    li.appendChild(el("p", "pdesc", pr.description));
    var side = el("div", "pside");
    var chips = el("div", "chips");
    pr.tech.slice(0, 3).forEach(function (t) { chips.appendChild(el("span", "chip", t)); });
    side.appendChild(chips);
    var links = el("div", "plinks");
    if (pr.github) links.appendChild(link(pr.github, "Code"));
    if (pr.live) links.appendChild(link(pr.live, "Live demo"));
    if (links.children.length) side.appendChild(links);
    li.appendChild(side);
    plist.appendChild(li);
  });

  var pv = el("div", "ppreview glass");
  var pvCanvas = el("canvas");
  pvCanvas.width = 600; pvCanvas.height = 300;
  var pvMeta = el("div", "pp-meta"), pvTitle = el("b"), pvChips = el("div", "chips");
  pvMeta.appendChild(pvTitle); pvMeta.appendChild(pvChips);
  pv.appendChild(pvCanvas); pv.appendChild(pvMeta);
  document.body.appendChild(pv);
  var pvCtx = pvCanvas.getContext("2d");

  function wave(kind, a) {
    var tau = Math.PI * 2;
    switch (kind % 6) {
      case 0: return Math.sin(a);
      case 1: return Math.tanh(4 * Math.sin(a));
      case 2: return 2 * (a / tau - Math.floor(a / tau + 0.5));
      case 3: return (2 / Math.PI) * Math.asin(Math.sin(a));
      case 4: return (Math.sin(a) + 0.5 * Math.sin(2.3 * a + 1) + 0.3 * Math.sin(5.1 * a)) / 1.4;
      default: return Math.pow(Math.max(0, Math.sin(a)), 10) * 2 - 0.6;
    }
  }
  function scope(t, kind) {
    var w = pvCanvas.width, h = pvCanvas.height, c = pvCtx;
    c.clearRect(0, 0, w, h);
    c.shadowBlur = 0;
    c.fillStyle = "rgba(255,255,255,.08)";
    for (var x = 14; x < w; x += 30) for (var y = 14; y < h; y += 30) c.fillRect(x, y, 2, 2);
    var grad = c.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#4fd1c5"); grad.addColorStop(1, "#4c8dff");
    for (var k = 0; k < 3; k++) {
      c.beginPath();
      for (var px = 0; px <= w; px += 3) {
        var a = (px / w) * Math.PI * 4 + t * (1 + k * 0.25) + k * 0.9;
        var py = h / 2 + wave(kind, a) * h * (0.3 - k * 0.07);
        if (px === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.strokeStyle = grad; c.globalAlpha = 1 - k * 0.3; c.lineWidth = 4 - k;
      c.shadowColor = "#4fd1c5"; c.shadowBlur = 16;
      c.stroke();
    }
    c.globalAlpha = 1;
  }
  var pvOn = false, pvKind = 0, pvX = 0, pvY = 0, pvTX = 0, pvTY = 0, pvStart = performance.now();
  function pvLoop(now) {
    if (!pvOn && !pv.classList.contains("show")) return;
    pvX += (pvTX - pvX) * 0.18; pvY += (pvTY - pvY) * 0.18;
    var w = pv.offsetWidth, h = pv.offsetHeight;
    var x = clamp(pvX + 28, 12, innerWidth - w - 12), y = clamp(pvY - h / 2, 12, innerHeight - h - 12);
    pv.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    scope((now - pvStart) / 700, pvKind);
    requestAnimationFrame(pvLoop);
  }
  if (fine) {
    plist.addEventListener("pointerover", function (e) {
      var row = e.target.closest(".prow");
      if (!row) return;
      pvTX = e.clientX; pvTY = e.clientY;
      var i = +row.dataset.i, pr = p.projects[i];
      Array.prototype.forEach.call(plist.children, function (r) { r.classList.toggle("on", r === row); });
      plist.classList.add("hovering");
      pvKind = i;
      pvTitle.textContent = pr.name;
      pvChips.textContent = "";
      pr.tech.slice(0, 4).forEach(function (t) { pvChips.appendChild(el("span", "chip", t)); });
      if (!pvOn) { pvOn = true; pvX = pvTX; pvY = pvTY; pv.classList.add("show"); requestAnimationFrame(pvLoop); }
    });
    plist.addEventListener("pointermove", function (e) { pvTX = e.clientX; pvTY = e.clientY; });
    plist.addEventListener("pointerleave", function () {
      pvOn = false; pv.classList.remove("show"); plist.classList.remove("hovering");
      Array.prototype.forEach.call(plist.children, function (r) { r.classList.remove("on"); });
    });
  }

  if (!(p.experience || []).length) { $("experience").remove(); }
  else p.experience.forEach(function (x, i) {
    var e = el("div", "entry glass reveal");
    e.style.setProperty("--d", i * 0.08 + "s");
    e.appendChild(el("span", "node"));
    e.appendChild(el("h3", "", x.role));
    e.appendChild(el("div", "meta", [x.org, x.dates].filter(Boolean).join("  ·  ")));
    e.appendChild(el("p", "", x.details));
    $("timeline").appendChild(e);
  });

  if (!(p.certifications || []).length) { $("certifications").remove(); }
  else p.certifications.forEach(function (c, i) {
    var parts = c.split(" · "), row = el("div", "cert-row glass reveal");
    row.style.setProperty("--d", i * 0.08 + "s");
    row.appendChild(el("h3", "", parts[0]));
    if (parts[1]) row.appendChild(el("span", "", parts[1]));
    $("cert-list").appendChild(row);
  });

  var L = p.links, box = $("contact-links"), mail = $("mail-big");
  if (L.email) { mail.href = "mailto:" + L.email; mail.textContent = L.email; mail.insertAdjacentHTML("beforeend", ARROW); }
  else mail.remove();
  if (L.phoneB64) {
    var phoneBtn = el("button", "btn ghost");
    phoneBtn.type = "button";
    phoneBtn.appendChild(el("span", "", "Show phone number"));
    phoneBtn.addEventListener("click", function () {
      var num = atob(L.phoneB64);
      var callLink = link("tel:" + num.replace(/[^+\d]/g, ""), "Call " + num, "btn ghost");
      box.replaceChild(callLink, phoneBtn);
      callLink.focus();
    });
    box.appendChild(phoneBtn);
  }
  if (L.github) box.appendChild(link(L.github, "GitHub", "btn ghost"));
  if (L.linkedin) box.appendChild(link(L.linkedin, "LinkedIn", "btn ghost"));
  if (L.resume) box.appendChild(link(L.resume, "Resume", "btn ghost"));
  if (!box.children.length) box.remove();
  if (!L.email && !box.parentNode) { $("contact").remove(); $("cta-contact").remove(); }

  var navLinks = Array.prototype.slice.call($("links").querySelectorAll("a")).filter(function (a) {
    if (!document.querySelector(a.getAttribute("href"))) { a.remove(); return false; }
    return true;
  });

  /* ---------- Bengaluru clock + hint ---------- */
  var clockFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
  function tickClock() { $("coords").textContent = [p.coords || p.location, clockFmt.format(new Date()) + " IST"].filter(Boolean).join(" · "); }
  tickClock(); setInterval(tickClock, 20000);
  $("hint").textContent = fine ? "Scroll · press / for terminal" : "Scroll";

  /* ---------- Scroll rail ---------- */
  var railEl = $("rail"), railFill = $("rail-fill"), railDot = $("rail-dot"), railNodes = [];
  [{ id: "top", label: "Top" }].concat(navLinks.map(function (a) { return { id: a.getAttribute("href").slice(1), label: a.textContent }; })).forEach(function (s) {
    var n = el("button", "rail-node");
    n.type = "button"; n.tabIndex = -1;
    n.appendChild(el("span", "", s.label));
    n.addEventListener("click", function () { var t = document.getElementById(s.id); if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
    railEl.appendChild(n);
    railNodes.push({ el: n, id: s.id, f: 0 });
  });
  function railUpdate(f) {
    railFill.style.height = f * 100 + "%";
    railDot.style.top = f * 100 + "%";
    railNodes.forEach(function (n) { n.el.classList.toggle("passed", f >= n.f - 0.002); });
  }
  function layoutRail() {
    var max = document.documentElement.scrollHeight - innerHeight;
    railNodes.forEach(function (n) {
      var t = document.getElementById(n.id);
      var y = n.id === "top" || !t ? 0 : t.getBoundingClientRect().top + scrollY - 96;
      n.f = max > 0 ? clamp(y / max, 0, 1) : 0;
      n.el.style.top = n.f * 100 + "%";
    });
    railUpdate(max > 0 ? scrollY / max : 0);
  }
  addEventListener("load", layoutRail);
  addEventListener("resize", layoutRail);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutRail);
  setTimeout(layoutRail, 1500);

  /* ---------- Confetti ---------- */
  function confetti() {
    if (reduce) return;
    var cv = $("confetti"), c = cv.getContext("2d");
    cv.width = innerWidth; cv.height = innerHeight;
    var cols = ["#4fd1c5", "#4c8dff", "#7dd3fc", "#ffffff", "#a8b5c8"], ps = [];
    for (var i = 0; i < 170; i++) ps.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 240, y: innerHeight * 0.62,
      vx: (Math.random() - 0.5) * 15, vy: -Math.random() * 17 - 4, s: 5 + Math.random() * 7,
      c: cols[i % cols.length], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 1
    });
    (function f() {
      c.clearRect(0, 0, cv.width, cv.height);
      var alive = false;
      ps.forEach(function (q) {
        q.vy += 0.36; q.vx *= 0.99; q.x += q.vx; q.y += q.vy; q.r += q.vr; q.life -= 0.007;
        if (q.life > 0 && q.y < innerHeight + 20) {
          alive = true;
          c.globalAlpha = q.life; c.save(); c.translate(q.x, q.y); c.rotate(q.r);
          c.fillStyle = q.c; c.fillRect(-q.s / 2, -q.s / 2, q.s, q.s * 0.6); c.restore();
        }
      });
      if (alive) requestAnimationFrame(f); else c.clearRect(0, 0, cv.width, cv.height);
    })();
  }

  /* ---------- Terminal ---------- */
  var termWrap = $("term"), termOut = $("term-out"), termForm = $("term-form"), termIn = $("term-input"), termBtn = $("term-btn");
  var hist = [], hpos = 0, token = 0, lastFocus = null;
  var secIds = navLinks.map(function (a) { return a.getAttribute("href").slice(1); });
  function tl(text, cls) {
    var d = el("div", "tl" + (cls ? " " + cls : ""));
    d.textContent = text;
    termOut.appendChild(d);
    termOut.scrollTop = termOut.scrollHeight;
    return d;
  }
  function show(rows) { rows.forEach(function (r) { tl(r[0], r[1]); }); }
  function play(rows, gap) {
    var mine = ++token, i = 0;
    (function next() {
      if (mine !== token || i >= rows.length) return;
      var r = rows[i++];
      tl(r[0], r[1]);
      if (r[2]) r[2]();
      setTimeout(next, gap);
    })();
  }
  var first = p.name.split(/\s+/)[0].toLowerCase();
  var C = {
    help: function () {
      show([["Commands", "hl"],
        ["  about          who I am"], ["  whoami         one-line intro"], ["  skills         what I work with"],
        ["  projects       list my projects  (then: project 3)"], ["  experience     internships and education"],
        ["  contact        how to reach me"], ["  reveal phone   show my phone number"], ["  goto <section> jump there (" + secIds.join(", ") + ")"],
        ["  ls             list the site like files"], ["  ping esp32     check on my favourite board"],
        ["  mqtt sub       stream simulated sensor topics"], ["  neofetch       system info"],
        ["  sudo hire " + first + "   you know you want to", "ok"], ["  clear | exit"]]);
    },
    whoami: function () { show([[p.name + " · " + p.title + " · " + p.location, "hl"]]); },
    about: function () { p.bio.forEach(function (b) { tl(b); tl(""); }); },
    skills: function () { Object.keys(p.skills).forEach(function (g) { tl(g + ": ", "hl").appendChild(document.createTextNode(p.skills[g].join(", "))); }); },
    projects: function () {
      p.projects.forEach(function (pr, i) { tl("[" + (i + 1) + "] " + pr.name); });
      tl("type 'project <n>' for details", "dim");
    },
    project: function (a) {
      var pr = p.projects[parseInt(a[0], 10) - 1];
      if (!pr) return tl("usage: project <1-" + p.projects.length + ">", "err");
      show([[pr.name, "hl"], [pr.description], ["stack: " + pr.tech.join(", "), "dim"]]);
      if (pr.github) tl("code: " + pr.github, "dim");
      if (pr.live) tl("live: " + pr.live, "dim");
    },
    experience: function () {
      (p.experience || []).forEach(function (x) { tl(x.role, "hl"); tl("  " + [x.org, x.dates].filter(Boolean).join(" · "), "dim"); });
    },
    contact: function () {
      var L = p.links;
      if (L.email) tl("email     " + L.email, "hl");
      if (L.phoneB64) { var pn = atob(L.phoneB64); tl("phone     " + pn.slice(0, 3) + " ***** ***" + pn.slice(-2) + "  (type 'reveal phone')", "hl"); }
      if (L.github) tl("github    " + L.github);
      if (L.linkedin) tl("linkedin  " + L.linkedin);
      if (!L.email && !L.github && !L.linkedin) tl("no public links yet", "dim");
    },
    goto: function (a) {
      var id = (a[0] || "").toLowerCase();
      if (id === "journey") id = "experience";
      if (id === "certs") id = "certifications";
      if (secIds.indexOf(id) < 0) return tl("usage: goto <" + secIds.join("|") + ">", "err");
      tl("navigating to #" + id + " ...", "ok");
      setTimeout(function () { closeTerm(); var t = document.getElementById(id); if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }, 350);
    },
    ls: function () { tl(["top/"].concat(secIds.map(function (s) { return s + "/"; })).join("  ")); },
    echo: function (a) { tl(a.join(" ")); },
    ping: function (a) {
      var host = (a[0] || "esp32").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 20) || "esp32";
      var rows = [["PING " + host + ".local (simulated)", "dim"]];
      for (var i = 1; i <= 4; i++) rows.push(["64 bytes from " + host + ".local: icmp_seq=" + i + " ttl=64 time=" + (10 + Math.random() * 30).toFixed(1) + " ms"]);
      rows.push(["4 packets transmitted, 4 received, 0% packet loss", "ok"]);
      play(rows, 420);
    },
    mqtt: function () {
      var feeds = [
        ["sensors/temperature", function () { return (26 + Math.random() * 3).toFixed(1) + " C"; }],
        ["sensors/humidity", function () { return Math.round(55 + Math.random() * 8) + " %"; }],
        ["sensors/gas", function () { return Math.round(170 + Math.random() * 25) + " ppm"; }],
        ["sensors/soil", function () { return Math.round(38 + Math.random() * 8) + " %"; }],
        ["irrigation/relay", function () { return Math.random() > 0.6 ? "on" : "off"; }]
      ];
      var rows = [["connecting to broker.local:1883 (simulated)", "dim"], ["subscribed: sensors/#", "ok"]];
      for (var i = 0; i < 9; i++) { var f = feeds[Math.floor(Math.random() * feeds.length)]; rows.push([f[0] + "  " + f[1](), "hl"]); }
      rows.push(["^C", "dim"]);
      play(rows, 380);
    },
    neofetch: function () {
      show([[first + "@portfolio", "hl"], ["------------------"],
        ["Role      " + p.title], ["Based     " + p.location], ["Boards    ESP32, ESP8266, Arduino, Raspberry Pi"],
        ["Protocols MQTT, CoAP, HTTP"], ["Cloud     AWS IoT Core, S3, CloudWatch"], ["Status    " + (p.availability || "available"), "ok"]]);
    },
    sudo: function (a) {
      if ((a[0] || "").toLowerCase() === "hire" && (a[1] || "").toLowerCase() === first) {
        play([["[sudo] password for recruiter: ********", "dim"], ["verifying credentials ...", "dim"],
          ["access granted", "ok", confetti], ["Offer letter to: " + (p.links.email || "coming soon"), "hl"]], 650);
      } else tl("recruiter is not in the sudoers file. This incident will be reported.", "err");
    },
    reveal: function (a) {
      if ((a[0] || "").toLowerCase() === "phone" && p.links.phoneB64) tl("phone     " + atob(p.links.phoneB64), "ok");
      else tl("usage: reveal phone", "err");
    },
    clear: function () { termOut.textContent = ""; },
    exit: function () { closeTerm(); }
  };
  C.quit = C.exit;
  function run(raw) {
    var d = el("div", "tl cmd");
    d.appendChild(el("b", "", "$ "));
    d.appendChild(document.createTextNode(raw));
    termOut.appendChild(d);
    var line = raw.trim();
    if (!line) return;
    hist.push(line); hpos = hist.length;
    var parts = line.split(/\s+/), name = parts[0].toLowerCase();
    if (Object.prototype.hasOwnProperty.call(C, name)) C[name](parts.slice(1));
    else tl("command not found: " + name + "  (try 'help')", "err");
    termOut.scrollTop = termOut.scrollHeight;
  }
  function openTerm() {
    if (!termWrap.hidden) return;
    lastFocus = document.activeElement;
    termWrap.hidden = false;
    document.body.style.overflow = "hidden";
    if (!termOut.children.length) show([["Welcome to " + p.name + "'s portfolio terminal.", "hl"], ["Type 'help' for commands. Try 'projects', 'mqtt sub' or 'sudo hire " + first + "'.", "dim"]]);
    setTimeout(function () { termIn.focus(); }, 30);
  }
  function closeTerm() {
    token++;
    termWrap.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  termForm.addEventListener("submit", function (e) { e.preventDefault(); var v = termIn.value; termIn.value = ""; run(v); });
  termIn.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp") { e.preventDefault(); if (hpos > 0) termIn.value = hist[--hpos]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); hpos = Math.min(hist.length, hpos + 1); termIn.value = hist[hpos] || ""; }
    else if (e.key === "Tab") {
      e.preventDefault();
      var v = termIn.value.toLowerCase();
      var m = Object.keys(C).filter(function (k) { return v && k.indexOf(v) === 0; });
      if (m.length === 1) termIn.value = m[0] + " ";
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") { token++; tl("^C", "dim"); termIn.value = ""; }
    else if (e.ctrlKey && e.key.toLowerCase() === "l") { e.preventDefault(); termOut.textContent = ""; }
  });
  termBtn.addEventListener("click", openTerm);
  $("term-x").addEventListener("click", closeTerm);
  termWrap.addEventListener("pointerdown", function (e) { if (e.target === termWrap) closeTerm(); });
  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if (e.key === "Escape" && !termWrap.hidden) { closeTerm(); return; }
    if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey)) {
      e.preventDefault(); openTerm();
    }
  });

  /* ---------- WebGL smoke background ---------- */
  var glScroll = 0, mouseX = innerWidth / 2, mouseY = innerHeight / 2;
  (function initGL() {
    var cv = $("gl"), gl;
    try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }); } catch (e) {}
    if (!gl) return;
    var vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    var fs = [
      "precision mediump float;",
      "uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;uniform float u_scroll;uniform vec3 u_click;",
      "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
      "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
      "return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}",
      "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.02;a*=.5;}return v;}",
      "void main(){",
      "vec2 uv=gl_FragCoord.xy/u_res;",
      "vec2 p=(gl_FragCoord.xy-.5*u_res)/u_res.y;",
      "vec2 m=(u_mouse-.5*u_res)/u_res.y;",
      "p.y+=u_scroll*.00035;",
      "float t=u_time*.05;",
      "float age=u_time-u_click.z;float w=0.;vec2 cc=(u_click.xy-.5*u_res)/u_res.y;",
      "if(age>0.&&age<3.){float dc=length(p-cc);float ring=age*.6;w=exp(-pow((dc-ring)*7.,2.))*exp(-age*1.2);p+=normalize(p-cc+vec2(1e-4))*w*.07;}",
      "vec2 d=p-m;float md=length(d);",
      "p+=d/(md+.25)*.06*exp(-md*2.5);",
      "vec2 q=vec2(fbm(p*1.5+t),fbm(p*1.5+vec2(5.2,1.3)-t));",
      "vec2 r=vec2(fbm(p*1.5+3.*q+vec2(1.7,9.2)+t*1.4),fbm(p*1.5+3.*q+vec2(8.3,2.8)-t*1.1));",
      "float f=fbm(p*1.3+3.*r);",
      "vec3 col=mix(vec3(.012,.02,.04),vec3(.04,.30,.32),clamp(f*f*3.2,0.,1.));",
      "col=mix(col,vec3(.09,.20,.52),clamp(length(q)*.55,0.,1.)*.6);",
      "col=mix(col,vec3(.60,.66,.76),clamp(r.x*r.x*.55,0.,1.)*.10);",
      "col+=vec3(.04,.32,.36)*exp(-md*md*9.)*.35;",
      "col*=smoothstep(1.5,.15,length(uv-.5)*1.7);",
      "col+=vec3(.12,.55,.6)*w*.5;",
      "gl_FragColor=vec4(col*.85,1.);}"
    ].join("\n");
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    var pr = gl.createProgram();
    gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ["u_res", "u_time", "u_mouse", "u_scroll", "u_click"].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    var scale = 0.4, sx = mouseX, sy = mouseY, last = 0, clickX = 0, clickY = 0, clickT = -100;
    function resize() {
      cv.width = Math.max(2, Math.floor(innerWidth * scale));
      cv.height = Math.max(2, Math.floor(innerHeight * scale));
      gl.viewport(0, 0, cv.width, cv.height);
    }
    function draw(now) {
      sx += (mouseX - sx) * 0.06; sy += (mouseY - sy) * 0.06;
      gl.uniform2f(U.u_res, cv.width, cv.height);
      gl.uniform1f(U.u_time, now / 1000);
      gl.uniform2f(U.u_mouse, sx * scale, (innerHeight - sy) * scale);
      gl.uniform1f(U.u_scroll, glScroll);
      gl.uniform3f(U.u_click, clickX * scale, (innerHeight - clickY) * scale, clickT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function frame(now) {
      requestAnimationFrame(frame);
      if (document.hidden || now - last < 32) return;
      last = now;
      draw(now);
    }
    resize();
    addEventListener("resize", function () { resize(); draw(performance.now()); });
    document.body.classList.add("gl");
    if (!reduce) addEventListener("pointerdown", function (e) { clickX = e.clientX; clickY = e.clientY; clickT = performance.now() / 1000; });
    draw(performance.now());
    if (!reduce) requestAnimationFrame(frame);
  })();

  /* ---------- Pointer effects ---------- */
  addEventListener("pointermove", function (e) { mouseX = e.clientX; mouseY = e.clientY; });
  document.addEventListener("pointermove", function (e) {
    var t = e.target.closest ? e.target : null;
    if (!t) return;
    var g = t.closest(".glass");
    if (g) {
      var r = g.getBoundingClientRect();
      g.style.setProperty("--mx", e.clientX - r.left + "px");
      g.style.setProperty("--my", e.clientY - r.top + "px");
    }
    var b = t.closest(".btn");
    if (b && fine) {
      var br = b.getBoundingClientRect();
      b.style.setProperty("--tx", (e.clientX - br.left - br.width / 2) * 0.16 + "px");
      b.style.setProperty("--ty", (e.clientY - br.top - br.height / 2) * 0.26 + "px");
    }
  });
  document.addEventListener("pointerover", function (e) {
    var b = e.target.closest ? e.target.closest(".btn") : null;
    if (!b) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty("--x", e.clientX - r.left + "px");
    b.style.setProperty("--y", e.clientY - r.top + "px");
  });
  document.addEventListener("pointerout", function (e) {
    var b = e.target.closest ? e.target.closest(".btn") : null;
    if (!b || b.contains(e.relatedTarget)) return;
    var r = b.getBoundingClientRect();
    b.style.setProperty("--x", e.clientX - r.left + "px");
    b.style.setProperty("--y", e.clientY - r.top + "px");
    b.style.setProperty("--tx", "0px");
    b.style.setProperty("--ty", "0px");
  });

  if (fine && !reduce) {
    var glow = document.querySelector(".cursor-glow"), ring = $("cursor");
    var gx = mouseX, gy = mouseY, rx = mouseX, ry = mouseY;
    addEventListener("pointermove", function (e) {
      glow.style.opacity = 1; ring.classList.add("on");
      var hot = e.target.closest && e.target.closest("a, button, input, .prow, .chip");
      ring.classList.toggle("big", !!hot);
    });
    document.addEventListener("pointerleave", function () { glow.style.opacity = 0; ring.classList.remove("on"); });
    (function loop() {
      gx += (mouseX - gx) * 0.12; gy += (mouseY - gy) * 0.12;
      rx += (mouseX - rx) * 0.22; ry += (mouseY - ry) * 0.22;
      glow.style.transform = "translate3d(" + (gx - 210) + "px," + (gy - 210) + "px,0)";
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Scroll: progress bar, lit statement ---------- */
  var ticking = false;
  function update() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    $("progress").style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    glScroll = scrollY;
    railUpdate(max > 0 ? scrollY / max : 0);
    var r = statement.getBoundingClientRect();
    var prog = reduce ? 1 : clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0, 1);
    var lit = Math.ceil(prog * swords.length * 1.1);
    for (var i = 0; i < swords.length; i++) swords[i].classList.toggle("lit", i < lit);
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();

  function countUp(node) {
    var m = /^(\d+)(.*)$/.exec(node.textContent);
    if (!m || reduce) return;
    var to = parseInt(m[1], 10), suffix = m[2], start = null;
    function step(ts) {
      if (start === null) start = ts;
      var k = Math.min((ts - start) / 1300, 1);
      node.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    node.textContent = "0" + suffix;
    requestAnimationFrame(step);
  }
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(reveals, function (r) { r.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        t.classList.add("in");
        io.unobserve(t);
        if (t.classList.contains("stat")) countUp(t.firstChild);
        setTimeout(function () { t.classList.remove("reveal", "in"); t.style.removeProperty("--d"); }, 1800);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    Array.prototype.forEach.call(reveals, function (r) { io.observe(r); });
  }

  /* ---------- Nav indicator ---------- */
  var linksBox = $("links"), ind = $("indicator"), current = null;
  function moveTo(a) {
    current = a;
    navLinks.forEach(function (l) { l.classList.toggle("active", l === a); });
    if (!a) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1;
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = "translateX(" + a.offsetLeft + "px)";
    if (linksBox.scrollWidth > linksBox.clientWidth) linksBox.scrollTo({ left: a.offsetLeft - linksBox.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
  }
  if ("IntersectionObserver" in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) moveTo(byId[en.target.id] || null); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Array.prototype.forEach.call(document.querySelectorAll("main > section"), function (s) { spy.observe(s); });
  }
  addEventListener("resize", function () { moveTo(current); });

  /* ---------- Smart irrigation demo ---------- */
  var soilIn = $("soil"), thIn = $("th"), simBtn = $("sim"), simTimer = null;
  function renderLab() {
    var s = +soilIn.value, t = +thIn.value, on = s < t;
    $("tank").style.setProperty("--lvl", s);
    $("tank-val").textContent = Math.round(s) + "%";
    $("o-soil").textContent = Math.round(s) + "%";
    $("o-th").textContent = t + "%";
    $("relay").classList.toggle("on", on);
    $("relay-text").textContent = on ? "Relay on: pump is watering" : "Relay off: soil is moist enough";
    $("c-soil").textContent = Math.round(s);
    $("c-irr").textContent = on ? "on" : "off";
  }
  soilIn.addEventListener("input", renderLab);
  thIn.addEventListener("input", renderLab);
  simBtn.addEventListener("click", function () {
    if (simTimer) { clearInterval(simTimer); simTimer = null; simBtn.firstChild.textContent = "Run simulation"; return; }
    simBtn.firstChild.textContent = "Stop simulation";
    simTimer = setInterval(function () {
      var s = +soilIn.value, on = s < +thIn.value;
      soilIn.value = Math.max(0, Math.min(100, s + (on ? 1.8 : -0.9)));
      renderLab();
    }, 350);
  });
  renderLab();

  /* ---------- Simulated telemetry ---------- */
  var line = $("spark-line"), area = $("spark-area"), dot = $("spark-dot");
  var N = 40, vals = [], t = 27.4, hum = 58, gas = 182, soil = 41;
  for (var i = 0; i < N; i++) { t += (Math.random() - 0.5) * 0.6 + (27.4 - t) * 0.08; vals.push(t); }
  function draw() {
    var min = Math.min.apply(null, vals) - 0.3, max = Math.max.apply(null, vals) + 0.3;
    var pts = vals.map(function (v, k) { return [k / (N - 1) * 300, 80 - (v - min) / (max - min) * 66]; });
    var d = "M" + pts[0][0] + " " + pts[0][1];
    for (var k = 1; k < pts.length; k++) {
      var xc = (pts[k - 1][0] + pts[k][0]) / 2, yc = (pts[k - 1][1] + pts[k][1]) / 2;
      d += " Q" + pts[k - 1][0] + " " + pts[k - 1][1] + " " + xc + " " + yc;
    }
    var last = pts[pts.length - 1];
    d += " L" + last[0] + " " + last[1];
    line.setAttribute("d", d);
    area.setAttribute("d", d + " L300 90 L0 90 Z");
    dot.setAttribute("cx", last[0]);
    dot.setAttribute("cy", last[1]);
  }
  function tick() {
    t += (Math.random() - 0.5) * 0.7 + (27.4 - t) * 0.1;
    hum += (Math.random() - 0.5) * 1.2 + (58 - hum) * 0.1;
    gas += (Math.random() - 0.5) * 6 + (182 - gas) * 0.1;
    soil += (Math.random() - 0.5) * 1 + (41 - soil) * 0.1;
    vals.push(t); vals.shift();
    $("t-temp").textContent = t.toFixed(1);
    $("t-hum").textContent = Math.round(hum) + "%";
    $("t-gas").textContent = Math.round(gas) + " ppm";
    $("t-soil").textContent = Math.round(soil) + "%";
    draw();
  }
  draw();
  if (!reduce) setInterval(tick, 1000);
})();
