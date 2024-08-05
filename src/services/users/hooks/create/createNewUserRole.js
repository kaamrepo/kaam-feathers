import { rolesPath } from '../../../roles/roles.shared.js'
import { userRolesPath } from '../../../user-roles/user-roles.shared.js'

export const createNewUserRole = async (context) => {
  // find roleId
  const roleData = await context.app.service(rolesPath).find({
    query: {
      roleId: context.params.role,
      paginate: false,
      isActive: true
    }
  })
  // check role
  if (!roleData) {
    throw new Error(`Role With roleId ${context.params.role} not found`)
  }
  const userrole = {
    roleId: context.params.role,
    userId: context.result._id.toString(),
    isActive: true
  }
  // create new role
  await context.app.service(userRolesPath).create(userrole)
  return context
}
