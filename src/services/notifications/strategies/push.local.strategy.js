import { NotificationStrategy } from './notification-strategy.js'
import { logger } from '../../../logger.js'
import { notificationChannelTypes } from '../factories/notification.factory.js'

export class PushLocalStrategy extends NotificationStrategy {
  sendNotification(template, data) {
    logger.debug('inside', PushLocalStrategy.name)
    if (!template.channelType.includes(notificationChannelTypes.PUSH)) {
      logger.error(
        `this channelType:${notificationChannelTypes.PUSH} does not supported by the provided template`
      )

      return
    }
    // Implement the logic to send PUSH using local service
    // console.log(`Sending PUSH to ${receiverDetails.phone} with content: ${template.channels.PUSH.content}`)
    // Replace variables in template.content with attributes
  }
}
