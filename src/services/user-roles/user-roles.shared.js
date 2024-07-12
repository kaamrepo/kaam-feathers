import { COMMON_ENDPOINT } from '../../constant/endpoints.js'

export const userRolesPath = `${COMMON_ENDPOINT}user-roles`

export const userRolesMethods = ['find', 'get', 'create', 'patch', 'remove', 'findOneByQuery']

export const userRolesClient = (client) => {
  const connection = client.get('connection')

  client.use(userRolesPath, connection.service(userRolesPath), {
    methods: userRolesMethods
  })
}
