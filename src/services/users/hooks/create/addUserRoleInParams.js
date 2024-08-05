export const addUserRoleInParams = async (context) => {
  const { role } = context.data
  context.params.role = role
  delete context.data.role
  return context
}
