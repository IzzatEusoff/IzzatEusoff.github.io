(function () {
  "use strict";
  var C = window.CONTENT;
  if (!C) return;
  var doc = document;
  doc.documentElement.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function isPh(v) { return typeof v !== "string" || v.indexOf("[[") !== -1 || v.trim() === "" || v === "none"; }
  function isUrl(v) { return !isPh(v) && /^https?:\/\//i.test(v); }
  function el(tag, attrs, kids) {
    var n = doc.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = isPh(attrs[k]) ? "" : attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      if (!c) return;
      if (typeof c === "string") { if (!isPh(c)) n.appendChild(doc.createTextNode(c)); }
      else n.appendChild(c);
    });
    return n;
  }
  function ext(href, cls, kids, label) {
    return el("a", { href: href, class: cls, target: "_blank", rel: "noopener noreferrer", "aria-label": label }, kids);
  }
  var NS = "http://www.w3.org/2000/svg";
  function icon(paths, size) {
    var s = doc.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("width", size || 18); s.setAttribute("height", size || 18);
    s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor"); s.setAttribute("stroke-width", "2");
    s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round"); s.setAttribute("aria-hidden", "true");
    paths.forEach(function (d) { var p = doc.createElementNS(NS, "path"); p.setAttribute("d", d); s.appendChild(p); });
    return s;
  }
  var ICONS = {
    linkedin: ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z", "M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"],
    github: ["M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.2-.4 6.5-1.6 6.5-7a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C6.4 1.6 5.2 2 5.2 2a5 5 0 0 0-.1 3.7A5.4 5.4 0 0 0 3.6 9.5c0 5.4 3.3 6.6 6.5 7a3.4 3.4 0 0 0-1 2.6V22"],
    check: ["M20 6L9 17l-5-5"],
    ext: ["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", "M15 3h6v6", "M10 14L21 3"],
    dl: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]
  };
  function head(num, label, id, title) {
    return [
      el("span", { class: "sec-label mono", text: num + " / " + label }),
      el("h2", { class: "sec-title", id: id, text: title })
    ];
  }
  function chips(list) {
    return el("ul", { class: "chips", "aria-label": "Tags" }, list.filter(function (t) { return !isPh(t); }).map(function (t) { return el("li", { class: "chip", text: t }); }));
  }
  function mount(id, kids, cls) {
    var s = doc.getElementById(id);
    var w = el("div", { class: "wrap reveal" + (cls ? " " + cls : "") }, kids);
    s.appendChild(w);
    return w;
  }

  /* ---------- hero ---------- */
  var S = C.site;
  (function () {
    var hasPhoto = !isPh(S.photo);
    var left = el("div", { class: "hero-text" }, []);
    left.appendChild(el("div", { class: "badge" }, [el("span", { class: "dot", "aria-hidden": "true" }), S.status]));
    left.appendChild(el("h1", { id: "heroName", text: S.name }));
    var typed = el("p", { class: "typed", "aria-label": S.title });
    var tspan = el("span", { "aria-hidden": "true" });
    typed.appendChild(tspan);
    typed.appendChild(el("span", { class: "caret", "aria-hidden": "true" }));
    left.appendChild(typed);
    left.appendChild(el("p", { class: "lead", text: S.oneLiner }));
    left.appendChild(el("p", { class: "loc", text: S.location + (S.openToRelocate ? " | Open to relocate" : "") }));
    left.appendChild(el("div", { class: "btns" }, [
      el("a", { class: "btn primary", href: "#featured", text: "View Featured Project" }),
      el("a", { class: "btn", href: "#contact", text: "Request Resume" }),
      el("a", { class: "btn", href: "#contact", text: "Contact Me" })
    ]));
    left.appendChild(socials());

    var grid = el("div", { class: "hero-grid" + (hasPhoto ? " has-photo" : "") });
    if (hasPhoto) {
      var photoWrap = el("div", { class: "photo-wrap" });
      var img = el("img", {
        class: "photo",
        src: S.photo,
        alt: S.photoAlt || "Portrait of Mohamad Izzat Anis",
        width: 280,
        height: 280,
        loading: "eager",
        decoding: "async"
      });
      var failed = false;
      function handlePhotoError() {
        failed = true;
        if (photoWrap && photoWrap.parentNode) {
          photoWrap.parentNode.removeChild(photoWrap);
        }
        grid.classList.remove("has-photo");
      }
      img.addEventListener("error", handlePhotoError);
      if (img.complete && img.naturalWidth === 0) {
        handlePhotoError();
      }
      if (!failed) {
        photoWrap.appendChild(img);
        grid.appendChild(photoWrap);
      }
    }
    grid.appendChild(left);
    doc.getElementById("heroMount").appendChild(grid);

    if (reduce) { tspan.textContent = S.title; }
    else {
      var i = 0;
      (function tick() { tspan.textContent = S.title.slice(0, ++i); if (i < S.title.length) setTimeout(tick, 38); })();
    }
  })();

  function socials() {
    var box = el("div", { class: "socials" });
    if (isUrl(S.linkedin)) box.appendChild(ext(S.linkedin, "", [icon(ICONS.linkedin, 20)], "LinkedIn (opens in new tab)"));
    if (isUrl(S.github)) box.appendChild(ext(S.github, "", [icon(ICONS.github, 20)], "GitHub (opens in new tab)"));
    return box;
  }

  /* ---------- about ---------- */
  mount("about", head("01", "ABOUT", "about-h", "About").concat([
    el("p", { class: "about-text", text: C.about.text }),
    el("div", { class: "facts" }, C.about.facts.map(function (f) {
      return el("div", { class: "card fact" }, [el("span", { class: "big", text: f.big }), el("span", { class: "small", text: f.small })]);
    }))
  ]));

  /* ---------- featured ---------- */
  (function () {
    var F = C.featured;
    var kids = head("02", "FEATURED PROJECT", "featured-h", F.title);
    kids.push(el("p", { class: "sub", text: F.subtitle }));
    kids.push(el("div", { class: "case-grid" }, [
      ["Overview", F.overview], ["The problem", F.problem], ["My approach", F.approach]
    ].map(function (x) { return el("div", { class: "card" }, [el("h3", { text: x[0] }), el("p", { text: x[1] })]); })));

    // pipeline
    var cap = el("p", { class: "pipe-cap", id: "pipeCap", "aria-live": "polite" });
    var btns = [];
    function setStage(i) {
      btns.forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
      cap.textContent = F.pipeline[i].name + ": " + F.pipeline[i].caption;
    }
    var ol = el("ol", { class: "pipe", "aria-label": "SOP pipeline stages" }, F.pipeline.map(function (s, i) {
      var b = el("button", { type: "button", "aria-pressed": "false" }, [s.name]);
      b.addEventListener("click", function () { setStage(i); });
      b.addEventListener("mouseenter", function () { setStage(i); });
      b.addEventListener("focus", function () { setStage(i); });
      btns.push(b);
      return el("li", {}, [b]);
    }));
    setStage(0);
    kids.push(el("div", { class: "block" }, [el("h3", { text: "SOP pipeline" }), ol, cap]));

    // qualitative ranking chart (no numbers)
    var chart = el("div", { class: "chart rank-chart", role: "img", "aria-label": F.resultsTitle + ". A text summary follows." });
    var srList = el("dl", { class: "sr-only" });
    var levelBars = { "High": 3, "Moderate": 2, "Low": 1, "None observed": 0 };
    (F.rankings || []).forEach(function (r) {
      var segs = [];
      var count = levelBars[r.level] || 0;
      for (var i = 0; i < 3; i++) {
        segs.push(el("span", { class: "seg" + (i < count ? " on" : ""), "aria-hidden": "true" }));
      }
      chart.appendChild(el("div", { class: "rank-row" }, [
        el("span", { class: "lab", text: r.level }),
        el("div", { class: "segs", "aria-hidden": "true" }, segs),
        el("div", { class: "chips" }, r.platforms.map(function (p) { return el("span", { class: "chip", text: p }); }))
      ]));
      srList.appendChild(el("dt", { text: r.level }));
      srList.appendChild(el("dd", { text: r.platforms.join(", ") }));
    });
    kids.push(el("div", { class: "block" }, [
      el("h3", { text: F.resultsTitle || "Platform responsiveness to takedown reports" }),
      el("div", { class: "stats" }, F.stats.map(function (s) {
        return el("div", { class: "card stat" }, [el("span", { class: "big", text: s.big }), s.small ? el("span", { class: "note", text: s.small }) : null]);
      })),
      el("div", { class: "card" }, [chart, srList, el("p", { class: "note", text: F.resultsCaption })])
    ]));

    kids.push(el("div", { class: "block" }, [el("h3", { text: "Key findings" }), el("ul", { class: "findings" }, F.findings.map(function (f) { return el("li", { text: f }); }))]));
    kids.push(el("div", { class: "block" }, [el("h3", { text: "Limitations and future work" }), el("p", { text: F.limitations })]));
    kids.push(el("div", { class: "block" }, [el("h3", { text: "Skills demonstrated" }), chips(F.skills)]));
    kids.push(el("p", { class: "note block", text: F.note }));
    mount("featured", kids);
  })();

  /* ---------- projects ---------- */
  mount("projects", head("03", "PROJECTS", "projects-h", "Projects").concat([
    el("div", { class: "grid2" }, C.projects.map(function (p) {
      var dl = el("dl");
      if (!isPh(p.problem)) { dl.appendChild(el("dt", { text: "Problem" })); dl.appendChild(el("dd", { text: p.problem })); }
      if (!isPh(p.built)) { dl.appendChild(el("dt", { text: "What I built" })); dl.appendChild(el("dd", { text: p.built })); }
      if (!isPh(p.designed)) { dl.appendChild(el("dt", { text: "What I designed" })); dl.appendChild(el("dd", { text: p.designed })); }
      if (!isPh(p.result)) { dl.appendChild(el("dt", { text: "Result" })); dl.appendChild(el("dd", { text: p.result })); }
      if (!isPh(p.outcome)) { dl.appendChild(el("dt", { text: "Result" })); dl.appendChild(el("dd", { text: p.outcome })); }
      if (!isPh(p.status)) { dl.appendChild(el("dt", { text: "Status" })); dl.appendChild(el("dd", { text: p.status })); }

      var foot = el("div", { class: "proj-foot" });
      if (p.tools && p.tools.length) foot.appendChild(chips(p.tools));
      if (!isPh(p.note)) foot.appendChild(el("p", { class: "note proj-note", text: p.note }));
      if (isUrl(p.link)) foot.appendChild(el("p", { class: "proj-link" }, [ext(p.link, "btn small", ["View project ", icon(ICONS.ext, 14)])]));

      return el("article", { class: "card proj" }, [
        el("h3", { text: p.title }),
        el("div", { class: "org" }, [
          p.org,
          p.sanitised ? el("span", { class: "tag", text: "Sanitised" }) : null,
          p.design ? el("span", { class: "tag", text: "Design" }) : null
        ]),
        dl,
        foot
      ]);
    }))
  ]));

  /* ---------- experience ---------- */
  mount("experience", head("04", "EXPERIENCE", "experience-h", "Experience").concat([
    el("ol", { class: "timeline" }, C.experience.map(function (x) {
      return el("li", {}, [
        el("h3", { text: x.role }), el("div", { class: "org", text: x.org }),
        el("span", { class: "when", text: x.dates }),
        el("ul", {}, x.bullets.filter(function (b) { return !isPh(b); }).map(function (b) { return el("li", { text: b }); }))
      ]);
    }))
  ]));

  /* ---------- skills ---------- */
  mount("skills", head("05", "SKILLS", "skills-h", "Skills").concat(C.skills.map(function (g) {
    return el("div", { class: "skill-group" }, [el("h3", { text: g.group }), chips(g.items)]);
  })));

  /* ---------- education ---------- */
  mount("education", head("06", "EDUCATION", "education-h", "Education").concat([
    el("div", { class: "grid2" }, C.education.map(function (e) {
      var kids = [el("h3", { text: e.degree }), el("p", { class: "note", text: e.school })];
      if (!isPh(e.dates)) kids.push(el("p", { class: "mono note", text: e.dates }));
      if (!isPh(e.detail)) kids.push(el("p", { text: e.detail }));
      return el("article", { class: "card" }, kids);
    }))
  ]));

  /* ---------- certifications ---------- */
  function initials(s) {
    if (isPh(s)) return "TR";
    var w = s.replace(/&/g, " ").split(/\s+/).filter(Boolean);
    return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
  }
  function hue(s) { var h = 0; for (var i = 0; i < (s || "").length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; }
  function renderCertCard(c) {
    var topKids = [];
    if (!isPh(c.issuer)) {
      var av = el("span", { class: "avatar", text: initials(c.issuer), "aria-hidden": "true" });
      av.style.setProperty("--hue", hue(c.issuer));
      topKids.push(av);
      topKids.push(el("div", {}, [
        el("div", { class: "issuer", text: c.issuer }),
        (c.date || c.year) ? el("div", { class: "yr", text: String(c.date || c.year) }) : null
      ]));
    } else if (c.date || c.year) {
      topKids.push(el("div", { class: "yr", text: String(c.date || c.year) }));
    }
    if (!isPh(c.type)) topKids.push(el("span", { class: "type-tag", text: c.type }));

    var foot = el("div", { class: "cert-foot" });
    if (isUrl(c.verifyUrl)) {
      foot.appendChild(el("span", { class: "verified-label" }, [icon(ICONS.check, 14), "Verifiable online"]));
      foot.appendChild(ext(c.verifyUrl, "btn small", ["Verify credential ", icon(ICONS.ext, 14)], "Verify credential: " + c.title + " (opens in new tab)"));
    } else if (c.onLinkedIn && isUrl(C.links.linkedinCerts)) {
      foot.appendChild(ext(C.links.linkedinCerts, "btn small", ["View on LinkedIn ", icon(ICONS.ext, 14)], "View on LinkedIn: " + c.title + " (opens in new tab)"));
    }

    return el("article", { class: "card cert" }, [
      topKids.length ? el("div", { class: "cert-top" }, topKids) : null,
      el("h3", { text: c.title }),
      !isPh(c.note) ? el("p", { class: "note", text: c.note }) : null,
      foot
    ]);
  }
  var certGroups = C.certificationGroups || [{ group: "", items: C.certifications || [] }];
  mount("certifications", head("07", "CERTIFICATIONS", "certifications-h", "Certifications").concat([
    el("p", { class: "note", text: C.certificationsIntro })
  ]).concat(certGroups.map(function (g) {
    return el("div", { class: "cert-group" }, [
      !isPh(g.group) ? el("h3", { class: "group-title", text: g.group }) : null,
      el("div", { class: "cert-grid" }, (g.items || []).map(renderCertCard))
    ]);
  })));

  /* ---------- awards ---------- */
  mount("awards", head("08", "AWARDS", "awards-h", "Awards and Recognition").concat([
    el("p", { class: "note", text: C.awardsIntro || "Awards are listed on my LinkedIn." }),
    el("div", { class: "award-grid" }, C.awards.map(function (a) {
      var metaKids = [];
      var d = a.date || a.year;
      if (!isPh(d)) metaKids.push(el("span", { class: "yr", text: d }));
      var proj = a.project || (a.text && a.text !== "" ? a.text : null);
      if (!isPh(proj)) metaKids.push(el("span", { class: "tag", text: "Project: " + proj }));

      var foot = el("div", { class: "award-foot" });
      if (a.onLinkedIn && isUrl(C.links.linkedinHonors)) {
        foot.appendChild(ext(C.links.linkedinHonors, "btn small", ["View on LinkedIn ", icon(ICONS.ext, 14)], "View on LinkedIn: " + a.title + " (opens in new tab)"));
      }

      return el("article", { class: "card award" }, [
        el("h3", { text: a.title }),
        metaKids.length ? el("div", { class: "award-meta" }, metaKids) : null,
        foot
      ]);
    }))
  ]));

  /* ---------- contact ---------- */
  (function () {
    var K = C.contact;
    var formEndpoint = C.site.formEndpoint || C.formEndpoint || "";
    var hasForm = !isPh(formEndpoint);

    var btnsList = [];
    if (isUrl(S.linkedin)) {
      btnsList.push(ext(S.linkedin, "btn primary", ["LinkedIn ", icon(ICONS.ext, 14)]));
    }

    var contactText = hasForm
      ? (K.text || "The quickest way to reach me is LinkedIn or the form below. My resume is available on request.")
      : "The quickest way to reach me is LinkedIn. My resume is available on request.";

    var leftKids = [
      el("p", { class: "about-text", text: contactText }),
      btnsList.length ? el("div", { class: "btns" }, btnsList) : null,
      el("p", { class: "note", text: K.references })
    ];
    var left = el("div", {}, leftKids);

    var contentKids = [left];

    if (hasForm) {
      function field(id, label, type, req, area) {
        var inp = area ? el("textarea", { id: id, name: id, rows: 5 }) : el("input", { id: id, name: id, type: type, autocomplete: id === "name" ? "name" : id === "email" ? "email" : "organization" });
        if (req) { inp.required = true; inp.setAttribute("aria-describedby", id + "-err"); }
        return el("div", {}, [el("label", { for: id, text: label + (req ? "" : " (optional)") }), inp, el("span", { class: "err", id: id + "-err", role: "alert" })]);
      }
      var status = el("div", { class: "status", role: "status", hidden: "" });
      var hp = el("div", { class: "hp", "aria-hidden": "true" }, [
        el("label", { for: "website", text: "Leave this field empty" }),
        el("input", { id: "website", name: "_gotcha", type: "text", tabindex: "-1", autocomplete: "off" })
      ]);
      var submit = el("button", { class: "btn primary", type: "submit", text: "Send message" });
      var form = el("form", { novalidate: "", "aria-label": "Contact form" }, [
        field("name", "Name", "text", true),
        field("email", "Email", "email", true),
        field("company", "Company", "text", false),
        field("message", "Message", "text", true, true),
        hp, submit, status
      ]);
      function say(msg, ok) { status.hidden = false; status.className = "status " + (ok ? "ok" : "bad"); status.textContent = msg; }
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var bad = false;
        ["name", "email", "message"].forEach(function (id) {
          var i = form.elements[id], v = i.value.trim(), m = "";
          if (!v) m = "This field is required.";
          else if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = "Enter a valid email address.";
          else if (id === "message" && v.length < 10) m = "Please write at least 10 characters.";
          doc.getElementById(id + "-err").textContent = m;
          i.setAttribute("aria-invalid", m ? "true" : "false");
          if (m && !bad) { i.focus(); bad = true; }
        });
        if (bad) return;
        if (form.elements._gotcha.value) { say("Thanks, message sent.", true); form.reset(); return; } // silently drop bots
        submit.disabled = true;
        fetch(formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            company: form.elements.company.value.trim(),
            message: form.elements.message.value.trim()
          })
        })
          .then(function (r) { if (!r.ok) throw new Error("bad"); say("Thanks! Your message was sent. I'll get back to you soon.", true); form.reset(); })
          .catch(function () { say("Sorry, the message could not be sent. Please reach out via LinkedIn.", false); })
          .then(function () { submit.disabled = false; });
      });

      contentKids.push(el("div", { class: "card" }, [form]));
    }

    mount("contact", head("09", "CONTACT", "contact-h", K.heading).concat([
      el("div", { class: hasForm ? "contact-grid" : "" }, contentKids)
    ]));
  })();

  doc.getElementById("footerText").textContent = "© " + S.year + " " + S.name + ". " + C.footer;

  /* ---------- nav, theme ---------- */
  var menuBtn = doc.getElementById("menuBtn"), links = doc.getElementById("navLinks");
  menuBtn.addEventListener("click", function () {
    var o = links.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(o));
  });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && links.classList.contains("open")) { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); } });

  var themeBtn = doc.getElementById("themeBtn");
  function applyTheme(t) {
    doc.documentElement.setAttribute("data-theme", t);
    themeBtn.setAttribute("aria-pressed", String(t === "light"));
    themeBtn.setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme");
  }
  try { var saved = localStorage.getItem("theme"); if (saved === "light" || saved === "dark") applyTheme(saved); } catch (e) {}
  themeBtn.addEventListener("click", function () {
    var t = doc.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(t); try { localStorage.setItem("theme", t); } catch (e) {}
  });

  /* ---------- scroll reveal + active link ---------- */
  var revs = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    revs.forEach(function (r) { io.observe(r); });
  } else {
    revs.forEach(function (r) { r.classList.add("in"); });
  }
  if ("IntersectionObserver" in window) {
    var anchors = {};
    links.querySelectorAll("a").forEach(function (a) { anchors[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var a = anchors[en.target.id]; if (!a) return;
        if (en.isIntersecting) {
          Object.keys(anchors).forEach(function (k) { anchors[k].classList.remove("active"); anchors[k].removeAttribute("aria-current"); });
          a.classList.add("active"); a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(anchors).forEach(function (k) { var s = doc.getElementById(k); if (s) spy.observe(s); });
  }
})();
