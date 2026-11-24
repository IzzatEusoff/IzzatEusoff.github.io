const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = __dirname;
const CONTENT_PATH = path.join(ROOT_DIR, 'assets', 'js', 'content.js');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');

// 1. Load content.js
const contentCode = fs.readFileSync(CONTENT_PATH, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(contentCode, sandbox);
const C = sandbox.window.CONTENT;
const S = C.site;

// Helper utilities
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isPh(v) {
  return !v || (typeof v === 'string' && (v.startsWith('[[') || v.trim() === ''));
}

function isUrl(v) {
  return typeof v === 'string' && /^https?:\/\//i.test(v) && !isPh(v);
}

const SELF_CLOSING = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

class VNode {
  constructor(tag, attrs, kids) {
    this.tag = tag;
    this.attrs = attrs || {};
    this.kids = kids || [];
  }
  toString() {
    let out = `<${this.tag}`;
    for (const [k, v] of Object.entries(this.attrs)) {
      if (v === null || v === undefined) continue;
      if (k === 'text') continue;
      out += ` ${k}="${escapeHtml(v)}"`;
    }
    if (SELF_CLOSING.has(this.tag.toLowerCase())) {
      return out + '>';
    }
    out += '>';
    if (this.attrs.text) {
      out += escapeHtml(this.attrs.text);
    }
    for (const kid of this.kids) {
      if (!kid) continue;
      if (typeof kid === 'string') {
        out += escapeHtml(kid);
      } else if (kid instanceof VNode) {
        out += kid.toString();
      } else {
        out += String(kid);
      }
    }
    out += `</${this.tag}>`;
    return out;
  }
}

function el(tag, attrs, kids) {
  if (kids && !Array.isArray(kids)) kids = [kids];
  return new VNode(tag, attrs, kids || []);
}

const ICONS = {
  linkedin: ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z", "M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"],
  github: ["M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.2-.4 6.5-1.6 6.5-7a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C6.4 1.6 5.2 2 5.2 2a5 5 0 0 0-.1 3.7A5.4 5.4 0 0 0 3.6 9.5c0 5.4 3.3 6.6 6.5 7a3.4 3.4 0 0 0-1 2.6V22"],
  check: ["M20 6L9 17l-5-5"],
  ext: ["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", "M15 3h6v6", "M10 14L21 3"],
  dl: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]
};

function icon(paths, size) {
  size = size || 18;
  const pathEls = paths.map(p => el('path', { d: p }));
  return el('svg', {
    width: String(size),
    height: String(size),
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true'
  }, pathEls);
}

function ext(href, cls, kids, label) {
  const attrs = {
    href: href,
    target: '_blank',
    rel: 'noopener noreferrer',
    class: 'ext' + (cls ? ' ' + cls : '')
  };
  if (label) attrs['aria-label'] = label;
  return el('a', attrs, kids);
}

function head(num, label, id, title) {
  return [
    el('span', { class: 'sec-label mono', text: `${num} / ${label}` }),
    el('h2', { class: 'sec-title', id: id, text: title })
  ];
}

function chips(list) {
  const valid = (list || []).filter(t => !isPh(t));
  return el('ul', { class: 'chips', 'aria-label': 'Tags' }, valid.map(t => el('li', { class: 'chip', text: t })));
}

function prepareLogo(src, alt, boxCls) {
  if (!src || isPh(src)) return null;
  const img = el('img', { src: src, alt: alt || '', class: 'logo-img', loading: 'lazy' });
  return el('div', { class: boxCls || 'cert-logo-box', title: alt || 'Official logo' }, [img]);
}

// ----------------- Section Generators -----------------

