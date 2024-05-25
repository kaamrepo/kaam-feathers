import { ObjectId } from 'mongodb'
export const getJobsAsPerPreference = async (context) => {
  const { query } = context?.params
  console.log("in the getJobsPreferecne hook",query);
  // switch (query?.type) {
  //   case 'nearby':
  //     console.log('in the case nearby', query)
  //     const { coordinates, text } = query

  //     // Clean up the query parameters
  //     delete query.coordinates
  //     delete query.text
  //     delete query.type

  //     // Initialize the pipeline
  //     context.params.pipeline = []

  //     // Handle geolocation filtering
  //     if (coordinates) {
  //       context.params.pipeline.push({
  //         $geoNear: {
  //           near: {
  //             type: 'Point',
  //             coordinates: coordinates
  //           },
  //           distanceField: 'distanceInMeter',
  //           spherical: true,
  //           maxDistance: 100000 // Set the maximum distance in meters (100km)
  //         }
  //       })
  //     }

  //     // Handle text search
  //     if (text) {
  //       context.params.query = {
  //         $or: [
  //           { jobtitle: { $regex: text, $options: 'i' } },
  //           { description: { $regex: text, $options: 'i' } }
  //         ]
  //       }
  //     }

  //     // Add the $feathers stage to the pipeline
  //     context.params.pipeline.push({
  //       $feathers: context.params.query
  //     })

  //     // Remove the pipeline if it's empty
  //     if (context.params.pipeline.length <= 0) {
  //       delete context.params.pipeline
  //     }
  //     break

  //   case 'recommended':
  //     // Add your logic for recommended jobs
  //     console.log('recommended query', query)
  //     break

  //   case 'featured':
  //     // Add your logic for featured jobs
  //     console.log('featured query', query)
  //     break

  //   default:
  //     // Add your default logic
  //     console.log('default', query)
  //     break
  // }
  if (query && query !== undefined) {
    query['$sort'] = !query.sortAsc && !query.sortDesc ? { createdAt: -1 } : {}
    Object.keys(context.params.query).forEach((key) => {
      switch (key) {
        case 'select':
          query['$select'] = Array.isArray(query['select']) ? query['select'] : [query['select']]
          delete query.select
          break
        case 'limit':
          query['$limit'] = query['limit']
          delete query['limit']
          break
        case 'skip':
          query['$skip'] = query['skip']
          delete query['skip']
          break
        case 'sortDesc':
          Array.isArray(query['sortDesc'])
            ? query['sortDesc'].forEach((field) => {
                query.$sort[`${field}`] = -1
              })
            : (() => {
                query['$sort'] = { ...query['$sort'] }
                query.$sort[`${query.sortDesc}`] = -1
              })()
          delete query['sortDesc']
          break
        case 'sortAsc':
          Array.isArray(query['sortAsc'])
            ? query['sortAsc'].forEach((field) => {
                query.$sort[`${field}`] = 1
              })
            : (() => {
                query['$sort'] = { ...query['$sort'] }
                query.$sort[`${query.sortAsc}`] = 1
              })()
          delete query['sortAsc']
          break
        case 'isExists':
          Array.isArray(query['isExists'])
            ? query['isExists'].forEach((field) => {
                query[`${field}`] = { $exists: true }
              })
            : (() => {
                query[`${query['isExists']}`] = { $exists: true }
              })()
          delete query['isExists']
          break
        case 'isNotExists':
          Array.isArray(query['isNotExists'])
            ? query['isNotExists'].forEach((field) => {
                query[`${field}`] = { $exists: false }
              })
            : (() => {
                query[`${query['isNotExists']}`] = { $exists: false }
              })()
          delete query['isNotExists']
          break
        case 'paginate':
          if (query['paginate'] == 'false') {
            context.params.paginate = false
          } else if (query['paginate'] === false) {
            context.params.paginate = false
          }
          delete context.params.query['paginate']
          break
        case 'excludeIds':
          if (Array.isArray(query['excludeIds'])) {
            query['_id'] = { $nin: query['excludeIds'].map((id) => new ObjectId(id)) }
          } else if (query['excludeIds']) {
            query['_id'] = { $nin: [new ObjectId(query['excludeIds'])] }
          }
          delete query['excludeIds']
          break
        case 'excludeIdsInJobSearch':
          console.log("in the excluedInJobSearch case");
          if (Array.isArray(query['excludeIdsInJobSearch'])) {
            query['createdby'] = { $nin: query['excludeIdsInJobSearch'].map((id) => new ObjectId(id)) }
          } else if (query['excludeIdsInJobSearch']) {
            query['createdby'] = { $nin: [new ObjectId(query['excludeIdsInJobSearch'])] }
          }
          delete query['excludeIdsInJobSearch']
          break
        case 'includeIds':
          if (Array.isArray(query['includeIds'])) {
            query['_id'] = { $in: query['includeIds'].map((id) => new ObjectId(id)) }
          } else if (query['includeIds']) {
            query['_id'] = { $in: [ObjectId(query['includeIds'])] }
          }
          delete query['includeIds']
          break
        default:
          break
      }
    })
    delete query['type']
    console.log("in the getPreference hook last", context.params.query);

    return context
  }
}
