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
  loginPatchValidator,
  userCreateStaffDataResolver
} from './users.schema.js'
import { UserService, getOptions } from './users.class.js'
import {
  userPath,
  userMethods,
  userLoginPath,
  userLoginMethods,
  userCreateStaffPath,
  userCreateStaffMethods
} from './users.shared.js'
import { generateOTPandExpiryTime } from './hooks/create/generateOTPandExpiryTime.js'
import { patchUserInfo } from './hooks/patch/patchUserInfo.js'
import { duplicateKeyError } from './hooks/error/duplicateKeyError.js'
import { sendOTP } from './hooks/create/sendOTP.js'
import { appendPassword } from './hooks/create/appendPassword.js'
import { checkUserExists } from './hooks/login/checkUserExists.js'
import { checkUserAlreadyRegistered } from './hooks/create/checkUserAlreadyRegistered.js'
import { appendOrRemoveFirebaseToken } from './hooks/patch/appendOrRemoveFirebaseToken.js'
import { addDefaultValuesToUser } from './hooks/create/addDefaultValues.js'
export * from './users.class.js'
export * from './users.schema.js'
import { commonHook } from '../../hooks/commonHook.js'
import { searchHook } from '../../hooks/searchHook.js'
import commonUploadHandler from '../../helpers/commonUploadHandler.js'
import { sentPasswordEmailNotification } from './hooks/create/sentPasswordEmailNotification.js'
import { createNewUserRole } from './hooks/create/createNewUserRole.js'
import { addUserRoleInParams } from './hooks/create/addUserRoleInParams.js'
import { fetchUsersByRoleId } from './hooks/filters/fetchUsersByRoleId.js'
import { authorizeApiRequest } from '../../hooks/check-authorization.js'
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
        // authenticate('jwt'),
        schemaHooks.resolveExternal(userExternalResolver),
        schemaHooks.resolveResult(userResolver)
      ],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      find: [commonHook(), searchHook(), fetchUsersByRoleId()],
      get: [],
      create: [
        checkUserAlreadyRegistered,
        addUserRoleInParams,
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
      create: [createNewUserRole]
    },
    error: {
      all: [],
      create: [duplicateKeyError]
    }
  })

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

  // on board users
  app.use(userCreateStaffPath, new UserService(getOptions(app)), {
    methods: userCreateStaffMethods,
    events: []
  })
  app.service(userCreateStaffPath).hooks({
    before: {
      all: [],
      create: [
        addUserRoleInParams,
        checkUserAlreadyRegistered,
        appendPassword,
        addDefaultValuesToUser,
        schemaHooks.resolveData(userCreateStaffDataResolver)
      ]
    },
    after: {
      create: [
        // createuserrole
        createNewUserRole,
        // sent email passwordString
        sentPasswordEmailNotification
      ]
    }
  })

  //// <- ******************************** LOGIN ROUTE *********************************** -> ////
}
