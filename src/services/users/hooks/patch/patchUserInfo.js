import { saveCloudnaryImage } from '../../../../helpers/saveCloudnaryImage.js'
import { saveS3Image } from '../../../../helpers/saveS3Image.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

export const patchUserInfo = async (hook) => {
  if (hook.params.headers?.timezone && hook.data.dateofbirth) {
    hook.data.dateofbirth = new Date(hook.data.dateofbirth?.split('T')[0]).toISOString()
  }
  if (hook.data.source === 'uploadProfile') {
    // saveCloudnaryImage
    try {
      // AWS bucket
      let profileImage = await saveS3Image(hook.data.profilepic)
      // cloudinary
      // let profileImage = await saveCloudnaryImage(hook.data.profilepic)
      if (profileImage) hook.data.profilepic = profileImage
    } catch (error) {
      console.log('error')
    }
  }
  if (hook.data.source === 'updatelocation') {
    const newCoordinates = { lat: hook.data.lat, long: hook.data.long }
    const getOldUser = await hook.app.service('api/users').get(hook.id)
    // Ensure coordinates is an array
    if (!Array.isArray(getOldUser.coordinates)) {
      getOldUser.coordinates = []
    }
    const lastCoordinates = getOldUser.coordinates[getOldUser.coordinates.length - 1]
    const isSameCoordinates =
      lastCoordinates &&
      lastCoordinates.lat === newCoordinates.lat &&
      lastCoordinates.long === newCoordinates.long
    if (!isSameCoordinates) {
      getOldUser.coordinates.push(newCoordinates)
    }
    hook.data.coordinates = getOldUser.coordinates
    delete hook.data.lat
    delete hook.data.long
  }
  delete hook.data.source
  return hook
}
