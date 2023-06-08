import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class UserService extends MongoDBService
{

  async getByPhone(phone)
  {
    const user = await super.find({ query: { phone } })
    if (user.total)
      return user.data[0]
    else return undefined
  }
}

export const getOptions = (app) =>
{
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('users'))
      .then((collection) =>
      {
        collection.createIndex({ phone: 1 }, { unique: true })
        return collection
      })
  }
}
