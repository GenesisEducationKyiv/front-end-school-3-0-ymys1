import { z } from 'zod';

export const trackSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().optional(),
  genres: z.array(z.string()),
  slug: z.string(),
  coverImage: z.string().optional(),
  audioFile: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const createTrackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  album: z.string().optional(),
  genres: z.array(z.string()),
  coverImage: z.string().optional()
});

export const updateTrackSchema = createTrackSchema.partial();

export type Track = z.infer<typeof trackSchema>;
export type CreateTrackDto = z.infer<typeof createTrackSchema>;
export type UpdateTrackDto = z.infer<typeof updateTrackSchema>;
