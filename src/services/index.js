import { userJobPreferences } from './user-job-preferences/user-job-preferences.js'

import { jobRoles } from './job-roles/job-roles.js'

import { dummy } from './dummy/dummy.js'

import { chat } from './chats/chats.js'

import { jobapplication } from './jobapplications/jobapplications.js'

import { job } from './jobs/jobs.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(userJobPreferences)

  app.configure(jobRoles)

  app.configure(dummy)

  app.configure(chat)

  app.configure(jobapplication)

  app.configure(job)

  app.configure(user)

  // All services will be registered here
}
