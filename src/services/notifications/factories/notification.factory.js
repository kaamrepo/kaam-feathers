// localNotificationFactory.js
import { EmailLocalStrategy } from '../strategies/email.local.strategy.js'
import { SmsLocalStrategy } from '../strategies/sms.local.strategy.js'
import { PushLocalStrategy } from '../strategies/push.local.strategy.js'
import { EmailTwilioStrategy } from '../strategies/email.twilio.strategy.js'

const notificationServiceTypes = {
  LOCAL: 'LOCAL',
  TWILIO: 'TWILIO'
}
export const notificationChannelTypes = {
  SMS: 'SMS',
  PUSH: 'PUSH',
  EMAIL: 'EMAIL'
}

export class NotificationFactory {
  static getStrategy(serviceType, channelType) {
    switch (true) {
      case channelType === notificationChannelTypes.SMS && serviceType === notificationServiceTypes.LOCAL:
        return new SmsLocalStrategy()
      case channelType === notificationChannelTypes.EMAIL && serviceType === notificationServiceTypes.LOCAL:
        return new EmailLocalStrategy()
      case channelType === notificationChannelTypes.PUSH && serviceType === notificationServiceTypes.LOCAL:
        return new PushLocalStrategy()
      case channelType === notificationChannelTypes.EMAIL && serviceType === notificationServiceTypes.TWILIO:
        return new EmailTwilioStrategy()
      default:
        throw new Error('Unknown channel type')
    }
  }
}
