# Shiteng Lu · Research & Fieldnotes

Personal academic website for Shiteng Lu / 路仕腾.

Published with GitHub Pages at https://uestc-simon.github.io/ .

## Development

Requires Node.js 24.

```sh
npm ci
npm run dev
```

## Build and publish

```sh
npm test
npm run build
```

The static website is generated in `out/`. GitHub Pages serves the `gh-pages` branch. After editing, run `npm run deploy:pages` to build locally and publish the generated pages; Git authenticates through the local credential manager. The optional Actions workflow can be triggered manually when Actions is enabled for the account. Source lives on `main`; commit and push source edits separately to keep the repository up to date.

Edit `lib/profile.ts` to update profile, research, projects and contact links. Add Markdown posts in `content/posts/`; only posts with `draft: false` appear on the site. This public repository contains source files, so draft files committed here are publicly readable even while hidden from the website. Keep private drafts outside the repository until ready to share.

Post frontmatter requires title, slug, date (YYYY-MM-DD), lang (en or zh), summary, category. Tags use a JSON string array. Draft defaults to true. The two included examples are unpublished writing templates.

The neural illustration supports pointer exploration, selection, pause/reset and reduced-motion preferences. The site includes Chinese/English UI, light/dark reading, printable CV and RSS.
