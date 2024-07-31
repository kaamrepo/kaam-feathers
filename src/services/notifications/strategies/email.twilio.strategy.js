import 'dotenv/config'
import { NotificationStrategy } from './notification-strategy.js'
import { logger } from '../../../logger.js'
import { notificationChannelTypes } from '../factories/notification.factory.js'
import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import { Utility } from '../utils/utility.js'
import 'dotenv/config'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_SECRETE_KEY
  }
})

export class EmailTwilioStrategy extends NotificationStrategy {
  async sendNotification(template, data) {
    logger.debug(`inside ${EmailTwilioStrategy.name}`)
    if (!template.channelType[notificationChannelTypes.EMAIL]) {
      logger.error(
        `this channelType:${notificationChannelTypes.EMAIL} does not supported by the provided template`
      )
      return
    }
    const { content, variables: templateVariables } = template.channels.EMAIL

    const templatepath = path.join('src/emails', content.templateName)
    logger.debug('templatepath', templatepath)
    const ejstemplate = fs.readFileSync(templatepath, 'utf-8')
    const compiledTemplate = ejs.compile(ejstemplate)

    const sendEmail = (recipient, variables) => {
      logger.debug(`sendEmail recipient ${recipient} variables ${JSON.stringify(variables)}`)
      const missingVariables = Utility.findMissingKeys(templateVariables, variables)
      if (!missingVariables?.length)
        return transporter.sendMail({
          from: `${process.env.APP_NAME} <${process.env.SENDGRID_EMAIL_ID}>`, // sender address
          to: recipient, // list of receivers
          subject: Utility.fillTemplate(content.subject, variables), // Subject line
          html: compiledTemplate(variables) // html body
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
