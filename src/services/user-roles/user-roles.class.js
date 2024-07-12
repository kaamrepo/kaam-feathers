import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class UserRolesService extends MongoDBService {
  async findOneByQuery(params) {
    const result = await super.find(params)
    return result?.data?.at(0) ?? null
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('user-roles'))
  }
}
