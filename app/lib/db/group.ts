// app/lib/db/group.ts

import type {Group, Prisma} from '../../../generated/prisma/client';
import prisma from './index';

// Create a new group
export async function createGroup(data: {name: string}): Promise<Group> {
    return prisma.group.create({data});
}

// Get group by ID
export async function getGroupById(id: string) {
    return prisma.group.findUnique({where: {id}});
}

// Update group
export async function updateGroup(id: string, data: Prisma.GroupUpdateInput) {
    return prisma.group.update({where: {id}, data});
}

// Delete group
export async function deleteGroup(id: string) {
    return prisma.group.delete({where: {id}});
}

// List all groups (optionally filter)
export async function listGroups(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.GroupWhereInput;
    orderBy?: Prisma.GroupOrderByWithRelationInput;
}) {
    return prisma.group.findMany(params);
}
