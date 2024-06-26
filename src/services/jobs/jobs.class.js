import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class JobService extends MongoDBService { }


export const getOptions = (app) =>
{
  return {
    operators: ['$regex', '$options', '$exists', '$geoNear'],
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient')
      .then((db) => db.collection('jobs'))
      .then((collection) =>
      {
        collection.createIndex(
          { location: '2dsphere' },
          // { partialFilterExpression: { location: { $exists: true } } }
        )
        return collection
      })
  }
}
