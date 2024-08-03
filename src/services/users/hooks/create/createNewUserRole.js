import { rolesPath } from '../../../roles/roles.shared.js'
import { userRolesPath } from '../../../user-roles/user-roles.shared.js'

export const createNewUserRole = async (context) => {
  // find roleId
  const roleData = await context.app.service(rolesPath).find({
    query: {
      roleId: context.result.role,
      paginate: false,
      isActive: true
    }
  })
  // check role
  if (!roleData) {
    throw new Error(`Role With roleId ${context.result.role} not found`)
  }
  const userrole = {
    roleId: context.result.role,
    userId: context.result._id.toString(),
    isActive: true
  }
  // create new role
  await context.app.service(userRolesPath).create(userrole)
  return context
}
