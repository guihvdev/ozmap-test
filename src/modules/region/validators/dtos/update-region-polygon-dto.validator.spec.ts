import { expect } from 'chai'
import { IUpdateRegionPolygonDto } from '../../../../@protocols/region.protocol'
import { UpdateRegionPolygonDtoValidator } from './update-region-polygon-dto.validator'

describe('UpdateRegionAddressDtoValidator', () => {
  const instance = new UpdateRegionPolygonDtoValidator()

  it('should be defined', () => {
    expect(instance).not.to.be.undefined
  })

  it('should not throw if fields are valid', () => {
    const validParams: IUpdateRegionPolygonDto = {
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [40, 40],
            [50, 50],
            [20, 20]
          ]
        ]
      }
    }

    expect(() => instance.validate(validParams)).to.not.throw()
  })

  it('should throw if latitude is missing', () => {
    const invalidParams = {
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [40, null],
            [50, 50],
            [20, 20]
          ]
        ]
      }
    } as any as IUpdateRegionPolygonDto

    expect(() => instance.validate(invalidParams)).to.throw()
  })

  it('should throw if longitude is missing', () => {
    const invalidParams = {
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [40, 40],
            [null, 50],
            [20, 20]
          ]
        ]
      }
    } as any as IUpdateRegionPolygonDto

    expect(() => instance.validate(invalidParams)).to.throw()
  })

  it('should throw if latitude is out of bounds', () => {
    const invalidParams = {
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [40, 180],
            [50, 50],
            [20, 20]
          ]
        ]
      }
    } as any as IUpdateRegionPolygonDto

    expect(() => instance.validate(invalidParams)).to.throw()
  })

  it('should throw if longitude is out of bounds', () => {
    const invalidParams = {
      polygon: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 20],
            [40, 90],
            [-250, 50],
            [20, 20]
          ]
        ]
      }
    } as any as IUpdateRegionPolygonDto

    expect(() => instance.validate(invalidParams)).to.throw()
  })
})
