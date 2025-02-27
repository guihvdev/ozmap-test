import { IUser } from '../../src/@protocols/user.protocol'
import { ObjectId } from '../../src/modules/base/entities/base.entity'

export const usersMock: IUser[] = [
  {
    _id: new ObjectId(),
    email: 'john.doe@email.com',
    name: 'John Doe',
    address: '12 Main St',
    coordinates: [0, 0],
    isDeleted: false,
    regions: []
  },
  {
    _id: new ObjectId(),
    email: 'john.doe2@email.com',
    name: 'John Doe 2',
    address: '23 Main St',
    coordinates: [0, 0],
    isDeleted: false,
    regions: []
  },
  {
    _id: new ObjectId(),
    email: 'john.doe3@email.com',
    name: 'John Doe 3',
    address: '34 Main St',
    coordinates: [0, 0],
    isDeleted: false,
    regions: []
  },
  {
    _id: new ObjectId(),
    email: 'john.doe4@email.com',
    name: 'John Doe 4',
    address: '45 Main St',
    coordinates: [0, 0],
    isDeleted: false,
    regions: []
  },
  {
    _id: new ObjectId(),
    email: 'john.doe5@email.com',
    name: 'John Doe 5',
    address: '56 Main St',
    coordinates: [0, 0],
    isDeleted: false,
    regions: []
  }
]
