import { ICreateRegionDto } from '../../../../@protocols/region.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'
import { RegionModel } from '../../region.module'

export class RegionConflictValidator {
  async validate(params: ICreateRegionDto, regionModel: typeof RegionModel) {
    const newPolygonOutBoundPositions = params.polygon.coordinates[0]

    for (const position of newPolygonOutBoundPositions) {
      const intersection = await regionModel.findOne({
        polygon: {
          $geoIntersects: {
            $geometry: {
              type: 'Point',
              coordinates: [position[0], position[1]]
            }
          }
        }
      })
      if (intersection) throw new BadRequestException('REGION_CONFLICT')
    }
  }
}
