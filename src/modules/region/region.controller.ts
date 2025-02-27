import { Request, Response, Router } from 'express'

import type {
  ICreateRegionDto,
  IRegion,
  IUpdateRegionPolygonDto,
  IUpdateRegionNameDto
} from '../../@protocols/region.protocol'

import { BaseController } from '../base/base.controller'

import { ErrorTrackingService } from '../logger/error-tracking.service'
import { LoggerService } from '../logger/logger.service'
import { RegionService } from './region.service'

import { CreateRegionDtoValidator } from './validators/dtos/create-region-dto.validator'
import { UpdateRegionPolygonDtoValidator } from './validators/dtos/update-region-polygon-dto.validator'
import { UpdateRegionNameDtoValidator } from './validators/dtos/update-region-name-dto.validator'
import { getRegionsMapper as regionsToFeatureCollectionMapper } from './mappers/get-regions.mapper'

export class RegionController extends BaseController<IRegion> {
  constructor(
    private readonly regionService: RegionService,
    private readonly router: Router,
    readonly errorTrackingService: ErrorTrackingService,
    readonly loggerService: LoggerService
  ) {
    super(errorTrackingService, loggerService)
  }

  init() {
    this.router.get('/regions', (req, res) => this.getRegions(req, res))
    this.loggerService.log('GET /regions mapped', 'RegionController')

    this.router.get('/regions/:id', (req, res) =>
      this.getSingleRegion(req, res)
    )
    this.loggerService.log('GET /regions/:id mapped', 'RegionController')

    this.router.get('/regions/includes-point/:lng/:lat', (req, res) =>
      this.getRegionIncludesPoint(req, res)
    )
    this.loggerService.log(
      'GET /regions/includes-point/:lng/:lat mapped',
      'RegionController'
    )

    this.router.get('/regions/point-distance/:lng/:lat/:distance', (req, res) =>
      this.getRegionsFromPointDistance(req, res)
    )
    this.loggerService.log(
      'GET /regions/point-distance/:lng/:lat/:distance mapped',
      'RegionController'
    )

    this.router.post('/regions', (req, res) => this.createRegion(req, res))
    this.loggerService.log('POST /regions mapped', 'RegionController')

    this.router.patch('/regions/:id/polygon', (req, res) =>
      this.updateRegionPolygon(req, res)
    )
    this.loggerService.log(
      'PATCH /regions/:id/polygon mapped',
      'RegionController'
    )

    this.router.patch('/regions/:id/name', (req, res) =>
      this.updateRegionName(req, res)
    )
    this.loggerService.log('PATCH /regions/:id/name mapped', 'RegionController')

    this.router.delete('/regions/:id', (req, res) =>
      this.deleteRegion(req, res)
    )
    this.loggerService.log('DELETE /regions/:id mapped', 'RegionController')
  }

  async getRegions(_req: Request, res: Response) {
    try {
      const { user } = _req.query
      const entities = await this.regionService.getRegions(user?.toString())

      this.okJSON(
        res,
        regionsToFeatureCollectionMapper(entities, user?.toString())
      )
    } catch (error) {
      this.catch(res, error, 'RegionController.getRegions')
    }
  }

  async getSingleRegion(req: Request, res: Response) {
    try {
      const { id } = req.params
      const entity = await this.regionService.getSingleRegion(id)

      this.okJSON(res, entity)
    } catch (error) {
      this.catch(res, error, 'RegionController.getSingleRegion')
    }
  }

  async getRegionsFromPointDistance(req: Request, res: Response) {
    try {
      const { user } = req.query
      const { lng, lat, distance } = req.params
      const entities = await this.regionService.getRegionsFromPointDistance(
        +lng,
        +lat,
        +distance,
        user?.toString()
      )

      this.okJSON(
        res,
        regionsToFeatureCollectionMapper(entities, user?.toString())
      )
    } catch (error) {
      this.catch(res, error, 'RegionController.getRegionsFromPointDistance')
    }
  }

  async getRegionIncludesPoint(req: Request, res: Response) {
    try {
      const { user } = req.query
      const { lng, lat } = req.params
      const entities = await this.regionService.getRegionIncludesPoint(
        +lng,
        +lat,
        user?.toString()
      )

      this.okJSON(
        res,
        regionsToFeatureCollectionMapper(entities, user?.toString())
      )
    } catch (error) {
      this.catch(res, error, 'RegionController.getRegionsFromPointDistance')
    }
  }

  async createRegion(req: Request, res: Response) {
    try {
      const dto: ICreateRegionDto = req.body
      new CreateRegionDtoValidator().validate(dto)

      const entity = await this.regionService.createRegion(dto)

      this.createdJSON(res, entity)
    } catch (error) {
      this.catch(res, error, 'RegionController.createRegion')
    }
  }

  async updateRegionPolygon(req: Request, res: Response) {
    try {
      const { id } = req.params

      const dto: IUpdateRegionPolygonDto = req.body
      new UpdateRegionPolygonDtoValidator().validate(dto)

      await this.regionService.updateRegionPolygon(id, dto)

      this.noContent(res)
    } catch (error) {
      this.catch(res, error, 'RegionController.updateRegionPolygon')
    }
  }

  async updateRegionName(req: Request, res: Response) {
    try {
      const { id } = req.params

      const dto: IUpdateRegionNameDto = req.body
      new UpdateRegionNameDtoValidator().validate(dto)

      await this.regionService.updateRegionName(id, dto)

      this.noContent(res)
    } catch (error) {
      this.catch(res, error, 'RegionController.updateRegionName')
    }
  }

  async deleteRegion(req: Request, res: Response) {
    try {
      const { id } = req.params
      await this.regionService.deleteRegion(id)
      this.noContent(res)
    } catch (error) {
      this.catch(res, error, 'RegionController.deleteRegion')
    }
  }
}
