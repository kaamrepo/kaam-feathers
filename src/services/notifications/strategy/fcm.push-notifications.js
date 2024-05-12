import admin from 'firebase-admin'

export async function sendPushNotification(payload) {
  const { recepient, notification, data, actions } = payload

  // console.log('notification payload', JSON.stringify(payload, null, 4))

  const notificationBody = {
    tokens: recepient,
    notification: notification
  }

  const response = await admin.messaging().sendEachForMulticast({
    tokens: recepient,
    priority: 'high',
    data: {
      priority: 'high',
      notifee: JSON.stringify({
        ...notification,
        android: {
          channelId: 'default',
          smallIcon: 'ic_notification',
          color: '#000000',
          actions
        }
      })
    }
  })

  console.log('notification response', JSON.stringify(response, null, 5))
}
