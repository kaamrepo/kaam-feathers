import { generatePassword } from '../../../../utils/generatePassword.js'

export const appendPassword = async (context) => {
  const generatedPassword = await generatePassword(8)
  context.params.passwordString = generatedPassword
  context.data.password = generatedPassword
  return context
}
