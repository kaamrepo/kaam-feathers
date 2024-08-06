import { jobapplicationPath } from '../../jobapplications/jobapplications.shared.js'
import { NotificationTemplates } from '../../notification-templates/notification-template-names.js'
import { notificationsPath } from '../../notifications/notifications.shared.js'
import { userPath } from '../../users/users.shared.js'
import { logger } from '../../../logger.js'
export const sendChatPushNotification = async (context) => {
  const {
    result,
    params: { chat }
  } = context

  if (!chat) return context

  if (result?._id) {
    const { messages, applicationid } = result
    const jobApplication = await context.app.service(jobapplicationPath)._get(applicationid)
    const notificationsService = context.app.service(notificationsPath)

    if (jobApplication?._id) {
      const { employerid, appliedby } = jobApplication
      const lastMessage = messages?.at(-1)
      const employer = await context.app.service(userPath).get(employerid)
      const applicant = await context.app.service(userPath).get(appliedby)
      let recipient = []
      let fullName = ''
      let message = ''
      let data = {
        type: NotificationTemplates.NEW_CHAT_NOTIFICATION,
        appliedJobId: applicationid,
        chatid: result?._id
      }
      if (lastMessage.senderid.toString() == appliedby.toString()) {
        logger.debug('message sent by applicant, notification should be sent to employer')
        //  get employer's fcm tokens and send a push notification
        const { firebasetokens } = employer
        const { firstname, lastname } = applicant

        if (firebasetokens?.length) {
          recipient = firebasetokens
          fullName = `${firstname} ${lastname}`
          message = lastMessage.text
          data['name'] = fullName
        }
      } else if (lastMessage.senderid.toString() == employerid.toString()) {
        //  get applicant's fcm tokens and send a push notification
        logger.debug('message sent by employer, notification should be sent to applicant')
        const { firebasetokens } = applicant
        const { firstname, lastname } = employer

        if (firebasetokens?.length) {
          recipient = firebasetokens
          fullName = `${firstname} ${lastname}`
          message = lastMessage.text
          data['name'] = fullName
        }
      }

      //  send notification here

      if (recipient?.length && fullName && message) {
        const payload = {
          templateName: NotificationTemplates.NEW_CHAT_NOTIFICATION,
          payload: {
            PUSH: [
              {
                recipient,
                variables: {
                  fullName,
                  message,
                  data,
                  actions: [
                    {
                      title: 'Open',
                      icon: 'https://images.unsplash.com/photo-1718916913219-0ebc462f91f2',
                      pressAction: {
                        id: 'open-chat',
                        launchActivity: 'default'
                      }
                    },
                    {
                      title: 'Reply',
                      icon: 'https://images.unsplash.com/photo-1720065527129-e50696c384a9',
                      pressAction: {
                        id: 'reply'
                      },
                      input: {
                        placeholder: `Reply to ${fullName}...`
                      } // enable free text input
                    }
                  ]
                }
              }
            ]
          }
        }
        notificationsService.create(payload)
      }
    }
  }

  return context
}
