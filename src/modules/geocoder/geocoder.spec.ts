import { expect } from 'chai'
import sinon from 'sinon'
import { geocoder } from './geocoder'

describe('Geocoder', () => {
  let reverseStub: sinon.SinonStub
  let searchStub: sinon.SinonStub

  beforeEach(() => {
    reverseStub = sinon.stub(geocoder['geocoder'], 'reverse')
    searchStub = sinon.stub(geocoder['geocoder'], 'search')
  })

  afterEach(() => {
    reverseStub.restore()
    searchStub.restore()
  })

  it('should return the address correctly, given coordinates', async () => {
    const mockAddress = '123 Main St'
    reverseStub.yields(null, null, { display_name: mockAddress })

    const address = await geocoder.getAddressFromCoordinates(
      48.8588443,
      2.2943506
    )
    expect(address).to.equal(mockAddress)
  })

  it('should return the coordinates correctly, given an address', async () => {
    const mockCoordinates = { lat: 48.8588443, lon: 2.2943506 }
    searchStub.yields(null, null, [mockCoordinates])

    const coordinates = await geocoder.getCoordinatesFromAddress('Eiffel Tower')
    expect(coordinates).to.deep.equal({
      lat: mockCoordinates.lat,
      lng: mockCoordinates.lon
    })
  })

  it('should handle errors when getting address from coordinates', async () => {
    reverseStub.yields(new Error('Geocoding error'), null, null)

    try {
      await geocoder.getAddressFromCoordinates(48.8588443, 2.2943506)
    } catch (error) {
      expect(error.message).to.equal('Geocoding error')
    }
  })

  it('should handle errors when getting coordinates from address', async () => {
    searchStub.yields(new Error('Geocoding error'), null, null)

    try {
      await geocoder.getCoordinatesFromAddress('Eiffel Tower')
    } catch (error) {
      expect(error.message).to.equal('Geocoding error')
    }
  })
})
