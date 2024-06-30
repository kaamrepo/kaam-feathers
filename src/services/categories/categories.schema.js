// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { userPath } from '../users/users.shared.js'

// Main data model schema
export const categoriesSchema = {
  $id: 'Categories',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'name', 'isActive', 'createdBy', 'createdAt'],
  properties: {
    _id: ObjectIdSchema(),
    name: { type: 'string' },
    isActive: { type: 'boolean', default: true },
    createdBy: ObjectIdSchema(),
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    bgurl: { type: 'string' }
  }
}
export const categoriesValidator = getValidator(categoriesSchema, dataValidator)
export const categoriesResolver = resolve({
  createdBy: async (value, category, context) => {
    // Fetch user details based on the _id stored in createdBy
    const $select = ['firstname', 'lastname', '_id', 'profilepic']
    // console.log("category",category);
    const user = await context.app.service(userPath).get(category?.createdBy, { query: { $select } })
    return user
  }
})

export const categoriesExternalResolver = resolve({})

// Schema for creating new data
export const categoriesDataSchema = {
  $id: 'CategoriesData',
  type: 'object',
  additionalProperties: false,
  required: ['name'],
  properties: {
    ...categoriesSchema.properties
  }
}
export const categoriesDataValidator = getValidator(categoriesDataSchema, dataValidator)
export const categoriesDataResolver = resolve({
  isActive: async () => true,
  createdBy: async (value, category, context) => context.params.user?._id,
  createdAt: async () => new Date().toISOString()
})

// Schema for updating existing data
export const categoriesPatchSchema = {
  $id: 'CategoriesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...categoriesSchema.properties
  }
}
export const categoriesPatchValidator = getValidator(categoriesPatchSchema, dataValidator)
export const categoriesPatchResolver = resolve({
  updatedAt: async () => new Date().toISOString()
})

// Schema for allowed query properties
export const categoriesQuerySchema = {
  $id: 'CategoriesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(categoriesSchema.properties)
  }
}
export const categoriesQueryValidator = getValidator(categoriesQuerySchema, queryValidator)
export const categoriesQueryResolver = resolve({})
