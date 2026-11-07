import type { APIRoute } from 'astro';
import { SITE_TAGLINE, SITE_TITLE } from '../lib/site';

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>https://emaaad.com/</link>
    <description>${SITE_TAGLINE}</description>
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
