import { Ref } from '@typegoose/typegoose'
import type { IBaseEntity } from './base.protocol'
import type { Coordinates, IRegion } from './region.protocol'

export interface IUser extends IBaseEntity {
  name: string
  email: string
  address: string
  coordinates: Coordinates
  isDeleted: boolean

  regions?: Ref<IRegion>[]
}

export interface ICreateUserDto {
  name: string
  email: string
  address?: string
  coordinates?: Coordinates
}

export interface IUpdateUserAddressDto {
  address?: string
  coordinates?: Coordinates
}
