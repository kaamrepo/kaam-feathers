import { COMMON_ENDPOINT } from '../../constant/endpoints.js'

export const userJobPreferencesPath = `${COMMON_ENDPOINT}user-job-preferences`

export const userJobPreferencesMethods = ['find', 'get', 'create', 'patch', 'remove']

export const userJobPreferencesClient = (client) => {
  const connection = client.get('connection')

  client.use(userJobPreferencesPath, connection.service(userJobPreferencesPath), {
    methods: userJobPreferencesMethods
  })
}
