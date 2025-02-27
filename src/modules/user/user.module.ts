import { Router } from 'express'
import { getModelForClass } from '@typegoose/typegoose'

import { User } from './entities/user.entity'

import { UserService } from './user.service'
import { ErrorTrackingService } from '../logger/error-tracking.service'
import { LoggerService } from '../logger/logger.service'

import { UserController } from './user.controller'
import { Database } from '../../infra/database'
import { GeoCoder } from '../geocoder/geocoder'

export const UserModel = getModelForClass(User)

export class UserModule {
  private _userService: UserService
  private _userController: UserController

  constructor(
    router: Router,
    database: Database,
    errorTrackingService: ErrorTrackingService,
    loggerService: LoggerService,
    geocoder: GeoCoder
  ) {
    this._userService = new UserService(UserModel, database, geocoder)
    this._userController = new UserController(
      this._userService,
      router,
      errorTrackingService,
      loggerService
    )
  }

  init() {
    this._userController.init()
  }
}
