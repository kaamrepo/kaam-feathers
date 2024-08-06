// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax,ObjectIdSchema,virtual } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { userPath } from '../users/users.shared.js'
// Main data model schema
export const approvalSchema = {
  $id: 'Approval',
  type: 'object',
  additionalProperties: false,
  required: ['requestor','status','requesttype'],
  properties: {
    _id: ObjectIdSchema(),
    requestor:ObjectIdSchema(),
    requesttype:{ type: 'string', enum: ['jobposting', 'jobapplication'] },
    createdat: { type: 'string', format: 'date-time' },
    updatedat: { type: 'string', format: 'date-time' },
    status: { type: 'string', enum: ['raised', 'approved'],default:'raised'},
    approvedby:ObjectIdSchema(),
    requestedjobapplication:{type:'number'},
    requestedjobposting:{type:'number'},
    isactive: { type: 'boolean',default:true },
    comment:{type:'string'},
    skip:{type:'number'},
    limit:{type:'number'},
    
  }
}
export const approvalValidator = getValidator(approvalSchema, dataValidator)
export const approvalResolver = resolve({})

export const approvalExternalResolver = resolve({
  userDetails: virtual(async (data, context) => {
    const $select = ['firstname', 'lastname', 'phone','allowedjobapplication','allowedjobposting']
    return await context.app.service(userPath).get(data.requestor, { query: { $select } })
  }),
})

// Schema for creating new data
export const approvalDataSchema = {
  $id: 'ApprovalData',
  type: 'object',
  additionalProperties: false,
  required: ['requestor','status','requesttype','createdat'],
  properties: {
    ...approvalSchema.properties
  }
}
export const approvalDataValidator = getValidator(approvalDataSchema, dataValidator)
export const approvalDataResolver = resolve({})

// Schema for updating existing data
export const approvalPatchSchema = {
  $id: 'ApprovalPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...approvalSchema.properties
  }
}
export const approvalPatchValidator = getValidator(approvalPatchSchema, dataValidator)
export const approvalPatchResolver = resolve({})

// Schema for allowed query properties
export const approvalQuerySchema = {
  $id: 'ApprovalQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(approvalSchema.properties)
  }
}
export const approvalQueryValidator = getValidator(approvalQuerySchema, queryValidator)
export const approvalQueryResolver = resolve({})
