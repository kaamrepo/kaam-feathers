import 'dotenv/config'
import { NotificationStrategy } from './notification-strategy.js'
import { logger } from '../../../logger.js'
import { notificationChannelTypes } from '../factories/notification.factory.js'
// import sgMail from '@sendgrid/mail'

// sgMail.setApiKey(process.env.SENDGRID_SECRET_KEY)

export class EmailLocalStrategy extends NotificationStrategy {
  sendNotification(template, data) {
    logger.debug('inside', EmailLocalStrategy.name)
    if (!template.channelType.includes(notificationChannelTypes.EMAIL)) {
      logger.error(
        `this channelType:${notificationChannelTypes.EMAIL} does not supported by the provided template`
      )
      return
    }
    const { content, variables, service } = template.channels.EMAIL

    console.log('\n------------------->>>>template', JSON.stringify(template, null, 4))
    console.log('\n------------------->>>> data', JSON.stringify(data, null, 4))

    const { EMAIL } = template.channels
    // const sendData = data.map(() => {})
    const msg = {
      to: 'sidheshparab34@gmail.com',
      from: 'vastbeacon@gmail.com',
      subject: EMAIL.content.subject,
      html: EMAIL.content.body
    }
    console.log(
      '🚀 ~ EmailLocalStrategy ~ sendNotification ~ msg.template.EMAIL.content:',
      template.channels.EMAIL.content
    )
    // Implement the logic to send Email using local service
    // console.log(
    //   `Sending Email to ${receiverDetails.email} with subject: ${template.channels.EMAIL.content.subject}`
    // )
    // Replace variables in template.content with attributes
  }
}

function findMissingKeys(obj1, obj2) {
  // Initialize an empty array to store missing keys
  let missingKeys = []

  // Loop through each key in obj1
  for (let key in obj1) {
    // Check if the key is not present in obj2
    if (!(key in obj2)) {
      // Add the missing key to the array
      missingKeys.push(key)
    }
  }

  // Return the array of missing keys
  return missingKeys
}
