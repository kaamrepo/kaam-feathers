// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const incrementalRequestSchema = {
  $id: 'IncrementalRequest',
  type: 'object',
  additionalProperties: false,
  required: ['_id','userid'],
  properties: {
    _id: ObjectIdSchema(),
    userid: ObjectIdSchema(),
    requestedjobpostingcount:{type:'number'},
    prevjobpostingcount:{type:'number'},
    requestjobapplicationcount:{type:'number'},
    prevjobapplicationcount:{type:'number'},
  }
}
export const incrementalRequestValidator = getValidator(incrementalRequestSchema, dataValidator)
export const incrementalRequestResolver = resolve({})

export const incrementalRequestExternalResolver = resolve({})

// Schema for creating new data
export const incrementalRequestDataSchema = {
  $id: 'IncrementalRequestData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...incrementalRequestSchema.properties
  }
}
export const incrementalRequestDataValidator = getValidator(incrementalRequestDataSchema, dataValidator)
export const incrementalRequestDataResolver = resolve({})

// Schema for updating existing data
export const incrementalRequestPatchSchema = {
  $id: 'IncrementalRequestPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...incrementalRequestSchema.properties
  }
}
export const incrementalRequestPatchValidator = getValidator(incrementalRequestPatchSchema, dataValidator)
export const incrementalRequestPatchResolver = resolve({})

// Schema for allowed query properties
export const incrementalRequestQuerySchema = {
  $id: 'IncrementalRequestQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(incrementalRequestSchema.properties)
  }
}
export const incrementalRequestQueryValidator = getValidator(incrementalRequestQuerySchema, queryValidator)
export const incrementalRequestQueryResolver = resolve({})
