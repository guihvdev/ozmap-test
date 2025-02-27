import { expect } from 'chai'
import { ClosePolygonValidator } from './close-polygon.validator'
import { ICreateRegionDto } from '../../../../@protocols/region.protocol'
import { faker } from '@faker-js/faker'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

describe('ClosePolygonValidator', () => {
  const instance = new ClosePolygonValidator()

  it('should thrown BadRequestException if Polygon do not close correctly', () => {
    const invalidParams: ICreateRegionDto = {
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
            [15, 25]
          ]
        ]
      }
    }

    try {
      instance.validate(invalidParams)
    } catch (error) {
      expect(error).to.be.instanceOf(BadRequestException)
      expect(error.output).to.be.equal('POLYGON_SHOULD_BE_CLOSED')
    }
  })

  it('should not thrown if Polygon close correctly', () => {
    const validParams: ICreateRegionDto = {
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
            [20, 20]
          ]
        ]
      }
    }
    expect(() => instance.validate(validParams)).to.not.throw()
  })

})
