import { expect } from 'chai'
import { CreateUserDtoValidator } from './create-user-dto.validator'
import { ICreateUserDto } from '../../../../@protocols/user.protocol'
import { faker } from '@faker-js/faker'

describe('CreateUserDtoValidator', () => {
  const instance = new CreateUserDtoValidator()

  it('should be defined', () => {
    expect(instance).not.to.be.undefined
  })

  it('should not throw an error if all fields are valid', () => {
    const createUserParams: ICreateUserDto = {
      email: faker.internet.email(),
      name: faker.person.firstName(),
      address: faker.string.alphanumeric(),
      coordinates: [faker.number.int(), faker.number.int()]
    }
    expect(() => instance.validate(createUserParams)).to.not.throw()
  })
  it('should throw an error if email is not provided', () => {
    const createUserParams: ICreateUserDto = {
      email: null,
      name: faker.person.firstName(),
      address: faker.string.alphanumeric(),
      coordinates: [faker.number.int(), faker.number.int()]
    }
    expect(() => instance.validate(createUserParams)).to.throw()
  })
  it('should throw an error if email is invalid', () => {
    const createUserParams: ICreateUserDto = {
      email: 'invalig+~emaíl@domain.com',
      name: faker.person.firstName(),
      address: faker.string.alphanumeric(),
      coordinates: [faker.number.int(), faker.number.int()]
    }
    expect(() => instance.validate(createUserParams)).to.throw()
  })
  it('should throw an error if name is not provided', () => {
    const createUserParams: ICreateUserDto = {
      email: faker.internet.email(),
      name: null,
      address: faker.string.alphanumeric(),
      coordinates: [faker.number.int(), faker.number.int()]
    }
    expect(() => instance.validate(createUserParams)).to.throw()
  })
})
