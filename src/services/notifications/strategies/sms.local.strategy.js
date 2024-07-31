import { NotificationStrategy } from './notification-strategy.js'
import { logger } from '../../../logger.js'
import { notificationChannelTypes } from '../factories/notification.factory.js'

export class SmsLocalStrategy extends NotificationStrategy {
  async sendNotification(template, data) {
    logger.debug('inside', SmsLocalStrategy.name)
    if (!template.channelType[notificationChannelTypes.SMS]) {
      logger.error(
        `this channelType:${notificationChannelTypes.SMS} does not supported by the provided template`
      )
      return
    }

    // Implement the logic to send SMS using local service
    // console.log(`Sending SMS to ${receiverDetails.phone} with content: ${template.channels.SMS.content}`)
    // Replace variables in template.content with attributes
  }
}
