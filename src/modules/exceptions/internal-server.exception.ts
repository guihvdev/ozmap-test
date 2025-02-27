import { FAIL_STATUS_CODE } from '../../@protocols/controller.protocol'
import { Exception } from './exception'

class InternalServerException extends Exception {
  constructor(error: any) {
    super('INTERNAL_SERVER', FAIL_STATUS_CODE['INTERNAL_SERVER'], error)
  }
}

export { InternalServerException }
