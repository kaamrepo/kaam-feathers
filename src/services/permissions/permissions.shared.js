import { COMMON_ENDPOINT } from '../../constant/endpoints.js'

export const permissionsPath = `${COMMON_ENDPOINT}permissions`

export const permissionsMethods = ['find', 'get', 'create', 'patch', 'remove', 'findOneByQuery']

export const permissionsClient = (client) => {
  const connection = client.get('connection')

  client.use(permissionsPath, connection.service(permissionsPath), {
    methods: permissionsMethods
  })
}
