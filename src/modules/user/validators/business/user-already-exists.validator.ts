import { BadRequestException } from '../../../exceptions/bad-request.exception'
import { UserModel } from '../../user.module'

export class UserAlreadyExistsValidator {
  async validate(email: string, userModel: typeof UserModel) {
    const user = await userModel.findOne({ email })
    if (user) throw new BadRequestException('EMAIL_ALREADY_IN_USE')
  }
}
