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
  loginPatchValidator,
  loginPatchResolver
} from './users.schema.js'
import { UserService, getOptions } from './users.class.js'
import { userPath, userMethods, userLoginPath, userLoginMethods } from './users.shared.js'
import { generateOTPandExpiryTime } from './hooks/create/generateOTPandExpiryTime.js'
import { duplicateKeyError } from './hooks/error/duplicateKeyError.js'
import { sendOTP } from './hooks/create/sendOTP.js'
import { checkUserExists } from './hooks/login/checkUserExists.js'

export * from './users.class.js'
export * from './users.schema.js'
// A configure function that registers the service and its hooks via `app.configure`
export const user = (app) => {
  // Register our service on the Feathers application
  app.use(userPath, new UserService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: userMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
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

  //// <- ******************************** LOGIN *********************************** -> ////
}
