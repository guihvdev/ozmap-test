import request from 'supertest'
import { AppExternalModules, createApp } from '../src/main'
import { Database } from '../src/infra/database'
import { Application } from 'express'
import { usersMock } from './mocks/user.mock'
import { expect } from 'chai'
import { regionsMock } from './mocks/region.mock'
import {
  ICreateRegionDto,
  IRegion,
  IUpdateRegionPolygonDto
} from '../src/@protocols/region.protocol'
import { GeoCoder } from '../src/modules/geocoder/geocoder'
import { faker } from '@faker-js/faker'
import { ObjectId } from '../src/modules/base/entities/base.entity'

describe('Region e2e', () => {
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
    describe('/regions', () => {
      it('should be able to get regions', async () => {
        await appDatabase.db.collection('regions').insertMany(regionsMock)

        await request(app)
          .get(`/regions`)
          .expect(200)
          .then((res) => {
            console.debug(res.body.data)
            expect(res.body.data.type).to.be.equal('FeatureCollection')
            expect(res.body.data.features.length).to.be.equal(
              regionsMock.length
            )
          })
      })
      it('should be able to get regions filtered by user', async () => {
        const [insertIdUser1, insertIdUser2] = await Promise.all([
          appDatabase.db.collection('users').insertOne(usersMock[0]),
          appDatabase.db.collection('users').insertOne(usersMock[1])
        ]).then((results) =>
          results.map((result) => result.insertedId.toString())
        )

        const regions = [
          {
            polygon: regionsMock[0].polygon,
            name: regionsMock[0].name,
            userId: insertIdUser1
          },
          {
            polygon: regionsMock[1].polygon,
            name: regionsMock[1].name,
            userId: insertIdUser2
          }
        ]

        await Promise.all(
          regions.map((region) =>
            request(app).post(`/regions`).send(region).expect(201)
          )
        )

        await request(app)
          .get(`/regions?user=${insertIdUser1}`)
          .expect(200)
          .then((res) => {
            expect(res.body.data.features.length).to.be.equal(1)
            expect(res.body.data.features[0].properties).to.deep.include({
              name: regionsMock[0].name,
              isUserRegion: true
            })
          })
      })
      it('should not return deleted regions', async () => {
        const { insertedId: insertIdUser1 } = await appDatabase.db
          .collection('users')
          .insertOne(usersMock[0])

        const regions = [
          {
            polygon: regionsMock[0].polygon,
            name: regionsMock[0].name,
            userId: insertIdUser1
          },
          {
            polygon: regionsMock[1].polygon,
            name: regionsMock[1].name,
            userId: insertIdUser1
          }
        ]

        await Promise.all(
          regions.map((region) =>
            request(app).post(`/regions`).send(region).expect(201)
          )
        )

        await appDatabase.db
          .collection('regions')
          .findOneAndUpdate(
            { user: insertIdUser1.toString() },
            { $set: { isDeleted: true } }
          )

        await request(app)
          .get(`/regions`)
          .expect(200)
          .then((res) => {
            expect(res.body.data.features.length).to.be.equal(1)
          })
      })
    })
    describe('/regions/:id', () => {
      it('should be able to get a single region', async () => {
        const { insertedId } = await appDatabase.db
          .collection('regions')
          .insertOne(regionsMock[0])

        await request(app)
          .get(`/regions/${insertedId.toString()}`)
          .expect(200)
          .then((res) => {
            expect(res.body.data).to.deep.include({
              name: regionsMock[0].name,
              polygon: regionsMock[0].polygon
            })
          })
      })
    })
    describe('/regions/point-distance/:lng/:lat/:distance', () => {
      it('should be able to get regions with a referential point distance', async () => {
        const newRegion = {
          userId: new ObjectId(),
          name: 'Near Region',
          polygon: {
            type: 'Polygon',
            coordinates: [
              [
                [-47.115052282523196, -18.42004856723054],
                [-47.112952282523196, -18.508521684870615],
                [-47.03607795454727, -18.508521684870615],
                [-47.03607795454727, -18.45004856723054],
                [-47.115052282523196, -18.42004856723054]
              ]
            ]
          }
        }
        await request(app).post('/regions').send(newRegion).expect(201)

        const lng = -47.112952282523196
        const lat = -18.40004856723054
        const distance = 20
        await request(app)
          .get(`/regions/point-distance/${lng}/${lat}/${distance}`)
          .expect(200)
          .then((res) => {
            expect(res.body.data.features.length).to.be.equal(1)
          })
      })
      it('should be able to get user regions with a referential point` distance', async () => {
        const { insertedId: insertIdUser1 } = await appDatabase.db
          .collection('users')
          .insertOne(usersMock[0])
        const { insertedId: insertIdUser2 } = await appDatabase.db
          .collection('users')
          .insertOne(usersMock[1])

        const newRegion = {
          userId: insertIdUser1,
          name: 'Near Region',
          polygon: {
            type: 'Polygon',
            coordinates: [
              [
                [-47.115052282523196, -18.42004856723054],
                [-47.112952282523196, -18.508521684870615],
                [-47.03607795454727, -18.508521684870615],
                [-47.03607795454727, -18.45004856723054],
                [-47.115052282523196, -18.42004856723054]
              ]
            ]
          }
        }

        await request(app).post('/regions').send(newRegion).expect(201)

        const lng = -47.112952282523196
        const lat = -18.40004856723054
        const distance = 20

        await request(app)
          .get(
            `/regions/point-distance/${lng}/${lat}/${distance}?user=${insertIdUser1}`
          )
          .expect(200)
          .then((res) => {
            expect(res.body.data.features.length).to.be.equal(1)
          })
        await request(app)
          .get(
            `/regions/point-distance/${lng}/${lat}/${distance}?user=${insertIdUser2}`
          )
          .expect(200)
          .then((res) => {
            expect(res.body.data.features.length).to.be.equal(0)
          })
      })
    })
  })
  describe('PATCH', () => {
    describe('/regions/:id/polygon', () => {
      it('should be able to update the polygon of a region', async () => {
        const { insertedId } = await appDatabase.db
          .collection('regions')
          .insertOne(regionsMock[0])

        const newPolygon: IUpdateRegionPolygonDto = {
          polygon: {
            coordinates: regionsMock[1].polygon.coordinates,
            type: 'Polygon'
          }
        }

        await request(app)
          .patch(`/regions/${insertedId.toString()}/polygon`)
          .send(newPolygon)
          .expect(204)

        await appDatabase.db
          .collection('regions')
          .findOne({ _id: insertedId })
          .then((region: IRegion) => {
            expect(region.polygon).to.deep.equal(newPolygon.polygon)
          })
      })
    })

    describe('/regions/:id/name', () => {
      it('should be able to update the name of a region', async () => {
        const { insertedId } = await appDatabase.db
          .collection('regions')
          .insertOne(regionsMock[0])

        const newName = 'New Region Name'

        await request(app)
          .patch(`/regions/${insertedId.toString()}/name`)
          .send({ name: newName })
          .expect(204)

        await appDatabase.db
          .collection('regions')
          .findOne({ _id: insertedId })
          .then((region) => {
            expect(region.name).to.equal(newName)
          })
      })
    })
  })
  describe('POST', () => {
    describe('/regions', () => {
      it('should be able to create a region', async () => {
        const createRegionParams: ICreateRegionDto = {
          userId: usersMock[0]._id.toString(),
          name: regionsMock[0].name,
          polygon: regionsMock[0].polygon
        }

        await request(app)
          .post('/regions')
          .send(createRegionParams)
          .expect(201)
          .then((res) => {
            expect(res.body.data).to.deep.include({
              name: regionsMock[0].name,
              polygon: regionsMock[0].polygon
            })
          })
      })
    })
  })
  describe('DELETE', () => {
    describe('/regions/:id', () => {
      it('should be able to delete a region', async () => {
        const { insertedId } = await appDatabase.db
          .collection('regions')
          .insertOne(regionsMock[0])

        await request(app)
          .delete(`/regions/${insertedId.toString()}`)
          .expect(204)

        await appDatabase.db
          .collection('regions')
          .findOne({ _id: insertedId })
          .then((region) => {
            expect(region.isDeleted).to.be.true
          })
      })
    })
  })
})
