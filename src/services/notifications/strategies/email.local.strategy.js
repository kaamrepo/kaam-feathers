import 'dotenv/config'
import { NotificationStrategy } from './notification-strategy.js'
import { logger } from '../../../logger.js'
import { notificationChannelTypes } from '../factories/notification.factory.js'
import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import formData from 'form-data'
import Mailgun from 'mailgun.js'
import { Utility } from '../utils/utility.js'

const mailgun = new Mailgun(formData)

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_SECRET_KEY
})

export class EmailLocalStrategy extends NotificationStrategy {
  async sendNotification(template, data) {
    logger.debug('inside', EmailLocalStrategy.name)
    if (!template.channelType.includes(notificationChannelTypes.EMAIL)) {
      logger.error(
        `this channelType:${notificationChannelTypes.EMAIL} does not supported by the provided template`
      )
      return
    }
    const { content, variables: templateVariables } = template.channels.EMAIL

    const templatepath = path.join('src/emails', content.templateName)
    const ejstemplate = fs.readFileSync(templatepath, 'utf-8')
    const compiledTemplate = ejs.compile(ejstemplate)

    const sendEmail = (recipient, variables) => {
      logger.debug(`sendEmail recipient ${recipient} variables ${JSON.stringify(variables)}`)
      const missingVariables = Utility.findMissingKeys(templateVariables, variables)
      if (!missingVariables?.length)
        return mg.messages.create(process.env.MAILGUN_DOMAIN, {
          from: 'KaamPe <mailgun@sandbox-123.mailgun.org>',
          to: [recipient],
          subject: Utility.fillTemplate(content.subject, variables),
          html: compiledTemplate(variables)
        })
      else {
        logger.debug(`missing variables found ${missingVariables} for recipient ${recipient}`)
      }
    }

    const promises = data.map((email) => sendEmail(email.recipient, email.variables))

    const results = await Promise.allSettled(promises)

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        logger.debug(`result ${JSON.stringify(result)}`)
        logger.debug(`Email to ${data[idx].recipient} was sent successfully.`)
      } else {
        logger.error(`Email to ${data[idx].recipient} failed:`, result.reason)
      }
    })
  }
}
