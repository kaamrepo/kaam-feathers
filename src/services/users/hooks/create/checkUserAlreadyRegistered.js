import { BadRequest } from '@feathersjs/errors'
import { userPath } from '../../users.shared.js'

export const checkUserAlreadyRegistered = async (context) => {
  const { phone, email } = context.data
  let user
  if (phone && email) {
    user = await context.app.service(userPath).findUserByPhoneOrEmail(phone, email)
  } else if (phone) {
    user = await context.app.service(userPath).findUserByPhoneOrEmail(phone)
  } else if (email) {
    user = await context.app.service(userPath).findUserByPhoneOrEmail(undefined, email)
  }
  if (user) {
    throw new BadRequest('User already exists')
  }
  console.log('---------------------------------------->called query', user)
  return context
}
