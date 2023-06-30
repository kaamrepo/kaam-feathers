// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const jobsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    position: Type.String(),
    description: Type.String(),
    requirements: Type.String(),
    about: Type.Optional(Type.String()),
    review: Type.Optional(Type.String()),

    tags: Type.Array(Type.String()),
    employerId: ObjectIdSchema(),
    salary: Type.String(),
    location: Type.Object({
      type: Type.Optional(Type.String()),
      coordinates: Type.Array(Type.Number()),
    }),

  },
  { $id: 'Jobs', additionalProperties: false }
)
export const jobsValidator = getValidator(jobsSchema, dataValidator)
export const jobsResolver = resolve({})

export const jobsExternalResolver = resolve({})

// Schema for creating new entries
export const jobsDataSchema = Type.Pick(jobsSchema, ['position'], {
  $id: 'JobsData'
})
export const jobsDataValidator = getValidator(jobsDataSchema, dataValidator)
export const jobsDataResolver = resolve({})

// Schema for updating existing entries
export const jobsPatchSchema = Type.Partial(jobsSchema, {
  $id: 'JobsPatch'
})
export const jobsPatchValidator = getValidator(jobsPatchSchema, dataValidator)
export const jobsPatchResolver = resolve({})

// Schema for allowed query properties
export const jobsQueryProperties = Type.Pick(jobsSchema, ['_id', 'position'])
export const jobsQuerySchema = Type.Intersect(
  [
    querySyntax(jobsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const jobsQueryValidator = getValidator(jobsQuerySchema, queryValidator)
export const jobsQueryResolver = resolve({})
