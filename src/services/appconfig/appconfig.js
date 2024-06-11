// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  appconfigDataValidator,
  appconfigPatchValidator,
  appconfigQueryValidator,
  appconfigResolver,
  appconfigExternalResolver,
  appconfigDataResolver,
  appconfigPatchResolver,
  appconfigQueryResolver
} from './appconfig.schema.js'
import { AppconfigService, getOptions } from './appconfig.class.js'
import { appconfigPath, appconfigMethods } from './appconfig.shared.js'

export * from './appconfig.class.js'
export * from './appconfig.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const appconfig = (app) => {
  // Register our service on the Feathers application
  app.use(appconfigPath, new AppconfigService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: appconfigMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(appconfigPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(appconfigExternalResolver),
        schemaHooks.resolveResult(appconfigResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(appconfigQueryValidator),
        schemaHooks.resolveQuery(appconfigQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(appconfigDataValidator),
        schemaHooks.resolveData(appconfigDataResolver)
      ],
      patch: [
        schemaHooks.validateData(appconfigPatchValidator),
        schemaHooks.resolveData(appconfigPatchResolver)
      ],
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