function renderHero() {
  const hasPhoto = !isPh(S.photo);
  const leftKids = [
    el('div', { class: 'badge' }, [el('span', { class: 'dot', 'aria-hidden': 'true' }), S.status]),
    el('h1', { id: 'heroName', text: S.name }),
    el('p', { class: 'typed', 'aria-label': S.title }, [
      el('span', { 'aria-hidden': 'true', text: S.title }),
      el('span', { class: 'caret', 'aria-hidden': 'true' })
    ]),
    el('p', { class: 'lead', text: S.oneLiner }),
    el('p', { class: 'loc' }, [
      S.location + (S.openToRelocate ? ' | Open to relocate' : ''),
      ' · ',
      el('a', { href: '#contact', text: 'Contact info' })
    ]),
    el('div', { class: 'btns' }, [
      el('a', { class: 'btn primary', href: '#featured', text: 'View Featured Project' }),
      el('a', { class: 'btn', href: '#contact', text: 'Contact Me' })
    ])
  ];

  const socialBox = el('div', { class: 'socials' }, [
    isUrl(S.linkedin) ? ext(S.linkedin, '', [icon(ICONS.linkedin, 20)], 'LinkedIn (opens in new tab)') : null,
    isUrl(S.github) ? ext(S.github, '', [icon(ICONS.github, 20)], 'GitHub (opens in new tab)') : null
  ].filter(Boolean));
  leftKids.push(socialBox);

  const left = el('div', { class: 'hero-text' }, leftKids);

  const gridKids = [];
  if (hasPhoto) {
    const photoWrap = el('div', {
      class: 'photo-wrap',
      role: 'button',
      tabindex: '0',
      title: 'Click to enlarge',
      'aria-label': 'Enlarge profile photo'
    }, [
      el('img', {
        class: 'photo',
        src: S.photo,
        alt: S.photoAlt || 'Portrait of Mohamad Izzat Anis',
        width: 280,
        height: 280,
        loading: 'eager',
        decoding: 'async'
      })
    ]);
    gridKids.push(photoWrap);
  }
  gridKids.push(left);

  return el('div', { class: 'hero-grid' + (hasPhoto ? ' has-photo' : '') }, gridKids);
}

function renderAbout() {
  const kids = head('01', 'ABOUT', 'about-h', 'About');
  if (C.about.heading) {
    kids.push(el('h3', { class: 'about-lead', text: C.about.heading }));
  }
  if (C.about.paragraphs && C.about.paragraphs.length) {
    C.about.paragraphs.forEach(p => {
      kids.push(el('p', { class: 'about-para', text: p }));
    });
  } else if (C.about.text) {
    kids.push(el('p', { class: 'about-text', text: C.about.text }));
  }

  const factCards = (C.about.facts || []).map(f => {
    return el('div', { class: 'card fact' }, [
      el('span', { class: 'big', text: f.big }),
      el('span', { class: 'small', text: f.small })
    ]);
  });
  kids.push(el('div', { class: 'facts' }, factCards));

  return el('div', { class: 'wrap reveal' }, kids);
}

