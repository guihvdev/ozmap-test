import request from 'supertest'
import { AppExternalModules, createApp } from '../src/main'
import { Database } from '../src/infra/database'
import { Application } from 'express'
import {
  ICreateUserDto,
  IUpdateUserAddressDto as IUpdateUserAddressDto,
  IUser
} from '../src/@protocols/user.protocol'
import { usersMock } from './mocks/user.mock'
import { expect } from 'chai'
import { regionsMock } from './mocks/region.mock'
import { ICreateRegionDto } from '../src/@protocols/region.protocol'
import { GeoCoder } from '../src/modules/geocoder/geocoder'
import { faker } from '@faker-js/faker'

describe('User e2e', () => {
  let app: Application
  let appDatabase: Database
  let fakeGeoCoder: Partial<GeoCoder>

  before(async () => {
    fakeGeoCoder = {
      getAddressFromCoordinates: async () => faker.string.alphanumeric(),
      getCoordinatesFromAddress: async () => ({ lat: 90, lng: 180 })
    }
    const { app: appInstance, database } = await createApp({
      geocoder: fakeGeoCoder
    } as AppExternalModules)

    app = appInstance
    appDatabase = database
  })

  afterEach(async () => {
    await appDatabase.resetCollections()
  })

  describe('GET', () => {
    describe('/users', () => {
      it('should be able to get users correctly', async () => {
        await appDatabase.db.collection('users').insertMany(usersMock)

        await request(app)
          .get(`/users?page=0&limit=${usersMock.length}`)
          .expect(200)
          .then((res) => {
            expect(res.body.data.length).to.be.equal(usersMock.length)
          })
      })
    })
    describe('/users/:id', () => {
      it('should be able to get an user correctly', async () => {
        const { insertedId } = await appDatabase.db
          .collection('users')
          .insertOne(usersMock[0])

        await request(app)
          .get(`/users/${insertedId.toString()}`)
          .expect(200)
          .then((res) => {
            expect(res.body.data).to.deep.include({
              email: usersMock[0].email,
              name: usersMock[0].name,
              address: usersMock[0].address,
              coordinates: usersMock[0].coordinates
            })
          })
      })
    })
  })
  describe('PATCH', () => {
    describe('/users/:id/address', () => {
      it('should be able to update an user address', async () => {
        const { insertedId } = await appDatabase.db
          .collection('users')
          .insertOne(usersMock[0])

        const updateAdressParams: IUpdateUserAddressDto = {
          address: 'New Address'
        }

        await request(app)
          .patch(`/users/${insertedId}/address`)
          .send(updateAdressParams)
          .expect(204)

        await appDatabase.db
          .collection('users')
          .findOne({ _id: insertedId })
          .then((user) => {
            expect(user.address).to.be.equal(updateAdressParams.address)
          })
      })
    })
  })
  describe('POST', () => {
    describe('/users', () => {
      it('should be able to create an user', async () => {
        const createUserParams: ICreateUserDto = {
          email: usersMock[0].email,
          name: usersMock[0].name,
          address: usersMock[0].address
        }
        const response = await request(app)
          .post('/users')
          .send(createUserParams)
          .expect(201)

        const userRes: IUser = response.body.data
        await appDatabase.db
          .collection('users')
          .findOne({ email: usersMock[0].email })
          .then((user) => {
            expect(user._id.toString()).to.be.equal(userRes._id)
            expect(user).to.deep.include({
              email: userRes.email,
              name: userRes.name,
              address: userRes.address,
              coordinates: userRes.coordinates
            })
          })
      })
      it('should reject if email is already in use', async () => {
        const createUserParams: ICreateUserDto = {
          email: usersMock[0].email,
          name: usersMock[0].name,
          address: usersMock[0].address,
          coordinates: usersMock[0].coordinates
        }
        await appDatabase.db.collection('users').insertOne(usersMock[0])
        await request(app)
          .post('/users')
          .send({
            ...createUserParams,
            coordinates: null
          })
          .expect(400)
          .then((response) => {
            const error = response.body
            expect(error.code).to.be.equal(400)
            expect(error.status).to.be.equal('BAD_REQUEST')
            expect(error.output).to.be.equal('EMAIL_ALREADY_IN_USE')
          })
      })
      it('should reject if address and coordinates are provided', async () => {
        const createUserParams: ICreateUserDto = {
          email: usersMock[0].email,
          name: usersMock[0].name,
          address: usersMock[0].address,
          coordinates: usersMock[0].coordinates
        }
        await request(app)
          .post('/users')
          .send(createUserParams)
          .expect(400)
          .then((response) => {
            const error = response.body
            expect(error.code).to.be.equal(400)
            expect(error.status).to.be.equal('BAD_REQUEST')
            expect(error.output).to.be.equal(
              'SHOULD_PROVIDE_ONLY_ADDRESS_OR_COORDINATES'
            )
          })
      })
      it('should reject if address and coordinates are not provided', async () => {
        const createUserParams: ICreateUserDto = {
          email: usersMock[0].email,
          name: usersMock[0].name,
          address: null,
          coordinates: null
        }
        await request(app)
          .post('/users')
          .send(createUserParams)
          .expect(400)
          .then((response) => {
            const error = response.body
            expect(error.code).to.be.equal(400)
            expect(error.status).to.be.equal('BAD_REQUEST')
            expect(error.output).to.be.equal(
              'SHOULD_PROVIDE_ADDRESS_OR_COORDINATES'
            )
          })
      })
    })
  })
  describe('DELETE', () => {
    describe('/users/:id', () => {
      it('should be able to delete an user', async () => {
        await appDatabase.db.collection('users').insertOne(usersMock[0])

        const createRegionParams: ICreateRegionDto = {
          polygon: regionsMock[0].polygon,
          name: regionsMock[0].name,
          userId: usersMock[0]._id.toString()
        }
        await request(app).post('/regions').send(createRegionParams).expect(201)

        await request(app).delete(`/users/${usersMock[0]._id}`).expect(204)

        const userFromDb = await appDatabase.db
          .collection('users')
          .findOne({ _id: usersMock[0]._id })
        expect(userFromDb.isDeleted).to.be.true

        const regionFromDb = await appDatabase.db
          .collection('regions')
          .findOne({ user: usersMock[0]._id.toString() })
        expect(regionFromDb.isDeleted).to.be.true
      })
    })
  })
})
