import { FAIL_STATUS_CODE } from '../../@protocols/controller.protocol'
import { Exception } from './exception'

class BadRequestException extends Exception {
  constructor(error: any) {
    super('BAD_REQUEST', FAIL_STATUS_CODE['BAD_REQUEST'], error)
  }
}

export { BadRequestException }
