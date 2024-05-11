// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const notificationsSchema = {
  $id: 'Notifications',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'type'],
  properties: {
    id: { type: 'number' },
    type: { type: 'string', enum: ['FCM', 'EMAIL', 'SMS'] },
    recepient: { type: 'array', items: { type: 'string' } },
    notification: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        body: { type: 'string' }
      }
    },
    data: {
      type: 'object',
      additionalProperties: true
    }
  }
}
export const notificationsValidator = getValidator(notificationsSchema, dataValidator)
export const notificationsResolver = resolve({})

export const notificationsExternalResolver = resolve({})

// Schema for creating new data
export const notificationsDataSchema = {
  $id: 'NotificationsData',
  type: 'object',
  additionalProperties: false,
  required: ['type'],
  properties: {
    ...notificationsSchema.properties
  }
}
export const notificationsDataValidator = getValidator(notificationsDataSchema, dataValidator)
export const notificationsDataResolver = resolve({})

// Schema for updating existing data
export const notificationsPatchSchema = {
  $id: 'NotificationsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...notificationsSchema.properties
  }
}
export const notificationsPatchValidator = getValidator(notificationsPatchSchema, dataValidator)
export const notificationsPatchResolver = resolve({})

// Schema for allowed query properties
export const notificationsQuerySchema = {
  $id: 'NotificationsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(notificationsSchema.properties)
  }
}
export const notificationsQueryValidator = getValidator(notificationsQuerySchema, queryValidator)
export const notificationsQueryResolver = resolve({})
