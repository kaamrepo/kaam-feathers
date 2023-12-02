import { dummy } from './dummy/dummy.js'

import { chat } from './chats/chats.js'

import { jobapplication } from './jobapplications/jobapplications.js'

import { job } from './jobs/jobs.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(dummy)

  app.configure(chat)

  app.configure(jobapplication)

  app.configure(job)

  app.configure(user)

  // All services will be registered here
}
