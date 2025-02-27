import { Ref } from '@typegoose/typegoose'
import type { IBaseEntity } from './base.protocol'
import type { IUser } from './user.protocol'
import { Polygon } from 'geojson'

export type Coordinates = [number, number]

export interface IRegion extends IBaseEntity {
  name: string
  polygon: GeoJSON.Polygon
  isDeleted: boolean
  user: Ref<IUser>
}

export interface ICreateRegionDto {
  name: string
  polygon: GeoJSON.Polygon
  userId: string
}

export interface IUpdateRegionNameDto {
  name: string
}

export interface IUpdateRegionPolygonDto {
  polygon: Polygon
}
