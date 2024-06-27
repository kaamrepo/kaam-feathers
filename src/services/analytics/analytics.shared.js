import { COMMON_ENDPOINT } from "../../constant/endpoints.js";
export const analyticsPath = `${COMMON_ENDPOINT}analytics`


export const analyticsMethods = ['find', 'get', 'create', 'patch', 'remove']

export const analyticsClient = (client) => {
  const connection = client.get('connection')

  client.use(analyticsPath, connection.service(analyticsPath), {
    methods: analyticsMethods
  })
}
