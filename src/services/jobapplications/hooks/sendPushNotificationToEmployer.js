import { NotificationTemplates } from '../../notification-templates/notification-template-names.js'
import { notificationsPath } from '../../notifications/notifications.shared.js'
import { userPath } from '../../users/users.shared.js'

export const sendPushNotificationToEmployer = async (context) => {
  const { result } = context
  if (result?._id) {
    const applicant = await context.app.service(userPath).get(result?.appliedby)
    const employer = await context.app.service(userPath).get(result?.employerid)

    if (applicant && employer) {
      const notificationsService = context.app.service(notificationsPath)
      const { firstname, lastname } = applicant
      const { firebasetokens } = employer

      if (firebasetokens?.length) {
        const payload = {
          templateName: NotificationTemplates.NEW_JOB_APPLICATION_NOTIFICATION,
          payload: {
            PUSH: [
              {
                recipient: firebasetokens,
                variables: {
                  fullName: `${firstname} ${lastname}`
                }
              }
            ]
          }
        }
        notificationsService.create(payload)
      }
    } else {
      throw new NotFound('User not found!')
    }
  }
  return context
}
