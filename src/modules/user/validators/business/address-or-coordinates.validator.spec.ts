import { expect } from 'chai'
import { AddressOrCoordinatesValidator } from './address-or-coordinates.validator'

describe('AddressOrCoordinatesValidator', () => {
  const instance = new AddressOrCoordinatesValidator()
  it('should be defined', () => {
    expect(instance).to.be.not.undefined
  })
  it('should not throw an error if only address or coordinates are filled', () => {
    expect(() =>
      instance.validate({ address: 'address', coordinates: null })
    ).to.not.throw()
    expect(() =>
      instance.validate({ address: null, coordinates: [0, 0] })
    ).to.not.throw()
  })
  it('should throw an error if both address and coordinates are filled or empty', () => {
    expect(() =>
      instance.validate({ address: 'address', coordinates: [0, 0] })
    ).to.throw()
    expect(() =>
      instance.validate({ address: null, coordinates: null })
    ).to.throw()
  })
})
