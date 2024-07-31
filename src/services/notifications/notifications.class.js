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

    const { channelType } = template

    for (const [key] of Object.entries(data.payload)) {
      if (!channelType[key]) {
        logger.info(`key:${key} is not configured in the notification template:${data.templateName}`)
      } else {
        logger.debug(`serviceType:${channelType[key]}, channelType:${JSON.stringify(channelType)} key:${key}`)
        const strategy = NotificationFactory.getStrategy(channelType[key], key)
        strategy.sendNotification(template, data.payload[key])
      }
    }
  }
}

export const getOptions = (app) => {
  return { app }
}
