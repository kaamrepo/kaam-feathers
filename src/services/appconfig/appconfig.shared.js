// import { COMMON_ENDPOINT } from "../../constant/endpoints";
export const appconfigPath = `/api/appconfig`

export const appconfigMethods = ['find', 'get', 'create', 'patch', 'remove']

export const appconfigClient = (client) => {
  const connection = client.get('connection')

  client.use(appconfigPath, connection.service(appconfigPath), {
    methods: appconfigMethods
  })
}
