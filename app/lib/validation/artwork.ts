// app/lib/validation/artwork.ts
import {z} from 'zod';

export const createArtworkSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    medium: z.string().max(100).optional(),
    dimensions: z.string().max(100).optional(),
    year: z.number().int().min(1800).max(new Date().getFullYear()),
    images: z.array(z.string()).min(1).max(5), // 1-5 images per artwork
    notes: z.string().max(500).optional(),
    status: z.enum(['portfolio', 'event', 'matched', 'flagged']).optional(),
});

export const updateArtworkSchema = createArtworkSchema.partial().extend({
    id: z.string(),
});
