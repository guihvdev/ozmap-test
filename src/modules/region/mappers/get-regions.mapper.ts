import { Feature, FeatureCollection, Polygon } from 'geojson'
import { IRegion } from '../../../@protocols/region.protocol'

export const getRegionsMapper = (
  regions: IRegion[],
  userId?: string
): FeatureCollection<Polygon> => {
  const features: Feature<Polygon>[] = regions.map((region) => ({
    type: 'Feature',
    geometry: region.polygon,
    properties: {
      regionId: region._id.toString(),
      name: region.name,
      /* would be checked from request token */
      isUserRegion: userId ? userId === region.user.toString() : false
    }
  }))

  return {
    type: 'FeatureCollection',
    features
  }
}
