// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  jobRolesDataValidator,
  jobRolesPatchValidator,
  jobRolesQueryValidator,
  jobRolesResolver,
  jobRolesExternalResolver,
  jobRolesDataResolver,
  jobRolesPatchResolver,
  jobRolesQueryResolver
} from './job-roles.schema.js'
import { JobRolesService, getOptions } from './job-roles.class.js'
import { jobRolesPath, jobRolesMethods } from './job-roles.shared.js'
import { commonHook } from '../../hooks/commonHook.js'

export * from './job-roles.class.js'
export * from './job-roles.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const jobRoles = (app) => {
  // Register our service on the Feathers application
  app.use(jobRolesPath, new JobRolesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: jobRolesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(jobRolesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(jobRolesExternalResolver),
        schemaHooks.resolveResult(jobRolesResolver)
      ]
    },
    before: {
      all: [
        commonHook,
        schemaHooks.validateQuery(jobRolesQueryValidator),
        schemaHooks.resolveQuery(jobRolesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(jobRolesDataValidator),
        schemaHooks.resolveData(jobRolesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(jobRolesPatchValidator),
        schemaHooks.resolveData(jobRolesPatchResolver)
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
