// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.sistemi.ca',

  // Keep the old Google Sites URL working.
  redirects: {
    '/home': '/',
  },

  integrations: [
    sitemap({
      // Leave redirect-only pages out of the sitemap.
      filter: (page) => !page.endsWith('/home/'),
    }),
  ],
});
