import { COMMON_ENDPOINT } from "../../constant/endpoints.js";
export const appconfigPath = `${COMMON_ENDPOINT}appconfig`

export const appconfigMethods = ['find', 'get', 'create', 'patch', 'remove']

export const appconfigClient = (client) => {
  const connection = client.get('connection')

  client.use(appconfigPath, connection.service(appconfigPath), {
    methods: appconfigMethods
  })
}
