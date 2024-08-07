// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema, virtual } from '@feathersjs/schema'
import { passwordHash } from '@feathersjs/authentication-local'
import { dataValidator, queryValidator } from '../../validators.js'
import { resolveObjectId } from '@feathersjs/mongodb'
import { categoriesPath } from '../categories/categories.shared.js'

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
    password: { type: 'string' },
    otpexpiresat: { type: 'string', format: 'date-time' },
    createdat: { type: 'string', format: 'date-time' },
    updatedat: { type: 'string', format: 'date-time' },

    isactive: { type: 'boolean' },
    isTermsAndConditionsChecked: { type: 'boolean' },
    termsAndConditionsId: ObjectIdSchema(),

    aboutme: { type: 'string', minLength: 0, maxLength: 256 },
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
    location: {
      type: 'object',
      properties: {
        type: { type: 'string', default: 'Point' },
        coordinates: { type: 'array', items: { type: 'number' || null } },
        fulladdress: { type: 'string' },
        pincode: { type: 'string' },
        district: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        country: { type: 'string' }
      },
      additionalProperties: false
    },
    firebasetokens: { type: 'array', items: { type: 'string' } },
    profilepic: { type: 'string' },
    googleid: { type: 'string' },
    facebookid: { type: 'string' },
    twitterid: { type: 'string' },
    githubid: { type: 'string' },
    auth0id: { type: 'string' },
    activeforjobs: { type: 'boolean' },
    allowedjobposting: { type: 'number' },
    allowedjobapplication: { type: 'number' },
    tags: {
      type: 'array',
      items: ObjectIdSchema(),
      minItems: 1,
      uniqueItems: true
    },
    experience: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          about: { type: 'string' },
          employer: { type: 'string' },
          year: { type: 'string' }
        },
        required: ['about', 'year'],
        additionalProperties: false
      }
    }
  }
}
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({
  // The password should never be visible externally
  otp: async () => undefined,
  password: async () => undefined,

  tagsDetails: virtual(async (user, context) => {
    const $select = ['isActive', 'name', '_id']
    const tags = user.tags || []
    const categoryPromises = tags.map(async (tagId) => {
      try {
        const category = await context.app.service(categoriesPath)._get(tagId, { query: { $select } })
        return category
      } catch (error) {
        console.error(`Failed to fetch category for tagId: ${tagId}`, error)
        return null
      }
    })
    const categories = await Promise.all(categoryPromises)
    const activeCategories = categories.filter((category) => category && category.isActive)
    return activeCategories
  }),
  experience: async (_value, _data, context) => {
    return _value?.sort((a, b) => {
      const yearA = a.year.split('-')[0] // Extract the starting year
      const yearB = b.year.split('-')[0] // Extract the starting year
      return yearA - yearB
    })
  }
})

// Schema for creating new data
export const userDataSchema = {
  $id: 'UserData',
  type: 'object',
  additionalProperties: false,
  required: [
    'phone',
    'otp',
    'dialcode',
    'firstname',
    'lastname',
    'otpexpiresat',
    'isTermsAndConditionsChecked',
    'termsAndConditionsId'
  ],
  properties: {
    ...userSchema.properties
  }
}

export const userDataValidator = getValidator(userDataSchema, dataValidator)

export const userDataResolver = resolve({
  otp: passwordHash({ strategy: 'local' }),
  password: passwordHash({ strategy: 'local' }),
  isactive: async () => true,
  createdat: async (value, _, context) => new Date(),
  updatedat: async (value, _, context) => new Date(),
  otpexpiresat: async (value, user, context) => {
    const expiryTime = Number(context.app.get('kaam_otp_validity_time')) ?? 4
    return value ? new Date(new Date(value).getTime() + expiryTime * 60000) : undefined
  }
})

export const userCreateStaffDataResolver = resolve({
  password: passwordHash({ strategy: 'local' }),
  isactive: async () => true,
  createdat: async (value, _, context) => new Date(),
  updatedat: async (value, _, context) => new Date()
})
// Schema for updating existing data
export const userPatchSchema = {
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userSchema.properties,
    isLogout: { type: 'boolean' }
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
  },
  tags: async (value) => {
    if (value) {
      const ids = []
      for (const id of value) {
        ids.push(await resolveObjectId(id))
      }
      return ids
    } else return undefined
  },
  activeforjobs: async (value, data, context) => {
    if (typeof value === 'boolean' && !data?.isLogout) {
      return value
    } else return undefined
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

export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userSchema.properties),
    tags: {
      anyOf: [
        { type: 'array', items: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' } }, // Pattern for ObjectId hex string
        {
          type: 'object',
          properties: {
            $in: {
              type: 'array'
            }
          },
          additionalProperties: true
        }
      ]
    }
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
