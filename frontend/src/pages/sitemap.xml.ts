import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://guitarena.at';

export const GET: APIRoute = async () => {
  const events = await getCollection('events');
  const staticPages = [
    '/',
    '/programm/',
    '/archiv/',
    '/about/',
    '/gaestebuch/',
    '/kontakt/',
  ];

  const urls = [
    ...staticPages,
    ...events.map((event) => `/programm/${event.id}/`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${new URL(path, SITE).toString()}</loc>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
