// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const dummySchema = {
  $id: 'Dummy',
  type: 'object',
  additionalProperties: false,
  required: ['_id'],
  properties: {
    _id: ObjectIdSchema(),
    messages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: ObjectIdSchema(),
          senderid: ObjectIdSchema(),
          type: { type: 'string' },
          text: { type: 'string' },
          createdat: { type: 'string' },
          isseen: { type: 'boolean' }
        }
      }
    }
  }
}
export const dummyValidator = getValidator(dummySchema, dataValidator)
export const dummyResolver = resolve({})

export const dummyExternalResolver = resolve({})

// Schema for creating new data
export const dummyDataSchema = {
  $id: 'DummyData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...dummySchema.properties
  }
}
export const dummyDataValidator = getValidator(dummyDataSchema, dataValidator)
export const dummyDataResolver = resolve({})

// Schema for updating existing data
export const dummyPatchSchema = {
  $id: 'DummyPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...dummySchema.properties,
    chat_message: {
      type: 'object',
      properties: {
        _id: ObjectIdSchema(),
        senderid: ObjectIdSchema(),
        type: { type: 'string' },
        text: { type: 'string' },
        createdat: { type: 'string' },
        isseen: { type: 'boolean' }
      },
      additionalProperties: false
    }
  }
}
export const dummyPatchValidator = getValidator(dummyPatchSchema, dataValidator)
export const dummyPatchResolver = resolve({})

// Schema for allowed query properties
export const dummyQuerySchema = {
  $id: 'DummyQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(dummySchema.properties)
  }
}
export const dummyQueryValidator = getValidator(dummyQuerySchema, queryValidator)
export const dummyQueryResolver = resolve({})
