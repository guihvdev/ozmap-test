import { expect } from 'chai'
import { UserAlreadyExistsValidator } from './user-already-exists.validator'
import { UserModel } from '../../user.module'
import Sinon from 'sinon'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

describe('UserAlreadyExistsValidator', () => {
  const instance = new UserAlreadyExistsValidator()
  let fakeUserModel: Partial<typeof UserModel>

  beforeEach(() => {
    fakeUserModel = {
      findOne: () => null
    }
  })

  it('should be defined', () => {
    expect(instance).not.to.be.undefined
  })

  it('should not throw an error if user does not exist', async () => {
    const email = 'email'
    try {
      await instance.validate(email, fakeUserModel as typeof UserModel)
    } catch (err) {
      throw new Error('Expected method to not throw.')
    }
  })

  it('should throw an error if user exists', async () => {
    const email = 'email'
    fakeUserModel.findOne = Sinon.stub().resolves({ email })
    try {
      await instance.validate(email, fakeUserModel as typeof UserModel)
      throw new Error('Expected method to throw.')
    } catch (err) {
      expect(err).to.be.instanceOf(BadRequestException)
      expect(err.output).to.equal('EMAIL_ALREADY_IN_USE')
    }
  })
})
