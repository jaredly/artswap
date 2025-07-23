// app/lib/db/artwork.ts

import type {Artwork, Prisma} from '../../../generated/prisma/client';
import prisma from './index';

// Create a new artwork
export async function createArtwork(data: {
    artistId: string;
    eventId?: string;
    title: string;
    description?: string;
    medium?: string;
    dimensions?: string;
    year?: number;
    images: any; // Should be Json (array of file paths/URLs)
    status: 'PORTFOLIO' | 'EVENT' | 'MATCHED' | 'FLAGGED';
}): Promise<Artwork> {
    return prisma.artwork.create({data});
}

// Get artwork by ID
export async function getArtworkById(id: string) {
    return prisma.artwork.findUnique({where: {id}});
}

// Update artwork
export async function updateArtwork(id: string, data: Prisma.ArtworkUpdateInput) {
    return prisma.artwork.update({where: {id}, data});
}

// Delete artwork
export async function deleteArtwork(id: string) {
    return prisma.artwork.delete({where: {id}});
}

// List all artworks (optionally filter)
export async function listArtworks(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ArtworkWhereInput;
    orderBy?: Prisma.ArtworkOrderByWithRelationInput;
}) {
    return prisma.artwork.findMany(params);
}
