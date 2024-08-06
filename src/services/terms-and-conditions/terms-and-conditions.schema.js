// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const termsAndConditionsSchema = {
  $id: 'TermsAndConditions',
  type: 'object',
  additionalProperties: false,
  required: ['_id'],
  properties: {
    _id: ObjectIdSchema(),
    text: { type: 'string' },
    isActive: { type: 'boolean' },
    createdBy: ObjectIdSchema()
  }
}
export const termsAndConditionsValidator = getValidator(termsAndConditionsSchema, dataValidator)
export const termsAndConditionsResolver = resolve({})

export const termsAndConditionsExternalResolver = resolve({})

// Schema for creating new data
export const termsAndConditionsDataSchema = {
  $id: 'TermsAndConditionsData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...termsAndConditionsSchema.properties
  }
}
export const termsAndConditionsDataValidator = getValidator(termsAndConditionsDataSchema, dataValidator)
export const termsAndConditionsDataResolver = resolve({
  createdBy: async (value, data, context) => {
    const { user } = context.params
    return user._id
  },
  isActive: async () => true
})

// Schema for updating existing data
export const termsAndConditionsPatchSchema = {
  $id: 'TermsAndConditionsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...termsAndConditionsSchema.properties
  }
}
export const termsAndConditionsPatchValidator = getValidator(termsAndConditionsPatchSchema, dataValidator)
export const termsAndConditionsPatchResolver = resolve({})

// Schema for allowed query properties
export const termsAndConditionsQuerySchema = {
  $id: 'TermsAndConditionsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(termsAndConditionsSchema.properties)
  }
}
export const termsAndConditionsQueryValidator = getValidator(termsAndConditionsQuerySchema, queryValidator)
export const termsAndConditionsQueryResolver = resolve({})
