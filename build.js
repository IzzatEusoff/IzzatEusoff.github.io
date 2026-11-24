const fs = require('fs');
const path = require('path');
const sections = require('./build-sections.js');

const ROOT_DIR = __dirname;
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const C = sections.C;
const S = C.site;

console.log('Generating pre-rendered static site for Mohamad Izzat Anis portfolio...');

// 1. Generate Schema.org JSON-LD
const schemaLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://izzateusoff.github.io/#person",
      "name": "Mohamad Izzat Anis",
      "givenName": "Mohamad Izzat",
      "familyName": "Anis",
      "jobTitle": "Cybersecurity Analyst",
      "description": "First Class Honours Cybersecurity graduate (3.82 CGPA) and commissioned 2nd Lieutenant specializing in SOC operations, threat intelligence (OSINT), and Python security automation.",
      "url": "https://izzateusoff.github.io/",
      "image": "https://izzateusoff.github.io/assets/img/photo.jpg",
      "sameAs": [
        "https://linkedin.com/in/izzatanis"
      ],
      "alumniOf": [
        {
          "@type": "CollegeOrUniversity",
          "name": "Universiti Malaysia Pahang Al-Sultan Abdullah",
          "alternateName": "UMPSA"
        },
        {
          "@type": "CollegeOrUniversity",
          "name": "Politeknik Seberang Perai",
          "alternateName": "PSP"
        }
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Bank Muamalat Malaysia Berhad"
      },
      "knowsAbout": [
        "Cybersecurity",
        "Security Operations Center (SOC)",
        "Open-Source Intelligence (OSINT)",
        "Threat Detection & Triage",
        "Security Automation",
        "Splunk",
        "CrowdStrike Falcon",
        "Digital Piracy Investigation",
        "Standard Operating Procedures (SOP)",
        "Python",
        "Incident Response"
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": "https://izzateusoff.github.io/#webpage",
      "url": "https://izzateusoff.github.io/",
      "name": "Mohamad Izzat Anis | Cybersecurity Analyst Portfolio",
      "about": { "@id": "https://izzateusoff.github.io/#person" },
      "mainEntity": { "@id": "https://izzateusoff.github.io/#person" },
      "inLanguage": "en"
    },
    {
      "@type": "WebSite",
      "@id": "https://izzateusoff.github.io/#website",
      "url": "https://izzateusoff.github.io/",
      "name": "Mohamad Izzat Anis Portfolio",
      "publisher": { "@id": "https://izzateusoff.github.io/#person" }
    }
  ]
};

// 2. Build complete pre-rendered index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://formspree.io; form-action https://formspree.io; base-uri 'self'; manifest-src 'self'">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  
  <!-- Search Engine & AI Crawler Directives -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="https://izzateusoff.github.io/">
  
  <!-- Primary Meta Tags -->
  <title>Mohamad Izzat Anis | Cybersecurity Analyst (SOC, OSINT, Security Automation)</title>
  <meta name="title" content="Mohamad Izzat Anis | Cybersecurity Analyst (SOC, OSINT, Security Automation)">
  <meta name="description" content="Cybersecurity graduate (First Class Honours, 3.82 CGPA) and commissioned 2nd Lieutenant specializing in SOC operations, OSINT investigations, and Python security automation. Based in Federal Territory of Kuala Lumpur, Malaysia.">
  <meta name="author" content="Mohamad Izzat Anis">
  <meta name="keywords" content="Mohamad Izzat Anis, Cybersecurity Analyst, SOC Analyst, OSINT, Security Automation, Python, Splunk, CrowdStrike, TUDM, PSSTUDM, UMPSA, Malaysia Cybersecurity">
  <meta name="color-scheme" content="dark light">
  <meta name="theme-color" content="#0b0f14">

  <!-- Open Graph / Facebook / LinkedIn -->
  <meta property="og:type" content="profile">
  <meta property="og:url" content="https://izzateusoff.github.io/">
  <meta property="og:site_name" content="Mohamad Izzat Anis Portfolio">
  <meta property="og:title" content="Mohamad Izzat Anis | Cybersecurity Analyst">
  <meta property="og:description" content="SOC, OSINT and security automation. I build automation that turns security noise into actionable detection.">
  <meta property="og:image" content="https://izzateusoff.github.io/assets/img/og-image.png">
  <meta property="og:image:alt" content="Mohamad Izzat Anis - Cybersecurity Portfolio">
  <meta property="og:locale" content="en_US">
  <meta property="profile:first_name" content="Mohamad Izzat">
  <meta property="profile:last_name" content="Anis">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://izzateusoff.github.io/">
  <meta name="twitter:title" content="Mohamad Izzat Anis | Cybersecurity Analyst">
  <meta name="twitter:description" content="SOC, OSINT and security automation. I build automation that turns security noise into actionable detection.">
  <meta name="twitter:image" content="https://izzateusoff.github.io/assets/img/og-image.png">

  <!-- Icons & Stylesheet -->
  <link rel="icon" href="./assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="./assets/css/style.css">

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
${JSON.stringify(schemaLd, null, 2)}
  </script>

  <!-- No-JS & Crawler Visual Accessibility Override -->
  <noscript>
    <style>
      .reveal {
        opacity: 1 !important;
        transform: none !important;
      }
      .lightbox-modal {
        display: none !important;
      }
    </style>
  </noscript>
