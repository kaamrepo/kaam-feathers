// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const notificationTemplatesSchema = {
  $id: 'NotificationTemplates',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'name'],
  properties: {
    _id: ObjectIdSchema(),
    name: { type: 'string' },
    createdAt: {
      type: 'string',
      format: 'date-time'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time'
    },

    channelType: {
      type: 'object',
      properties: {
        SMS: { type: 'string' },
        EMAIL: { type: 'string' },
        PUSH: { type: 'string' }
      },
      additionalProperties: false
    },

    channels: {
      type: 'object',
      properties: {
        SMS: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            variables: {
              type: 'array',
              items: {
                type: 'string'
              },
              nullable: true
            },
            isActive: { type: 'boolean', default: true }
          },
          required: ['content'],
          additionalProperties: false
        },
        PUSH: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                subTitle: { type: 'string' }
              },
              additionalProperties: false
            },
            variables: {
              type: 'array',
              items: {
                type: 'string'
              },
              nullable: true
            },
            isActive: { type: 'boolean', default: true }
          },
          required: ['content'],
          additionalProperties: false
        },
        EMAIL: {
          type: 'object',
          properties: {
            content: {
              type: 'object',
              properties: {
                subject: { type: 'string' },
                body: { type: 'string' },
                templateName: { type: 'string' }
              },
              required: ['subject', 'templateName'],
              additionalProperties: false
            },
            variables: {
              type: 'array',
              items: {
                type: 'string'
              },
              nullable: true
            },
            isActive: { type: 'boolean', default: true }
          },
          required: ['content']
        }
      },
      additionalProperties: false
    },
    isActive: {
      type: 'boolean',
      default: true
    }
  },
  additionalProperties: false
}

export const notificationTemplatesValidator = getValidator(notificationTemplatesSchema, dataValidator)
export const notificationTemplatesResolver = resolve({})

export const notificationTemplatesExternalResolver = resolve({})

// Schema for creating new data
export const notificationTemplatesDataSchema = {
  $id: 'NotificationTemplatesData',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'channelType', 'channels', 'service'],
  properties: {
    ...notificationTemplatesSchema.properties
  }
}
export const notificationTemplatesDataValidator = getValidator(notificationTemplatesDataSchema, dataValidator)
export const notificationTemplatesDataResolver = resolve({
  createdAt: async () => new Date(),
  updatedAt: async () => new Date()
})

// Schema for updating existing data
export const notificationTemplatesPatchSchema = {
  $id: 'NotificationTemplatesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...notificationTemplatesSchema.properties
  }
}
export const notificationTemplatesPatchValidator = getValidator(
  notificationTemplatesPatchSchema,
  dataValidator
)
export const notificationTemplatesPatchResolver = resolve({
  updatedAt: async () => new Date()
})

// Schema for allowed query properties
export const notificationTemplatesQuerySchema = {
  $id: 'NotificationTemplatesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(notificationTemplatesSchema.properties)
  }
}
export const notificationTemplatesQueryValidator = getValidator(
  notificationTemplatesQuerySchema,
  queryValidator
)
export const notificationTemplatesQueryResolver = resolve({})
