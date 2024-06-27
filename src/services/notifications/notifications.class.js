// This is a skeleton for a custom service class. Remove or add the methods you need here
import { notificationTemplatesPath } from '../notification-templates/notification-templates.shared.js'
import { NotificationFactory } from './factories/notification.factory.js'
import { BadRequest } from '@feathersjs/errors'
// import { sendPushNotification } from './strategies/fcm.push-notifications.js'
import { logger } from '../../logger.js'

export class NotificationsService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    return []
  }

  async get(id, _params) {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }
  // async create(data, params) {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map((current) => this.create(current, params)))
  //   }
  //   const { type } = data
  //   switch (type) {
  //     case 'FCM':
  //       sendPushNotification(data)
  //       break

  //     default:
  //       break
  //   }
  //   return {
  //     message: `${data.type} notification initiated successfully`
  //   }
  // }

  // This method has to be added to the 'methods' option to make it available to clients

  async create(data, params) {
    await this.sendNotification(data)
    return {
      message: 'Notification request initiated successfully'
    }
  }

  async update(id, data, _params) {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id, data, _params) {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id, _params) {
    return {
      id: 0,
      text: 'removed'
    }
  }

  async sendNotification(data) {
    const template = await this.options.app
      .service(notificationTemplatesPath)
      .get(null, { query: { name: data.templateName } })

    if (!template) {
      throw new BadRequest('template not found')
    }

    const { channelType, service } = template

    const serviceType = service ?? this.options.app.get('kaam_notification_service_type')

    for (const [key] of Object.entries(data.payload)) {
      logger.debug(`serviceType:${serviceType}, channelType:${channelType} key:${key}`)
      const strategy = NotificationFactory.getStrategy(serviceType, key)
      strategy.sendNotification(template, data.payload[key])
    }
  }
}

export const getOptions = (app) => {
  return { app }
}
