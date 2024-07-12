import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class RolesService extends MongoDBService {
  async findOneByQuery(params) {
    const result = await super.find(params)
    return result.data.at(0)
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    multi: ['create'],
    Model: app.get('mongodbClient').then((db) => db.collection('roles'))
  }
}
