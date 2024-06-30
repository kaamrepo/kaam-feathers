import { NotificationTemplates } from '../../../../constant/enums.js'
import { notificationsPath } from '../../../notifications/notifications.shared.js'
export const sentPasswordEmailNotification = (context) => {
  const password = context.params.passwordString
  const { firstname, lastname, email } = context.result
  const emailPayload = {
    templateName: NotificationTemplates.WEB_ONBOARD_USER,
    payload: {
      EMAIL: [
        {
          recipient: email,
          variables: {
            password,
            name: `${firstname} ${lastname}`,
            email
          }
        }
      ]
    }
  }
  context.app.service(notificationsPath).create(emailPayload)
}
