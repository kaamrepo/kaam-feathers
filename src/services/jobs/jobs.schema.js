// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax, virtual } from '@feathersjs/schema'
import { resolveQueryObjectId } from '@feathersjs/mongodb'
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
      maxItems: 3,
      uniqueItems: true
    },
    employerid: ObjectIdSchema(),
    salary: { type: 'number' },
    salaryduration: { type: 'string', enum: ['year', 'month', 'week'] },
    location: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string', default: 'Point' },
        coordinates: { type: 'array', items: { type: 'number' } }
      },
      required: ['coordinates'],
      additionalProperties: false
    },


    styles: {
      type: "object",
      properties: {
        bgcolor: { type: "string", default: "white" },
        color: { type: "string", default: "black" }
      },
      required: ["bgcolor", "color"],
      additionalProperties: false,
    },

    createdat: { type: 'string', format: 'date-time' },
    updatedat: { type: 'string', format: 'date-time' },
  }
}
export const jobValidator = getValidator(jobSchema, dataValidator)
export const jobResolver = resolve({})

export const jobExternalResolver = resolve({
  employerDetails: virtual(async (job, context) =>
  {
    const $select = ["firstname", "lastname", "email", "_id"]
    return context.app.service(userPath).get(job.employerid, { query: { $select } })
  })
})

// Schema for creating new data
export const jobDataSchema = {
  $id: 'JobData',
  type: 'object',
  additionalProperties: false,
  required: ['position', 'description', 'requirements', 'about', 'tags', 'salary', 'salaryduration', 'location'],
  properties: {
    ...jobSchema.properties
  }
}
export const jobDataValidator = getValidator(jobDataSchema, dataValidator)
export const jobDataResolver = resolve({
  createdat: async (value, _data, context) => new Date(),
  employerid: async (value, _data, context) =>
  {
    const { user } = context.params;
    return user?._id;
  }
})

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
export const jobPatchResolver = resolve({
  updatedat: async (value, _data, context) => new Date(),
})

// Schema for allowed query properties
export const jobQuerySchema = {
  $id: 'JobQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(jobSchema.properties, {
      position: {
        $regex: { type: 'string' },
        $options: { type: 'string' },
      }
    })
  }
}
export const jobQueryValidator = getValidator(jobQuerySchema, queryValidator)
export const jobQueryResolver = resolve({
  // properties: {
  //   employerid: resolveQueryObjectId
  // }
})
