import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import * as mongoose from 'mongoose'

import ObjectId = mongoose.Types.ObjectId

export interface IBaseEntity extends TimeStamps {
  _id: ObjectId
}
