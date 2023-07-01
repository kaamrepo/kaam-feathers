export const jobsPath = 'jobs'

export const jobsMethods = ['find', 'get', 'create', 'patch', 'remove']

export const jobsClient = (client) => {
  const connection = client.get('connection')

  client.use(jobsPath, connection.service(jobsPath), {
    methods: jobsMethods
  })
}
