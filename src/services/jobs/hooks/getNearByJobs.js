export const getNearByJobs = async (context) => {
  const { query } = context.params

  switch (query.type) {
    case 'nearby':
      const { coordinates, text } = context.params.query
      delete context.params.query.coordinates
      delete context.params.query.text
      delete context.params.query.type
      context.params.pipeline = []

      if (coordinates) {
        context.params.pipeline.push({
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: coordinates
            },
            distanceField: 'distanceInMeter',
            spherical: true,
            maxDistance: 100000 // Set the maximum distance in meters (100km)
          }
        })
      }

      if (text) {
        context.params.query = {
          $or: [
            { jobtitle: { $regex: text, $options: 'i' } },
            { description: { $regex: text, $options: 'i' } }
          ]
        }
      }
      context.params.pipeline.push({
        $feathers: context.params.query
      })
      if (context.params?.pipeline?.length <= 0) {
        delete context.params.pipeline
      }
      break

    case 'recommended':
      // console.log('recommended query', query)
      break

    case 'featured':
      // console.log('featured query', query)
      break

    default:
      // console.log('default', query)
      break
  }

  delete query.type
  // console.log('context.params.pipeline', JSON.stringify(context.params.pipeline, null, 4))

  return context
}
