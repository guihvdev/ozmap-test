import 'reflect-metadata'
import * as mongoose from 'mongoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { IBaseEntity } from '../../../@protocols/base.protocol'
import { Prop } from '@typegoose/typegoose'

import ObjectId = mongoose.Types.ObjectId

export class Base extends TimeStamps implements IBaseEntity {
  @Prop({ required: true, default: () => new ObjectId().toString() })
  _id: ObjectId
}

export { ObjectId }
