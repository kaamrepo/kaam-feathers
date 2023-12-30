// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import
{
  jobDataValidator,
  jobPatchValidator,
  jobQueryValidator,
  jobResolver,
  jobExternalResolver,
  jobDataResolver,
  jobPatchResolver,
  jobQueryResolver
} from './jobs.schema.js'
import { JobService, getOptions } from './jobs.class.js'
import
{ jobPath, jobMethods } from './jobs.shared.js'
import { commonHook } from '../../hooks/commonHook.js'
import { getNearByJobs } from './hooks/getNearByJobs.js'

export * from './jobs.class.js'
export * from './jobs.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const job = (app) =>
{
  app.use(jobPath, new JobService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: jobMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(jobPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(jobExternalResolver),
        schemaHooks.resolveResult(jobResolver)
      ]
    },
    before: {
      all: [
        commonHook,
        schemaHooks.validateQuery(jobQueryValidator),
        schemaHooks.resolveQuery(jobQueryResolver),

      ],
      find: [
        getNearByJobs,
      ],
      get: [],
      create: [schemaHooks.validateData(jobDataValidator), schemaHooks.resolveData(jobDataResolver)],
      patch: [schemaHooks.validateData(jobPatchValidator), schemaHooks.resolveData(jobPatchResolver)],
      remove: []
    },
    after: {
      all: [(context)=>{
        // console.log("aftere context", context.path);
      }]
    },
    error: {
      all: []
    }
  })
}
