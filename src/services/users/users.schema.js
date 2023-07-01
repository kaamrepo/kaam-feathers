// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../validators.js'
import { getDateWithStartTime } from '../../utils/date.js'

// Main data model schema
export const userSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    phone: Type.String({ minLength: 10, maxLength: 10 }),
    dialcode: Type.String({ minLength: 1 }),
    firstname: Type.String({ minLength: 1 }),
    lastname: Type.String({ minLength: 1 }),
    email: Type.Optional(Type.String({ format: 'email' })),
    otp: Type.String({ minLength: 1 }),
    otpexpiresat: Type.String({ format: 'date-time' }),
    createdat: Type.String({ format: 'date-time' }),
    updatedat: Type.String({ format: 'date-time' }),

    aboutme: Type.Optional(Type.String({ minLength: 1, maxLength: 256 })),
    dateofbirth: Type.String({ format: 'date-time' }),
    address: Type.Object({
      addressline: Type.Optional(Type.String()),
      pincode: Type.String(),
      district: Type.Optional(Type.String()),
      city: Type.Optional(Type.String()),
      state: Type.Optional(Type.String()),
      country: Type.Optional(Type.String())
    }),

    aadharno: Type.Optional(Type.String()),
    panno: Type.Optional(Type.String()),

    googleId: Type.Optional(Type.String()),
    facebookId: Type.Optional(Type.String()),
    twitterId: Type.Optional(Type.String()),
    githubId: Type.Optional(Type.String()),
    auth0Id: Type.Optional(Type.String()),
    profilePic: Type.Optional(Type.String()),
    isactive: Type.Boolean({ default: true })
  },
  { $id: 'User', additionalProperties: false }
)
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // The otp should never be visible externally
  otp: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(
  userSchema,
  ['phone', 'otp', 'dialcode', 'email', 'firstname', 'lastname', 'otpexpiresat'],
  {
    $id: 'UserData'
  }
)
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

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve({
  otp: passwordHash({ strategy: 'local' }),
  updatedat: async (value, _, context) => new Date()
})

// Schema for login user route

export const loginPatchSchema = Type.Pick(userSchema, ['dialcode', 'phone', 'otp', 'otpexpiresat'], {
  $id: 'LoginPatch'
})
export const loginPatchValidator = getValidator(loginPatchSchema, dataValidator)
export const loginPatchResolver = resolve({
  otp: passwordHash({ strategy: 'local' }),
  updatedat: async (value, _, context) => new Date(),
  otpexpiresat: async (value, user, context) => {
    const expiryTime = Number(context.app.get('kaam_otp_validity_time')) ?? 4
    return value ? new Date(new Date(value).getTime() + expiryTime * 60000) : undefined
  }
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['_id', 'email', 'phone', 'firstname', 'lastname'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
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
