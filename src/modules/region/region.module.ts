import { Router } from 'express'
import { getModelForClass } from '@typegoose/typegoose'

import { Region } from './entities/region.entity'

import { RegionService } from './region.service'
import { ErrorTrackingService } from '../logger/error-tracking.service'
import { LoggerService } from '../logger/logger.service'

import { RegionController } from './region.controller'
import { UserModel } from '../user/user.module'
import { Database } from '../../infra/database'

export const RegionModel = getModelForClass(Region)

export class RegionModule {
  private regionService: RegionService
  private regionController: RegionController

  constructor(
    router: Router,
    _database: Database,
    errorTrackingService: ErrorTrackingService,
    loggerService: LoggerService
  ) {
    this.regionService = new RegionService(RegionModel, UserModel, loggerService)
    this.regionController = new RegionController(
      this.regionService,
      router,
      errorTrackingService,
      loggerService
    )
  }

  init() {
    this.regionController.init()
  }
}