</head>
<body id="top">
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav">
    <div class="wrap nav-in">
      <a class="brand" href="#top" aria-label="Mohamad Izzat Anis, back to top"><span class="mono">&gt;_</span> M. Izzat Anis</a>
      <button class="icon-btn menu-btn" id="menuBtn" aria-expanded="false" aria-controls="navLinks" aria-label="Toggle menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <nav id="navLinks" class="links" aria-label="Primary">
        <a href="#about">About</a>
        <a href="#featured">Featured Project</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#military">Military</a>
        <a href="#skills">Skills</a>
        <a href="#education">Education</a>
        <a href="#certifications">Certifications</a>
        <a href="#awards">Awards</a>
        <a href="#contact">Contact</a>
      </nav>
      <button class="icon-btn" id="themeBtn" aria-label="Switch to light theme" aria-pressed="false">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      </button>
    </div>
  </header>

  <main id="main">
    <section class="hero" id="hero" aria-labelledby="heroName"><div class="wrap" id="heroMount">${sections.renderHero()}</div></section>
    <section id="about" aria-labelledby="about-h">${sections.renderAbout()}</section>
    <section id="featured" class="featured" aria-labelledby="featured-h">${sections.renderFeatured()}</section>
    <section id="projects" aria-labelledby="projects-h">${sections.renderProjects()}</section>
    <section id="experience" aria-labelledby="experience-h">${sections.renderExperience()}</section>
    <section id="military" aria-labelledby="military-h">${sections.renderMilitary()}</section>
    <section id="skills" aria-labelledby="skills-h">${sections.renderSkills()}</section>
    <section id="education" aria-labelledby="education-h">${sections.renderEducation()}</section>
    <section id="certifications" aria-labelledby="certifications-h">${sections.renderCertifications()}</section>
    <section id="awards" aria-labelledby="awards-h">${sections.renderAwards()}</section>
    <section id="contact" aria-labelledby="contact-h">${sections.renderContact()}</section>
  </main>

  <footer class="footer"><div class="wrap foot-in">
    <p id="footerText">© ${S.year} ${S.name}. ${C.footer}</p>
    <a href="#top">Back to top &uarr;</a>
  </div></footer>

  <script src="./assets/js/content.js"></script>
  <script src="./assets/js/main.js"></script>
</body>
</html>
`;

fs.writeFileSync(INDEX_PATH, indexHtml, 'utf8');
console.log(`Saved pre-rendered index.html (${indexHtml.length} bytes)`);

// 3. Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

# Dedicated AI and Search Bot Directives
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

Sitemap: https://izzateusoff.github.io/sitemap.xml
`;

fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf8');
console.log('Saved robots.txt');

// 4. Generate sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://izzateusoff.github.io/</loc>
    <lastmod>2026-11-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('Saved sitemap.xml');

