import { userRolesPath } from '../../../user-roles/user-roles.shared.js'
export const fetchUsersByRoleId = () => async (context) => {
  const { query } = context.params
  // Check if roleId is provided
  if (query.roleId) {
    // Initialize the user roles query
    const userRolesQuery = {
      roleId: query.roleId,
      isActive: true
    }
    // Check if $limit is provided and greater than or equal to 0
    if (typeof query.$limit === 'number' && query.$limit > 0) {
      userRolesQuery['$limit'] = query.$limit
    }
    // Check if $skip is provided and greater than or equal to 0
    if (typeof query.$skip === 'number' && query.$skip >= 0) {
      userRolesQuery['$skip'] = query.$skip
    }
    // Fetch user roles based on the provided roleId
    const userRoles = await context.app.service(userRolesPath).find({ query: userRolesQuery })
    // Extract user IDs from the user roles
    const userIds = userRoles.data.map((userRole) => userRole.userId)
    // If no user IDs are found, return an empty array
    if (userIds.length === 0) {
      return []
    }
    // Update the query to fetch users based on the extracted user IDs
    context.params.query._id = {
      $in: userIds
    }
    delete context.params.query.roleId
  }
  // Return the modified context
  return context
}
