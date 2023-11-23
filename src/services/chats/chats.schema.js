// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const chatSchema = {
  $id: 'Chat',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'text'],
  properties: {
    _id: ObjectIdSchema(),
    applicationid: ObjectIdSchema(),
    messages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: ObjectIdSchema(),
          senderid: ObjectIdSchema(),
          type: { type: 'string', enum: ['initial', 'text'] },
          text: { type: 'string' },
          createdat: { type: 'string', format: 'date-time' },
          isseen: { type: 'boolean' }
        }
      }
    },
    createdat: { type: 'string', format: 'date-time' },
    updatedat: { type: 'string', format: 'date-time' },
    isactive: { type: 'boolean' }
  }
}
export const chatValidator = getValidator(chatSchema, dataValidator)
export const chatResolver = resolve({})

export const chatExternalResolver = resolve({})

// Schema for creating new data
export const chatDataSchema = {
  $id: 'ChatData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...chatSchema.properties
  }
}
export const chatDataValidator = getValidator(chatDataSchema, dataValidator)
export const chatDataResolver = resolve({
  createdat: async () => new Date(),
  isactive: async () => true
})

// Schema for updating existing data
export const chatPatchSchema = {
  $id: 'ChatPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...chatSchema.properties
  }
}
export const chatPatchValidator = getValidator(chatPatchSchema, dataValidator)
export const chatPatchResolver = resolve({
  updatedat: async () => new Date()
})

// Schema for allowed query properties
export const chatQuerySchema = {
  $id: 'ChatQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(chatSchema.properties)
  }
}
export const chatQueryValidator = getValidator(chatQuerySchema, queryValidator)
export const chatQueryResolver = resolve({})
