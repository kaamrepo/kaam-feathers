// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  userJobPreferencesDataValidator,
  userJobPreferencesPatchValidator,
  userJobPreferencesQueryValidator,
  userJobPreferencesResolver,
  userJobPreferencesExternalResolver,
  userJobPreferencesDataResolver,
  userJobPreferencesPatchResolver,
  userJobPreferencesQueryResolver
} from './user-job-preferences.schema.js'
import { UserJobPreferencesService, getOptions } from './user-job-preferences.class.js'
import { userJobPreferencesPath, userJobPreferencesMethods } from './user-job-preferences.shared.js'
import { commonHook } from '../../hooks/commonHook.js'

export * from './user-job-preferences.class.js'
export * from './user-job-preferences.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const userJobPreferences = (app) => {
  // Register our service on the Feathers application
  app.use(userJobPreferencesPath, new UserJobPreferencesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: userJobPreferencesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(userJobPreferencesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(userJobPreferencesExternalResolver),
        schemaHooks.resolveResult(userJobPreferencesResolver)
      ]
    },
    before: {
      all: [
        commonHook,
        schemaHooks.validateQuery(userJobPreferencesQueryValidator),
        schemaHooks.resolveQuery(userJobPreferencesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(userJobPreferencesDataValidator),
        schemaHooks.resolveData(userJobPreferencesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(userJobPreferencesPatchValidator),
        schemaHooks.resolveData(userJobPreferencesPatchResolver)
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
