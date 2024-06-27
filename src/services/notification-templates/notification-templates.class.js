import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class NotificationTemplatesService extends MongoDBService {}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app
      .get('mongodbClient')
      .then((db) => db.collection('notification-templates'))
      .then((collection) => {
        collection.createIndex({ name: 1 }, { unique: true })
        return collection
      })
  }
}
