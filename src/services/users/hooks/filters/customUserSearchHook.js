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
            // Single word search
            const regex = new RegExp(`^${query.wildString}`, 'i')
            query['$or'] = [
              { firstname: regex },
              { lastname: regex },
              { phone: regex },
              // { 'address.addressline': regex },
              // { 'address.pincode': regex },
              // { 'address.district': regex },
              // { 'address.country': regex },
              // { 'address.state': regex },
              // { 'address.city': regex }
            ]
          } else if (words.length === 2) {
            // First name and last name search
            const [firstName, lastName] = words
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
            // Address filter with all
            query['$or'] = [
              { firstname: new RegExp(`^${query.wildString}`, 'i') },
              { lastname: new RegExp(`^${query.wildString}`, 'i') },
              { phone: new RegExp(`^${query.wildString}`, 'i') },
              // { 'address.addressline': new RegExp(`^${query.wildString}`, 'i') },
              // { 'address.pincode': new RegExp(`^${query.wildString}`, 'i') },
              // { 'address.district': new RegExp(`^${query.wildString}`, 'i') },
              // { 'address.country': new RegExp(`^${query.wildString}`, 'i') },
              // { 'address.state': new RegExp(`^${query.wildString}`, 'i') },
              // { 'address.city': new RegExp(`^${query.wildString}`, 'i') }
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
    hook.params.query = query;
  }
  return hook
}
