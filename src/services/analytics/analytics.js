// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  analyticsDataValidator,
  analyticsPatchValidator,
  analyticsQueryValidator,
  analyticsResolver,
  analyticsExternalResolver,
  analyticsDataResolver,
  analyticsPatchResolver,
  analyticsQueryResolver
} from './analytics.schema.js'
import { AnalyticsService, getOptions } from './analytics.class.js'
import { analyticsPath, analyticsMethods } from './analytics.shared.js'

export * from './analytics.class.js'
export * from './analytics.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const analytics = (app) => {
  // Register our service on the Feathers application
  app.use(analyticsPath, new AnalyticsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: analyticsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(analyticsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(analyticsExternalResolver),
        schemaHooks.resolveResult(analyticsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(analyticsQueryValidator),
        schemaHooks.resolveQuery(analyticsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(analyticsDataValidator),
        schemaHooks.resolveData(analyticsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(analyticsPatchValidator),
        schemaHooks.resolveData(analyticsPatchResolver)
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
