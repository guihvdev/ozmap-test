import { Coordinates } from '../../../../@protocols/region.protocol'
import { ICreateUserDto } from '../../../../@protocols/user.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'
import * as validator from 'email-validator'

export class CreateUserDtoValidator {
  validate(params: ICreateUserDto) {
    const errors: { message: string }[] = []

    const emailError = this.validateEmail(params.email)
    if (emailError) errors.push(emailError)

    const nameError = this.validateName(params.name)
    if (nameError) errors.push(nameError)

    const addressError = this.validateAddress(params.address)
    if (addressError) errors.push(addressError)

    const coordinatesError = this.validateCoordinates(params.coordinates)
    if (coordinatesError) errors.push(coordinatesError)

    if (errors.length) throw new BadRequestException(errors)
  }

  private validateEmail(email: string) {
    if (!email) return { message: "field 'email' must be defined as a string" }
    if (typeof email !== 'string')
      return { message: "field 'email' must be a string" }
    if (!validator.validate(email)) 
      return { message: "field 'email' must be a valid email" }
  }

  private validateName(name: string) {
    if (!name) return { message: "field 'name' must be defined as a string" }
    if (typeof name !== 'string')
      return { message: "field 'name' must be a string" }
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
