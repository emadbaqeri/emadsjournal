import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://emaaad.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/dev/'),
    }),
  ],
  markdown: { shikiConfig: { theme: 'css-variables' } },
});
