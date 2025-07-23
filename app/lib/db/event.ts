// app/lib/db/event.ts

import type {Event, Prisma} from '../../../generated/prisma/client';
import prisma from './index';

// Create a new event
export async function createEvent(data: {groupId: string; phase: string; submissionLimit: number}): Promise<Event> {
    return prisma.event.create({data});
}

// Get event by ID
export async function getEventById(id: string) {
    return prisma.event.findUnique({where: {id}});
}

// Update event
export async function updateEvent(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({where: {id}, data});
}

// Delete event
export async function deleteEvent(id: string) {
    return prisma.event.delete({where: {id}});
}

// List all events (optionally filter)
export async function listEvents(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
}) {
    return prisma.event.findMany(params);
}
