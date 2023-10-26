import { COMMON_ENDPOINT } from "../../constant/endpoints.js"

export const chatPath = `${ COMMON_ENDPOINT }chats`
export const chatMethods = ['find', 'get', 'create', 'patch', 'remove']

export const chatClient = (client) =>
{
  const connection = client.get('connection')

  client.use(chatPath, connection.service(chatPath), {
    methods: chatMethods
  })
}
