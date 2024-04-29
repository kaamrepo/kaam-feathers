import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class JobapplicationService extends MongoDBService {
  // constructor(object) {
  //   this.object = object
  // }
  async getByQueryParams(params) {
    const res = await this.find(params)
    if (res.total) {
      return res.data[0]
    }
    return undefined
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('jobapplications'))
  }
}
