import { COMMON_ENDPOINT } from "../../constant/endpoints.js"

export const userPath = `${ COMMON_ENDPOINT }users`
export const userMethods = ['find', 'get', 'create', 'patch', 'remove']

export const userClient = (client) =>
{
  const connection = client.get('connection')

  client.use(userPath, connection.service(userPath), {
    methods: userMethods
  })
}
