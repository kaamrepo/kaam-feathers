import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
dayjs.extend(utc)
dayjs.extend(timezone)
export const patchUserInfo = async (hook) => {
  if (hook.params?.headers?.timezone && hook?.data?.dateofbirth) {
    hook.data.dateofbirth = new Date(hook.data.dateofbirth?.split('T')[0]).toISOString()
  }
  if (hook.data.source === 'updatelocation') {
    const newCoordinates = [hook?.data?.long, hook?.data?.lat]
    const getOldUser = await hook.app.service('api/users').get(hook?.id)
    if (!Array.isArray(getOldUser.coordinates)) {
      getOldUser.coordinates = []
    }
    const lastCoordinates = getOldUser.coordinates[getOldUser.coordinates.length - 1]
    const isSameCoordinates =
      lastCoordinates && lastCoordinates[0] === newCoordinates[0] && lastCoordinates[1] === newCoordinates[1]
    if (!isSameCoordinates) {
      getOldUser.coordinates = newCoordinates
    }
    hook.data.coordinates = getOldUser.coordinates
    delete hook.data.lat
    delete hook.data.long
  }
  delete hook.data.source
  return hook
}