function renderFeatured() {
  const F = C.featured;
  const kids = head('02', 'FEATURED PROJECT', 'featured-h', F.title);
  kids.push(el('p', { class: 'sub', text: F.subtitle }));

  const caseCards = [
    ['Overview', F.overview],
    ['The problem', F.problem],
    ['My approach', F.approach]
  ].map(x => el('div', { class: 'card' }, [
    el('h3', { text: x[0] }),
    el('p', { text: x[1] })
  ]));
  kids.push(el('div', { class: 'case-grid' }, caseCards));

  // Pipeline
  const firstPipe = F.pipeline && F.pipeline[0] ? `${F.pipeline[0].name}: ${F.pipeline[0].caption}` : '';
  const cap = el('p', { class: 'pipe-cap', id: 'pipeCap', 'aria-live': 'polite', text: firstPipe });
  const ol = el('ol', { class: 'pipe', 'aria-label': 'SOP pipeline stages' }, (F.pipeline || []).map((s, i) => {
    const b = el('button', { type: 'button', 'aria-pressed': i === 0 ? 'true' : 'false' }, [s.name]);
    return el('li', {}, [b]);
  }));
  kids.push(el('div', { class: 'block' }, [
    el('h3', { text: 'SOP pipeline' }),
    ol,
    cap
  ]));

  // Rankings chart
  const levelBars = { 'High': 3, 'Moderate': 2, 'Low': 1, 'None observed': 0 };
  const chartKids = [];
  const srKids = [];
  (F.rankings || []).forEach(r => {
    const segs = [];
    const count = levelBars[r.level] || 0;
    for (let i = 0; i < 3; i++) {
      segs.push(el('span', { class: 'seg' + (i < count ? ' on' : ''), 'aria-hidden': 'true' }));
    }
    chartKids.push(el('div', { class: 'rank-row' }, [
      el('span', { class: 'lab', text: r.level }),
      el('div', { class: 'segs', 'aria-hidden': 'true' }, segs),
      el('div', { class: 'chips' }, r.platforms.map(p => el('span', { class: 'chip', text: p })))
    ]));
    srKids.push(el('dt', { text: r.level }));
    srKids.push(el('dd', { text: r.platforms.join(', ') }));
  });

  const chart = el('div', { class: 'chart rank-chart', role: 'img', 'aria-label': F.resultsTitle + '. A text summary follows.' }, chartKids);
  const srList = el('dl', { class: 'sr-only' }, srKids);

  const statsCards = (F.stats || []).map(s => {
    return el('div', { class: 'card stat' }, [
      el('span', { class: 'big', text: s.big }),
      s.small ? el('span', { class: 'note', text: s.small }) : null
    ]);
  });

  kids.push(el('div', { class: 'block' }, [
    el('h3', { text: F.resultsTitle || 'Platform responsiveness to takedown reports' }),
    el('div', { class: 'stats' }, statsCards),
    el('div', { class: 'card' }, [chart, srList, el('p', { class: 'note', text: F.resultsCaption })])
  ]));

  kids.push(el('div', { class: 'block' }, [
    el('h3', { text: 'Key findings' }),
    el('ul', { class: 'findings' }, (F.findings || []).map(f => el('li', { text: f })))
  ]));

  kids.push(el('div', { class: 'block' }, [
    el('h3', { text: 'Limitations and future work' }),
    el('p', { text: F.limitations })
  ]));

  kids.push(el('div', { class: 'block' }, [
    el('h3', { text: 'Skills demonstrated' }),
    chips(F.skills)
  ]));

  kids.push(el('p', { class: 'note block', text: F.note }));

  return el('div', { class: 'wrap reveal' }, kids);
}

function renderProjects() {
  const kids = head('03', 'PROJECTS', 'projects-h', 'Projects');
  const projectCards = C.projects.map(p => {
    const dlKids = [];
    if (!isPh(p.problem)) { dlKids.push(el('dt', { text: 'Problem' }), el('dd', { text: p.problem })); }
    if (!isPh(p.built)) { dlKids.push(el('dt', { text: 'What I built' }), el('dd', { text: p.built })); }
    if (!isPh(p.designed)) { dlKids.push(el('dt', { text: 'What I designed' }), el('dd', { text: p.designed })); }
    if (!isPh(p.result)) { dlKids.push(el('dt', { text: 'Result' }), el('dd', { text: p.result })); }
    if (!isPh(p.outcome)) { dlKids.push(el('dt', { text: 'Result' }), el('dd', { text: p.outcome })); }
    if (!isPh(p.status)) { dlKids.push(el('dt', { text: 'Status' }), el('dd', { text: p.status })); }

    const footKids = [];
    if (p.tools && p.tools.length) footKids.push(chips(p.tools));
    if (!isPh(p.note)) footKids.push(el('p', { class: 'note proj-note', text: p.note }));
    if (isUrl(p.link)) footKids.push(el('p', { class: 'proj-link' }, [ext(p.link, 'btn small', ['View project ', icon(ICONS.ext, 14)])]));

    const orgKids = [p.org];
    if (p.sanitised) orgKids.push(el('span', { class: 'tag', text: 'Sanitised' }));
    if (p.design) orgKids.push(el('span', { class: 'tag', text: 'Design' }));

    return el('article', { class: 'card proj' }, [
      el('h3', { text: p.title }),
      el('div', { class: 'org' }, orgKids),
      el('dl', {}, dlKids),
      el('div', { class: 'proj-foot' }, footKids)
    ]);
  });

  kids.push(el('div', { class: 'grid2' }, projectCards));
  return el('div', { class: 'wrap reveal' }, kids);
}

