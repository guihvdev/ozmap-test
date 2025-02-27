import { FailCode, FailStatus } from '../../@protocols/controller.protocol'

export abstract class Exception {
  constructor(
    public status: FailStatus,
    public code: FailCode,
    public output: any
  ) {}
}
