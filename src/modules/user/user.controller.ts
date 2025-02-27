import { Request, Response, Router } from 'express'

import type {
  ICreateUserDto,
  IUpdateUserAddressDto,
  IUser
} from '../../@protocols/user.protocol'
import { BaseController } from '../base/base.controller'
import { ErrorTrackingService } from '../logger/error-tracking.service'
import { LoggerService } from '../logger/logger.service'
import { UserService } from './user.service'
import { CreateUserDtoValidator } from './validators/dtos/create-user-dto.validator'
import { EditUserAddressDtoValidator } from './validators/dtos/edit-user-address-dto.validator'

export class UserController extends BaseController<IUser> {
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    readonly errorTrackingService: ErrorTrackingService,
    readonly loggerService: LoggerService
  ) {
    super(errorTrackingService, loggerService)
  }

  init() {
    this.router.get('/users', (req, res) => this.getUsers(req, res))
    this.loggerService.log('GET /users mapped', 'UserController')

    this.router.get('/users/:id', (req, res) => this.getSingleUser(req, res))
    this.loggerService.log('GET /users/:id mapped', 'UserController')

    this.router.patch('/users/:id/address', (req, res) =>
      this.editUserAdress(req, res)
    )
    this.loggerService.log('PATCH /users/:id/address mapped', 'UserController')

    this.router.post('/users', (req, res) => this.createUser(req, res))
    this.loggerService.log('POST /users mapped', 'UserController')

    this.router.delete('/users/:id', (req, res) => this.deleteUser(req, res))
    this.loggerService.log('DELETE /users/:id mapped', 'UserController')
  }

  async getUsers(req: Request, res: Response) {
    try {
      const { page, limit } = req.query
      const entities = await this.userService.find(+page, +limit)

      this.okJSON(res, entities)
    } catch (error) {
      this.catch(res, error, 'UserController.getUsers')
    }
  }

  async getSingleUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const response = await this.userService.findOne(id)

      this.okJSON(res, response)
    } catch (error) {
      this.catch(res, error, 'UserController.getSingleUser')
    }
  }

  async editUserAdress(req: Request, res: Response) {
    try {
      const { id } = req.params
      const dto: IUpdateUserAddressDto = req.body
      new EditUserAddressDtoValidator().validate(dto)
      await this.userService.editUserAddress(id, dto)

      this.noContent(res)
    } catch (error) {
      this.catch(res, error, 'UserController.editUserAdress')
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const dto: ICreateUserDto = req.body
      new CreateUserDtoValidator().validate(dto)
      const response = await this.userService.create(dto)

      this.createdJSON(res, response)
    } catch (error) {
      this.catch(res, error, 'UserController.getUsers')
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      await this.userService.delete(id)

      this.noContent(res)
    } catch (error) {
      this.catch(res, error, 'UserController.getUsers')
    }
  }
}
