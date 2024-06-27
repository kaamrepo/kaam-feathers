// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const notificationsSchema = {
  $id: 'Notifications',
  type: 'object',
  additionalProperties: false,
  required: ['templateName', 'payload'],
  properties: {
    templateName: { type: 'string' },
    payload: {
      type: 'object',
      properties: {
        PUSH: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              recipient: { type: 'array', items: { type: 'string' } },
              variables: { type: 'object', additionalProperties: true }
            },
            required: ['recipient']
          }
        },
        SMS: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              recipient: { type: 'string' },
              variables: { type: 'object', additionalProperties: true }
            },
            required: ['recipient']
          }
        },
        EMAIL: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              recipient: { type: 'string' },
              variables: { type: 'object', additionalProperties: true }
            },
            required: ['recipient']
          }
        }
      }
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
  required: ['templateName', 'payload'],
  properties: {
    ...notificationsSchema.properties
  }
}
export const notificationsDataValidator = getValidator(notificationsDataSchema, dataValidator)
export const notificationsDataResolver = resolve({})

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
