import { jobs } from './jobs/jobs.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(jobs)

  app.configure(user)

  // All services will be registered here
}
