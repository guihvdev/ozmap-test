import { expect } from 'chai'
import { ClosePolygonValidator } from './close-polygon.validator'
import { ICreateRegionDto } from '../../../../@protocols/region.protocol'
import { faker } from '@faker-js/faker'

describe('ClosePolygonValidator', () => {
  const instance = new ClosePolygonValidator()
  it('should be defined', () => {
    expect(instance).not.to.be.undefined
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
            [20, 20]
          ]
        ]
      }
    }
    expect(() => instance.validate(params)).to.not.throw()
  })
  it('should thrown if Polygon close correctly', () => {
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
    expect(() => instance.validate(params)).to.throw()
  })
})
