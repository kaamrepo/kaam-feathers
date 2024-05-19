// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  jobapplicationDataValidator,
  jobapplicationPatchValidator,
  jobapplicationQueryValidator,
  jobapplicationResolver,
  jobapplicationExternalResolver,
  jobapplicationDataResolver,
  jobapplicationPatchResolver,
  jobapplicationQueryResolver
} from './jobapplications.schema.js'
import { JobapplicationService, getOptions } from './jobapplications.class.js'
import { jobapplicationPath, jobapplicationMethods } from './jobapplications.shared.js'
import { createChatForAppliedJob } from './hooks/createChatForAppliedJob.js'
import { commonHook } from '../../hooks/commonHook.js'
import { sendPushNotificationToEmployer } from './hooks/sendPushNotificationToEmployer.js'
import { changeJobApplicationStatus } from './hooks/changeJobApplicationStatus.js'
export * from './jobapplications.class.js'
export * from './jobapplications.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const jobapplication = (app) => {
  // Register our service on the Feathers application
  app.use(jobapplicationPath, new JobapplicationService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: jobapplicationMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(jobapplicationPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(jobapplicationExternalResolver),
        schemaHooks.resolveResult(jobapplicationResolver)
      ]
    },
    before: {
      all: [
        commonHook,
        schemaHooks.validateQuery(jobapplicationQueryValidator),
        schemaHooks.resolveQuery(jobapplicationQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(jobapplicationDataValidator),
        schemaHooks.resolveData(jobapplicationDataResolver)
      ],
      patch: [
        changeJobApplicationStatus,
        schemaHooks.validateData(jobapplicationPatchValidator),
        schemaHooks.resolveData(jobapplicationPatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      create: [createChatForAppliedJob, sendPushNotificationToEmployer]
    },
    error: {
      all: []
    }
  })
}