function renderExperience() {
  const kids = head('04', 'EXPERIENCE', 'experience-h', 'Experience');
  const timelineItems = C.experience.map(x => {
    const itemKids = [
      el('h3', { text: x.role }),
      el('div', { class: 'org', text: x.org }),
      el('span', { class: 'when', text: x.dates }),
      el('ul', {}, x.bullets.filter(b => !isPh(b)).map(b => el('li', { text: b })))
    ];

    if (x.gallery && x.gallery.length) {
      const gTitleText = (x.galleryTitle || 'Showcase') + ' (' + x.gallery.length + ' Photos)';
      const gHead = el('div', { class: 'exp-gallery-head' }, [
        el('span', { class: 'exp-gallery-title', text: gTitleText }),
        el('span', { class: 'exp-gallery-hint', text: '⤢ Click photo to enlarge' })
      ]);
      const gScroll = el('div', { class: 'exp-gallery-scroll' }, x.gallery.map((item, idx) => {
        return el('button', {
          type: 'button',
          class: 'exp-gallery-item',
          'aria-label': item.caption || (`View photo ${idx + 1}`),
          title: item.caption || 'Click to enlarge'
        }, [
          el('img', {
            src: item.src,
            alt: item.caption || (x.org + ' photo'),
            loading: 'lazy'
          }),
          item.tag ? el('span', { class: 'exp-gallery-badge', text: item.tag }) : null
        ]);
      }));
      itemKids.push(el('div', { class: 'exp-gallery-wrap' }, [gHead, gScroll]));
    }

    return el('li', {}, itemKids);
  });

  kids.push(el('ol', { class: 'timeline' }, timelineItems));
  return el('div', { class: 'wrap reveal' }, kids);
}

function renderMilitary() {
  if (!C.military) return '';
  const M = C.military;
  const milLogo = prepareLogo(M.logo, M.logoAlt, 'military-logo-box');
  const kids = head('04b', 'MILITARY EXPERIENCE', 'military-h', M.title || 'Military Experience & Leadership');

  const titleKids = [el('h3', { text: M.position })];
  if (M.rank) {
    titleKids.push(el('span', { class: 'mil-rank-badge', text: M.rank }));
  }
  const titleRow = el('div', { class: 'military-title-row' }, titleKids);
  const headCol = el('div', { class: 'military-title-wrap' }, [
    titleRow,
    el('div', { class: 'org', text: M.org + (M.branch ? ' · ' + M.branch : '') })
  ]);

  const headRow = [];
  if (milLogo) headRow.push(milLogo);
  headRow.push(headCol);

  const bodyKids = [
    el('div', { class: 'military-header' }, headRow),
    el('p', { class: 'military-bg', text: M.background })
  ];

  if (M.highlights && M.highlights.length) {
    const statsWrap = el('div', { class: 'military-stats' }, M.highlights.map(h => {
      return el('div', { class: 'mil-stat-item' }, [
        el('span', { class: 'mil-stat-val', text: h.val }),
        el('span', { class: 'mil-stat-lbl', text: h.lbl })
      ]);
    }));
    bodyKids.push(statsWrap);
  }

  bodyKids.push(el('div', { class: 'military-attrs' }, [
    el('div', { class: 'attr-label', text: 'Attributes Developed' }),
    chips(M.attributes)
  ]));

  const milBody = el('div', { class: 'military-body' }, bodyKids);
  const cardKids = [milBody];

  if (M.photo) {
    const photoWrap = el('button', {
      type: 'button',
      class: 'military-photo-wrap',
      'aria-label': 'Enlarge military photo',
      title: 'Click to enlarge'
    }, [
      el('img', {
        src: M.photo,
        alt: M.photoAlt || 'Mohamad Izzat Anis in Royal Malaysian Air Force (TUDM) Reserve Officer uniform',
        class: 'military-photo',
        loading: 'lazy'
      }),
      el('div', { class: 'mil-photo-overlay' }),
      el('div', { class: 'mil-expand-hint', text: '⤢ Enlarge' }),
      el('div', { class: 'mil-photo-badge', text: '🎖 2nd Lt · Full Ceremonial Dress' })
    ]);
    cardKids.push(photoWrap);
  }

  const milCard = el('div', { class: 'card military-card' + (M.photo ? ' has-photo' : '') }, cardKids);
  kids.push(milCard);
  return el('div', { class: 'wrap reveal' }, kids);
}

