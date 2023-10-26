import { COMMON_ENDPOINT } from "../../constant/endpoints.js"

export const jobPath = `${ COMMON_ENDPOINT }jobs`
export const jobMethods = ['find', 'get', 'create', 'patch', 'remove']


export const jobClient = (client) =>
{
  const connection = client.get('connection')

  client.use(jobPath, connection.service(jobPath), {
    methods: jobMethods
  })
}
