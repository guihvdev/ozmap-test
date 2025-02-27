import { expect } from 'chai'
import { EditUserAddressDtoValidator } from './edit-user-address-dto.validator'
import { IUpdateUserAddressDto } from '../../../../@protocols/user.protocol'
import { faker } from '@faker-js/faker'

describe('EditUserAdressParamsValidator', () => {
  const instance = new EditUserAddressDtoValidator()

  it('should be defined', () => {
    expect(instance).not.to.be.undefined
  })

  it('should not throw an error if all fields are valid', () => {
    const EditUserAdressParams: IUpdateUserAddressDto = {
      address: faker.string.alphanumeric(),
      coordinates: [faker.number.int(), faker.number.int()]
    }
    expect(() => instance.validate(EditUserAdressParams)).to.not.throw()
  })
  it('should throw an error if a field is provided incorrectly', () => {
    const EditUserAdressParams = {
      address: faker.number.int(),
      coordinates: faker.string.alphanumeric()
    } as any as IUpdateUserAddressDto
    expect(() => instance.validate(EditUserAdressParams)).to.throw()
  })
})
