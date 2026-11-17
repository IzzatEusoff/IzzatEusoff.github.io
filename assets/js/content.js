/* ALL site content lives here. Edit text, links and certificates freely.
   Unconfigured placeholder values are hidden or handled automatically. */
// Change these links in one place.
var LINKEDIN_CERTS_URL = "https://www.linkedin.com/in/izzatanis/details/certifications/";
var LINKEDIN_HONORS_URL = "https://www.linkedin.com/in/izzatanis/details/honors/";
var FORM_ENDPOINT = "[[FORM_ENDPOINT]]";

window.CONTENT = {
  formEndpoint: FORM_ENDPOINT,
  links: { linkedinCerts: LINKEDIN_CERTS_URL, linkedinHonors: LINKEDIN_HONORS_URL },
  site: {
    name: "Mohamad Izzat Anis",
    title: "Cybersecurity Analyst | SOC, OSINT & Security Automation",
    oneLiner: "I build automation that turns security noise into actionable detection.",
    location: "Selangor, Malaysia",
    openToRelocate: true,
    status: "Open to opportunities",
    photo: "./assets/img/photo.jpg",
    photoAlt: "Portrait of Mohamad Izzat Anis",
    linkedin: "https://linkedin.com/in/izzatanis",
    github: "[[GITHUB_URL]]",
    formEndpoint: FORM_ENDPOINT,
    year: 2026
  },

  about: {
    text: "First Class Honours Cybersecurity graduate (3.82 CGPA) and commissioned 2nd Lieutenant with a disciplined, mission-first approach to security work. I have hands-on experience in security operations, threat triage and OSINT investigations, and I enjoy replacing repetitive manual checks with Python automation. I am looking to grow in security operations and detection engineering in a team where I can keep learning and contribute from day one.",
    facts: [
      { big: "3.82", small: "CGPA" },
      { big: "First Class", small: "Honours" },
      { big: "Dean's List", small: "multiple semesters" },
      { big: "2nd Lieutenant", small: "PSSTUDM" },
      { big: "Languages", small: "English, Bahasa Malaysia (fluent), Tamil (moderate)" }
    ]
  },

  featured: {
    title: "Combating Digital Piracy Using OSINT: An SOP-Based Case Study",
    subtitle: "Final Year Project, industry collaboration with Vulsan X Cydef Sdn. Bhd. | Universiti Malaysia Pahang Al-Sultan Abdullah | 2025",
    overview: "I designed a Standard Operating Procedure for investigating pirated film content across social platforms, covering identification, collection, documentation, analysis, evidence preservation, reporting and follow-up. I applied it to a real case involving a 2025 international film leak, tracking a large volume of infringing listings across all major platforms and measuring how each platform responded to takedown reports.",
    problem: "Independent creators and small production teams often lack the time, tools and legal resources to track and remove pirated content. Platform reporting tools are built for individual use, give little transparency, and pirated content can stay online for days or weeks after being reported. Existing anti-piracy work depends heavily on manual searching, screenshots and form filling.",
    approach: "I built a repeatable, evidence-based process that adds structure and automation to the pre-reporting phase while keeping platform reporting itself manual and compliant. It combines semi-automated collection (Apify and basic Python tooling for keyword matching and link logging) with manual OSINT verification (IntelTechniques, Yandex reverse image search, Google Alerts, Social Buzz).",
    pipeline: [
      { name: "Identification", caption: "Keyword and hashtag strategy, platform selection" },
      { name: "Collection", caption: "Automated and manual gathering of public URLs, usernames, timestamps" },
      { name: "Documentation", caption: "Structured evidence logs and screenshots" },
      { name: "Analysis", caption: "Categorising content by disguise tactic and reach" },
      { name: "Preservation", caption: "Organised storage, integrity checks (file hashes / metadata), preservation record" },
      { name: "Reporting", caption: "In-platform complaint channels and official IP complaint routes" },
      { name: "Post-Reporting Follow-Up", caption: "Tracking takedown outcomes and re-reporting" }
    ],
    stats: [
      { big: "Real industry case", small: "Case study" },
      { big: "Multi-platform analysis", small: "Scope" },
      { big: "Evidence-based reporting", small: "Methodology" }
    ],
    resultsTitle: "Platform responsiveness to takedown reports",
    resultsCaption: "Platforms ranked by how often reported content was removed.",
    rankings: [
      { level: "High", platforms: ["Telegram", "Other websites"] },
      { level: "Moderate", platforms: ["Facebook", "YouTube"] },
      { level: "Low", platforms: ["TikTok", "Instagram"] },
      { level: "None observed", platforms: ["X / Twitter"] }
    ],
    findings: [
      "Enforcement was uneven across platforms.",
      "The platform with the largest volume of infringing content had a low removal rate.",
      "Identical content got different outcomes on the same platform.",
      "Automated moderation often misses content from small or independent rights holders.",
      "Regulatory escalation is a recommended way to strengthen outcomes."
    ],
    limitations: "Reporting and evidence tracking were largely manual and kept in spreadsheets, which does not scale. I recommended a secure database or dashboard for evidence handling and traceability as future work.",
    skills: ["OSINT", "Python", "Apify", "Evidence Preservation", "Process Design (SOP)", "Data Analysis", "Technical Reporting"],
    note: "Details are sanitised. Target content, platform links and evidence are intentionally not published."
  },

  projects: [
    {
      title: "Automated Application Monitoring",
      org: "Bank Muamalat",
      sanitised: true,
      problem: "Server health was checked by hand every day.",
      built: "A real-time monitoring dashboard that checks application servers continuously and alerts the SOC automatically when something goes wrong.",
      result: "Replaced daily manual checks with continuous monitoring and faster incident awareness.",
      tools: ["Python", "Flask", "PowerShell", "Chart.js"],
      note: "Details are intentionally limited for confidentiality."
    },
    {
      title: "DLP Risk Analytics Dashboard",
      org: "Bank Muamalat",
      sanitised: true,
      design: true,
      problem: "Raw DLP activity was hard to turn into clear insight for management and the SOC.",
      designed: "A dashboard concept that shows sensitive-data activity, risk trends and repeat behaviour, with every figure traceable to its source events.",
      status: "Design stage. Production use depends on approved integration.",
      tools: ["Python", "SQL"],
      note: "Details are intentionally limited for confidentiality."
    },
    {
      title: "SSL/TLS Certificate Expiry Tracker",
      org: "Bank Muamalat",
      sanitised: true,
      problem: "Certificate expiry was tracked in spreadsheets.",
      built: "A dashboard that shows how long each certificate has left, sorts them by risk, and emails the infrastructure and security teams before they expire.",
      result: "One central view with automated alerts and an audit history.",
      tools: ["Python", "Flask", "SQLite"],
      note: "Details are intentionally limited for confidentiality."
    },
    {
      title: "AI-Assisted Threat Data Crawler",
      org: "Vulsan X Cydef",
      sanitised: false,
      problem: "Threat data collection was slow and manual.",
      built: "An AI-assisted Python crawler that automates collection of threat data.",
      result: "Reduced manual investigation effort by 90% and increased processing speed.",
      tools: ["Python", "Automation", "AI-assisted development"]
    }
  ],

  experience: [
    {
      role: "Junior Cybersecurity Analyst",
      org: "Bank Muamalat Malaysia Berhad (K-Youth)",
      dates: "Jun 2026 - Oct 2026",
      bullets: [
        "Monitored and triaged network, endpoint and DLP alerts using Splunk, CrowdStrike, Fortinet and Forcepoint.",
        "Built an automated monitoring dashboard with SOC alerting that replaced daily manual server checks.",
        "Built an SSL/TLS certificate expiry tracker, and designed a DLP risk analytics dashboard for the SOC and IT Operations teams."
      ]
    },
    {
      role: "OSINT Technical Operation Support | Cybersecurity Intern",
      org: "Vulsan X Cydef Sdn. Bhd.",
      dates: "Mar 2025 - Mar 2026",
      bullets: [
        "AI-assisted Python crawler that automated threat data collection, reducing manual investigation effort by 90%.",
        "Triaged and investigated brand infringement and digital piracy cases and preserved digital evidence.",
        "Investigated across the surface and dark web with Maltego and Shodan, and supported alert investigation using VirusTotal and AbuseIPDB.",
        "Prepared investigation reports for leadership."
      ]
    },
    {
      role: "Operations & Technical Lead",
      org: "Cybersphere Solution (university-incubated startup)",
      dates: "Apr 2023 - Mar 2025",
      bullets: [
        "Led development of DIETMATE and JOMSCAN.",
        "Supervised the team, budget and partnerships, and mentored members.",
        "Delivered cybersecurity awareness workshops."
      ]
    }
  ],

  skills: [
    { group: "Security tools", items: ["Splunk (SIEM)", "CrowdStrike Falcon (EDR)", "Microsoft Defender", "Sentinel (fundamentals)", "Fortinet", "Forcepoint DLP", "Maltego", "Shodan", "VirusTotal", "AbuseIPDB", "Burp Suite", "Nmap", "Kali Linux", "OWASP ZAP"] },
    { group: "Core security", items: ["Log analysis", "Endpoint protection", "EDR", "IDS/IPS", "Vulnerability Management", "System Hardening", "Threat detection (OSINT)", "Incident triage and response", "Root cause analysis", "Forensic metadata extraction"] },
    { group: "Automation and engineering", items: ["Python", "PowerShell", "WinRM (HTTPS)", "REST API integration", "Flask", "Bash", "Selenium", "Pandas", "Workflow automation"] },
    { group: "Governance & compliance (foundational knowledge)", items: ["NIST Cybersecurity Framework", "ISO 27001", "PDPA", "GDPR"] },
    { group: "Professional", items: ["Technical reporting", "Stakeholder engagement", "Crisis response", "Project delivery"] }
  ],

  education: [
    {
      degree: "Bachelor of Computer Science (Cybersecurity) with Honours",
      school: "UMPSA",
      dates: "Oct 2022 - Mar 2026",
      detail: "CGPA 3.82 | Dean's List, multiple semesters"
    },
    {
      degree: "Diploma in Information Technology (Digital Technology)",
      school: "Politeknik Seberang Perai",
      dates: "",
      detail: "CGPA 3.68"
    }
  ],

  certificationsIntro: "Credentials are listed with official verification links where available. Documents are not published online to protect personal data; copies are available on request.",
  certificationGroups: [
    // Newest first inside each group.
    // verifyUrl (issuer-hosted) => "Verify credential". Else onLinkedIn:true => "View on LinkedIn" (list page only). Else => plain text only (no button, no label).
    {
      group: "Industry certifications",
      items: [
        {
          title: "Microsoft Certified: Security, Compliance, and Identity Fundamentals (SC-900)",
          issuer: "Microsoft", date: "Mar 2025", type: "Certification",
          onLinkedIn: true,
          verifyUrl: "https://learn.microsoft.com/api/credentials/share/en-gb/MOHAMADIZZATANISBINEUSOFF-3463/4FB0B4F470233C9B?sharingId=CB5E824ED589E5C3"
        },
        {
          title: "Cisco Certified CyberOps Associate",
          issuer: "Cisco Networking Academy", date: "Jul 2024", type: "Certification",
          note: "Valid until Jul 2027.",
          onLinkedIn: true,
          verifyUrl: "[[CREDLY_BADGE_URL]]"
        }
      ]
    },
    {
      group: "Professional certificates & programmes",
      items: [
        {
          title: "Google Cybersecurity Professional Certificate",
          issuer: "Google (Coursera)", date: "Aug 2026", type: "Professional Certificate",
          verifyUrl: "https://www.coursera.org/account/accomplishments/specialization/OY8F5YYQUV2Z"
        },
        {
          title: "AWS re/Start Graduate",
          issuer: "Amazon Web Services", date: "Aug 2026", type: "Programme",
          verifyUrl: "https://www.credly.com/badges/03eeb9bb-0681-4bc0-8dbd-8a646c46f348"
        },
        {
          title: "Google AI Professional Certificate",
          issuer: "Google (Coursera)", date: "Jun 2026", type: "Professional Certificate",
          onLinkedIn: true,
          verifyUrl: "[[GOOGLE_AI_COURSERA_URL]]"
        },
        {
          title: "APAC Cybersecurity Fund",
          issuer: "Asia Foundation & Google.org", date: "Jun 2025", type: "Programme",
          onLinkedIn: true,
          verifyUrl: ""
        },
        {
          title: "OPSWAT Academy Graduate (Multi-Domain Security Bundle)",
          issuer: "OPSWAT Academy", year: null, type: "Programme",
          verifyUrl: "[[OPSWAT_VERIFY_URL or empty]]"
        },
        {
          title: "Specialised training (certificates available on request)",
          issuer: "", year: null, type: "Training",
          note: "Network Pentesting, Burp Suite, Nmap, Digital Forensics, Mobile Security, Kali Linux.",
          verifyUrl: ""
        }
      ]
    },
    {
      group: "Competitions",
      items: [
        {
          title: "Hack The Box University CTF 2023 (Brains & Bytes)",
          issuer: "Hack The Box", date: "Dec 2023", type: "Competition",
          note: "Ranked 390th globally of ~1,000 universities, representing UMPSA.",
          onLinkedIn: true,
          verifyUrl: ""
        }
      ]
    }
  ],

  awardsIntro: "Awards are listed on my LinkedIn.",
  awards: [
    { title: "Champion, UMPSA x Huawei AppGallery Mobile App Competition 2024 (Track A, 120 teams)", date: "Nov 2024", project: "DIETMATE", onLinkedIn: true },
    { title: "Silver, iCE-CInno 2024", date: "Nov 2024", project: "JOMSCAN", onLinkedIn: true },
    { title: "Gold Medal, DICE 2.0 (Interactive Media AR/VR)", date: "Aug 2024", project: "JOMSCAN", onLinkedIn: true },
    { title: "Gold Award, Citrex 2024 (Undergraduate Category)", date: "May 2024", project: "DIETMATE", onLinkedIn: true },
    { title: "National Cybersecurity Training Scholarship (NACSA, EC-Council, MKN)", date: "2024" },
    { title: "Silver, INoDEx 2023", date: "Sep 2023", project: "DIETMATE", onLinkedIn: true },
    { title: "Finalist, IBIEC 2023 (ICT & Multimedia)", date: "Aug 2023", project: "DIETMATE", onLinkedIn: true },
    { title: "Gold, INVIDE 2023", date: "Jun 2023", onLinkedIn: true }
  ],

  contact: {
    heading: "Let's connect",
    text: "The quickest way to reach me is LinkedIn or the form below. My resume is available on request.",
    references: "References available on request."
  },

  footer: "Built as a static site with no trackers."
};
