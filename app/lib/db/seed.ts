// app/lib/db/seed.ts
import prisma from './index';

// Example seed data for Artist, Group, Event, Artwork
async function main() {
    await prisma.artist.createMany({
        data: [
            {name: 'Alice', bio: 'Painter from Denver'},
            {name: 'Bob', bio: 'Sculptor from NYC'},
        ],
    });

    await prisma.group.createMany({
        data: [{name: 'Modernists'}, {name: 'Impressionists'}],
    });

    await prisma.event.createMany({
        data: [{name: 'Spring Exhibition', description: 'Annual spring art event'}],
    });

    await prisma.artwork.createMany({
        data: [
            {title: 'Sunset', artistId: 1, eventId: 1},
            {title: 'Mountain', artistId: 2, eventId: 1},
        ],
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
