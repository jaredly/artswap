// app/lib/validation/group.ts
import {z} from 'zod';

export const createGroupSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
});

export const updateGroupSchema = z.object({
    id: z.string(),
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
});

export const inviteToGroupSchema = z.object({
    groupId: z.string(),
    email: z.string().email(),
});

export const removeMemberSchema = z.object({
    groupId: z.string(),
    userId: z.string(),
});
