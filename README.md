# Nidhi Pezhai

A Tamil financial education blog built with Eleventy. Articles are Markdown files, and each build discovers the files in `_posts/` and publishes an article page plus an automatically updated home-page listing.

## Run locally

```sh
npm install
npm run dev
```

Eleventy serves the site at `http://localhost:8080` and rebuilds it when source files change. Create a production build with `npm run build`; the static output is written to `_site/`.

## Add an article

Create a Markdown file in `_posts/`, for example `_posts/retirement-savings.md`:

```markdown
---
title: ஓய்வுக்கால சேமிப்பைத் திட்டமிடுவது எப்படி?
description: ஓய்வுக்கால இலக்குகளைப் பற்றி சிந்திக்க உதவும் தொடக்க வழிகாட்டி.
date: 2026-10-01
topics:
  - ஓய்வூதியம்
---

இங்கே உங்கள் கட்டுரையை Markdown-ல் எழுதுங்கள்.

## ஒரு துணைத்தலைப்பு

பத்திகள், பட்டியல்கள், இணைப்புகள் போன்ற வழக்கமான Markdown அமைப்புகளைப் பயன்படுத்தலாம்.
```

The article appears in the newest-first list, topic filters, search results, and its own `/articles/<filename>/` page. No index or navigation file needs to be edited when adding a post.

## GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` builds and deploys on every push to `main`, including pushes created when a pull request is merged. It can also be run manually from the Actions tab. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

The workflow defaults to `nidhipezhai.com`, writes it into the deployed `CNAME` file, and builds links for the domain root. To use a different custom domain, set the repository Actions variable `CUSTOM_DOMAIN` to the domain only (for example, `blog.example.com`). Without a custom domain, remove the default from the workflow so it uses the repository subpath supplied by GitHub Pages. Point the domain’s DNS records to GitHub Pages using the current instructions from GitHub, then enable HTTPS in the repository’s Pages settings after DNS verification.

Calculator source files live in `_calculators/` and are copied into `_site/calculators/` unchanged. The calculator directory and homepage link to those generated routes.

## Languages

Tamil is the default language. The English home page at `/en/` lists completed English articles and links to the English guide, calculator and checklist directories. On an article, calculator, or checklist, the language selector links to its published translation when available; otherwise the unavailable language is disabled. The guide, glossary, About, Disclaimer and License pages also have matching language links. On other pages, it navigates to the other language's home page.

Article files in `_posts/en/` default to English and automatically appear on the English home page and sitemap at `/en/articles/<filename>/`, without changing existing Tamil URLs. Use the same filename as the Tamil article to connect the language selector. For an unfinished translation, set `draft: true` in its front matter to prevent publication until it is ready.

Tools in `_calculators/en/` and `_checklists/en/` default to English and appear automatically in their English directory and sitemap at `/en/calculators/<filename>.html` or `/en/checklists/<filename>.html`. For an unfinished tool, set `publishedEnglish: false` to prevent publication. Use the same filename as the Tamil tool to connect the language selector; the Tamil tool must also be listed in its directory data. Translate interactive messages and exports as well as the visible page.

The English calculator directory and next-calculator links follow the categories and order in `_data/calculators.json`. Add a new calculator to a Tamil category there to group its English counterpart; English calculators without a matching entry appear under Other calculators automatically.

The Tamil glossary in `_data/glossary.json` is the master for the English glossary at `/en/glossary/`. For each master entry, maintain a reviewed translation in `_data/glossary-en.json` with the same `id` and English term, the corresponding English category, a translated `definition` and `example`, and a related link to the same resource. Link to a published English translation when available; otherwise use the Tamil URL with `language: ta`. Run `npm run check:glossary` to check IDs, terms, categories and related URLs after making changes; review translations manually when the master definitions or examples change.