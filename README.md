# RedHat Funding marketing site

A static Bootstrap 5 website for RedHat Funding, an MCA brokerage. The site mirrors the structure of One Park Financial with hero messaging, trust signals, step-by-step process, minimum qualifications, FAQs, resources, and contact forms across six public pages.

## Project structure

```
├── index.html                    # Home page with hero, trust badges, process, and application form
├── how-it-works.html             # Process comparison, benefits, and application form
├── about.html                    # Mission, story, leadership, credibility stats, and application form
├── faq.html                      # Accordion FAQ and application form
├── resources.html                # Resource hub with article cards and CTA
├── resources/
│   └── resource-what-is-mca.html # In-depth MCA guide with anchors for resource cards
├── assets/
│   ├── css/styles.css            # Custom brand styles and layout helpers
│   └── js/main.js                # Smooth scroll helper and Formspree disable logic
├── img/                          # Placeholder SVG badges, logos, thumbnails, headshots
└── .github/workflows/pages.yml   # GitHub Pages deployment workflow
```

All pages share a sticky navigation bar, footer, skip link, and CTA form so the “Get Funded” button always jumps to the `#apply` section.

## Editing the site

1. **Update hero copy**
   - Open `index.html` (and any other page hero you want to change).
   - Search for the `<section class="hero">` block and edit the `<h1>` text and `<p class="lead">` copy.
   - Save the file and commit.

2. **Swap brand assets or logos**
   - Replace the placeholder SVG files inside `/img/` (e.g., `logo-redhat-funding.svg`, `badge-bbb.svg`).
   - Keep the same filenames to avoid updating HTML references, or update the `<img src="...">` paths if you introduce new filenames.

3. **Add more trust badges**
   - In `index.html`, locate the `trust-strip` section.
  - Duplicate one of the `<div class="col-md-4">` columns and swap the `<img>` and alt text.

4. **Add a new FAQ entry**
   - Open `faq.html`.
   - Duplicate an `.accordion-item` block inside the `#faqAccordion` container.
   - Give the new question a unique heading ID (e.g., `headingTen`) and matching collapse ID (e.g., `collapseTen`).
   - Update the button text and accordion body content.

5. **Add a new resource card**
   - Open `resources.html` and scroll to the `#articles` section.
   - Duplicate an `<article class="resource-card">` column.
   - Update the image, title, blurb, date, and link. If you are pointing to a new article file, create it in `/resources/` (see next step).

6. **Create a new article page**
   - Copy `resources/resource-what-is-mca.html` and rename it (e.g., `resource-cash-flow-tips.html`).
   - Update the meta tags, breadcrumb text, hero heading, byline, and article content.
   - Adjust any internal anchor links as needed and keep the CTA form at the bottom so navigation remains consistent.

7. **Wire up Formspree**
   - Create a Formspree form and grab your endpoint URL (e.g., `https://formspree.io/f/abcd1234`).
   - In every page that contains `<form id="fundingForm">`, replace the `action="https://formspree.io/f/your-id-here"` attribute with your live endpoint.
   - Remove or comment out the `Connect Formspree—see README` banner if you no longer need the reminder.
   - Delete the `disabled` attributes from the inputs or remove the disabling logic in `assets/js/main.js` if you prefer to keep the form live by default.

## Deploying to GitHub Pages

1. Push the `main` branch to GitHub.
2. In your repository settings (`Settings → Pages`), ensure the source is set to “GitHub Actions.”
3. The included workflow `.github/workflows/pages.yml` publishes the root of the repository on every push to `main`.
4. Wait for the “Deploy to GitHub Pages” workflow to succeed, then visit the published URL shown in the Actions log.

## Connecting a custom domain

1. Purchase or configure your domain with your preferred registrar.
2. In GitHub, go to `Settings → Pages` and add your custom domain.
3. Update your DNS records:
   - Add an `A` record pointing to GitHub’s Pages IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153).
   - Optionally add a `CNAME` for subdomains pointing to `<username>.github.io`.
4. Wait for DNS propagation, then enable HTTPS in the Pages settings.

## Going further

- **Spanish localization**: Create an `/es/` directory. Duplicate each page into Spanish (e.g., `/es/index.html`) and translate the content. Update navigation links in the Spanish pages to point to other `/es/` pages.
- **Google Analytics**: In each HTML file, find the comment `<!-- TODO: Paste Google Analytics tag here when ready -->` inside the `<head>` element. Replace the comment with your GA4 tag (or add the script immediately after the comment) once you have a property ID.
- **Enhance performance & SEO**: Run Lighthouse audits locally or in Chrome DevTools. Aim for Performance and Accessibility scores above 90 by compressing images, inlining critical CSS, and double-checking alt text and heading order.

## Form and accessibility notes

- Forms are intentionally disabled until a real Formspree endpoint is added. Remove the placeholder or update the script once you are ready to accept submissions.
- Every page includes a skip link, descriptive alt text, keyboard-visible focus states, and responsive layouts tested on mobile breakpoints. Continue to run accessibility checks if you introduce new components.

Happy funding!
