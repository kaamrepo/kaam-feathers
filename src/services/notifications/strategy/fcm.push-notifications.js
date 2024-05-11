import admin from 'firebase-admin'

export async function sendPushNotification(payload) {
  const { recepient, notification, data } = payload

  // console.log('notification payload', JSON.stringify(payload, null, 4))

  const notificationBody = {
    tokens: recepient,
    notification: notification
  }
  const response = await admin.messaging().sendEachForMulticast({
    ...notificationBody,
    data: { ...data, priority: 'high' },
    android: { priority: 'high' }
  })

  // console.log('notification response', JSON.stringify(response, null, 5))
}
