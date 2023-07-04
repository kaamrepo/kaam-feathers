// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { userPath } from '../users/users.shared.js'

// Main data model schema
export const jobsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    position: Type.String({ minLength: 1 }),
    description: Type.String({ minLength: 1 }),
    requirements: Type.String({ minLength: 1 }),
    about: Type.Optional(Type.String({ minLength: 1 })),
    review: Type.Optional(Type.String()),

    tags: Type.Array(Type.String({ minLength: 1 }), { minItems: 1, maxItems: 3, uniqueItems: true }),
    employerId: ObjectIdSchema(),
    salary: Type.Number(),
    location: Type.Object({
      type: Type.Optional(Type.String({ default: "Point" })),
      coordinates: Type.Array(Type.Number()),
    }),

  },
  { $id: 'Jobs', additionalProperties: false }
)
export const jobsValidator = getValidator(jobsSchema, dataValidator)
export const jobsResolver = resolve({})

export const jobsExternalResolver = resolve({
  employeerDetails: virtual(async (job, context) =>
  {
    const $select = ["firstname", "lastname", "email", "_id"]
    return context.app.service(userPath).get(job.employerId, { query: { $select } })
  })
})

// Schema for creating new entries
export const jobsDataSchema = Type.Pick(jobsSchema, [
  'position', 'description', 'requirements', 'about', 'tags', 'salary', 'location', 'employerId'], {
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
    Type.Object({

    }, { additionalProperties: true })
  ],
  { additionalProperties: true }
)
export const jobsQueryValidator = getValidator(jobsQuerySchema, queryValidator)
export const jobsQueryResolver = resolve({})
