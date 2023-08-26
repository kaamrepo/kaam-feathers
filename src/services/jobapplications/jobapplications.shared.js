import { COMMON_ENDPOINT } from "../../constant/endpoints.js"

export const jobapplicationPath = `${ COMMON_ENDPOINT }jobapplications`
export const jobapplicationMethods = ['find', 'get', 'create', 'patch', 'remove']

export const jobapplicationClient = (client) =>
{
  const connection = client.get('connection')

  client.use(jobapplicationPath, connection.service(jobapplicationPath), {
    methods: jobapplicationMethods
  })
}
