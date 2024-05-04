import { COMMON_ENDPOINT } from '../../constant/endpoints.js'

export const notificationsPath = `${COMMON_ENDPOINT}notifications`

export const notificationsMethods = ['create']

export const notificationsClient = (client) => {
  const connection = client.get('connection')

  client.use(notificationsPath, connection.service(notificationsPath), {
    methods: notificationsMethods
  })
}
