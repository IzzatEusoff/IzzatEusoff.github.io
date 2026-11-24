# Mohamad Izzat Anis: Portfolio

Static site (HTML + CSS + vanilla JS). No backend, no trackers, no external fonts or requests. All content is in `assets/js/content.js`.

## 1. Run locally and edit

```
cd portfolio
python -m http.server 8000      # then open http://localhost:8000
```
Edit `assets/js/content.js` (text, projects, certificates, links). Refresh the browser. Layout code lives in `assets/js/main.js` and `assets/css/style.css`.

Any value that still contains `[[...]]` is treated as "not provided" and hidden automatically. Remove the `[[...]]` marker by replacing the whole value.

**Certificate & Award links:**
- If an item has an official issuer-hosted `verifyUrl`, it shows a "Verify credential" button.
- Else if `onLinkedIn: true` is set, it shows a "View on LinkedIn" button pointing to `LINKEDIN_CERTS_URL` or `LINKEDIN_HONORS_URL`.
- Items not on LinkedIn and without an issuer link render as plain text only (no button, no label).

## 2. Deploy

### GitHub Pages (Step-by-Step)

> [!IMPORTANT]
> **Run the privacy scan BEFORE your first commit!**
> On a free GitHub account, GitHub Pages requires a **public repository**. This means all source files and commit history will be visible on GitHub. Complete the Pre-publish Privacy Checklist (Section 6) before running `git add` or `git commit`.

1. **Verify your local files**:
   Run the privacy scan script in Section 6 to ensure no personal numbers, email addresses, or unreleased details exist in the source code.
2. **Initialize git repository and commit**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```
3. **Create the GitHub repository**:
   - Go to [GitHub New Repository](https://github.com/new).
   - Name your repo (e.g., `portfolio` or `username.github.io`).
   - Keep it **Public** (required for GitHub Pages on free accounts).
   - Leave "Initialize with README" unchecked.
4. **Push your code**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```
5. **Enable GitHub Pages**:
   - Go to your repository on GitHub: **Settings > Pages**.
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`. Click **Save**.
   - Wait ~1–2 minutes. The live URL will appear at the top of the Pages tab.
6. **Subfolder & relative URLs**:
   All asset paths use relative links (`./assets/...`), so the site works automatically whether deployed to a user root domain (`https://username.github.io/`) or a project subfolder (`https://username.github.io/portfolio/`).
7. **Privacy & indexing**:
   `<meta name="robots" content="noindex, nofollow">` is currently enabled in `index.html` to prevent search engine indexing during review. Do not change `og:image` to an absolute URL until you are ready for public discovery.

### Netlify
Drag the folder onto https://app.netlify.com/drop, or connect the repo (no build command, publish directory `.`).

### Contact Form
The contact form is wired to `FORM_ENDPOINT = "[[FORM_ENDPOINT]]"` in `assets/js/content.js`.
- While `FORM_ENDPOINT` contains `[[ ]]`, the form is automatically hidden.
- When configured, the contact form displays with client-side validation, a honeypot anti-spam field, and JSON submission.

## 3. Placeholders to fill

| Token | Where | Notes |
|---|---|---|
| `[[FORM_ENDPOINT]]` | `FORM_ENDPOINT` in `content.js` | Formspree URL; form stays hidden until set |
| `[[GITHUB_URL]]` | `site.github` | Icon hidden until set |
| `[[CONFIRM]]` (relocate) | `site.openToRelocate` | `true`/`false` |
| `[[CONFIRM]]` 90% claim | project 1 outcome | Keep only if you can explain the measurement |
| `[[GOOGLE_AI_COURSERA_URL]]` | Google AI `verifyUrl` | Falls back to LinkedIn list page until set |
| `[[CREDLY_BADGE_URL]]` | Cisco CyberOps `verifyUrl` | Falls back to LinkedIn list page until set |
| `[[OPSWAT_VERIFY_URL or empty]]` | OPSWAT `verifyUrl` | Plain text until set |
| `[[CONFIRM level]]` | Governance skills | State as familiarity, not certification |
| `assets/docs/resume.pdf` | file | Replace placeholder with sanitised PDF |

## 4. Replacing and sanitising the profile photo & resume

### Profile Photo (`assets/img/photo.jpg`)
The site displays `./assets/img/photo.jpg` in the hero section. If the file is missing or fails to load, `onerror` automatically hides the photo container and expands the hero text to full width without displaying any broken image icon.

To replace with your own photo:
1. **Crop & Resize**: Crop to a 1:1 square aspect ratio and resize to 560×560 px (or 280×280 px) JPEG:
   ```bash
   # Using ImageMagick
   magick input.jpg -resize 560x560^ -gravity center -extent 560x560 assets/img/photo.jpg
   ```
2. **Strip all EXIF & GPS metadata**:
   Never upload an unscrubbed phone/camera image directly. Strip all metadata:
   ```bash
   exiftool -all= -overwrite_original assets/img/photo.jpg
   ```
3. **Verify metadata is clean**:
   ```bash
   exiftool assets/img/photo.jpg
   # Verify: no GPS coordinates, camera model, lens serial, or creation timestamps appear
   ```

### Resume PDF (`assets/docs/resume.pdf`)
Remove phone, address, IC, DOB and references from the source document *before* exporting. Then strip metadata:
```bash
exiftool -all= -overwrite_original assets/docs/resume.pdf
qpdf --linearize --replace-input assets/docs/resume.pdf   # optional: drops incremental-update history
```
Re-open the PDF, search for "+60", "@" and digits patterns, and check Document Properties (Author field).

## 5. Optional: keep the site private (noindex)
In `index.html`, `<meta name="robots" content="noindex, nofollow">` is currently enabled. For stronger privacy also add a `robots.txt` with `User-agent: *` / `Disallow: /`. Remove both when ready to go public. (This only discourages search engines; it is not access control.)

## 6. Pre-publish privacy checklist
Run from the site folder (PowerShell):
```powershell
Select-String -Path index.html,assets\js\*.js,assets\css\*.css,README.md -Pattern '\+60','\b01\d[- ]?\d{7,8}\b','[\w.+-]+@[\w-]+\.[\w.]+','mailto:'
Select-String -Path index.html,assets\js\*.js -Pattern '<FILM TITLE>','<IC NUMBER>','<REFERENCE NAMES>'
Get-ChildItem -Recurse assets | Where-Object Extension -match 'jpg|jpeg|png|pdf'
```
- [ ] No phone patterns, `+60`, email addresses or `mailto:` in the source (the first command should return nothing, aside from this README's own examples)
- [ ] IC number, film title and references' names return no matches (fill in the real values in the second command; do not save them in the repo)
- [ ] `/assets` contains only: `og-image.png`, `photo.jpg`, and the sanitised `resume.pdf`. No certificate scans
- [ ] Every external link has `target="_blank" rel="noopener noreferrer"` (all are created via one helper in `main.js`; check in DevTools: `document.querySelectorAll('a[target=_blank]:not([rel~=noopener])')` returns 0)
- [ ] No `[[` tokens visible on the live page
- [ ] Resume PDF opened and checked, metadata stripped
- [ ] Lighthouse run (Chrome DevTools) shows 90+ for all four categories
