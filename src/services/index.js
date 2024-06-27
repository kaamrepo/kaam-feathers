import { approval } from './approval/approval.js'

import { incrementalRequest } from './incrementalrequest/incrementalrequest.js'

import { appconfig } from './appconfig/appconfig.js'

import { categories } from './categories/categories.js'

import { notifications } from './notifications/notifications.js'

import { userJobPreferences } from './user-job-preferences/user-job-preferences.js'

import { jobRoles } from './job-roles/job-roles.js'

import { dummy } from './dummy/dummy.js'

import { chat } from './chats/chats.js'

import { jobapplication } from './jobapplications/jobapplications.js'

import { job } from './jobs/jobs.js'

import { user } from './users/users.js'

import { notificationTemplates } from './notification-templates/notification-templates.js'


export const services = (app) => {

  app.configure(approval)

  app.configure(notificationTemplates)

  app.configure(notifications)

  app.configure(incrementalRequest)

  app.configure(appconfig)

  app.configure(categories)

  app.configure(userJobPreferences)

  app.configure(jobRoles)

  app.configure(dummy)

  app.configure(chat)

  app.configure(jobapplication)

  app.configure(job)

  app.configure(user)

  // All services will be registered here
}
