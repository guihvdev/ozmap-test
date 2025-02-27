import { expect } from 'chai'
import sinon from 'sinon'
import { RegionConflictValidator } from './region-conflict.validator'
import { BadRequestException } from '../../../exceptions/bad-request.exception'
import { RegionModel } from '../../region.module'
import { ICreateRegionDto } from '../../../../@protocols/region.protocol'

describe('RegionConflictValidator', () => {
  let regionConflictValidator: RegionConflictValidator
  let regionModelStub: sinon.SinonStub

  beforeEach(() => {
    regionConflictValidator = new RegionConflictValidator()
    regionModelStub = sinon.stub(RegionModel, 'findOne')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should throw BadRequestException if there is a region conflict', async () => {
    const params = {
      polygon: {
        coordinates: [
          [
            [0, 0],
            [5, 0],
            [5, 5],
            [0, 5],
            [0, 0]
          ]
        ]
      }
    }
    regionModelStub.resolves(true)

    try {
      await regionConflictValidator.validate(params as ICreateRegionDto, RegionModel)
      throw new Error('Expected BadRequestException to be thrown')
    } catch (error) {
      expect(error).to.be.instanceOf(BadRequestException)
      expect(error.output).to.equal('REGION_CONFLICT')
    }
  })

  it('should not throw an error if there is no region conflict', async () => {
    const params = {
      polygon: {
        coordinates: [
          [
            [0, 0],
            [1, 1]
          ]
        ]
      }
    }

    regionModelStub.resolves(false)

    await regionConflictValidator.validate(params as ICreateRegionDto, RegionModel)
  })

  it('should check all positions in the polygon', async () => {
    const params = {
      polygon: {
        coordinates: [
          [
            [0, 0],
            [1, 1],
            [2, 2]
          ]
        ]
      }
    }

    regionModelStub.resolves(false)

    await regionConflictValidator.validate(params as ICreateRegionDto, RegionModel)

    expect(regionModelStub.callCount).to.equal(3)
  })
})