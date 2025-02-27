import { Prop, Ref } from '@typegoose/typegoose'
import { IUser } from '../../../@protocols/user.protocol'
import { Base } from '../../base/entities/base.entity'
import { Region } from '../../region/entities/region.entity'

export class User extends Base implements IUser {
  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  email!: string

  @Prop({ required: true })
  address: string

  @Prop({ required: true, type: () => [Number] })
  coordinates: [number, number]

  @Prop({ default: false, type: () => Boolean })
  isDeleted: boolean

  @Prop({ required: true, default: [], ref: () => Region, type: () => String })
  regions: Ref<Region>[]
}
