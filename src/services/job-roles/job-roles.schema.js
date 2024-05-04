// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const jobRolesSchema = {
  $id: 'JobRoles',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'role','isSelected'],
  properties: {
    _id: ObjectIdSchema(),
    role: { type: 'string' },
    isSelected:{type:'boolean'}
  }
}
export const jobRolesValidator = getValidator(jobRolesSchema, dataValidator)
export const jobRolesResolver = resolve({})

export const jobRolesExternalResolver = resolve({})

// Schema for creating new data
export const jobRolesDataSchema = {
  $id: 'JobRolesData',
  type: 'object',
  additionalProperties: false,
  required: ['role','isSelected'],
  properties: {
    ...jobRolesSchema.properties
  }
}
export const jobRolesDataValidator = getValidator(jobRolesDataSchema, dataValidator)
export const jobRolesDataResolver = resolve({})

// Schema for updating existing data
export const jobRolesPatchSchema = {
  $id: 'JobRolesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...jobRolesSchema.properties
  }
}
export const jobRolesPatchValidator = getValidator(jobRolesPatchSchema, dataValidator)
export const jobRolesPatchResolver = resolve({})

// Schema for allowed query properties
export const jobRolesQuerySchema = {
  $id: 'JobRolesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(jobRolesSchema.properties)
  }
}
export const jobRolesQueryValidator = getValidator(jobRolesQuerySchema, queryValidator)
export const jobRolesQueryResolver = resolve({})
