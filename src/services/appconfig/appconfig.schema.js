// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const appconfigSchema = {
  $id: 'Appconfig',
  type: 'object',
  additionalProperties: false,
  required: ['_id'],
  properties: {
    _id: ObjectIdSchema(),
    allowedjobapplicaiton:{type:'number', default: 1},
    allowedjobposting:{type:'number', default: 1},
    superadminotp: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^[0-9]{10}$'  // Adjust the regex pattern based on your phone number format
      }
    }
  }
}
export const appconfigValidator = getValidator(appconfigSchema, dataValidator)
export const appconfigResolver = resolve({})

export const appconfigExternalResolver = resolve({})

// Schema for creating new data
export const appconfigDataSchema = {
  $id: 'AppconfigData',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...appconfigSchema.properties
  }
}
export const appconfigDataValidator = getValidator(appconfigDataSchema, dataValidator)
export const appconfigDataResolver = resolve({})

// Schema for updating existing data
export const appconfigPatchSchema = {
  $id: 'AppconfigPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...appconfigSchema.properties
  }
}
export const appconfigPatchValidator = getValidator(appconfigPatchSchema, dataValidator)
export const appconfigPatchResolver = resolve({})

// Schema for allowed query properties
export const appconfigQuerySchema = {
  $id: 'AppconfigQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(appconfigSchema.properties)
  }
}
export const appconfigQueryValidator = getValidator(appconfigQuerySchema, queryValidator)
export const appconfigQueryResolver = resolve({})
