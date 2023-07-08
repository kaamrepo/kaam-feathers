// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'

import { authentication } from './authentication.js'

import { services } from './services/index.js'
import { channels } from './channels.js'


// firebase notification imports:
import admin from 'firebase-admin'

// cloudinary image imports:
import cloudinary from 'cloudinary'



const app = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(mongodb)

app.configure(authentication)

app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))



// Fcm Notification
const uid = 'some-uid'
const additionalClaims = {
  premiumAccount: true
}
function jsonConcat(o1, o2)
{
  for (let key in o2)
  {
    o1[key] = o2[key]
  }
  return o1
}
let serviceAccountInfo = app.get('firebase_fcm_serive_account')
let serviceAuthUrl = app.get('firebase_fcm_auth_url')
let serviceAccount = {}
if (serviceAuthUrl && Object.keys(serviceAuthUrl).length != 0)
{
  serviceAccount = jsonConcat(serviceAccount, JSON.parse(serviceAuthUrl))
}
serviceAccount = jsonConcat(serviceAccount, JSON.parse(serviceAccountInfo))
let firbaseEmail = app.get('firebase_db_url')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firbaseEmail
})
app.set('FIREBASE', admin)
admin
  .auth()
  .createCustomToken(uid, additionalClaims)
  .catch((error) => console.log(error))


//cloudnary setup
cloudinary.config({
  cloud_name: app.get('cloudName'),
  api_key: app.get('apiKey'),
  api_secret: app.get('apiSecret')
})

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
