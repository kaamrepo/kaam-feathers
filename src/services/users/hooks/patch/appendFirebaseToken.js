export const appendFirebaseToken = async (hook) => {
  const { firebasetokens } = hook.data

  hook.data['$push'] = {
    firebasetokens: firebasetokens?.at(0)
  }

  delete hook.data.firebasetokens

  return hook
}
