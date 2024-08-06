// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  userRolesDataValidator,
  userRolesPatchValidator,
  userRolesQueryValidator,
  userRolesResolver,
  userRolesExternalResolver,
  userRolesDataResolver,
  userRolesPatchResolver,
  userRolesQueryResolver
} from './user-roles.schema.js'
import { UserRolesService, getOptions } from './user-roles.class.js'
import { userRolesPath, userRolesMethods } from './user-roles.shared.js'

export * from './user-roles.class.js'
export * from './user-roles.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const userRoles = (app) => {
  // Register our service on the Feathers application
  app.use(userRolesPath, new UserRolesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: userRolesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(userRolesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(userRolesExternalResolver),
        schemaHooks.resolveResult(userRolesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(userRolesQueryValidator),
        schemaHooks.resolveQuery(userRolesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(userRolesDataValidator),
        schemaHooks.resolveData(userRolesDataResolver),
      ],
      patch: [
        schemaHooks.validateData(userRolesPatchValidator),
        schemaHooks.resolveData(userRolesPatchResolver)
      ],
      remove: [],
      findOneByQuery: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
