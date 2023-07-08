// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax, virtual } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { userPath } from '../users/users.shared.js'

// Main data model schema
export const jobSchema = {
  $id: 'Job',
  type: 'object',
  additionalProperties: false,
  required: ['_id',],
  properties: {
    _id: ObjectIdSchema(),
    position: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    requirements: { type: 'string', minLength: 1 },
    about: { type: 'string', minLength: 1 },
    review: { type: 'string', minLength: 1 },

    tags: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 1,
      maxItems: 1,
      uniqueItems: true
    },
    employerId: ObjectIdSchema(),
    salary: { type: 'number' },
    location: {
      type: 'object',
      properties: {
        type: { type: 'string', default: 'Point' },
        coordinates: { type: 'array', items: { type: 'number' } }
      },
      required: ['coordinates'],
      additionalProperties: false
    }
  }
}
export const jobValidator = getValidator(jobSchema, dataValidator)
export const jobResolver = resolve({})

export const jobExternalResolver = resolve({
  employeerDetails: virtual(async (job, context) =>
  {
    const $select = ["firstname", "lastname", "email", "_id"]
    return context.app.service(userPath).get(job.employerId, { query: { $select } })
  })
})

// Schema for creating new data
export const jobDataSchema = {
  $id: 'JobData',
  type: 'object',
  additionalProperties: false,
  required: ['position', 'description', 'requirements', 'about', 'tags', 'salary', 'location', 'employerId'],
  properties: {
    ...jobSchema.properties
  }
}
export const jobDataValidator = getValidator(jobDataSchema, dataValidator)
export const jobDataResolver = resolve({})

// Schema for updating existing data
export const jobPatchSchema = {
  $id: 'JobPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...jobSchema.properties
  }
}
export const jobPatchValidator = getValidator(jobPatchSchema, dataValidator)
export const jobPatchResolver = resolve({})

// Schema for allowed query properties
export const jobQuerySchema = {
  $id: 'JobQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(jobSchema.properties)
  }
}
export const jobQueryValidator = getValidator(jobQuerySchema, queryValidator)
export const jobQueryResolver = resolve({})
