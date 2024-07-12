// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { getQuerySchemaProperties } from '../../utils/query-schema-properties.js'

// Main data model schema
export const permissionsSchema = {
  $id: 'Permissions',
  type: 'object',
  additionalProperties: false,
  required: ['_id'],
  properties: {
    _id: ObjectIdSchema(),
    isActive: { type: 'boolean' },
    isDefault: { type: 'boolean' },
    permissionName: { type: 'string' },
    permissionId: { type: 'string' },
    apiScopes: {
      type: 'array',
      items: { type: 'string' },
      default: []
    },
    feModules: {
      type: 'array',
      items: { type: 'string' },
      default: []
    }
  }
}
export const permissionsValidator = getValidator(permissionsSchema, dataValidator)
export const permissionsResolver = resolve({})

export const permissionsExternalResolver = resolve({})

// Schema for creating new data
export const permissionsDataSchema = {
  $id: 'PermissionsData',
  type: 'object',
  additionalProperties: false,
  required: ['permissionName', 'permissionId', 'apiScopes', 'feModules'],
  properties: {
    ...permissionsSchema.properties
  }
}
export const permissionsDataValidator = getValidator(permissionsDataSchema, dataValidator)
export const permissionsDataResolver = resolve({})

// Schema for updating existing data
export const permissionsPatchSchema = {
  $id: 'PermissionsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...permissionsSchema.properties
  }
}
export const permissionsPatchValidator = getValidator(permissionsPatchSchema, dataValidator)
export const permissionsPatchResolver = resolve({
  isActive: async () => true
})

// Schema for allowed query properties
export const permissionsQuerySchema = {
  $id: 'PermissionsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax({
      ...permissionsSchema.properties,
      ...getQuerySchemaProperties(permissionsSchema)
    })
  }
}
export const permissionsQueryValidator = getValidator(permissionsQuerySchema, queryValidator)
export const permissionsQueryResolver = resolve({})
