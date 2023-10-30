// firebase notification imports:
import admin from 'firebase-admin'
export const FcmSetup=(app)=>{
    const uid = 'some-uid'
    const additionalClaims = {
    premiumAccount: true
    }
    let serviceAccountInfo = app.get('firebase_fcm_serive_account')
    let serviceAuthUrl = app.get('firebase_fcm_auth_url')
    let serviceAccount = {}
    if (serviceAuthUrl && Object.keys(serviceAuthUrl).length != 0) {
    serviceAccount = jsonConcat(serviceAccount, JSON.parse(serviceAuthUrl))
    }
    serviceAccount = jsonConcat(serviceAccount, JSON.parse(serviceAccountInfo))
    let firbaseEmail = app.get('firebase_db_url')
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firbaseEmail
    })
    app.set('FIREBASE', admin)
    admin
    .auth()
    .createCustomToken(uid, additionalClaims)
    .catch((error) => console.log(error))

}
function jsonConcat(o1, o2) {
  for (let key in o2) {
    o1[key] = o2[key]
  }
  return o1
}