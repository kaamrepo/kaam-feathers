export function generatePassword(length) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  // const specialCharacters = "!@#$%^&*()_+-=[]{}|;':,.<>?"
  const allCharacters = uppercase + lowercase + numbers
  // + specialCharacters
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length)
    password += allCharacters[randomIndex]
  }
  return password
}
