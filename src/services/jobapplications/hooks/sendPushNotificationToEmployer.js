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
        const notificationPayload = {
          type: 'FCM',
          recepient: firebasetokens,
          notification: {
            title: 'New job application',
            body: `${firstname} ${lastname} has applied for the job`
          }
        }

        notificationsService.create(notificationPayload)
      }

    } else {
      throw new NotFound('User not found!')
    }
  }
  return context
}
