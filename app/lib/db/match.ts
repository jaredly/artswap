// app/lib/db/match.ts
import prisma from './index';
import type {Match, Prisma} from '../../../generated/prisma/client';

// Create a new match
export async function createMatch(data: {eventId: string; artwork1Id: string; artwork2Id: string; status: string}): Promise<Match> {
    return prisma.match.create({data});
}

// Get match by ID
export async function getMatchById(id: string) {
    return prisma.match.findUnique({where: {id}});
}

// Update match
export async function updateMatch(id: string, data: Prisma.MatchUpdateInput) {
    return prisma.match.update({where: {id}, data});
}

// Delete match
export async function deleteMatch(id: string) {
    return prisma.match.delete({where: {id}});
}

// List all matches (optionally filter)
export async function listMatches(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.MatchWhereInput;
    orderBy?: Prisma.MatchOrderByWithRelationInput;
}) {
    return prisma.match.findMany(params);
}

// Calculate matches for an event (preference-based mutual like detection)
export async function calculateMatches(eventId: string) {
    // 1. Get all finalized, liked votes for the event
    const votes = await prisma.vote.findMany({
        where: {
            eventId,
            liked: true,
            finalizedAt: {not: null},
        },
        include: {
            artist: true,
            artwork: true,
        },
    });

    // 2. Build a map: artworkId -> { artistId, preferenceOrder }
    const voteMap = new Map<string, {artistId: string; preferenceOrder: number}[]>();
    for (const vote of votes) {
        if (!voteMap.has(vote.artworkId)) voteMap.set(vote.artworkId, []);
        voteMap.get(vote.artworkId)!.push({
            artistId: vote.artistId,
            preferenceOrder: vote.preferenceOrder ?? 9999,
        });
    }

    // 3. Find mutual likes and calculate combined preference score
    const matches: Array<{
        artwork1Id: string;
        artwork2Id: string;
        artist1PreferenceOrder: number;
        artist2PreferenceOrder: number;
        combinedScore: number;
    }> = [];
    const matchedArtworks = new Set<string>();

    // For each pair of artworks by different artists, check for mutual like
    for (const voteA of votes) {
        if (matchedArtworks.has(voteA.artworkId)) continue;
        const artistA = voteA.artistId;
        const artworkA = voteA.artworkId;
        // No need to check for ownArtworkA; just look for mutual likes
        for (const voteB of votes) {
            if (matchedArtworks.has(voteB.artworkId)) continue;
            const artistB = voteB.artistId;
            const artworkB = voteB.artworkId;
            if (artistA === artistB) continue;
            // Only consider if artworkA is by artistA and artworkB is by artistB
            if (voteA.artwork.artistId === artistB && voteB.artwork.artistId === artistA) {
                // artistA liked artistB's artwork, artistB liked artistA's artwork
                if (!matchedArtworks.has(artworkA) && !matchedArtworks.has(artworkB)) {
                    const artist1PreferenceOrder = voteA.preferenceOrder ?? 9999;
                    const artist2PreferenceOrder = voteB.preferenceOrder ?? 9999;
                    const combinedScore = artist1PreferenceOrder + artist2PreferenceOrder;
                    matches.push({
                        artwork1Id: artworkA,
                        artwork2Id: artworkB,
                        artist1PreferenceOrder,
                        artist2PreferenceOrder,
                        combinedScore,
                    });
                    matchedArtworks.add(artworkA);
                    matchedArtworks.add(artworkB);
                }
            }
        }
    }

    // 4. Sort matches by combinedScore (lower = more preferred)
    matches.sort((a, b) => a.combinedScore - b.combinedScore);

    // 5. Create Match records in DB
    for (const match of matches) {
        await prisma.match.upsert({
            where: {artwork1Id: match.artwork1Id},
            update: {},
            create: {
                eventId,
                artwork1Id: match.artwork1Id,
                artwork2Id: match.artwork2Id,
                status: 'completed',
            },
        });
    }

    return matches;
}
