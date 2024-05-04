import { COMMON_ENDPOINT } from "../../constant/endpoints.js"

export const jobRolesPath = `${ COMMON_ENDPOINT }job-roles`
export const jobRolesMethods = ['find', 'get', 'create', 'patch', 'remove']

export const jobRolesClient = (client) => {
  const connection = client.get('connection')

  client.use(jobRolesPath, connection.service(jobRolesPath), {
    methods: jobRolesMethods
  })
}
