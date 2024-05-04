// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { resolveQueryObjectId } from '@feathersjs/mongodb'
import { resolveObjectId } from '@feathersjs/mongodb'

// Main data model schema
export const userJobPreferencesSchema = {
  $id: 'UserJobPreferences',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'roleIds', 'userId'],
  properties: {
    _id: ObjectIdSchema(),
    roleIds: { type: 'array' },
    userId: ObjectIdSchema()
  }
}
export const userJobPreferencesValidator = getValidator(userJobPreferencesSchema, dataValidator)
export const userJobPreferencesResolver = resolve({})

export const userJobPreferencesExternalResolver = resolve({})

// Schema for creating new data
export const userJobPreferencesDataSchema = {
  $id: 'UserJobPreferencesData',
  type: 'object',
  additionalProperties: false,
  required: ['roleIds', 'userId'],
  properties: {
    ...userJobPreferencesSchema.properties
  }
}
export const userJobPreferencesDataValidator = getValidator(userJobPreferencesDataSchema, dataValidator)
export const userJobPreferencesDataResolver = resolve({
  roleIds: async (value) => {
    const ids = []
    for (const id of value) {
      ids.push(await resolveObjectId(id))
    }
    return ids
  }
})

// Schema for updating existing data
export const userJobPreferencesPatchSchema = {
  $id: 'UserJobPreferencesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userJobPreferencesSchema.properties
  }
}
export const userJobPreferencesPatchValidator = getValidator(userJobPreferencesPatchSchema, dataValidator)
export const userJobPreferencesPatchResolver = resolve({})

// Schema for allowed query properties
export const userJobPreferencesQuerySchema = {
  $id: 'UserJobPreferencesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userJobPreferencesSchema.properties)
  }
}
export const userJobPreferencesQueryValidator = getValidator(userJobPreferencesQuerySchema, queryValidator)
export const userJobPreferencesQueryResolver = resolve({
  properties: {
    userId: resolveQueryObjectId,
    roleId: resolveQueryObjectId
  }
})
