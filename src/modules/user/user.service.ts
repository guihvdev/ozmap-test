import type { Coordinates } from '../../@protocols/region.protocol'
import type {
  ICreateUserDto,
  IUpdateUserAddressDto
} from '../../@protocols/user.protocol'

import { AddressOrCoordinatesValidator } from './validators/business/address-or-coordinates.validator'
import { UserAlreadyExistsValidator } from './validators/business/user-already-exists.validator'

import { GeoCoder } from '../geocoder/geocoder'
import { UserModel } from './user.module'
import { Database } from '../../infra/database'

import { LoggerService } from '../logger/logger.service'

export class UserService {
  constructor(
    private readonly userModel: typeof UserModel,
    private readonly database: Database,
    private readonly loggerService: LoggerService,
    private readonly geocoder: GeoCoder
  ) { }
  async find(page = 0, limit = 20) {
    return this.userModel
      .find({ isDeleted: false })
      .skip(page * limit)
      .limit(limit)
  }

  async findOne(_id: string) {
    return this.userModel.findOne({ _id, isDeleted: false })
  }

  async create(params: ICreateUserDto) {
    await new UserAlreadyExistsValidator().validate(
      params.email,
      this.userModel
    )
    const { address, coordinates } = await this.prepareUserAddress(params)

    const entity = await this.userModel.create({
      email: params.email,
      name: params.name,
      address,
      coordinates
    })
    this.loggerService.debug(`User entity created: ${params.email}`, 'UserService.create')

    return entity
  }

  async editUserAddress(_id: string, params: IUpdateUserAddressDto) {
    const { address, coordinates } = await this.prepareUserAddress(params)
    await this.userModel.updateOne({ _id }, { address, coordinates })
    this.loggerService.debug(`User entity address and coordinates updated`, 'UserService.editUserAddress')
  }

  async delete(_id: string) {
    await UserModel.findOneAndUpdate({ _id }, { isDeleted: true }).then(
      async () => {
        await this.database.db
          .collection('regions')
          .updateMany({ user: _id }, { $set: { isDeleted: true } })
      }
    )
    this.loggerService.debug(`User entity and aggregates soft deleted`, 'UserService.delete')
  }

  async prepareUserAddress(
    params: ICreateUserDto | IUpdateUserAddressDto
  ): Promise<{ address: string; coordinates: Coordinates }> {
    new AddressOrCoordinatesValidator().validate(params)
    if (params.address) {
      const { lng, lat } = await this.geocoder.getCoordinatesFromAddress(
        params.address
      )
      return {
        address: params.address,
        coordinates: [lng, lat]
      }
    } else {
      return {
        address: await this.geocoder.getAddressFromCoordinates(
          params.coordinates[0],
          params.coordinates[1]
        ),
        coordinates: params.coordinates
      }
    }
  }
}
