import { Coordinates } from '../../../../@protocols/region.protocol'
import { IUpdateUserAddressDto } from '../../../../@protocols/user.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

export class EditUserAddressDtoValidator {
  validate(params: IUpdateUserAddressDto) {
    const errors: { message: string }[] = []

    const addressError = this.validateAddress(params.address)
    if (addressError) errors.push(addressError)

    const coordinatesError = this.validateCoordinates(params.coordinates)
    if (coordinatesError) errors.push(coordinatesError)

    if (errors.length) throw new BadRequestException(errors)
  }

  private validateAddress(address: string) {
    if (address) {
      if (typeof address !== 'string')
        return { message: "field 'address' must be a string" }
    }
  }

  private validateCoordinates(coordinates: Coordinates) {
    if (coordinates) {
      if (coordinates.length !== 2)
        return { message: "field 'coordinates' must have two positions" }
      if (typeof coordinates[0] !== 'number')
        return {
          message: "longitude from field 'coordinates' must be a number"
        }
      if (typeof coordinates[1] !== 'number')
        return {
          message: "latitude from field 'coordinates' must be a number"
        }
    }
  }
}