function renderSkills() {
  const kids = head('05', 'SKILLS', 'skills-h', 'Skills');
  const groups = C.skills.map(g => {
    return el('div', { class: 'skill-group' }, [
      el('h3', { text: g.group }),
      chips(g.items)
    ]);
  });
  kids.push(...groups);
  return el('div', { class: 'wrap reveal' }, kids);
}

function renderEducation() {
  const kids = head('06', 'EDUCATION', 'education-h', 'Education');
  const cards = C.education.map(e => {
    const cardKids = [];
    const logoBox = prepareLogo(e.logo, e.logoAlt || (e.school ? e.school + ' logo' : 'Institution logo'), 'edu-logo-box');
    const titles = [
      el('h3', { class: 'edu-degree', text: e.degree }),
      el('p', { class: 'edu-school', text: e.school })
    ];
    const headerKids = [];
    if (logoBox) headerKids.push(logoBox);
    headerKids.push(el('div', { class: 'edu-title-wrap' }, titles));
    cardKids.push(el('div', { class: 'edu-header' }, headerKids));

    if (!isPh(e.dates)) cardKids.push(el('p', { class: 'mono note edu-dates', text: e.dates }));
    if (!isPh(e.detail)) cardKids.push(el('p', { class: 'edu-detail', text: e.detail }));
    return el('article', { class: 'card edu-card' }, cardKids);
  });

  kids.push(el('div', { class: 'grid2' }, cards));
  return el('div', { class: 'wrap reveal' }, kids);
}

function renderCertCard(c) {
  const topKids = [];
  const logoBox = prepareLogo(c.logo, c.logoAlt || (c.issuer ? c.issuer + ' logo' : 'Certification logo'), 'cert-logo-box');
  if (logoBox) topKids.push(logoBox);

  if (!isPh(c.issuer)) {
    topKids.push(el('div', {}, [
      el('div', { class: 'issuer', text: c.issuer }),
      (c.date || c.year) ? el('div', { class: 'yr', text: String(c.date || c.year) }) : null
    ]));
  } else if (c.date || c.year) {
    topKids.push(el('div', { class: 'yr', text: String(c.date || c.year) }));
  }
  if (!isPh(c.type)) topKids.push(el('span', { class: 'type-tag', text: c.type }));

  const footKids = [];
  if (isUrl(c.verifyUrl)) {
    footKids.push(el('span', { class: 'verified-label' }, [icon(ICONS.check, 14), 'Verifiable online']));
    footKids.push(ext(c.verifyUrl, 'btn small', ['Verify credential ', icon(ICONS.ext, 14)], `Verify credential: ${c.title} (opens in new tab)`));
  } else if (c.onLinkedIn && isUrl(C.links.linkedinCerts)) {
    footKids.push(ext(C.links.linkedinCerts, 'btn small', ['View on LinkedIn ', icon(ICONS.ext, 14)], `View on LinkedIn: ${c.title} (opens in new tab)`));
  }
  const foot = el('div', { class: 'cert-foot' }, footKids);

  return el('article', { class: 'card cert' }, [
    topKids.length ? el('div', { class: 'cert-top' }, topKids) : null,
    el('h3', { text: c.title }),
    !isPh(c.note) ? el('p', { class: 'note', text: c.note }) : null,
    foot
  ]);
}

function renderCertifications() {
  const kids = head('07', 'CERTIFICATIONS', 'certifications-h', 'Certifications');
  kids.push(el('p', { class: 'note', text: C.certificationsIntro }));

  const certGroups = C.certificationGroups || [{ group: '', items: C.certifications || [] }];
  certGroups.forEach(g => {
    kids.push(el('div', { class: 'cert-group' }, [
      !isPh(g.group) ? el('h3', { class: 'group-title', text: g.group }) : null,
      el('div', { class: 'cert-grid' }, (g.items || []).map(renderCertCard))
    ]));
  });

  return el('div', { class: 'wrap reveal' }, kids);
}

