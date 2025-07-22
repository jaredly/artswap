// app/lib/db/seed.ts
import prisma from './index';

// Example seed data for Artist, Group, Event, Artwork
async function main() {
    // Create Artists
    const alice = await prisma.artist.create({
        data: {
            email: 'alice@example.com',
            passwordHash: 'hashedpassword1',
            fullName: 'Alice Painter',
            role: 'USER',
            status: 'ACTIVE',
        },
    });

    const bob = await prisma.artist.create({
        data: {
            email: 'bob@example.com',
            passwordHash: 'hashedpassword2',
            fullName: 'Bob Sculptor',
            role: 'USER',
            status: 'ACTIVE',
        },
    });

    // Create Groups
    const modernists = await prisma.group.create({
        data: {
            name: 'Modernists',
        },
    });

    const impressionists = await prisma.group.create({
        data: {
            name: 'Impressionists',
        },
    });

    // Create Event
    const event = await prisma.event.create({
        data: {
            groupId: modernists.id,
            phase: 'open',
            submissionLimit: 5,
        },
    });

    // Create Artworks
    await prisma.artwork.create({
        data: {
            title: 'Sunset',
            artistId: alice.id,
            eventId: event.id,
            status: 'EVENT',
            images: [],
        },
    });

    await prisma.artwork.create({
        data: {
            title: 'Mountain',
            artistId: bob.id,
            eventId: event.id,
            status: 'EVENT',
            images: [],
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
