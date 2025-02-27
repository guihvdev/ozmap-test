import { FAIL_STATUS_CODE } from '../../@protocols/controller.protocol'
import { Exception } from './exception'

class NotFoundException extends Exception {
  constructor(error: any) {
    super('NOT_FOUND', FAIL_STATUS_CODE['NOT_FOUND'], error)
  }
}

export { NotFoundException }
