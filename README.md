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

**Push to `main` and it deploys.** The `sistemi-website` Worker is connected to this
repo (Workers Builds), so Cloudflare runs `npm run build` then `npx wrangler deploy`
on every push to `main`. Build logs: *Workers & Pages → sistemi-website → Deployments*.

To deploy from your machine instead (e.g. to test something quickly):

```bash
npx wrangler login   # first time only
npm run deploy
```

Config is in `wrangler.jsonc`. It serves:
- `https://www.sistemi.ca`: the live site (custom domain, set in `wrangler.jsonc`)
- `https://sistemi-website.sistemipx.workers.dev`: test address, same content

`sistemi.ca` (no `www`) is redirected to `https://www.sistemi.ca` by a Redirect Rule on
the `sistemi.ca` zone (*Rules → Redirect Rules*), with *Always Use HTTPS* on. DNS,
including the Google Workspace email records (MX, SPF, DKIM), is managed in Cloudflare.
