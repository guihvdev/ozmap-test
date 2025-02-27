import {
  ICreateUserDto,
  IUpdateUserAddressDto
} from '../../../../@protocols/user.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

export class AddressOrCoordinatesValidator {
  validate(params: ICreateUserDto | IUpdateUserAddressDto) {
    const { address, coordinates } = params
    if (!!address === !!coordinates) {
      const error = address
        ? 'SHOULD_PROVIDE_ONLY_ADDRESS_OR_COORDINATES'
        : 'SHOULD_PROVIDE_ADDRESS_OR_COORDINATES'
      throw new BadRequestException(error)
    }
  }
}
