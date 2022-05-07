import { prisma } from '../../src/database.js'
import { faker } from '@faker-js/faker'

export const body = {
    name: 'LOFI',
    youtubeLink: 'https://www.youtube.com/watch?v=IjMESxJdWkg',
}

export async function newVideo() {
    const video = await prisma.recommendation.create({
        data: { ...body, score: 10 },
    })
    return video
}

export async function createManyVideos(qtd: number) {
    const videos = []
    for (let i = 0; i < qtd; i++) {
        videos.push({
            name: faker.animal.cat(),
            youtubeLink: 'https://www.youtube.com/watch?v=K9ju0iMdncc',
            score: i,
        })
    }

    await prisma.recommendation.createMany({
        data: videos,
        skipDuplicates: true,
    })
}
