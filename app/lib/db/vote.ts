// app/lib/db/vote.ts

import type {Prisma, Vote} from '../../../generated/prisma/client';
import prisma from './index';

// Create a new vote
export async function createVote(data: {
    artistId: string;
    artworkId: string;
    eventId: string;
    liked: boolean;
    preferenceOrder?: number;
    finalizedAt?: Date;
}): Promise<Vote> {
    return prisma.vote.create({data});
}

// Get vote by ID
export async function getVoteById(id: string) {
    return prisma.vote.findUnique({where: {id}});
}

// Update vote
export async function updateVote(id: string, data: Prisma.VoteUpdateInput) {
    return prisma.vote.update({where: {id}, data});
}

// Delete vote
export async function deleteVote(id: string) {
    return prisma.vote.delete({where: {id}});
}

// List all votes (optionally filter)
export async function listVotes(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.VoteWhereInput;
    orderBy?: Prisma.VoteOrderByWithRelationInput;
}) {
    return prisma.vote.findMany(params);
}
