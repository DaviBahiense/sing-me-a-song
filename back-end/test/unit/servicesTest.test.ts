import { recommendationService } from '../../src/services/recommendationsService'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'
import { jest } from '@jest/globals'

describe('unit recommendationService.upvote', () => {
    it('should throw error when recommendation is not found', async () => {
        jest.spyOn(recommendationRepository, 'find').mockReturnValue(null)

        expect(async () => {
            await recommendationService.upvote(1)
        }).rejects.toEqual(notFoundError)
    })
})

describe('unit recommendationService.downvote', () => {
    it('should throw error when recommendation is not found', async () => {
        jest.spyOn(recommendationRepository, 'find').mockReturnValue(null)

        expect(async () => {
            await recommendationService.downvote(1)
        }).rejects.toEqual(notFoundError)
    })

    it('should erase recommendation if: score < -5', async () => {
        jest.spyOn(recommendationRepository, 'find').mockResolvedValue(video)
        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValue(
            null
        )
        jest.spyOn(recommendationRepository, 'remove').mockResolvedValue(null)

        await recommendationService.downvote(1)
    })
})

describe('unit recommendationService.getScoreFilter', () => {
    it('should return lte if more than 0.7', async () => {
        const result = recommendationService.getScoreFilter(1)

        expect(result).toBe('lte')
    })

    it('should return gt if lower than 0.7', async () => {
        const result = recommendationService.getScoreFilter(0.1)

        expect(result).toBe('gt')
    })
})

describe('unit recommendationService.getByScore', () => {
    it('should return no recommendations', async () => {
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValue([])

        const result = jest
            .spyOn(recommendationRepository, 'findAll')
            .mockResolvedValue([])

        await recommendationService.getByScore('gt')

        expect(async () => {
            await recommendationService.getByScore('gt')
        }).rejects.toEqual(notFoundError)
    })
})

describe('unit recommendationService/getRandom', () => {
    it('should throw error if recommendation is not found', async () => {
        jest.spyOn(recommendationService, 'getScoreFilter').mockReturnValue(
            'gt'
        )
        jest.spyOn(recommendationService, 'getByScore').mockResolvedValue([])

        expect(async () => {
            await recommendationService.getRandom()
        }).rejects.toEqual(notFoundError)
    })
})

const notFoundError = {
    message: '',
    type: 'not_found',
}

const video = {
    id: 1,
    name: 'musica',
    youtubeLink: 'https://www.youtube.com/watch?v=IjMESxJdWkg',
    score: -10,
}
