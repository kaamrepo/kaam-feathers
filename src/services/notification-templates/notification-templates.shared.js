import { COMMON_ENDPOINT } from '../../constant/endpoints.js'

export const notificationTemplatesPath = `${COMMON_ENDPOINT}notification-templates`

export const notificationTemplatesMethods = ['find', 'get', 'create', 'patch', 'remove']

export const notificationTemplatesClient = (client) => {
  const connection = client.get('connection')

  client.use(notificationTemplatesPath, connection.service(notificationTemplatesPath), {
    methods: notificationTemplatesMethods
  })
}
