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
  userQueryResolver,
  loginPatchResolver,
  loginPatchValidator
} from './users.schema.js'
import { UserService, getOptions } from './users.class.js'
import { userPath, userMethods, userLoginPath, userLoginMethods } from './users.shared.js'
import { generateOTPandExpiryTime } from './hooks/create/generateOTPandExpiryTime.js'
import { patchUserInfo } from './hooks/patch/patchUserInfo.js'
import { BadRequest } from '@feathersjs/errors'
import { duplicateKeyError } from './hooks/error/duplicateKeyError.js'
import { sendOTP } from './hooks/create/sendOTP.js'
import { checkUserExists } from './hooks/login/checkUserExists.js'
import { checkUserAlreadyRegistered } from './hooks/create/checkUserAlreadyRegistered.js'
import { appendOrRemoveFirebaseToken } from './hooks/patch/appendOrRemoveFirebaseToken.js'

export * from './users.class.js'
export * from './users.schema.js'

// multer implementation
import fs from 'fs'
import multer from 'multer'
const profilePhotosPath = 'uploads/profilepic'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, profilePhotosPath), // where the files are being stored
  filename: (_req, file, cb) => cb(null, `ProfilePic_${Date.now()}-${file.originalname}`) // getting the file name
})

const memoryStorage = multer.memoryStorage()

const fileFilter = function (req, file, cb) {
  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Wrong file type')
    error.code = 'LIMIT_FILE_TYPES'
    return cb(error, false)
  }
  cb(null, true)
}
const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter
})

// A configure function that registers the service and its hooks via `app.configure`
export const user = (app) => {
  // Register our service on the Feathers application
  app.use(
    userPath,
    async function (req, res, next) {
      try {
        if (!fs.existsSync(profilePhotosPath)) {
          fs.mkdirSync(profilePhotosPath, { recursive: true })
        }
      } catch (err) {
        console.log(err)
        return err
      }
      next()
    },
    async (req, res, next) => {
      // Check if the method is PATCH
      if (req.method === 'PATCH') {
        await upload.single('profilepic')(req, res, (err) => {
          if (err) {
            console.error('Multer error:', err)
            throw new BadRequest('File upload failed.')
          } else {
            if (req.file) {
              req.body.profilepic = req.file
            }
            next()
          }
        })
      } else {
        // For other methods, skip the Multer middleware
        next()
      }
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
        checkUserAlreadyRegistered,
        generateOTPandExpiryTime,
        schemaHooks.validateData(userDataValidator),
        sendOTP,
        schemaHooks.resolveData(userDataResolver)
      ],
      patch: [
        patchUserInfo,
        schemaHooks.validateData(userPatchValidator),
        schemaHooks.resolveData(userPatchResolver),
        appendOrRemoveFirebaseToken
      ],
      remove: []
    },
    after: {
      all: [],
      create: [
        // async (hook) => {
        //   try {
        //     let notificationMessage = {
        //       notification: {
        //         title: 'Toolbox training completed',
        //         body: 'Test 1'
        //       },
        //       data: {
        //         event: 'Toolbox Training',
        //         action: 'close'
        //       }
        //     }
        //     let response = await notificationHelper(
        //       hook.app,
        //       [
        //         'f6ZU75sdSbyfiiJ-Hjk6WB:APA91bF0XGwpmZYcLC3SqYq1RtT4GFfa4ezJxUt-FcubFPRdLDpyMbvD9yPudFYn1KFjzI5uQ3fsG4-aZ5r3wK1ErEXQhO-gbDU0axgfJ3UGIGFAH4xkuT0r1grbmpCiNmF1B8AGGzpA'
        //       ],
        //       notificationMessage
        //     )
        //     console.log('response', response)
        //   } catch (error) {
        //     console.log('Notificaion error', error)
        //   }
        // }
      ]
    },
    error: {
      all: [],
      create: [duplicateKeyError]
    }
  })

  //// <- ******************************** LOGIN ROUTE *********************************** -> ////

  app.use(userLoginPath, new UserService(getOptions(app)), {
    methods: userLoginMethods,
    events: []
  })
  app.service(userLoginPath).hooks({
    before: {
      all: [],
      patch: [
        checkUserExists,
        generateOTPandExpiryTime,
        schemaHooks.validateData(loginPatchValidator),
        sendOTP,
        schemaHooks.resolveData(loginPatchResolver)
      ]
    }
  })

  //// <- ******************************** LOGIN ROUTE *********************************** -> ////
}
