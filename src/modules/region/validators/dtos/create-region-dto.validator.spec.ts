import { expect } from 'chai'
import { CreateRegionDtoValidator } from './create-region-dto.validator'
import { ICreateRegionDto } from '../../../../@protocols/region.protocol'
import { faker } from '@faker-js/faker'

describe('CreateRegionDtoValidator', () => {
  const instance = new CreateRegionDtoValidator()

  it('should be defined', () => {
    expect(instance).not.to.be.undefined
  })

  it('should not throw if fields are valid', () => {
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

  it('should throw if userId is missing', () => {
    const invalidParams: ICreateRegionDto = {
      userId: null,
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

    expect(() => instance.validate(invalidParams)).to.throw()
  })

  it('should throw if name is missing', () => {
    const invalidParams: ICreateRegionDto = {
      userId: faker.string.alphanumeric(),
      name: null,
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

    expect(() => instance.validate(invalidParams)).to.throw()
  })

  it('should throw if coordinates are less than 4', () => {
    const invalidParams: ICreateRegionDto = {
      userId: faker.string.alphanumeric(),
      name: faker.string.alphanumeric(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [25, 20],
            [20, 20]
          ]
        ]
      }
    }

    expect(() => instance.validate(invalidParams)).to.throw()
  })

  it('should throw if any coordinate is not an array of two numbers', () => {
    const invalidParams: ICreateRegionDto = {
      userId: faker.string.alphanumeric(),
      name: faker.string.alphanumeric(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [25, '20'],
            [20, 20]
          ]
        ]
      }
    } as any as ICreateRegionDto

    expect(() => instance.validate(invalidParams)).to.throw()
  })

  it('should throw if any latitude is out of bounds', () => {
    const invalidParams: ICreateRegionDto = {
      userId: faker.string.alphanumeric(),
      name: faker.string.alphanumeric(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [3, 91], // Invalid latitude
            [2, 2],
            [0, 0]
          ]
        ]
      }
    }

    expect(() => instance.validate(invalidParams)).to.throw()
  })

  it('should throw if any longitude is out of bounds', () => {
    const invalidParams: ICreateRegionDto = {
      userId: faker.string.alphanumeric(),
      name: faker.string.alphanumeric(),
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [3, 90],
            [182, 2], // Invalid longitude
            [0, 0]
          ]
        ]
      }
    }

    expect(() => instance.validate(invalidParams)).to.throw()
  })
})
