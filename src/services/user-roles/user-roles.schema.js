// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { getQuerySchemaProperties } from '../../utils/query-schema-properties.js'

// Main data model schema
export const userRolesSchema = {
  $id: 'UserRoles',
  type: 'object',
  additionalProperties: false,
  required: ['_id'],
  properties: {
    _id: ObjectIdSchema(),
    userId: ObjectIdSchema(),
    roleId: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    isActive: { type: 'boolean' },
    createdBy: ObjectIdSchema(),
    updatedBy: ObjectIdSchema()
  }
}
export const userRolesValidator = getValidator(userRolesSchema, dataValidator)
export const userRolesResolver = resolve({})

export const userRolesExternalResolver = resolve({})

// Schema for creating new data
export const userRolesDataSchema = {
  $id: 'UserRolesData',
  type: 'object',
  additionalProperties: false,
  required: ['userId', 'roleId'],
  properties: {
    ...userRolesSchema.properties
  }
}
export const userRolesDataValidator = getValidator(userRolesDataSchema, dataValidator)
export const userRolesDataResolver = resolve({
  createdAt: async () => new Date(),
  updatedAt: async () => new Date(),
  isActive: async () => true,
  createdBy: async (_, __, context) => context.params.user._id,
  updatedBy: async (_, __, context) => context.params.user._id
})

// Schema for updating existing data
export const userRolesPatchSchema = {
  $id: 'UserRolesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userRolesSchema.properties
  }
}
export const userRolesPatchValidator = getValidator(userRolesPatchSchema, dataValidator)
export const userRolesPatchResolver = resolve({
  updatedAt: async () => new Date(),
  updatedBy: async (_, __, context) => context.params.user._id
})

// Schema for allowed query properties
export const userRolesQuerySchema = {
  $id: 'UserRolesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax({ ...userRolesSchema.properties, ...getQuerySchemaProperties(userRolesSchema) })
  }
}
export const userRolesQueryValidator = getValidator(userRolesQuerySchema, queryValidator)
export const userRolesQueryResolver = resolve({})
