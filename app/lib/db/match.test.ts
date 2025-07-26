// app/lib/db/match.test.ts
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {createArtist} from './artist';
import {createArtwork} from './artwork';
import {createEvent} from './event';
import {createGroup} from './group';
import prisma from './index';
import {calculateMatches, createMatch} from './match';
import {createVote} from './vote';

// Utility to clear DB between tests
async function clearDb() {
    await prisma.vote.deleteMany();
    await prisma.match.deleteMany();
    await prisma.artwork.deleteMany();
    await prisma.event.deleteMany();
    await prisma.artist.deleteMany();
}

describe('calculateMatches', () => {
    // beforeEach(async () => {
    //     await clearDb();
    // });

    afterEach(async () => {
        await clearDb();
    });

    it('creates matches only for mutual likes with finalized votes', async () => {
        // Setup: 2 artists, 2 artworks, 1 event
        const group = await createGroup({name: 'Test Group 1'});
        const artistA = await createArtist({email: 'a@test.com', passwordHash: 'x', fullName: 'A'});
        const artistB = await createArtist({email: 'b@test.com', passwordHash: 'x', fullName: 'B'});
        const event = await createEvent({groupId: group.id, phase: 'voting', submissionLimit: 2});
        const artworkA = await createArtwork({artistId: artistA.id, title: 'ArtA', images: [], status: 'EVENT', eventId: event.id});
        const artworkB = await createArtwork({artistId: artistB.id, title: 'ArtB', images: [], status: 'EVENT', eventId: event.id});
        // A likes B's art, B likes A's art, both finalized
        await createVote({artistId: artistA.id, artworkId: artworkB.id, eventId: event.id, liked: true, preferenceOrder: 1, finalizedAt: new Date()});
        await createVote({artistId: artistB.id, artworkId: artworkA.id, eventId: event.id, liked: true, preferenceOrder: 1, finalizedAt: new Date()});
        // Run matching
        const matches = await calculateMatches(event.id);
        expect(matches.length).toBe(1);
        expect([matches[0].artwork1Id, matches[0].artwork2Id]).toContain(artworkA.id);
        expect([matches[0].artwork1Id, matches[0].artwork2Id]).toContain(artworkB.id);
    });

    it('does not match if votes are not finalized', async () => {
        const group = await createGroup({name: 'Test Group 2'});
        const artistA = await createArtist({email: 'c@test.com', passwordHash: 'x', fullName: 'C'});
        const artistB = await createArtist({email: 'd@test.com', passwordHash: 'x', fullName: 'D'});
        const event = await createEvent({groupId: group.id, phase: 'voting', submissionLimit: 2});
        const artworkA = await createArtwork({artistId: artistA.id, title: 'ArtC', images: [], status: 'EVENT', eventId: event.id});
        const artworkB = await createArtwork({artistId: artistB.id, title: 'ArtD', images: [], status: 'EVENT', eventId: event.id});
        // Mutual likes, but not finalized
        await createVote({artistId: artistA.id, artworkId: artworkB.id, eventId: event.id, liked: true});
        await createVote({artistId: artistB.id, artworkId: artworkA.id, eventId: event.id, liked: true});
        const matches = await calculateMatches(event.id);
        expect(matches.length).toBe(0);
    });

    it('prefers lower combined preference order for matches', async () => {
        // 3 artists, 3 artworks, 1 event
        const group = await createGroup({name: 'Test Group 3'});
        const a = await createArtist({email: 'e@test.com', passwordHash: 'x', fullName: 'E'});
        const b = await createArtist({email: 'f@test.com', passwordHash: 'x', fullName: 'F'});
        const c = await createArtist({email: 'g@test.com', passwordHash: 'x', fullName: 'G'});
        const event = await createEvent({groupId: group.id, phase: 'voting', submissionLimit: 3});
        const artA = await createArtwork({artistId: a.id, title: 'A', images: [], status: 'EVENT', eventId: event.id});
        const artB = await createArtwork({artistId: b.id, title: 'B', images: [], status: 'EVENT', eventId: event.id});
        const artC = await createArtwork({artistId: c.id, title: 'C', images: [], status: 'EVENT', eventId: event.id});
        // E likes F (pref 1), F likes E (pref 2), F likes G (pref 1), G likes F (pref 1)
        await createVote({artistId: a.id, artworkId: artB.id, eventId: event.id, liked: true, preferenceOrder: 1, finalizedAt: new Date()});
        await createVote({artistId: b.id, artworkId: artA.id, eventId: event.id, liked: true, preferenceOrder: 2, finalizedAt: new Date()});
        await createVote({artistId: b.id, artworkId: artC.id, eventId: event.id, liked: true, preferenceOrder: 1, finalizedAt: new Date()});
        await createVote({artistId: c.id, artworkId: artB.id, eventId: event.id, liked: true, preferenceOrder: 1, finalizedAt: new Date()});
        // Run matching
        const matches = await calculateMatches(event.id);
        // G<->F (artC <-> artB) should be matched first (combined score 2), then E<->F (artA <-> artB, score 3)
        expect(matches[0].combinedScore).toBeLessThanOrEqual(matches[1]?.combinedScore ?? 9999);
    });
});
