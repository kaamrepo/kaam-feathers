// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  approvalDataValidator,
  approvalPatchValidator,
  approvalQueryValidator,
  approvalResolver,
  approvalExternalResolver,
  approvalDataResolver,
  approvalPatchResolver,
  approvalQueryResolver
} from './approval.schema.js'
import { ApprovalService, getOptions } from './approval.class.js'
import { approvalPath, approvalMethods } from './approval.shared.js'

export * from './approval.class.js'
export * from './approval.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const approval = (app) => {
  // Register our service on the Feathers application
  app.use(approvalPath, new ApprovalService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: approvalMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(approvalPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(approvalExternalResolver),
        schemaHooks.resolveResult(approvalResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(approvalQueryValidator),
        schemaHooks.resolveQuery(approvalQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(approvalDataValidator),
        schemaHooks.resolveData(approvalDataResolver)
      ],
      patch: [
        schemaHooks.validateData(approvalPatchValidator),
        schemaHooks.resolveData(approvalPatchResolver)
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
