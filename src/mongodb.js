// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { MongoClient } from 'mongodb'
import { logger } from './logger.js'
export const mongodb = (app) => {
  const connection = app.get('kaam_mongodb')
  logger.info(`🚀 Mongodb connection: ${connection}`)
  const database = new URL(connection).pathname.substring(1)
  const mongoClient = MongoClient.connect(connection).then((client) => client.db(database))
  app.set('mongodbClient', mongoClient)
}
