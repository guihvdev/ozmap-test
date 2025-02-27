import mongoose, { Connection } from 'mongoose'
import { LoggerService } from '../modules/logger/logger.service'
import { ErrorTrackingService } from '../modules/logger/error-tracking.service'

class Database {
  private _db: Connection['db']
  constructor(
    private readonly loggerService: LoggerService,
    private readonly errorTrackingService: ErrorTrackingService
  ) {}

  async init() {
    try {
      await mongoose.connect(
        process.env.MONGO_URI || 'mongodb://root:root@localhost:27017/',
        {
          dbName: process.env.DB_NAME,
          authSource: process.env.DB_AUTH_SOURCE,
          auth: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
          }
        }
      )
      this.loggerService.log('Database started', 'Database')
      this._db = mongoose.connection.db
    } catch (error) {
      this.errorTrackingService.error(error, 'Database')
      this.loggerService.error(`Could not start database: ${error}`, 'Database')
    }
  }

  async resetCollections() {
    try {
      const collections = await this.db.listCollections().toArray()
      for (const collection of collections) {
        await this.db.collection(collection.name).deleteMany({})
      }
      this.loggerService.log('Collections reseted', 'Database')
    } catch (error) {
      this.loggerService.error(
        `Could not reset collections: ${error}`,
        'Database'
      )
    }
  }

  public get db() {
    return this._db
  }
}

export { Database }
