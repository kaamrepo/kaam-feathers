import { defaultAppSettings, getValidator } from '@feathersjs/schema'

import { dataValidator } from './validators.js'

export const configurationSchema = {
  $id: 'configuration',
  type: 'object',
  additionalProperties: false,
  required: ['host', 'port', 'public'],
  properties: {
    ...defaultAppSettings,
    host: { type: 'string' },
    port: { type: 'number' },
    public: { type: 'string' },
    kaam_otp_validity_time: { type: 'string' },
    kaam_twilio_account_sid: { type: 'string' },
    kaam_twilio_auth_token: { type: 'string' },
    firebase_db_url: { type: 'string' },
    firebase_fcm_serive_account: { type: 'string' },
    firebase_fcm_auth_url: { type: 'string' },
    cloudName: { type: 'string' },
    apiKey: { type: 'string' },
    apiSecret: { type: 'string' },
    url: { type: 'string' },
    kaam_otp_digits: { type: 'string' }
  }
}

export const configurationValidator = getValidator(configurationSchema, dataValidator)
