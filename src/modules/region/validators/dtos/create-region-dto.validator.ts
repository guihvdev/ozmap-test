import { ICreateRegionDto } from '../../../../@protocols/region.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

export class CreateRegionDtoValidator {
  validate(params: ICreateRegionDto) {
    const errors: { message: string }[] = []

    const userIdErrors = this.validateUserId(params.userId)
    if (userIdErrors) errors.push(userIdErrors)

    const nameErrors = this.validateName(params.name)
    if (nameErrors) errors.push(nameErrors)

    const coordinatesErrors = this.validateCoordinates(
      params.polygon.coordinates
    )
    if (coordinatesErrors) errors.push(coordinatesErrors)

    if (errors.length) throw new BadRequestException(errors)
  }

  private validateUserId(userId: string) {
    if (!userId)
      return { message: "field 'userId' must be defined as a string" }
    if (typeof userId !== 'string')
      return { message: "field 'userId' must be a string" }
  }

  private validateName(name: string) {
    if (!name) return { message: "field 'name' must be defined as a string" }
    if (typeof name !== 'string')
      return { message: "field 'name' must be a string" }
  }

  private validateCoordinates(position: GeoJSON.Polygon['coordinates']) {
    const innerCordinates = position[0]
    if (innerCordinates.length < 4)
      return { message: "field 'coordinates' must have at least 4 positions" }
    for (const coordinate of innerCordinates) {
      if (!Array.isArray(coordinate) || coordinate.length !== 2) {
        return { message: 'each coordinate must be an array with 2 positions' }
      }

      if (
        typeof coordinate[0] !== 'number' ||
        typeof coordinate[1] !== 'number'
      ) {
        return { message: 'each coordinate must contain two numbers' }
      }

      const lngErrors = this.validateLng(coordinate[0])
      if (lngErrors) return lngErrors

      const latErrors = this.validateLat(coordinate[1])
      if (latErrors) return latErrors
    }
  }

  private validateLat(lat: number) {
    if (Math.abs(lat) > 90)
      return { message: 'latitude coordinate must be between -90 and 90' }
  }

  private validateLng(lng: number) {
    if (Math.abs(lng) > 180)
      return { message: 'longitude coordinate must be between -180 and 180' }
  }
}
