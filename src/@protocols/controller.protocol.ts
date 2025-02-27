import { FeatureCollection, Polygon } from 'geojson'

export enum SUCCESS_STATUS_CODE {
  'OK' = 200,
  'CREATED' = 201,
  'NO_CONTENT' = 204
}

export enum FAIL_STATUS_CODE {
  'BAD_REQUEST' = 400,
  'FORBIDDEN' = 403,
  'NOT_FOUND' = 404,
  'INTERNAL_SERVER' = 500
}

export type SuccessStatus = keyof typeof SUCCESS_STATUS_CODE
export type SuccessCode =
  (typeof SUCCESS_STATUS_CODE)[keyof typeof SUCCESS_STATUS_CODE]

export type FailStatus = keyof typeof FAIL_STATUS_CODE
export type FailCode = (typeof FAIL_STATUS_CODE)[keyof typeof FAIL_STATUS_CODE]

export interface ControllerResponse<T> {
  status: SuccessStatus
  code: SuccessCode
  data: T | T[] | FeatureCollection<Polygon>
  limit?: number
  page?: number
  total?: number
}
