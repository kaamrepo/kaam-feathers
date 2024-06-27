// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import { analyticsClient } from './services/analytics/analytics.shared.js'

import { approvalClient } from './services/approval/approval.shared.js'

import { incrementalRequestClient } from './services/incrementalrequest/incrementalrequest.shared.js'

import { appconfigClient } from './services/appconfig/appconfig.shared.js'

import { categoriesClient } from './services/categories/categories.shared.js'

import { notificationsClient } from './services/notifications/notifications.shared.js'

import { userJobPreferencesClient } from './services/user-job-preferences/user-job-preferences.shared.js'

import { jobRolesClient } from './services/job-roles/job-roles.shared.js'

import { dummyClient } from './services/dummy/dummy.shared.js'

import { chatClient } from './services/chats/chats.shared.js'

import { jobapplicationClient } from './services/jobapplications/jobapplications.shared.js'

import { jobClient } from './services/jobs/jobs.shared.js'

import { userClient } from './services/users/users.shared.js'

import { notificationTemplatesClient } from './services/notification-templates/notification-templates.shared.js'

/**
 * Returns a  client for the kaam-feathers app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = (connection, authenticationOptions = {}) => {
  const client = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)

  client.configure(jobClient)

  client.configure(jobapplicationClient)

  client.configure(chatClient)

  client.configure(dummyClient)

  client.configure(jobRolesClient)

  client.configure(userJobPreferencesClient)

  client.configure(notificationsClient)

  client.configure(categoriesClient)

  client.configure(appconfigClient)

  client.configure(incrementalRequestClient)

  client.configure(approvalClient)

  client.configure(notificationTemplatesClient)

  client.configure(analyticsClient)

  return client
}
