import { expect } from 'chai'
import { IUpdateRegionNameDto } from '../../../../@protocols/region.protocol'
import { UpdateRegionNameDtoValidator } from './update-region-name-dto.validator'

describe('UpdateRegionNameDtoValidator', () => {
  const instance = new UpdateRegionNameDtoValidator()

  it('should be defined', () => {
    expect(instance).not.to.be.undefined
  })

  it('should not throw if fields are valid', () => {
    const validParams: IUpdateRegionNameDto = {
      name: 'Novo nome'
    }

    expect(() => instance.validate(validParams)).to.not.throw()
  })

  it('should throw if name is missing', () => {
    const invalidParams: IUpdateRegionNameDto = {
      name: null
    }

    expect(() => instance.validate(invalidParams)).to.throw()
  })
})
