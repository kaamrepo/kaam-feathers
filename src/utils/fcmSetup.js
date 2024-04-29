import admin from 'firebase-admin'
import { logger } from '../logger.js'
import { readFile } from 'fs/promises';

export const firebaseSetup = async (app) => {
  try {
    const firebasePrivateKeyFilePath = app.get('kaam_firebase_notification_file_path')
    const buffer = await readFile(firebasePrivateKeyFilePath)
    const serviceAccount = JSON.parse(buffer.toString('utf8'))
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })

    logger.info('Firebase app initialized successfully')
  } catch (error) {
    logger.info('Error initializing Firebase app:' + error)
  }
}
