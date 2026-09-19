import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isPast } from '../utils/date';

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

  // lastmod nur für vergangene Konzerte: dort ist der Inhalt nach dem Abend stabil (Konzertdatum als Näherung)
  const urls: { path: string; lastmod?: string }[] = [
    ...staticPages.map((path) => ({ path })),
    ...events.map((event) => ({
      path: `/programm/${event.id}/`,
      lastmod: isPast(event.data.date) ? event.data.date.toISOString().slice(0, 10) : undefined,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, lastmod }) => `  <url>
    <loc>${new URL(path, SITE).toString()}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
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
