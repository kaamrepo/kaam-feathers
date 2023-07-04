import { COMMON_ENDPOINT } from "../../constant/endpoints.js"

export const jobsPath = `${ COMMON_ENDPOINT }jobs`
export const jobsMethods = ['find', 'get', 'create', 'patch', 'remove']

export const jobsClient = (client) =>
{
  const connection = client.get('connection')

  client.use(jobsPath, connection.service(jobsPath), {
    methods: jobsMethods
  })
}
