// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  dummyDataValidator,
  dummyPatchValidator,
  dummyQueryValidator,
  dummyResolver,
  dummyExternalResolver,
  dummyDataResolver,
  dummyPatchResolver,
  dummyQueryResolver
} from './dummy.schema.js'
import { DummyService, getOptions } from './dummy.class.js'
import { dummyPath, dummyMethods } from './dummy.shared.js'

export * from './dummy.class.js'
export * from './dummy.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const dummy = (app) => {
  // Register our service on the Feathers application
  app.use(dummyPath, new DummyService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: dummyMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(dummyPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(dummyExternalResolver), schemaHooks.resolveResult(dummyResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(dummyQueryValidator), schemaHooks.resolveQuery(dummyQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(dummyDataValidator), schemaHooks.resolveData(dummyDataResolver)],
      patch: [
        schemaHooks.validateData(dummyPatchValidator),
        async (hook) => {
          const { chat_message } = hook.data
          delete hook.data.chat_message
          hook.data = {
            ...hook.data,
            $push: { messages: chat_message }
          }
          return hook
        },
        schemaHooks.resolveData(dummyPatchResolver)
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
