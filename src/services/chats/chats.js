// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  chatDataValidator,
  chatPatchValidator,
  chatQueryValidator,
  chatResolver,
  chatExternalResolver,
  chatDataResolver,
  chatPatchResolver,
  chatQueryResolver
} from './chats.schema.js'
import { ChatService, getOptions } from './chats.class.js'
import { chatPath, chatMethods } from './chats.shared.js'
import { updateChatIdInJobApplication } from './hooks/updateChatIdInJobApplication.js'
import { pushChatMessage } from './hooks/pushChatMessage.js'
import { sendChatNotification } from './hooks/sendChatNotification.js'

export * from './chats.class.js'
export * from './chats.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const chat = (app) => {
  // Register our service on the Feathers application
  app.use(chatPath, new ChatService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: chatMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(chatPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(chatExternalResolver),
        schemaHooks.resolveResult(chatResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(chatQueryValidator), schemaHooks.resolveQuery(chatQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(chatDataValidator), schemaHooks.resolveData(chatDataResolver)],
      patch: [
        schemaHooks.validateData(chatPatchValidator),
        pushChatMessage,
        schemaHooks.resolveData(chatPatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      create: [updateChatIdInJobApplication],
      patch: [sendChatNotification]
    },
    error: {
      all: []
    }
  })
}
