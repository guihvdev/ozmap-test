import { ICreateRegionDto } from '../../../../@protocols/region.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

export class ClosePolygonValidator {
  validate(params: ICreateRegionDto) {
    const newPolygonOutBoundPositions = params.polygon.coordinates[0]
    const openCoordinates = newPolygonOutBoundPositions[0]
    const closeCoordinates =
      newPolygonOutBoundPositions[newPolygonOutBoundPositions.length - 1]

    if (
      openCoordinates[0] !== closeCoordinates[0] ||
      openCoordinates[1] !== closeCoordinates[1]
    ) {
      throw new BadRequestException('POLYGON_SHOULD_BE_CLOSED')
    }
  }
}
