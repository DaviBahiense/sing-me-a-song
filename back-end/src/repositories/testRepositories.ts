import { Request, Response } from 'express';
import { prisma } from '../database.js';

async function clearDb() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}

async function seedDb() {
    await prisma.recommendation.createMany({
        data: [
            {
                name: "LOFI",
                youtubeLink: "https://www.youtube.com/watch?v=IjMESxJdWkg",
                score:10
            },
            {
                name: "Chopin",
                youtubeLink: "https://www.youtube.com/watch?v=Jn09UdSb3aA",
                score:20
            },
            {
                name: "Adagio - Tiesto",
                youtubeLink: "https://www.youtube.com/watch?v=8tIgN7eICn4",
                score:30
            },
        ],
        skipDuplicates: true
    })
}

export {
    clearDb,
    seedDb
}