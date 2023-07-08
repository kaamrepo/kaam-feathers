import { job } from './jobs/jobs.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(job)

  app.configure(user)

  // All services will be registered here
}
