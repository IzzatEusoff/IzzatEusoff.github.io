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
    if (!s) return null;
    var existing = s.querySelector(".wrap");
    if (existing) {
      return existing;
    }
    var w = el("div", { class: "wrap reveal" + (cls ? " " + cls : "") }, kids);
    s.appendChild(w);
    return w;
  }

  /* ---------- lightbox modal ---------- */
  var lightbox = el("div", {
    class: "lightbox-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Image preview",
    hidden: ""
  });
  var lbBackdrop = el("div", { class: "lightbox-backdrop" });
  var lbContent = el("div", { class: "lightbox-content" });
  var lbImg = el("img", { class: "lightbox-img", alt: "" });
  var lbClose = el("button", {
    type: "button",
    class: "lightbox-close",
    "aria-label": "Close preview",
    html: "&times;"
  });
  var lbPrev = el("button", {
    type: "button",
    class: "lightbox-nav prev",
    "aria-label": "Previous image",
    html: "&#8249;"
  });
  var lbNext = el("button", {
    type: "button",
    class: "lightbox-nav next",
    "aria-label": "Next image",
    html: "&#8250;"
  });
  var lbCaption = el("div", { class: "lightbox-caption" });

  lbContent.appendChild(lbImg);
  lightbox.appendChild(lbBackdrop);
  lightbox.appendChild(lbClose);
  lightbox.appendChild(lbPrev);
  lightbox.appendChild(lbNext);
  lightbox.appendChild(lbContent);
  lightbox.appendChild(lbCaption);
  doc.body.appendChild(lightbox);

  var currentGallery = null;
  var currentGalleryIdx = 0;

  function updateGalleryDisplay() {
    if (!currentGallery || currentGallery.length <= 1) {
      lbPrev.style.display = "none";
      lbNext.style.display = "none";
      return;
    }
    lbPrev.style.display = "flex";
    lbNext.style.display = "flex";
    var cur = currentGallery[currentGalleryIdx];
    lbImg.src = cur.src;
    lbImg.alt = cur.caption || "Gallery image";
    lbCaption.textContent = "(" + (currentGalleryIdx + 1) + " / " + currentGallery.length + ") " + (cur.caption || cur.tag || "");
    lbCaption.style.display = "block";
  }

  function nextGalleryItem(e) {
    if (e) e.stopPropagation();
    if (!currentGallery || currentGallery.length <= 1) return;
    currentGalleryIdx = (currentGalleryIdx + 1) % currentGallery.length;
    updateGalleryDisplay();
  }

  function prevGalleryItem(e) {
    if (e) e.stopPropagation();
    if (!currentGallery || currentGallery.length <= 1) return;
    currentGalleryIdx = (currentGalleryIdx - 1 + currentGallery.length) % currentGallery.length;
    updateGalleryDisplay();
  }

  lbPrev.addEventListener("click", prevGalleryItem);
  lbNext.addEventListener("click", nextGalleryItem);

  function openLightbox(src, alt, gallery, idx) {
    if (gallery && gallery.length) {
      currentGallery = gallery;
      currentGalleryIdx = typeof idx === "number" ? idx : 0;
      updateGalleryDisplay();
    } else {
      currentGallery = null;
      currentGalleryIdx = 0;
      lbImg.src = src;
      lbImg.alt = alt || "Enlarged photo";
      lbPrev.style.display = "none";
      lbNext.style.display = "none";
      if (alt) {
        lbCaption.textContent = alt;
        lbCaption.style.display = "block";
      } else {
        lbCaption.style.display = "none";
      }
    }
    lightbox.hidden = false;
    void lightbox.offsetWidth;
    lightbox.classList.add("active");
    doc.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    setTimeout(function () {
      if (!lightbox.classList.contains("active")) {
        lightbox.hidden = true;
        lbImg.src = "";
        currentGallery = null;
        doc.body.style.overflow = "";
      }
    }, 200);
  }

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target === lbBackdrop || e.target === lbContent || e.target === lbClose) {
      closeLightbox();
    }
  });

  doc.addEventListener("keydown", function (e) {
    if (!lightbox.hidden) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextGalleryItem();
      else if (e.key === "ArrowLeft") prevGalleryItem();
    }
  });

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
    left.appendChild(el("p", { class: "loc" }, [
      S.location + (S.openToRelocate ? " | Open to relocate" : ""),
      " · ",
      el("a", { href: "#contact", text: "Contact info" })
    ]));
    left.appendChild(el("div", { class: "btns" }, [
      el("a", { class: "btn primary", href: "#featured", text: "View Featured Project" }),
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
        photoWrap.style.cursor = "pointer";
        photoWrap.setAttribute("role", "button");
        photoWrap.setAttribute("tabindex", "0");
        photoWrap.setAttribute("title", "Click to enlarge");
        photoWrap.setAttribute("aria-label", "Enlarge profile photo");
        photoWrap.addEventListener("click", function () {
          openLightbox(S.photo, S.photoAlt);
        });
        photoWrap.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(S.photo, S.photoAlt);
          }
        });
        grid.appendChild(photoWrap);
      }
    }
    grid.appendChild(left);
    var heroMount = doc.getElementById("heroMount");
    if (heroMount && heroMount.children.length === 0) {
      heroMount.appendChild(grid);
    } else {
      // Hydrate pre-rendered profile photo
      var prePhoto = doc.querySelector("#heroMount .photo-wrap");
      if (prePhoto && !prePhoto.dataset.hydrated) {
        prePhoto.dataset.hydrated = "true";
        prePhoto.style.cursor = "pointer";
        prePhoto.addEventListener("click", function () {
          openLightbox(S.photo, S.photoAlt);
        });
        prePhoto.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(S.photo, S.photoAlt);
          }
        });
      }
    }

    var activeTspan = doc.querySelector("#heroMount .typed span") || tspan;
    if (activeTspan) {
      if (reduce) {
        activeTspan.textContent = S.title;
      } else {
        var i = 0;
        activeTspan.textContent = "";
        (function tick() {
          activeTspan.textContent = S.title.slice(0, ++i);
          if (i < S.title.length) setTimeout(tick, 38);
        })();
      }
    }
  })();

  function socials() {
    var box = el("div", { class: "socials" });
    if (isUrl(S.linkedin)) box.appendChild(ext(S.linkedin, "", [icon(ICONS.linkedin, 20)], "LinkedIn (opens in new tab)"));
    if (isUrl(S.github)) box.appendChild(ext(S.github, "", [icon(ICONS.github, 20)], "GitHub (opens in new tab)"));
    return box;
  }

  function prepareLogo(src, alt, boxCls) {
    if (!src || isPh(src)) return null;
    var box = el("div", { class: boxCls || "cert-logo-box", title: alt || "Official logo" });
    var img = el("img", { src: src, alt: alt || "", class: "logo-img" });
    img.onerror = function () {
      box.style.display = "none";
    };
    box.appendChild(img);
    return box;
  }

  /* ---------- about ---------- */
  var aboutKids = head("01", "ABOUT", "about-h", "About");
  if (C.about.heading) {
    aboutKids.push(el("h3", { class: "about-lead", text: C.about.heading }));
  }
  if (C.about.paragraphs && C.about.paragraphs.length) {
    C.about.paragraphs.forEach(function (p) {
      aboutKids.push(el("p", { class: "about-para", text: p }));
    });
  } else if (C.about.text) {
    aboutKids.push(el("p", { class: "about-text", text: C.about.text }));
  }
  aboutKids.push(el("div", { class: "facts" }, C.about.facts.map(function (f) {
    return el("div", { class: "card fact" }, [el("span", { class: "big", text: f.big }), el("span", { class: "small", text: f.small })]);
  })));
  mount("about", aboutKids);

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
      var itemKids = [
        el("h3", { text: x.role }), el("div", { class: "org", text: x.org }),
        el("span", { class: "when", text: x.dates }),
        el("ul", {}, x.bullets.filter(function (b) { return !isPh(b); }).map(function (b) { return el("li", { text: b }); }))
      ];
      if (x.gallery && x.gallery.length) {
        var gTitleText = (x.galleryTitle || "Showcase") + " (" + x.gallery.length + " Photos)";
        var gHead = el("div", { class: "exp-gallery-head" }, [
          el("span", { class: "exp-gallery-title", text: gTitleText }),
          el("span", { class: "exp-gallery-hint", text: "⤢ Click photo to enlarge" })
        ]);
        var gScroll = el("div", { class: "exp-gallery-scroll" }, x.gallery.map(function (item, idx) {
          var btn = el("button", {
            type: "button",
            class: "exp-gallery-item",
            "aria-label": item.caption || ("View photo " + (idx + 1)),
            title: item.caption || "Click to enlarge"
          }, [
            el("img", {
              src: item.src,
              alt: item.caption || (x.org + " photo"),
              loading: "lazy"
            }),
            item.tag ? el("span", { class: "exp-gallery-badge", text: item.tag }) : null
          ]);
          btn.addEventListener("click", function () {
            openLightbox(item.src, item.caption, x.gallery, idx);
          });
          return btn;
        }));
        itemKids.push(el("div", { class: "exp-gallery-wrap" }, [gHead, gScroll]));
      }
      return el("li", {}, itemKids);
    }))
  ]));

  /* ---------- military ---------- */
  if (C.military) {
    var M = C.military;
    var milLogo = prepareLogo(M.logo, M.logoAlt, "military-logo-box");
    var milKids = head("04b", "MILITARY EXPERIENCE", "military-h", M.title || "Military Experience & Leadership");

    var titleKids = [
      el("h3", { text: M.position })
    ];
    if (M.rank) {
      titleKids.push(el("span", { class: "mil-rank-badge", text: M.rank }));
    }

    var titleRow = el("div", { class: "military-title-row" }, titleKids);
    var headCol = el("div", { class: "military-title-wrap" }, [
      titleRow,
      el("div", { class: "org", text: M.org + (M.branch ? " · " + M.branch : "") })
    ]);

    var headRow = [];
    if (milLogo) headRow.push(milLogo);
    headRow.push(headCol);

    var bodyKids = [
      el("div", { class: "military-header" }, headRow),
      el("p", { class: "military-bg", text: M.background })
    ];

    if (M.highlights && M.highlights.length) {
      var statsWrap = el("div", { class: "military-stats" }, M.highlights.map(function (h) {
        return el("div", { class: "mil-stat-item" }, [
          el("span", { class: "mil-stat-val", text: h.val }),
          el("span", { class: "mil-stat-lbl", text: h.lbl })
        ]);
      }));
      bodyKids.push(statsWrap);
    }

    bodyKids.push(el("div", { class: "military-attrs" }, [
      el("div", { class: "attr-label", text: "Attributes Developed" }),
      chips(M.attributes)
    ]));

    var milBody = el("div", { class: "military-body" }, bodyKids);
    var cardKids = [milBody];

    if (M.photo) {
      var photoWrap = el("button", {
        type: "button",
        class: "military-photo-wrap",
        "aria-label": "Enlarge military photo",
        title: "Click to enlarge"
      }, [
        el("img", {
          src: M.photo,
          alt: M.photoAlt || "Mohamad Izzat Anis in Royal Malaysian Air Force (TUDM) Reserve Officer uniform",
          class: "military-photo",
          loading: "lazy"
        }),
        el("div", { class: "mil-photo-overlay" }),
        el("div", { class: "mil-expand-hint", text: "⤢ Enlarge" }),
        el("div", { class: "mil-photo-badge", text: "🎖 2nd Lt · Full Ceremonial Dress" })
      ]);
      photoWrap.addEventListener("click", function () {
        openLightbox(M.photo, M.photoAlt);
      });
      cardKids.push(photoWrap);
    }

    var milCard = el("div", { class: "card military-card" + (M.photo ? " has-photo" : "") }, cardKids);
    milKids.push(milCard);
    mount("military", milKids);
  }

  /* ---------- skills ---------- */
  mount("skills", head("05", "SKILLS", "skills-h", "Skills").concat(C.skills.map(function (g) {
    return el("div", { class: "skill-group" }, [el("h3", { text: g.group }), chips(g.items)]);
  })));

  /* ---------- education ---------- */
  mount("education", head("06", "EDUCATION", "education-h", "Education").concat([
    el("div", { class: "grid2" }, C.education.map(function (e) {
      var kids = [];
      var logoBox = prepareLogo(e.logo, e.logoAlt || (e.school ? e.school + " logo" : "Institution logo"), "edu-logo-box");
      var titles = [
        el("h3", { class: "edu-degree", text: e.degree }),
        el("p", { class: "edu-school", text: e.school })
      ];
      var headerKids = [];
      if (logoBox) headerKids.push(logoBox);
      headerKids.push(el("div", { class: "edu-title-wrap" }, titles));
      kids.push(el("div", { class: "edu-header" }, headerKids));

      if (!isPh(e.dates)) kids.push(el("p", { class: "mono note edu-dates", text: e.dates }));
      if (!isPh(e.detail)) kids.push(el("p", { class: "edu-detail", text: e.detail }));
      return el("article", { class: "card edu-card" }, kids);
    }))
  ]));

  /* ---------- certifications ---------- */
  function renderCertCard(c) {
    var topKids = [];
    var logoBox = prepareLogo(c.logo, c.logoAlt || (c.issuer ? c.issuer + " logo" : "Certification logo"), "cert-logo-box");
    if (logoBox) topKids.push(logoBox);

    if (!isPh(c.issuer)) {
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
    var hasForm = true;

    var btnsList = [];
    if (isUrl(S.linkedin)) {
      btnsList.push(ext(S.linkedin, "btn primary", ["LinkedIn ", icon(ICONS.ext, 14)]));
    }

    var leftKids = [
      el("p", { class: "about-text", text: K.text || "Fill in the form and I'll get back to you. You can also find me on LinkedIn." }),
      el("div", { class: "btns" }, btnsList),
      el("p", { class: "note", text: K.references })
    ];
    var left = el("div", {}, leftKids);

    var contentKids = [left];

    if (hasForm) {
      function field(id, label, type, req, area) {
        var inp = area ? el("textarea", { id: id, name: id, rows: 5 }) : el("input", { id: id, name: id, type: type, autocomplete: id === "name" ? "name" : id === "email" ? "email" : "off" });
        if (req) { inp.required = true; inp.setAttribute("aria-describedby", id + "-err"); }
        return el("div", {}, [el("label", { for: id, text: label + (req ? "" : " (optional)") }), inp, el("span", { class: "err", id: id + "-err", role: "alert" })]);
      }
      var status = el("div", { class: "status", role: "status", hidden: "" });
      var hp = el("div", { class: "hp", "aria-hidden": "true" }, [
        el("label", { for: "website", text: "Leave this field empty" }),
        el("input", { id: "website", name: "_gotcha", type: "text", tabindex: "-1", autocomplete: "off" })
      ]);
      var submit = el("button", { class: "btn primary", type: "submit", text: "Submit Message" });
      var form = el("form", { novalidate: "", "aria-label": "Contact form" }, [
        field("name", "Full Name", "text", true),
        field("email", "Email Address", "email", true),
        field("subject", "Subject", "text", true),
        field("message", "Message", "text", true, true),
        hp, submit, status
      ]);
      function say(msg, type) {
        status.hidden = false;
        status.className = "status " + (type || "ok");
        status.textContent = msg;
      }
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var bad = false;
        ["name", "email", "subject", "message"].forEach(function (id) {
          var i = form.elements[id], v = i.value.trim(), m = "";
          if (!v) {
            if (id === "name") m = "Please enter your full name.";
            else if (id === "email") m = "Please enter your email address.";
            else if (id === "subject") m = "Please enter a subject.";
            else if (id === "message") m = "Please write a message.";
          } else if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
            m = "Please enter a valid email address.";
          } else if (id === "message" && v.length < 10) {
            m = "Please write at least 10 characters.";
          }
          doc.getElementById(id + "-err").textContent = m;
          i.setAttribute("aria-invalid", m ? "true" : "false");
          if (m && !bad) { i.focus(); bad = true; }
        });
        if (bad) return;
        if (form.elements._gotcha.value) { say("Thank you! Your message has been sent successfully.", "ok"); form.reset(); return; }

        if (!formEndpoint || isPh(formEndpoint) || formEndpoint.indexOf("[[") !== -1) {
          say("The contact form is currently in demonstration mode. Please configure your Formspree endpoint in assets/js/content.js.", "warn");
          return;
        }

        submit.disabled = true;
        submit.textContent = "Sending...";
        fetch(formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            subject: form.elements.subject.value.trim(),
            message: form.elements.message.value.trim()
          })
        })
          .then(function (r) {
            if (!r.ok) throw new Error("bad");
            say("Thank you! Your message has been sent successfully. I will get back to you soon.", "ok");
            form.reset();
          })
          .catch(function () {
            say("Sorry, an error occurred while sending your message. Please reach out via LinkedIn.", "bad");
          })
          .then(function () {
            submit.disabled = false;
            submit.textContent = "Submit Message";
          });
      });

      contentKids.push(el("div", { class: "card" }, [form]));
    }

    mount("contact", head("09", "CONTACT", "contact-h", K.heading).concat([
      el("div", { class: hasForm ? "contact-grid" : "" }, contentKids)
    ]));
  })();

  doc.getElementById("footerText").textContent = "© " + S.year + " " + S.name + ". " + C.footer;

  /* ---------- Hydrate pre-rendered elements ---------- */
  // 1. SOP Pipeline stages
  var pipeCap = doc.getElementById("pipeCap");
  var pipeBtns = doc.querySelectorAll("#featured .pipe button");
  if (pipeBtns.length && C.featured && C.featured.pipeline) {
    var Fpipe = C.featured.pipeline;
    function setPreStage(idx) {
      pipeBtns.forEach(function (b, j) {
        b.setAttribute("aria-pressed", j === idx ? "true" : "false");
      });
      if (pipeCap && Fpipe[idx]) {
        pipeCap.textContent = Fpipe[idx].name + ": " + Fpipe[idx].caption;
      }
    }
    pipeBtns.forEach(function (b, i) {
      b.addEventListener("click", function () { setPreStage(i); });
      b.addEventListener("mouseenter", function () { setPreStage(i); });
      b.addEventListener("focus", function () { setPreStage(i); });
    });
  }

  // 2. Experience photo galleries
  var gWraps = doc.querySelectorAll("#experience .exp-gallery-wrap");
  var expWithGallery = (C.experience || []).filter(function (x) { return x.gallery && x.gallery.length; });
  gWraps.forEach(function (wrap, gIdx) {
    var expData = expWithGallery[gIdx];
    if (!expData) return;
    var buttons = wrap.querySelectorAll(".exp-gallery-item");
    buttons.forEach(function (btn, bIdx) {
      btn.addEventListener("click", function () {
        openLightbox(expData.gallery[bIdx].src, expData.gallery[bIdx].caption, expData.gallery, bIdx);
      });
    });
  });

  // 3. Military uniform photo
  var milPhotoWrap = doc.querySelector(".military-photo-wrap");
  if (milPhotoWrap && C.military && C.military.photo) {
    milPhotoWrap.addEventListener("click", function () {
      openLightbox(C.military.photo, C.military.photoAlt);
    });
  }

  // 4. Contact Form submission
  var contactForm = doc.querySelector("#contact form");
  if (contactForm && !contactForm.dataset.hydrated) {
    contactForm.dataset.hydrated = "true";
    var statusEl = doc.getElementById("contactStatus") || contactForm.querySelector(".status");
    function sayContact(msg, type) {
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.className = "status " + (type || "ok");
        statusEl.textContent = msg;
      }
    }
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = false;
      ["name", "email", "subject", "message"].forEach(function (id) {
        var i = contactForm.elements[id];
        if (!i) return;
        var v = i.value.trim(), m = "";
        if (!v) {
          if (id === "name") m = "Please enter your full name.";
          else if (id === "email") m = "Please enter your email address.";
          else if (id === "subject") m = "Please enter a subject.";
          else if (id === "message") m = "Please write a message.";
        } else if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
          m = "Please enter a valid email address.";
        } else if (id === "message" && v.length < 10) {
          m = "Please write at least 10 characters.";
        }
        var errEl = doc.getElementById(id + "-err");
        if (errEl) errEl.textContent = m;
        i.setAttribute("aria-invalid", m ? "true" : "false");
        if (m && !bad) { i.focus(); bad = true; }
      });
      if (bad) return;
      if (contactForm.elements._gotcha && contactForm.elements._gotcha.value) {
        sayContact("Thank you! Your message has been sent successfully.", "ok");
        contactForm.reset();
        return;
      }
      var formEndpoint = C.site.formEndpoint || C.formEndpoint || "";
      if (!formEndpoint || isPh(formEndpoint) || formEndpoint.indexOf("[[") !== -1) {
        sayContact("The contact form is currently in demonstration mode. Please configure your Formspree endpoint in assets/js/content.js.", "warn");
        return;
      }
      var submitBtn = contactForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      fetch(formEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.elements.name.value.trim(),
          email: contactForm.elements.email.value.trim(),
          subject: contactForm.elements.subject.value.trim(),
          message: contactForm.elements.message.value.trim()
        })
      })
        .then(function (r) {
          if (!r.ok) throw new Error("bad");
          sayContact("Thank you! Your message has been sent successfully. I will get back to you soon.", "ok");
          contactForm.reset();
        })
        .catch(function () {
          sayContact("Sorry, an error occurred while sending your message. Please reach out via LinkedIn.", "bad");
        })
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Message";
          }
        });
    });
  }

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

  /* ---------- back to top smooth scroll ---------- */
  doc.querySelectorAll('a[href="#top"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.history && window.history.replaceState) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    });
  });
})();
