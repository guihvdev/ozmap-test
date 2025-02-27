import express from 'express'

import { Database } from './infra/database'

import { ErrorTrackingService } from './modules/logger/error-tracking.service'
import { LoggerService } from './modules/logger/logger.service'

import { UserModule } from './modules/user/user.module'
import { RegionModule } from './modules/region/region.module'
import { GeoCoder } from './modules/geocoder/geocoder'

export interface AppExternalModules {
  geocoder: GeoCoder
}

export async function createApp({ geocoder }: AppExternalModules) {
  require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
  const loggerService = new LoggerService()
  const errorTrackingService = new ErrorTrackingService()

  const database = new Database(loggerService, errorTrackingService)
  await database.init()

  if (process.env.DB_RESET_COLLECTIONS === 'true') {
    await database.resetCollections()
  }

  const router = express.Router()

  const globalDeps: [
    typeof router,
    Database,
    ErrorTrackingService,
    LoggerService
  ] = [router, database, errorTrackingService, loggerService]
  new UserModule(...globalDeps, geocoder).init()
  loggerService.log('UserModule initialized', 'Bootstrap')

  new RegionModule(...globalDeps).init()
  loggerService.log('RegionModule initialized', 'Bootstrap')

  const app = express()
  app.use(express.json()).use(router)

  return {
    app,
    database,
    loggerService,
    errorTrackingService
  }
}
