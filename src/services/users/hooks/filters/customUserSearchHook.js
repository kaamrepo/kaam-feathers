export const userQueryfilters = () => async (hook) => {
  let query = hook.params.query
  if (query && query !== undefined) {
    Object.keys(hook.params.query).forEach((key) => {
      switch (key) {
        case 'nearBy':
          if (query['nearBy'] && query['nearBy'].length === 2) {
            hook.params.pipeline.push({
              $geoNear: {
                near: {
                  type: 'Point',
                  coordinates: query['nearBy']
                },
                distanceField: 'distanceInMeter',
                spherical: true,
                maxDistance: 10000 // (10km)
              }
            })
            delete query['nearBy']
          }
          break

        case 'wildString':
          query.wildString = query.wildString.trim()
          const words = query.wildString.split(' ')
          if (words.length === 1) {
            const regex = new RegExp(`^${query.wildString}`, 'i')
            query['$or'] = [{ firstname: regex }, { lastname: regex }, { phone: regex }]
          } else if (words.length === 2) {
            query['$and'] = [
              {
                $or: [
                  { firstname: new RegExp(`^${firstName}`, 'i') },
                  { lastname: new RegExp(`^${firstName}`, 'i') }
                ]
              },
              {
                $or: [
                  { firstname: new RegExp(`^${lastName}`, 'i') },
                  { lastname: new RegExp(`^${lastName}`, 'i') }
                ]
              }
            ]
          } else {
            query['$or'] = [
              { firstname: new RegExp(`^${query.wildString}`, 'i') },
              { lastname: new RegExp(`^${query.wildString}`, 'i') },
              { phone: new RegExp(`^${query.wildString}`, 'i') }
            ]
          }
          delete query['wildString']
          break
        case 'phone':
          query['phone'] = new RegExp(`^${query.phone}`, 'i') || ''
          break
        default:
          break
      }
    })
    hook.params.query = query
  }
  return hook
}
