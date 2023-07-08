import { saveCloudnaryImage } from '../../../../helpers/saveCloudnaryImage.js'
export const patchUserInfo = async (hook) =>
{
  if (hook.data.source === 'uploadProfile')
  {
    // saveCloudnaryImage
    try
    {
      let profileImage = await saveCloudnaryImage(hook.data.profilepic)
      if (profileImage) hook.data.profilepic = profileImage
    } catch (error)
    {
      console.log('error')
    }
  }
  delete hook.data.source
  return hook
}
