import { IUpdateRegionNameDto } from '../../../../@protocols/region.protocol'
import { BadRequestException } from '../../../exceptions/bad-request.exception'

export class UpdateRegionNameDtoValidator {
  validate(params: IUpdateRegionNameDto) {
    const errors: { message: string }[] = []

    const nameErrors = this.validateName(params.name)
    if (nameErrors) errors.push(nameErrors)

    if (errors.length) throw new BadRequestException(errors)
  }

  private validateName(name: string) {
    if (!name) return { message: "field 'name' must be defined as a string" }
    if (typeof name !== 'string')
      return { message: "field 'name' must be a string" }
  }
}
