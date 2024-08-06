import { COMMON_ENDPOINT } from '../../constant/endpoints.js'

export const termsAndConditionsPath = `${COMMON_ENDPOINT}terms-and-conditions`

export const termsAndConditionsMethods = ['find', 'get', 'create', 'patch', 'remove']

export const termsAndConditionsClient = (client) => {
  const connection = client.get('connection')

  client.use(termsAndConditionsPath, connection.service(termsAndConditionsPath), {
    methods: termsAndConditionsMethods
  })
}
