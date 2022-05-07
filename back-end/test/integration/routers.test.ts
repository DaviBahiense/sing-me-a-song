import { prisma } from '../../src/database.js'
import supertest from 'supertest'
import * as factory from '../factories/testsFactories.js'
import app from '../../src/app.js'

describe('POST /recommendations', () => {
    beforeEach(truncateTables)

    afterAll(disconnect)

    it('should return 201', async () => {
        const { statusCode } = await supertest(app)
            .post('/recommendations')
            .send(factory.body)

        expect(statusCode).toEqual(201)
    })

    it('should return 422', async () => {
        const { statusCode } = await supertest(app)
            .post('/recommendations')
            .send({
                youtubeLink: 'https://www.youtube.com/watch?v=IjMESxJdWkg',
            })
        expect(statusCode).toEqual(422)
    })
})

describe('POST /recommendations/:id/upvote', () => {
    beforeEach(truncateTables)

    afterAll(disconnect)

    it('Should increment the counter', async () => {
        const video = await factory.newVideo()

        const before = await prisma.recommendation.findUnique({
            where: {
                id: video.id,
            },
        })

        const { statusCode } = await supertest(app)
            .post(`/recommendations/${video.id}/upvote`)
            .send()

        const after = await prisma.recommendation.findUnique({
            where: {
                id: video.id,
            },
        })

        expect(after.score - before.score).toBe(1)
        expect(statusCode).toBe(200)
    })
})

describe('POST /recommendations/:id/downvote', () => {
    beforeEach(truncateTables)

    afterAll(disconnect)

    it('should decrement the counter', async () => {
        const video = await factory.newVideo()

        const before = await prisma.recommendation.findUnique({
            where: {
                id: video.id,
            },
        })

        const { statusCode } = await supertest(app)
            .post(`/recommendations/${video.id}/downvote`)
            .send()

        const after = await prisma.recommendation.findUnique({
            where: {
                id: video.id,
            },
        })

        expect(before.score - after.score).toBe(1)
        expect(statusCode).toBe(200)
    })
})

describe('GET /recommendations', () => {
    beforeEach(truncateTables)

    afterAll(disconnect)

    it('should return 200', async () => {
        await factory.newVideo()
        const { statusCode, body } = await supertest(app).get(
            '/recommendations'
        )

        expect(typeof body).toBe('object')
        expect(statusCode).toBe(200)
    })
})

describe('GET /recommendations/:id', () => {
    beforeEach(truncateTables)

    afterAll(disconnect)

    it('should return a object given a id', async () => {
        const video = await factory.newVideo()

        const { statusCode, body } = await supertest(app).get(
            `/recommendations/${video.id}`
        )

        expect(body.id).toBe(video.id)
        expect(statusCode).toBe(200)
    })
})

describe('GET /recommendations/top/:amount', () => {
    beforeEach(truncateTables)

    afterAll(disconnect)

    it('should return a list of X recommendations, ordered by score, given X amount', async () => {
        await factory.createManyVideos(11)

        const { statusCode, body } = await supertest(app).get(
            `/recommendations/top/${5}`
        )

        expect(body.length).toBe(5)
        expect(body[0].score).toBeGreaterThanOrEqual(body[1].score)
        expect(statusCode).toBe(200)
    })
})

describe('GET /recommendations/random', () => {
    beforeEach(truncateTables)

    afterAll(disconnect)

    it('should return 200', async () => {
        await factory.createManyVideos(11)

        const { statusCode } = await supertest(app).get(
            '/recommendations/random'
        )

        expect(statusCode).toEqual(200)
    })
})

async function disconnect() {
    await prisma.$disconnect()
}
async function truncateTables() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`
}
