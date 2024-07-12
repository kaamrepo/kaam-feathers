// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  rolesDataValidator,
  rolesPatchValidator,
  rolesQueryValidator,
  rolesResolver,
  rolesExternalResolver,
  rolesDataResolver,
  rolesPatchResolver,
  rolesQueryResolver
} from './roles.schema.js'
import { RolesService, getOptions } from './roles.class.js'
import { rolesPath, rolesMethods } from './roles.shared.js'

export * from './roles.class.js'
export * from './roles.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const roles = (app) => {
  // Register our service on the Feathers application
  app.use(rolesPath, new RolesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: rolesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(rolesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(rolesExternalResolver),
        schemaHooks.resolveResult(rolesResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(rolesQueryValidator), schemaHooks.resolveQuery(rolesQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(rolesDataValidator), schemaHooks.resolveData(rolesDataResolver)],
      patch: [schemaHooks.validateData(rolesPatchValidator), schemaHooks.resolveData(rolesPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
