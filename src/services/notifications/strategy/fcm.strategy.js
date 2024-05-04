import admin from 'firebase-admin'

export class FCMNotification {
  sendNotification(payload) {
    const notificationBody = {
      tokens: payload.recepient,
      notification: payload.notification
    }
    return admin.messaging().sendEachForMulticast({
      ...notificationBody,
      data: { priority: 'high' },
      android: { priority: 'high' }
    })
  }
}
