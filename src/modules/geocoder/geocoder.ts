import Nomatin from 'node-nominatim2'

export class GeoCoder {
  private geocoder: Nomatin

  constructor() {
    this.initGeocoder()
  }

  private initGeocoder() {
    const config = {
      useragent: 'MyApp',
      referer: 'https://github.com/xbgmsharp/node-nominatim2',
      timeout: 1000
    }
    this.geocoder = new Nomatin(config)
  }

  public async getAddressFromCoordinates(
    lng: number,
    lat: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.geocoder.reverse({ lon: lng, lat }, (err, _res, data) => {
        if (err) return reject(err)
        const address = data.display_name
        resolve(address)
      })
    })
  }

  public async getCoordinatesFromAddress(
    address: string
  ): Promise<{ lng: number; lat: number }> {
    return new Promise((resolve, reject) => {
      this.geocoder.search({ q: address }, (err, _res, data) => {
        if (err) return reject(err)
        const lat = +data[0].lat
        const lng = +data[0].lon
        resolve({ lng, lat })
      })
    })
  }
}

const geocoder = new GeoCoder()
export { geocoder }
