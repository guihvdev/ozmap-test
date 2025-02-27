import {
  ICreateRegionDto,
  IUpdateRegionPolygonDto as IUpdateRegionCoordinatesdTOParams,
  IUpdateRegionNameDto as IUpdateRegionNameDtoParams
} from '../../@protocols/region.protocol'
import { UserModel } from '../user/user.module'
import { RegionModel } from './region.module'
import { ClosePolygonValidator } from './validators/business/close-polygon.validator'
import { RegionConflictValidator } from './validators/business/region-conflict.validator'

class RegionService {
  constructor(
    private readonly regionModel: typeof RegionModel,
    private readonly userModel: typeof UserModel
  ) { }

  async getRegions(userId?: string) {
    const query = {
      isDeleted: false
    }
    if (userId) query['user'] = userId

    return this.regionModel.find(query)
  }

  async getSingleRegion(_id: string) {
    return this.regionModel.findOne({ _id, isDeleted: false })
  }

  async getRegionIncludesPoint(lng: number, lat: number, userId?: string) {
    const query = {
      isDeleted: false,
      polygon: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      }
    }
    if (userId) query['user'] = userId

    return this.regionModel.find(query)
  }

  async getRegionsFromPointDistance(
    lng: number,
    lat: number,
    distance: number,
    userId?: string
  ) {
    const query = {
      isDeleted: false,
      polygon: {
        $geoWithin: {
          $centerSphere: [[lng, lat], distance / 6378.1]
        }
      }
    }
    if (userId) query['user'] = userId

    return this.regionModel.find(query)
  }

  async createRegion(params: ICreateRegionDto) {
    new ClosePolygonValidator().validate(params)
    await new RegionConflictValidator().validate(params, this.regionModel)

    const region = await this.regionModel.create({
      name: params.name,
      user: params.userId,
      polygon: params.polygon
    })
    await this.userModel.updateOne(
      { _id: params.userId },
      { $push: { regions: region._id } }
    )
    return region
  }

  async updateRegionName(_id: string, params: IUpdateRegionNameDtoParams) {
    await this.regionModel.updateOne({ _id }, { name: params.name })
  }

  async updateRegionPolygon(
    _id: string,
    params: IUpdateRegionCoordinatesdTOParams
  ) {
    new ClosePolygonValidator().validate(params)
    await new RegionConflictValidator().validate({ ...params, id: _id }, this.regionModel)

    await this.regionModel.updateOne({ _id }, { polygon: params.polygon })
  }

  async deleteRegion(_id: string) {
    await this.regionModel.findOneAndUpdate({ _id }, { isDeleted: true })
  }
}

export { RegionService }
