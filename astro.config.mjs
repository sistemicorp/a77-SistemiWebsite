// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.sistemi.ca',
  // Keep the old Google Sites URL working.
  redirects: {
    '/home': '/',
  },
});
