// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  notificationsDataValidator,
  notificationsResolver,
  notificationsExternalResolver,
  notificationsDataResolver,
  notificationsQueryValidator,
  notificationsQueryResolver
} from './notifications.schema.js'
import { NotificationsService, getOptions } from './notifications.class.js'
import { notificationsPath, notificationsMethods } from './notifications.shared.js'
export * from './notifications.class.js'
export * from './notifications.schema.js'
import { MethodNotAllowed } from '@feathersjs/errors'

// A configure function that registers the service and its hooks via `app.configure`
export const notifications = (app) => {
  // Register our service on the Feathers application
  app.use(notificationsPath, new NotificationsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: notificationsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(notificationsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(notificationsExternalResolver),
        schemaHooks.resolveResult(notificationsResolver)
      ]
    },
    before: {
      all: [
        (hook) => {
          if (hook.method !== 'create') {
            throw new MethodNotAllowed()
          }
        },
        schemaHooks.validateQuery(notificationsQueryValidator),
        schemaHooks.resolveQuery(notificationsQueryResolver)
      ],
      create: [
        schemaHooks.validateData(notificationsDataValidator),
        schemaHooks.resolveData(notificationsDataResolver)
      ]
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
