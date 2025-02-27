import { expect } from 'chai'
import sinon from 'sinon'
import { ClosePolygonValidator } from './close-polygon.validator'
import { ICreateRegionDto } from '../../../../@protocols/region.protocol'
import { faker } from '@faker-js/faker'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

describe('ClosePolygonValidator', () => {
  let closePolygonValidator: ClosePolygonValidator

  beforeEach(() => {
    closePolygonValidator = new ClosePolygonValidator()
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should not thrown if Polygon close correctly', () => {
    const params: ICreateRegionDto = {
      userId: faker.string.alphanumeric(),
      name: faker.string.alphanumeric(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [25, 20],
            [25, 25],
            [23, 25],
            [15, 15]
          ]
        ]
      }
    }
    try {
      closePolygonValidator.validate(params)
      throw new Error('Expected BadRequestException to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(BadRequestException)
      expect(error.output).to.equal('POLYGON_SHOULD_BE_CLOSED')
    }
  })
  it('should thrown BadRequestException if Polygon close correctly', () => {
  })
})
