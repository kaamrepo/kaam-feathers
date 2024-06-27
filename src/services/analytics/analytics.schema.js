// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const analyticsSchema = {
  $id: 'Analytics',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'text'],
  properties: {
    id: { type: 'number' },
    text: { type: 'string' }
  }
}
export const analyticsValidator = getValidator(analyticsSchema, dataValidator)
export const analyticsResolver = resolve({})

export const analyticsExternalResolver = resolve({})

// Schema for creating new data
export const analyticsDataSchema = {
  $id: 'AnalyticsData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...analyticsSchema.properties
  }
}
export const analyticsDataValidator = getValidator(analyticsDataSchema, dataValidator)
export const analyticsDataResolver = resolve({})

// Schema for updating existing data
export const analyticsPatchSchema = {
  $id: 'AnalyticsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...analyticsSchema.properties
  }
}
export const analyticsPatchValidator = getValidator(analyticsPatchSchema, dataValidator)
export const analyticsPatchResolver = resolve({})

// Schema for allowed query properties
export const analyticsQuerySchema = {
  $id: 'AnalyticsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(analyticsSchema.properties)
  }
}
export const analyticsQueryValidator = getValidator(analyticsQuerySchema, queryValidator)
export const analyticsQueryResolver = resolve({})
