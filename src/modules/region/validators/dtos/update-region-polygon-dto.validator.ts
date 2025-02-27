import { IUpdateRegionPolygonDto } from '../../../../@protocols/region.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

export class UpdateRegionPolygonDtoValidator {
  validate(params: IUpdateRegionPolygonDto) {
    const errors: { message: string }[] = []

    const coordinatesErrors = this.validateCoordinates(
      params.polygon.coordinates
    )
    if (coordinatesErrors) errors.push(coordinatesErrors)

    if (errors.length) throw new BadRequestException(errors)
  }

  private validateCoordinates(position: GeoJSON.Polygon['coordinates']) {
    const innerCordinates = position[0]
    if (innerCordinates.length < 4)
      return { message: "field 'coordinates' must have at least 4 positions" }
    for (let i = 0; i < innerCordinates.length; i++) {
      const coordinate = innerCordinates[i]
      if (!Array.isArray(coordinate) || coordinate.length !== 2) {
        return {
          message: `coordinate at index ${i} must be an array with 2 positions`
        }
      }

      if (
        typeof coordinate[0] !== 'number' ||
        typeof coordinate[1] !== 'number'
      ) {
        return { message: `coordinate at index ${i} must contain two numbers` }
      }

      const lngErrors = this.validateLng(coordinate[0])
      if (lngErrors)
        return {
          message: `coordinate at index ${i} has an error: ${lngErrors.message}`
        }

      const latErrors = this.validateLat(coordinate[1])
      if (latErrors)
        return {
          message: `coordinate at index ${i} has an error: ${latErrors.message}`
        }
    }
  }

  private validateLat(lat: number) {
    if (Math.abs(lat) > 90)
      return { message: 'latitude must be between -90 and 90' }
  }

  private validateLng(lng: number) {
    if (Math.abs(lng) > 180)
      return { message: 'longitude must be between -180 and 180' }
  }
}
