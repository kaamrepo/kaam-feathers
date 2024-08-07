// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  notificationTemplatesDataValidator,
  notificationTemplatesPatchValidator,
  notificationTemplatesQueryValidator,
  notificationTemplatesResolver,
  notificationTemplatesExternalResolver,
  notificationTemplatesDataResolver,
  notificationTemplatesPatchResolver,
  notificationTemplatesQueryResolver
} from './notification-templates.schema.js'
import { NotificationTemplatesService, getOptions } from './notification-templates.class.js'
import { notificationTemplatesPath, notificationTemplatesMethods } from './notification-templates.shared.js'
import { commonHook } from '../../hooks/commonHook.js'
import { authorizeApiRequest } from '../../hooks/check-authorization.js'

export * from './notification-templates.class.js'
export * from './notification-templates.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const notificationTemplates = (app) => {
  // Register our service on the Feathers application
  app.use(notificationTemplatesPath, new NotificationTemplatesService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: notificationTemplatesMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(notificationTemplatesPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        authorizeApiRequest,
        schemaHooks.resolveExternal(notificationTemplatesExternalResolver),
        schemaHooks.resolveResult(notificationTemplatesResolver)
      ]
    },
    before: {
      all: [
        commonHook(),
        schemaHooks.validateQuery(notificationTemplatesQueryValidator),
        schemaHooks.resolveQuery(notificationTemplatesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(notificationTemplatesDataValidator),
        schemaHooks.resolveData(notificationTemplatesDataResolver)
      ],
      patch: [
        schemaHooks.validateData(notificationTemplatesPatchValidator),
        schemaHooks.resolveData(notificationTemplatesPatchResolver)
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
