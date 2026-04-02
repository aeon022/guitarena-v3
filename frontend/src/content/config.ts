import { defineCollection, z } from 'astro:content';
import dummyData from './content.json';

const eventSchema = z.object({
  title: z.string().min(3, "Titel muss mindestens 3 Zeichen lang sein"),
  date: z.coerce.date(), // Wandelt YYYY-MM-DD HH:MM:SS nativ in JS Date um
  location: z.string().default('Schloss Porcia, Spittal/Drau'),
  body: z.string().optional(),
  image: z.string().nullable().optional(),
  video: z.string().optional(), // YouTube URL oder lokaler Pfad
  ticketLink: z.string().url().or(z.string().startsWith('mailto:')).optional(),
});

export type GuitarenaEvent = z.infer<typeof eventSchema>;

const events = defineCollection({
  loader: async () => {
    return dummyData.map((event: any) => ({
      id: event.id,
      ...event
    }));
  },
  schema: eventSchema,
});

export const collections = { events };
