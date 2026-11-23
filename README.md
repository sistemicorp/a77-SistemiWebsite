# a77-SistemiWebsite

Source for [www.sistemi.ca](https://www.sistemi.ca), built with [Astro](https://astro.build) and hosted on Cloudflare.

## Run locally

Requires Node.js 22+.

```bash
npm install      # first time only
npm run dev      # live-reloading dev server at http://localhost:4321
```

To check the production build:

```bash
npm run build    # outputs static site to dist/
npm run preview  # serves dist/ at http://localhost:4321
```

## Where things are

| What | Where |
|---|---|
| Home page | `src/pages/index.astro` |
| P1150 pages | `src/pages/p1150/` (`index.astro`, `downloads.astro`, `videos.astro`, `faq.md`, `accessories.astro`) |
| Team | `src/pages/team.astro` (edit the `team` list at the top) |
| Header / nav, footer | `src/components/Header.astro`, `src/components/Footer.astro` |
| Shopify Buy Button | `src/components/ShopifyCollection.astro` |
| Colours, fonts, shared styles | `src/styles/global.css` |
| Images, PDFs, favicon | `public/` (served as-is, e.g. `public/docs/x.pdf` → `/docs/x.pdf`) |

Common edits:
- **FAQ**: plain Markdown in `src/pages/p1150/faq.md`; each `##` heading is a question.
- **CLI release**: change `cliVersion` at the top of `src/pages/p1150/downloads.astro`.
- **Videos**: add YouTube IDs to the `videos` list in `src/pages/p1150/videos.astro`.
- **Accessories**: edit the `accessories` list in `src/pages/p1150/accessories.astro`.

## Deploy (Cloudflare Workers, static assets)

**Option A: Git integration (recommended).** In the Cloudflare dashboard go to
*Workers & Pages → Create → Import a repository*, select this repo, and set:
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Every push to `main` deploys; other branches get preview URLs.

**Option B: from your machine.**

```bash
npx wrangler login
npm run deploy
```

Config is in `wrangler.jsonc`. Once it's live on the `*.workers.dev` URL, add the
custom domains `www.sistemi.ca` and `sistemi.ca` under the Worker's
*Settings → Domains & Routes*, then remove the custom domain from Google Sites.
