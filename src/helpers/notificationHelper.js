import { handleError } from './errorhandlingHelper.js'
const notificationHelper = async function (app, registrationTokens, message) {
  try {
    const admin = app.get('FIREBASE')
    let responses = []
    const notification_options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24
    }
    const options = notification_options
    if (registrationTokens && registrationTokens.length > 0) {
      for (let i = 0; i < registrationTokens.length; i++) {
        let registrationToken = registrationTokens[i]
        let response = await admin.messaging().sendToDevice(registrationToken, message, options)
        responses.push(response)
      }
    }
    return responses
  } catch (error) {
    handleError(
      undefined,
      undefined,
      { value: undefined },
      `Error occurred while sending in-app notification >>> ${error}`
    )
  }
}
export { notificationHelper }
