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
import 'dotenv/config'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'
import { authentication } from './authentication.js'
import { services } from './services/index.js'
import { channels } from './channels.js'
import { CloudnarySetup } from './utils/cloudnarySetup.js'
import { firebaseSetup } from './utils/fcmSetup.js'
// import { addHttpMethodToFeathersContext } from './hooks/add-http-method-to-feathers-context.js'

import path from 'path'
const app = express(feathers())
// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))
// public url for images
app.use('/api/images/', express.static(path.join('public/images/')))
// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    },
    pingInterval: 10000,
    pingTimeout: 50000
  })
)
console.log('.......')
app.configure(mongodb)
app.configure(authentication)
app.configure(services)
app.configure(channels)
// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))
// fcm and cloudinary and s3 setup configuration
// FcmSetup(app)
firebaseSetup(app)
CloudnarySetup(app)
// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [
      logError
      // addHttpMethodToFeathersContext
    ]
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