// 5. Generate llms.txt (llmstxt.org standard)
const llmsTxt = `# Mohamad Izzat Anis - Cybersecurity Analyst Portfolio
> First Class Honours Cybersecurity Graduate (3.82 CGPA), Commissioned 2nd Lieutenant (PSSTUDM / Royal Malaysian Air Force), and Cybersecurity Analyst specializing in SOC Operations, Threat Intelligence (OSINT), and Security Automation.

## Personal Information
- Full Name: Mohamad Izzat Anis
- Current Role: Junior Cybersecurity Analyst at Bank Muamalat Malaysia Berhad (K-Youth)
- Location: Federal Territory of Kuala Lumpur, Malaysia
- Professional Profile: https://izzateusoff.github.io/
- LinkedIn: https://www.linkedin.com/in/izzatanis

## Professional Summary
First Class Honours Cybersecurity graduate (3.82 CGPA) and commissioned 2nd Lieutenant with a disciplined, mission-first approach to security work. Hands-on experience in security operations, threat triage, and OSINT investigations, with an emphasis on replacing repetitive manual checks with Python automation. Focused on security operations, detection engineering, and incident response.

## Core Technical Competencies
- Security Tools: Splunk (SIEM), CrowdStrike Falcon (EDR), Microsoft Defender, Microsoft Sentinel (fundamentals), Fortinet, Forcepoint DLP, Maltego, Shodan, VirusTotal, AbuseIPDB, Burp Suite, Nmap, Kali Linux, OWASP ZAP.
- Core Security Operations: Log analysis, endpoint protection, EDR, IDS/IPS, Vulnerability Management, System Hardening, Threat detection (OSINT), Incident triage and response, Root cause analysis, Forensic metadata extraction.
- Automation & Engineering: Python, PowerShell, WinRM (HTTPS), REST API integration, Flask, Bash, Selenium, Pandas, Workflow automation.
- Governance & Compliance: NIST Cybersecurity Framework (CSF), ISO 27001, PDPA, GDPR.
- Professional: Technical reporting, Stakeholder engagement, Crisis response, Project delivery.

## Key Work Experience
1. Junior Cybersecurity Analyst - Bank Muamalat Malaysia Berhad (K-Youth) (Jun 2026 - Oct 2026)
   - Monitored and triaged network, endpoint and DLP alerts using Splunk, CrowdStrike, Fortinet and Forcepoint.
   - Built an automated monitoring dashboard with SOC alerting that replaced daily manual server checks.
   - Built an SSL/TLS certificate expiry tracker, and designed a DLP risk analytics dashboard for the SOC and IT Operations teams.

2. OSINT Technical Operation Support | Cybersecurity Intern - Vulsan X Cydef Sdn. Bhd. (Mar 2025 - Mar 2026)
   - AI-assisted Python crawler that automated threat data collection, reducing manual investigation effort by 90%.
   - Triaged and investigated brand infringement and digital piracy cases and preserved digital evidence.
   - Investigated across the surface and dark web with Maltego and Shodan, and supported alert investigation using VirusTotal and AbuseIPDB.
   - Prepared investigation reports for leadership.

3. Operations & Technical Lead - Cybersphere Solution (university-incubated startup) (Apr 2023 - Mar 2025)
   - Led development of DIETMATE and JOMSCAN mobile applications.
   - Supervised the team, budget and partnerships, and mentored members.
   - Delivered cybersecurity awareness workshops. Won multiple national competition awards.

## Military Leadership & Service
- Rank: 2nd Lieutenant, Reserve Officer
- Branch: PSSTUDM, Royal Malaysian Air Force (TUDM)
- Background: Completed three years of rigorous officer cadet military training during university and currently serve as a commissioned Reserve Officer with the Royal Malaysian Air Force.
- Attributes Developed: Discipline, Leadership, Teamwork, Accountability, Adaptability, Responsibility.

## Education
1. Bachelor of Computer Science (Cybersecurity) with Honours
   - Institution: Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)
   - Duration: Oct 2022 - Mar 2026
   - Performance: CGPA 3.82 | First Class Honours | Dean's List (multiple semesters)
2. Diploma in Information Technology (Digital Technology)
   - Institution: Politeknik Seberang Perai (PSP)
   - Performance: CGPA 3.68

## Key Industry Certifications
- Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900) - Microsoft (Mar 2025)
- Cisco Certified CyberOps Associate - Cisco Networking Academy (Jul 2024, Valid until Jul 2027)
- Google Cybersecurity Professional Certificate - Google / Coursera (Aug 2026)
- AWS re/Start Graduate - Amazon Web Services (Aug 2026)
- Google AI Professional Certificate - Google / Coursera (Jun 2026)
- APAC Cybersecurity Fund - Asia Foundation & Google.org (Jun 2025)
- OPSWAT Academy Graduate (Multi-Domain Security Bundle) - OPSWAT Academy
- Hack The Box University CTF 2023 (Brains & Bytes) - Ranked 390th globally of ~1,000 universities representing UMPSA

## Featured Case Study
- Title: Combating Digital Piracy Using OSINT: An SOP-Based Case Study (Final Year Project with Vulsan X Cydef)
- Overview: Designed a Standard Operating Procedure (SOP) for investigating pirated film content across social platforms (Identification, Collection, Documentation, Analysis, Preservation, Reporting, Post-Reporting Follow-Up), tracking illicit distribution of an international film leak across major platforms.

## Portfolio Section Deep Links
- [About Me](https://izzateusoff.github.io/#about)
- [Featured Project](https://izzateusoff.github.io/#featured)
- [Projects](https://izzateusoff.github.io/#projects)
- [Work Experience](https://izzateusoff.github.io/#experience)
- [Military Leadership](https://izzateusoff.github.io/#military)
- [Skills Matrix](https://izzateusoff.github.io/#skills)
- [Education](https://izzateusoff.github.io/#education)
- [Certifications](https://izzateusoff.github.io/#certifications)
- [Awards & Recognition](https://izzateusoff.github.io/#awards)
- [Contact Me](https://izzateusoff.github.io/#contact)
`;

fs.writeFileSync(path.join(ROOT_DIR, 'llms.txt'), llmsTxt, 'utf8');
console.log('Saved llms.txt');

console.log('Build completed successfully!');
