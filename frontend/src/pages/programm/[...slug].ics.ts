import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { stripMarkdown } from '../../utils/seo';

export async function getStaticPaths() {
  const events = await getCollection('events');
  return events.map((event) => ({ params: { slug: event.id }, props: { event } }));
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\r?\n/g, '\\n');
const utc = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
// ponytail: Ende fix +2h (kein Endzeit-Feld im Schema), Feld ergänzen wenn Orbiter da ist
const DURATION_MS = 2 * 60 * 60 * 1000;

export const GET: APIRoute = ({ props, params, site }) => {
  const { event } = props as { event: Awaited<ReturnType<typeof getCollection<'events'>>>[number] };
  const { title, date } = event.data;
  const url = new URL(`/programm/${params.slug}/`, site).toString();
  const teaser = stripMarkdown(event.body ?? '').slice(0, 300);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Guitarena//guitarena.at//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${params.slug!.replace(/\//g, '-')}@guitarena.at`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(date)}`,
    `DTEND:${utc(new Date(date.getTime() + DURATION_MS))}`,
    `SUMMARY:${esc(`${title} – Guitarena`)}`,
    `LOCATION:${esc('Ortenburgerkeller, Schloss Porcia, Burgplatz 1, 9800 Spittal an der Drau')}`,
    `DESCRIPTION:${esc(`Einlass 19:00, Beginn 19:30. Karten: karten@porcia.at, Tel. 04762 / 42020.\n${teaser}\n${url}`)}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return new Response(lines.join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
