import { defineConfig } from 'astro/config';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://emaaad.com',
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/dev/'),
    }),
  ],
});
