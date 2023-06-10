// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  userDataValidator,
  userPatchValidator,
  userQueryValidator,
  userResolver,
  userExternalResolver,
  userDataResolver,
  userPatchResolver,
  userQueryResolver
} from './users.schema.js'
import { UserService, getOptions } from './users.class.js'
import { userPath, userMethods } from './users.shared.js'
import { generateOTPandExpiryTime } from './hooks/create/generateOTPandExpiryTime.js'
import { duplicateKeyError } from './hooks/error/duplicateKeyError.js'
import { sendOTP } from './hooks/create/sendOTP.js'
import multer from 'multer'
import { notificationHelper } from '../../helpers/notificationHelper.js'
import { saveCloudnaryImage } from '../../helpers/saveCloudnaryImage.js'

export * from './users.class.js'
export * from './users.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const user = (app) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/profilepic'), // where the files are being stored
    filename: (_req, file, cb) => cb(null, `ProfilePic_${Date.now()}-${file.originalname}`) // getting the file name
  })
  const upload = multer({
    storage: storage
  })
  // Register our service on the Feathers application
  app.use(
    userPath,
    upload.single('profilePic'),
    async (req, res, next) => {
      console.log(req.body)
      console.log(req.file)
      let imageUpload = await saveCloudnaryImage(req.file.path)
      console.log('imageUpload', imageUpload)
      next()
    },
    new UserService(getOptions(app)),
    {
      // A list of all methods this service exposes externally
      methods: userMethods,
      // You can add additional custom events to be sent to clients here
      events: []
    }
  )
  // Initialize hooks
  app.service(userPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(userExternalResolver), schemaHooks.resolveResult(userResolver)],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [schemaHooks.validateQuery(userQueryValidator), schemaHooks.resolveQuery(userQueryResolver)],
      find: [],
      get: [],
      create: [
        generateOTPandExpiryTime,
        schemaHooks.validateData(userDataValidator),
        sendOTP,
        schemaHooks.resolveData(userDataResolver)
      ],
      patch: [schemaHooks.validateData(userPatchValidator), schemaHooks.resolveData(userPatchResolver)],
      remove: []
    },
    after: {
      all: [],
      create: [
        async (hook) => {
          try {
            let notificationMessage = {
              notification: {
                title: 'Toolbox training completed',
                body: 'Test 1'
              },
              data: {
                event: 'Toolbox Training',
                action: 'close'
              }
            }
            let response = await notificationHelper(
              hook.app,
              [
                'f6ZU75sdSbyfiiJ-Hjk6WB:APA91bF0XGwpmZYcLC3SqYq1RtT4GFfa4ezJxUt-FcubFPRdLDpyMbvD9yPudFYn1KFjzI5uQ3fsG4-aZ5r3wK1ErEXQhO-gbDU0axgfJ3UGIGFAH4xkuT0r1grbmpCiNmF1B8AGGzpA'
              ],
              notificationMessage
            )
            console.log('response', response)
          } catch (error) {
            console.log('Notificaion error', error)
          }
        }
      ]
    },
    error: {
      all: [],
      create: [duplicateKeyError]
    }
  })
}