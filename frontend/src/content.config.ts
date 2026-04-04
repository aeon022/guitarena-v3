import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const eventSchema = z.object({
  title: z.string().min(3),
  date: z.coerce.date(),
  location: z.string(),
  image: z.string().nullable().optional(),
  video: z.string().optional(),
  ticketLink: z.string().url().or(z.string().startsWith('mailto:')).optional(),
});

export type GuitarenaEvent = z.infer<typeof eventSchema>;

const events = defineCollection({
  // Wir laden alle .md Dateien rekursiv aus src/content/events
  loader: glob({ pattern: '**/*.md', base: "./src/content/events" }),
  schema: eventSchema,
});

export const collections = { events };
