import { userRoles } from './user-roles/user-roles.js'

import { roles } from './roles/roles.js'

import { permissions } from './permissions/permissions.js'

import { analytics } from './analytics/analytics.js'

import { approval } from './approval/approval.js'

import { incrementalRequest } from './incrementalrequest/incrementalrequest.js'

import { appconfig } from './appconfig/appconfig.js'

import { categories } from './categories/categories.js'

import { notifications } from './notifications/notifications.js'

import { dummy } from './dummy/dummy.js'

import { chat } from './chats/chats.js'

import { jobapplication } from './jobapplications/jobapplications.js'

import { job } from './jobs/jobs.js'

import { user } from './users/users.js'

import { notificationTemplates } from './notification-templates/notification-templates.js'

export const services = (app) => {
  app.configure(userRoles)

  app.configure(roles)

  app.configure(permissions)

  app.configure(analytics)

  app.configure(approval)

  app.configure(notificationTemplates)

  app.configure(notifications)

  app.configure(incrementalRequest)

  app.configure(appconfig)

  app.configure(categories)

  app.configure(dummy)

  app.configure(chat)

  app.configure(jobapplication)

  app.configure(job)

  app.configure(user)

  // All services will be registered here
}