function renderAwards() {
  const kids = head('08', 'AWARDS', 'awards-h', 'Awards and Recognition');
  kids.push(el('p', { class: 'note', text: C.awardsIntro || 'Awards are listed on my LinkedIn.' }));

  const awardCards = C.awards.map(a => {
    const metaKids = [];
    const d = a.date || a.year;
    if (!isPh(d)) metaKids.push(el('span', { class: 'yr', text: d }));
    const proj = a.project || (a.text && a.text !== '' ? a.text : null);
    if (!isPh(proj)) metaKids.push(el('span', { class: 'tag', text: 'Project: ' + proj }));

    const footKids = [];
    if (a.onLinkedIn && isUrl(C.links.linkedinHonors)) {
      footKids.push(ext(C.links.linkedinHonors, 'btn small', ['View on LinkedIn ', icon(ICONS.ext, 14)], `View on LinkedIn: ${a.title} (opens in new tab)`));
    }
    const foot = el('div', { class: 'award-foot' }, footKids);

    return el('article', { class: 'card award' }, [
      el('h3', { text: a.title }),
      metaKids.length ? el('div', { class: 'award-meta' }, metaKids) : null,
      foot
    ]);
  });

  kids.push(el('div', { class: 'award-grid' }, awardCards));
  return el('div', { class: 'wrap reveal' }, kids);
}

function renderContact() {
  const K = C.contact;
  const kids = head('09', 'CONTACT', 'contact-h', K.heading || "Let's connect");

  const btnsList = [];
  if (isUrl(S.linkedin)) {
    btnsList.push(ext(S.linkedin, 'btn primary', ['LinkedIn ', icon(ICONS.ext, 14)]));
  }

  const left = el('div', {}, [
    el('p', { class: 'about-text', text: K.text || "Fill in the form and I'll get back to you. You can also find me on LinkedIn." }),
    el('div', { class: 'btns' }, btnsList),
    el('p', { class: 'note', text: K.references })
  ]);

  function field(id, label, type, req, area) {
    const inp = area
      ? el('textarea', { id: id, name: id, rows: 5, placeholder: 'Your message...' })
      : el('input', { id: id, name: id, type: type, autocomplete: id === 'name' ? 'name' : id === 'email' ? 'email' : 'off', placeholder: label });
    return el('div', {}, [
      el('label', { for: id, text: label + (req ? ' *' : ' (optional)') }),
      inp,
      el('span', { class: 'err', id: id + '-err', role: 'alert' })
    ]);
  }

  const hp = el('div', { class: 'hp', 'aria-hidden': 'true', style: 'display:none;' }, [
    el('label', { for: 'website', text: 'Leave this field empty' }),
    el('input', { id: 'website', name: '_gotcha', type: 'text', tabindex: '-1', autocomplete: 'off' })
  ]);

  const submitBtn = el('button', { class: 'btn primary', type: 'submit', text: 'Submit Message' });
  const statusDiv = el('div', { class: 'status', id: 'contactStatus', role: 'status', hidden: '' });

  const formEndpoint = C.site.formEndpoint || C.formEndpoint || '';
  const formAttrs = {
    action: isUrl(formEndpoint) ? formEndpoint : '#',
    method: 'POST',
    'aria-label': 'Contact form'
  };

  const form = el('form', formAttrs, [
    field('name', 'Full Name', 'text', true),
    field('email', 'Email Address', 'email', true),
    field('subject', 'Subject', 'text', true),
    field('message', 'Message', 'text', true, true),
    hp,
    submitBtn,
    statusDiv
  ]);

  const formCard = el('div', { class: 'card' }, [form]);

  kids.push(el('div', { class: 'contact-grid' }, [left, formCard]));
  return el('div', { class: 'wrap reveal' }, kids);
}

// Export pre-rendered sections
module.exports = {
  renderHero,
  renderAbout,
  renderFeatured,
  renderProjects,
  renderExperience,
  renderMilitary,
  renderSkills,
  renderEducation,
  renderCertifications,
  renderAwards,
  renderContact,
  C
};

if (require.main === module) {
  console.log('Testing build generator...');
  console.log('Hero length:', renderHero().length);
  console.log('About length:', renderAbout().length);
  console.log('Featured length:', renderFeatured().length);
  console.log('Projects length:', renderProjects().length);
  console.log('Experience length:', renderExperience().length);
  console.log('Military length:', renderMilitary().length);
  console.log('Education length:', renderEducation().length);
  console.log('Certifications length:', renderCertifications().length);
  console.log('Awards length:', renderAwards().length);
  console.log('Contact length:', renderContact().length);
}
