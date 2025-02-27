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

export class UserService {
  constructor(
    private readonly userModel: typeof UserModel,
    private readonly database: Database,
    private readonly geocoder: GeoCoder
  ) {}
  async find(page = 0, limit = 20) {
    return this.userModel
      .find()
      .skip(page * limit)
      .limit(limit)
  }

  async findOne(_id: string) {
    return this.userModel.findOne({ _id })
  }

  async create(params: ICreateUserDto) {
    await new UserAlreadyExistsValidator().validate(
      params.email,
      this.userModel
    )
    const { address, coordinates } = await this.prepareUserAddress(params)

    return this.userModel.create({
      email: params.email,
      name: params.name,
      address,
      coordinates
    })
  }

  async editUserAddress(_id: string, params: IUpdateUserAddressDto) {
    const { address, coordinates } = await this.prepareUserAddress(params)
    await this.userModel.updateOne({ _id }, { address, coordinates })
  }

  async delete(_id: string) {
    await UserModel.findOneAndUpdate({ _id }, { isDeleted: true }).then(
      async () => {
        await this.database.db
          .collection('regions')
          .updateMany({ user: _id }, { $set: { isDeleted: true } })
      }
    )
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
