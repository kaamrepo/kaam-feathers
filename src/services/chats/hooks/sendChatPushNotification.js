import { jobapplicationPath } from '../../jobapplications/jobapplications.shared.js'
import { notificationsPath } from '../../notifications/notifications.shared.js'
import { userPath } from '../../users/users.shared.js'

export const sendChatPushNotification = async (context) => {
  const {
    result,
    params: { chat }
  } = context

  console.log('chat', chat)
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
      if (lastMessage.senderid.toString() == appliedby.toString()) {
        console.log('message sent by applicant, notification should be sent to employer')
        //  get employer's fcm tokens and send a push notification

        const { firebasetokens } = employer
        const {firstname, lastname} = applicant

        if (firebasetokens?.length) {
          const notificationPayload = {
            type: 'FCM',
            recepient: firebasetokens,
            notification: {
              title: `${firstname} ${lastname}`,
              body: lastMessage.text
            }
          }

          notificationsService.create(notificationPayload)
        }
      } else if (lastMessage.senderid.toString() == employerid.toString()) {
        //  get applicant's fcm tokens and send a push notification
        console.log('message sent by employer, notification should be sent to applicant')
        const { firebasetokens } = applicant
        const {firstname, lastname} = employer


        if (firebasetokens?.length) {
          const notificationPayload = {
            type: 'FCM',
            recepient: firebasetokens,
            notification: {
              title: `${firstname} ${lastname}`,
              body: lastMessage.text
            }
          }

          notificationsService.create(notificationPayload)
        }
      }
    }
  }
  return context
}
