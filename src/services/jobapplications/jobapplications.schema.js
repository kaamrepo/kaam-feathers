// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax, queryProperty, ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { userPath } from '../users/users.shared.js'
import { jobPath } from '../jobs/jobs.shared.js'
import { resolveQueryObjectId } from '@feathersjs/mongodb'

// Main data model schema
export const jobapplicationSchema = {
  $id: 'Jobapplication',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'appliedby', 'createdat', 'updatedat', 'status', 'employerid'],
  properties: {
    _id: ObjectIdSchema(),
    jobid: ObjectIdSchema(),
    appliedby: ObjectIdSchema(),
    createdat: { type: 'string', format: 'date-time' },
    updatedat: { type: 'string', format: 'date-time' },
    status: { type: 'string', enum: ['Applied', 'Approved', 'Rejected'] },
    updatedby: ObjectIdSchema(),
    employerid: ObjectIdSchema(),
    chatid: ObjectIdSchema()
  }
}
export const jobapplicationValidator = getValidator(jobapplicationSchema, dataValidator)
export const jobapplicationResolver = resolve({
  applicantDetails: async (value, data, context) => {
    const user = await context.app.service(userPath).get(data?.appliedby)
    return user
  },
  jobDetails: async (value, data, context) => {
    const user = await context.app.service(jobPath)._get(data?.jobid)
    return user
  }
})

export const jobapplicationExternalResolver = resolve({})

// Schema for creating new data
export const jobapplicationDataSchema = {
  $id: 'JobapplicationData',
  type: 'object',
  additionalProperties: false,
  required: ['jobid', 'employerid'],
  properties: {
    ...jobapplicationSchema.properties
  }
}
export const jobapplicationDataValidator = getValidator(jobapplicationDataSchema, dataValidator)
export const jobapplicationDataResolver = resolve({
  createdat: async () => new Date(),
  status: async () => 'Applied',
  appliedby: async (_value, _data, _context) => _context?.params?.user?._id
})

// Schema for updating existing data
export const jobapplicationPatchSchema = {
  $id: 'JobapplicationPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...jobapplicationSchema.properties
  }
}
export const jobapplicationPatchValidator = getValidator(jobapplicationPatchSchema, dataValidator)
export const jobapplicationPatchResolver = resolve({
  updatedat: async () => new Date(),
  updatedby: async (_value, _data, _context) => _context?.params?.user?._id
})

// Schema for allowed query properties
export const jobapplicationQuerySchema = {
  $id: 'JobapplicationQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(jobapplicationSchema.properties),
    appliedby: queryProperty({ anyOf: [{ type: 'string' }, { type: 'object' }] })
  }
}
export const jobapplicationQueryValidator = getValidator(jobapplicationQuerySchema, queryValidator)
export const jobapplicationQueryResolver = resolve({
  appliedby: resolveQueryObjectId
})
