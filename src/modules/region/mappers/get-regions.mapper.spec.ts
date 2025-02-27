import { FeatureCollection, Polygon } from 'geojson'
import { getRegionsMapper } from './get-regions.mapper'
import { expect } from 'chai'
import { IRegion } from '../../../@protocols/region.protocol'
import { ObjectId } from '../../base/entities/base.entity'

describe('getRegionsMapper', () => {
  it('should map multiple regions to FeatureCollection correctly', () => {
    const regions: Partial<IRegion>[] = [
      {
        _id: new ObjectId(),
        name: 'Polygon A',
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [20, 20],
              [30, 30],
              [30, 30],
              [20, 20]
            ]
          ]
        },
        user: new ObjectId()
      },
      {
        _id: new ObjectId(),
        name: 'Polygon B',
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [40, 40],
              [30, 30],
              [30, 30],
              [40, 40]
            ]
          ]
        },
        user: new ObjectId()
      },
      {
        _id: new ObjectId(),
        name: 'Polygon C',
        polygon: {
          type: 'Polygon',
          coordinates: [
            [
              [60, 60],
              [30, 30],
              [30, 30],
              [60, 60]
            ]
          ]
        },
        user: new ObjectId()
      }
    ]
    const expectedFeatureCollection: FeatureCollection<Polygon> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            isUserRegion: true,
            regionId: regions[0]._id.toString(),
            name: regions[0].name
          },
          geometry: {
            type: 'Polygon',
            coordinates: regions[0].polygon.coordinates
          }
        },
        {
          type: 'Feature',
          properties: {
            isUserRegion: false,
            regionId: regions[1]._id.toString(),
            name: regions[1].name
          },
          geometry: {
            type: 'Polygon',
            coordinates: regions[1].polygon.coordinates
          }
        },
        {
          type: 'Feature',
          properties: {
            isUserRegion: false,
            regionId: regions[2]._id.toString(),
            name: regions[2].name
          },
          geometry: {
            type: 'Polygon',
            coordinates: regions[2].polygon.coordinates
          }
        }
      ]
    }

    const result = getRegionsMapper(
      regions as IRegion[],
      regions[0].user.toString()
    )
    expect(result).to.be.deep.equal(expectedFeatureCollection)
  })
})
