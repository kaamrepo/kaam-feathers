// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { MongoClient } from 'mongodb'

export const mongodb = (app) => {
  const connection = app.get('mongodb')

  let mongodbUrl = `mongodb://${ encodeURIComponent(process.env.KAAM_DB_USERNAME) }:${ encodeURIComponent(process.env.KAAM_DB_PASSWORD) }@${ process.env.KAAM_DB_HOSTNAME }:${ process.env.KAAM_DB_PORT }/${ process.env.KAAM_DB_NAME }?authSource=${ process.env.KAAM_DB_NAME }`
  
  const database = new URL(connection).pathname.substring(1)
  const mongoClient = MongoClient.connect(connection).then((client) => client.db(database))

  app.set('mongodbClient', mongoClient)
}
