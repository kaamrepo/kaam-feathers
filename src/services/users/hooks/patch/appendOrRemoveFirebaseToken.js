export const appendOrRemoveFirebaseToken = async (hook) => {
  const { firebasetokens, isLogout } = hook.data

  if (isLogout && firebasetokens?.at(0)) {
    hook.data['$pull'] = {
      firebasetokens: firebasetokens?.at(0)
    }
    delete hook.data.isLogout
  } else if (!isLogout && firebasetokens?.at(0)) {
    hook.data['$push'] = {
      firebasetokens: firebasetokens?.at(0)
    }
  }
  delete hook.data.firebasetokens

  return hook
}
