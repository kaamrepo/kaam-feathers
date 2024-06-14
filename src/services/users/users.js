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
import { duplicateKeyError } from './hooks/error/duplicateKeyError.js'
import { sendOTP } from './hooks/create/sendOTP.js'
import { checkUserExists } from './hooks/login/checkUserExists.js'
import { checkUserAlreadyRegistered } from './hooks/create/checkUserAlreadyRegistered.js'
import { appendOrRemoveFirebaseToken } from './hooks/patch/appendOrRemoveFirebaseToken.js'
import { addDefaultValuesToUser } from './hooks/create/addDefaultValues.js'
export * from './users.class.js'
export * from './users.schema.js'
import { userQueryfilters } from './hooks/filters/customUserSearchHook.js'
import { commonHook } from '../../hooks/commonHook.js'
import { searchHook } from '../../hooks/searchHook.js'
import commonUploadHandler from '../../helpers/commonUploadHandler.js'
const profilePhotosPath = 'uploads/profilepic'
// A configure function that registers the service and its hooks via `app.configure`
export const user = (app) => {
  const upload = commonUploadHandler({
    fields: [{ name: 'profilepic', maxCount: 1 }],
    allowedTypes: ['image/jpeg', 'image/png']
  })
  // Register our service on the Feathers application
  app.use(
    userPath,
    upload,
    async (req, res, next) => {
      try {
        const checkIsUpload = req.method === 'PATCH' && req.body.source === 'uploadProfile'
        if (checkIsUpload) {
          if (req.files && Object.keys(req.files).length > 0) {
            req.body.profilepic = req.files.profilepic[0]
          } else {
            throw new Error('Please select file to upload')
          }
        }
        next()
      } catch (error) {
        next(error)
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
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(userExternalResolver),
        schemaHooks.resolveResult(userResolver)
      ],
      find: [authenticate('jwt')],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },
    before: {
      find: [commonHook(), searchHook()],
      get: [],
      create: [
        checkUserAlreadyRegistered,
        generateOTPandExpiryTime,
        schemaHooks.validateData(userDataValidator),
        sendOTP,
        addDefaultValuesToUser,
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
      all: [schemaHooks.validateQuery(userQueryValidator), schemaHooks.resolveQuery(userQueryResolver)],
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
