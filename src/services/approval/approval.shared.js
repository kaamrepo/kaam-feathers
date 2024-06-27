import { COMMON_ENDPOINT } from "../../constant/endpoints.js";
export const approvalPath = `${COMMON_ENDPOINT}approval`

export const approvalMethods = ['find', 'get', 'create', 'patch', 'remove']

export const approvalClient = (client) => {
  const connection = client.get('connection')

  client.use(approvalPath, connection.service(approvalPath), {
    methods: approvalMethods
  })
}
