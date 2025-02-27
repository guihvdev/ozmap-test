import { ICreateRegionDto, IUpdateRegionPolygonDto } from '../../../../@protocols/region.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'
import { RegionModel } from '../../region.module'

export class RegionConflictValidator {
  async validate(params: ICreateRegionDto | (IUpdateRegionPolygonDto & { id: string }), regionModel: typeof RegionModel) {
    const newPolygonOutBoundPositions = params.polygon.coordinates[0]

    for (const position of newPolygonOutBoundPositions) {
      const query = {
        polygon: {
          $geoIntersects: {
            $geometry: {
              type: 'Point',
              coordinates: [position[0], position[1]]
            }
          }
        }
      }
      if ('id' in params) {
        query['_id'] = { $ne: params.id }
      }
      const intersection = await regionModel.findOne(query)
      if (intersection) throw new BadRequestException('REGION_CONFLICT')
    }
  }
}
