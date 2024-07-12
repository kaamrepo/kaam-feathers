// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { getQuerySchemaProperties } from '../../utils/query-schema-properties.js'

// Main data model schema
export const rolesSchema = {
  $id: 'Roles',
  type: 'object',
  additionalProperties: false,
  required: ['_id'],
  properties: {
    _id: ObjectIdSchema(),
    roleName: { type: 'string' },
    roleId: { type: 'string' },
    permissionIds: {
      type: 'array',
      items: { type: 'string' }
    },
    isActive: { type: 'boolean' },
    isDefault: { type: 'boolean' },
    createdBy: ObjectIdSchema(),
    updatedBy: ObjectIdSchema()
  }
}
export const rolesValidator = getValidator(rolesSchema, dataValidator)
export const rolesResolver = resolve({})

export const rolesExternalResolver = resolve({})

// Schema for creating new data
export const rolesDataSchema = {
  $id: 'RolesData',
  type: 'object',
  additionalProperties: false,
  required: ['roleName', 'roleId', 'permissionIds'],
  properties: {
    ...rolesSchema.properties
  }
}
export const rolesDataValidator = getValidator(rolesDataSchema, dataValidator)
export const rolesDataResolver = resolve({
  isActive: async () => true,
  createdBy: async (_, __, context) => context.params.user._id,
  updatedBy: async (_, __, context) => context.params.user._id
})

// Schema for updating existing data
export const rolesPatchSchema = {
  $id: 'RolesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...rolesSchema.properties
  }
}
export const rolesPatchValidator = getValidator(rolesPatchSchema, dataValidator)
export const rolesPatchResolver = resolve({
  updatedBy: async (_, __, context) => context.params.user._id
})

// Schema for allowed query properties
export const rolesQuerySchema = {
  $id: 'RolesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax({
      ...rolesSchema.properties,
      ...getQuerySchemaProperties(rolesSchema)
    })
  }
}
export const rolesQueryValidator = getValidator(rolesQuerySchema, queryValidator)
export const rolesQueryResolver = resolve({})
