// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const analyticsSchema = {
  $id: 'Analytics',
  type: 'object',
  additionalProperties: true,

  properties: {
  }
}
export const analyticsValidator = getValidator(analyticsSchema, dataValidator)
export const analyticsResolver = resolve({})

export const analyticsExternalResolver = resolve({})




// Schema for allowed query properties
export const analyticsQuerySchema = {
  $id: 'AnalyticsQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(analyticsSchema.properties)
  }
}
export const analyticsQueryValidator = getValidator(analyticsQuerySchema, queryValidator)
export const analyticsQueryResolver = resolve({})
