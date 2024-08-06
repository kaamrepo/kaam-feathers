// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  termsAndConditionsDataValidator,
  termsAndConditionsPatchValidator,
  termsAndConditionsQueryValidator,
  termsAndConditionsResolver,
  termsAndConditionsExternalResolver,
  termsAndConditionsDataResolver,
  termsAndConditionsPatchResolver,
  termsAndConditionsQueryResolver
} from './terms-and-conditions.schema.js'
import { TermsAndConditionsService, getOptions } from './terms-and-conditions.class.js'
import { termsAndConditionsPath, termsAndConditionsMethods } from './terms-and-conditions.shared.js'

export * from './terms-and-conditions.class.js'
export * from './terms-and-conditions.schema.js'

import { commonHook } from '../../hooks/commonHook.js'

// A configure function that registers the service and its hooks via `app.configure`
export const termsAndConditions = (app) => {
  // Register our service on the Feathers application
  app.use(termsAndConditionsPath, new TermsAndConditionsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: termsAndConditionsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(termsAndConditionsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(termsAndConditionsExternalResolver),
        schemaHooks.resolveResult(termsAndConditionsResolver)
      ]
    },
    before: {
      all: [
        commonHook(),
        schemaHooks.validateQuery(termsAndConditionsQueryValidator),
        schemaHooks.resolveQuery(termsAndConditionsQueryResolver)
      ],
      find: [],
      get: [authenticate('jwt')],
      create: [
        authenticate('jwt'),
        schemaHooks.validateData(termsAndConditionsDataValidator),
        schemaHooks.resolveData(termsAndConditionsDataResolver)
      ],
      patch: [
        authenticate('jwt'),
        schemaHooks.validateData(termsAndConditionsPatchValidator),
        schemaHooks.resolveData(termsAndConditionsPatchResolver)
      ],
      remove: [authenticate('jwt')]
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
