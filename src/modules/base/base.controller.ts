import { Response } from 'express'

import {
  ControllerResponse,
  FAIL_STATUS_CODE,
  SUCCESS_STATUS_CODE
} from '../../@protocols/controller.protocol'

import { Exception } from '../exceptions/exception'

import { ErrorTrackingService } from '../logger/error-tracking.service'
import { LoggerService } from '../logger/logger.service'
import { FeatureCollection, Polygon } from 'geojson'

export abstract class BaseController<T> {
  constructor(
    protected readonly errorTrackingService: ErrorTrackingService,
    protected readonly loggerService: LoggerService
  ) {}

  okJSON(
    res: Response,
    data?: T | T[] | FeatureCollection<Polygon>,
    page?: number,
    limit?: number
  ) {
    const response: ControllerResponse<T> = {
      code: SUCCESS_STATUS_CODE['OK'],
      status: 'OK',
      data,
      page,
      limit
    }
    res.status(SUCCESS_STATUS_CODE['OK']).send(response)
  }

  createdJSON(res: Response, data: T) {
    const response: ControllerResponse<T> = {
      code: SUCCESS_STATUS_CODE['CREATED'],
      status: 'CREATED',
      data
    }
    res.status(SUCCESS_STATUS_CODE['CREATED']).send(response)
  }

  noContent(res: Response) {
    res.status(SUCCESS_STATUS_CODE['NO_CONTENT']).send()
  }

  async okFlatBuffer(_res: Response, _data: GeoJSON.FeatureCollection) {
    /* serialize to flatbuffer */
  }

  catch(res: Response, error: any, context: string) {
    this.loggerService.error(error, context)
    this.errorTrackingService.error(error, context)

    if (error instanceof Exception) res.status(error.code).send(error)
    else
      res.status(FAIL_STATUS_CODE['INTERNAL_SERVER']).send({
        code: FAIL_STATUS_CODE['INTERNAL_SERVER'],
        status: 'INTERNAL_SERVER',
        output: error
      })
  }
}
