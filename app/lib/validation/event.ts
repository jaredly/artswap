// app/lib/validation/event.ts
import {z} from 'zod';

export const createEventSchema = z.object({
    groupId: z.string(),
    name: z.string().min(2).max(100),
    submissionLimit: z.number().int().min(1).max(20),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
});

export const updateEventSchema = z.object({
    id: z.string(),
    name: z.string().min(2).max(100).optional(),
    submissionLimit: z.number().int().min(1).max(20).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    phase: z.enum(['open', 'voting', 'closed', 'archived']).optional(),
});

export const eventPhaseTransitionSchema = z.object({
    eventId: z.string(),
    fromPhase: z.enum(['open', 'voting', 'closed', 'archived']),
    toPhase: z.enum(['open', 'voting', 'closed', 'archived']),
});
