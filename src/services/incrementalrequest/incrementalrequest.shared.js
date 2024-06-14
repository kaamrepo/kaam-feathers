export const incrementalRequestPath = 'incrementalrequest'

export const incrementalRequestMethods = ['find', 'get', 'create', 'patch', 'remove']

export const incrementalRequestClient = (client) => {
  const connection = client.get('connection')

  client.use(incrementalRequestPath, connection.service(incrementalRequestPath), {
    methods: incrementalRequestMethods
  })
}
