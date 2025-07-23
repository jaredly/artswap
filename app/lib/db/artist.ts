// app/lib/db/artist.ts
import prisma from './index';
import type {Artist, Prisma} from '../../../generated/prisma/client';

// Create a new artist
export async function createArtist(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    profilePic?: string;
    role?: 'USER' | 'SUPER_ADMIN';
    status?: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
}): Promise<Artist> {
    return prisma.artist.create({data});
}

// Get artist by ID
export async function getArtistById(id: string) {
    return prisma.artist.findUnique({where: {id}});
}

// Get artist by email
export async function getArtistByEmail(email: string) {
    return prisma.artist.findUnique({where: {email}});
}

// Update artist
export async function updateArtist(id: string, data: Prisma.ArtistUpdateInput) {
    return prisma.artist.update({where: {id}, data});
}

// Delete artist
export async function deleteArtist(id: string) {
    return prisma.artist.delete({where: {id}});
}

// List all artists (optionally filter)
export async function listArtists(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ArtistWhereInput;
    orderBy?: Prisma.ArtistOrderByWithRelationInput;
}) {
    return prisma.artist.findMany(params);
}
