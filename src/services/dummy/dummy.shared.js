export const dummyPath = 'dummy'

export const dummyMethods = ['find', 'get', 'create', 'patch', 'remove']

export const dummyClient = (client) => {
  const connection = client.get('connection')

  client.use(dummyPath, connection.service(dummyPath), {
    methods: dummyMethods
  })
}
