// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const userSchema = {
  $id: 'User',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'email'],
  properties: {
    _id: ObjectIdSchema(),
    phone: { type: 'string', minLength: 10, maxLength: 10 },
    dialcode: { type: 'string', minLength: 1 },
    firstname: { type: 'string', minLength: 1 },
    lastname: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    otp: { type: 'string', minLength: 1 },
    otpexpiresat: { type: 'string', format: 'date-time' },
    createdat: { type: 'string', format: 'date-time' },
    updatedat: { type: 'string', format: 'date-time' },
    isFirstLogin: { type: 'boolean', default: true },

    isactive: { type: 'boolean', default: true },

    aboutme: { type: 'string', minLength: 1, maxLength: 256 },
    dateofbirth: { type: 'string', format: 'date-time' },
    address: {
      type: 'object',
      properties: {
        addressline: { type: 'string' },
        pincode: { type: 'string' },
        district: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        country: { type: 'string' }
      },
      required: [],
      additionalProperties: false
    },

    firebasetokens: { type: 'array', items: { type: 'string' } },
    profilepic: { type: 'string' },

    googleid: { type: 'string' },
    facebookid: { type: 'string' },
    twitterid: { type: 'string' },
    githubid: { type: 'string' },
    auth0id: { type: 'string' }
  }
}
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // The password should never be visible externally
  otp: async () => undefined
})

// Schema for creating new data
export const userDataSchema = {
  $id: 'UserData',
  type: 'object',
  additionalProperties: false,
  required: ['phone', 'otp', 'dialcode', 'firstname', 'lastname', 'otpexpiresat'],
  properties: {
    ...userSchema.properties
  }
}
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({
  otp: passwordHash({ strategy: 'local' }),
  isactive: async () => true,
  createdat: async (value, _, context) => new Date(),
  updatedat: async (value, _, context) => new Date(),
  otpexpiresat: async (value, user, context) => {
    const expiryTime = Number(context.app.get('kaam_otp_validity_time')) ?? 4
    return value ? new Date(new Date(value).getTime() + expiryTime * 60000) : undefined
  }
})

// Schema for updating existing data
export const userPatchSchema = {
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userSchema.properties
  }
}
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve({
  otp: passwordHash({ strategy: 'local' }),
  updatedat: async (value, _, context) => new Date(),
  dateofbirth: async (value, _, context) => {
    if (value) return new Date(value)
  },
  isactive: async (value, _data, context) => {
    if (value === undefined) {
      return undefined
    }
  }
})

// Schema for login user route

export const loginPatchSchema = {
  $id: 'LoginPatch',
  type: 'object',
  additionalProperties: false,
  required: ['dialcode', 'phone', 'otp', 'otpexpiresat'],
  properties: {
    ...userSchema.properties
  }
}
export const loginPatchValidator = getValidator(loginPatchSchema, dataValidator)
export const loginPatchResolver = resolve({
  otp: passwordHash({ strategy: 'local' }),
  updatedat: async (value, _, context) => new Date(),
  otpexpiresat: async (value, user, context) => {
    const expiryTime = Number(context.app.get('kaam_otp_validity_time')) ?? 4
    return value ? new Date(new Date(value).getTime() + expiryTime * 60000) : undefined
  },
  isactive: async (value, _data, context) => {
    if (value === undefined) {
      return undefined
    }
  }
})

// Schema for allowed query properties
export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userSchema.properties)
  }
}
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  _id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user._id
    }

    return value
  }
})
