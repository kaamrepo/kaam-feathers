// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  incrementalRequestDataValidator,
  incrementalRequestPatchValidator,
  incrementalRequestQueryValidator,
  incrementalRequestResolver,
  incrementalRequestExternalResolver,
  incrementalRequestDataResolver,
  incrementalRequestPatchResolver,
  incrementalRequestQueryResolver
} from './incrementalrequest.schema.js'
import { IncrementalRequestService, getOptions } from './incrementalrequest.class.js'
import { incrementalRequestPath, incrementalRequestMethods } from './incrementalrequest.shared.js'
import { authorizeApiRequest } from '../../hooks/check-authorization.js'

export * from './incrementalrequest.class.js'
export * from './incrementalrequest.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const incrementalRequest = (app) => {
  // Register our service on the Feathers application
  app.use(incrementalRequestPath, new IncrementalRequestService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: incrementalRequestMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(incrementalRequestPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        authorizeApiRequest,
        schemaHooks.resolveExternal(incrementalRequestExternalResolver),
        schemaHooks.resolveResult(incrementalRequestResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(incrementalRequestQueryValidator),
        schemaHooks.resolveQuery(incrementalRequestQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(incrementalRequestDataValidator),
        schemaHooks.resolveData(incrementalRequestDataResolver)
      ],
      patch: [
        schemaHooks.validateData(incrementalRequestPatchValidator),
        schemaHooks.resolveData(incrementalRequestPatchResolver)
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
