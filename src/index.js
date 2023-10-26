import { app } from './app.js'
import { logger } from './logger.js'

const port = process.env.KAAM_PORT
const host = app.get('kaam_host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${ host }:${ port }`)
  console.log("kaam_twilio_account_sid: -",app.get('kaam_twilio_account_sid'));
  console.log("kaam_twilio_auth_token: -",app.get('kaam_twilio_auth_token'));
  console.log("firebase_db_url: -",app.get('firebase_db_url'));
  console.log("firebase_fcm_serive_account: -",app.get('firebase_fcm_serive_account'));
  console.log("firebase_fcm_auth_url: -",app.get('firebase_fcm_auth_url'));
  console.log("cloudName: -",app.get('cloudName'));
  console.log("apiKey: -",app.get('apiKey'));
  console.log("apiSecret: -",app.get('apiSecret'));
  console.log("url: -",app.get('url'));
  console.log("kaam_otp_digits: -",app.get('kaam_otp_digits'));
  console.log("kaam_port: -",app.get('kaam_port'));
  console.log("kaam_host: -",app.get('kaam_host'));
  console.log("kaam_mongodb: -",app.get('kaam_mongodb'));
})
