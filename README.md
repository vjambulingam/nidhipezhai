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

The workflow in `.github/workflows/pages.yml` builds and deploys on every push to `master`; it can also be run manually from the Actions tab. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

For a custom domain, add a repository Actions variable named `CUSTOM_DOMAIN` with the domain only (for example, `blog.example.com`). The workflow writes it into the deployed `CNAME` file and builds links for the domain root. Without this variable, it uses the repository subpath supplied by GitHub Pages. Point the domain’s DNS records to GitHub Pages using the current instructions from GitHub, then enable HTTPS in the repository’s Pages settings after DNS verification.

Calculator source files live in `_calculators/` and are copied into `_site/calculators/` unchanged. The calculator directory and homepage link to those generated routes.