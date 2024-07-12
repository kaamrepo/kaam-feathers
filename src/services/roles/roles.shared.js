import { COMMON_ENDPOINT } from '../../constant/endpoints.js'

export const rolesPath = `${COMMON_ENDPOINT}roles`

export const rolesMethods = ['find', 'get', 'create', 'patch', 'remove','findOneByQuery']

export const rolesClient = (client) => {
  const connection = client.get('connection')

  client.use(rolesPath, connection.service(rolesPath), {
    methods: rolesMethods
  })
}
