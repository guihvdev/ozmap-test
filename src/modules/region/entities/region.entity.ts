import { modelOptions, Prop, Ref, index } from '@typegoose/typegoose'
import { Base } from '../../base/entities/base.entity'
import { User } from '../../user/entities/user.entity'
import { IRegion } from '../../../@protocols/region.protocol'

@index({ polygon: '2dsphere' })
@modelOptions({ schemaOptions: { validateBeforeSave: false } })
export class Region extends Base implements IRegion {
  @Prop({ required: true })
  name!: string

  @Prop({ ref: () => User, required: true, type: () => String })
  user: Ref<User>

  @Prop({ required: true, type: () => Object })
  polygon: GeoJSON.Polygon

  @Prop({ default: false, type: () => Boolean })
  isDeleted: boolean
}
