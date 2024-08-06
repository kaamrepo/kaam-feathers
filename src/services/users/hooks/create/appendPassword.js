import { generatePassword } from '../../../../utils/generatePassword.js'

export const appendPassword = async (context) => {
  // const generatedPassword = await generatePassword(8)
  const generatedPassword = '12345678'
  context.params.passwordString = generatedPassword
  context.data.password = generatedPassword
  return context
}
