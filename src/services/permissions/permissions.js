// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  permissionsDataValidator,
  permissionsPatchValidator,
  permissionsQueryValidator,
  permissionsResolver,
  permissionsExternalResolver,
  permissionsDataResolver,
  permissionsPatchResolver,
  permissionsQueryResolver
} from './permissions.schema.js'
import { PermissionsService, getOptions } from './permissions.class.js'
import { permissionsPath, permissionsMethods } from './permissions.shared.js'

export * from './permissions.class.js'
export * from './permissions.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const permissions = (app) => {
  // Register our service on the Feathers application
  app.use(permissionsPath, new PermissionsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: permissionsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(permissionsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(permissionsExternalResolver),
        schemaHooks.resolveResult(permissionsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(permissionsQueryValidator),
        schemaHooks.resolveQuery(permissionsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(permissionsDataValidator),
        schemaHooks.resolveData(permissionsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(permissionsPatchValidator),
        schemaHooks.resolveData(permissionsPatchResolver)
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
