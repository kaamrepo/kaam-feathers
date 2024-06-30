import { ObjectId } from 'mongodb'
export const searchHook = (hook) => async (hook) => {
  let query = hook.params.query
  if (query && query !== undefined) {
    Object.keys(hook.params.query).forEach((key) => {
      switch (key) {
        case 'categories':
          if (Array.isArray(query['categories'])) {
            query['tags'] = { $in: query['categories'].map((category) => new ObjectId(category)) }
          } else if (query['categories']) {
            query['tags'] = { $in: [ObjectId(query['categories'])] }
          }
          delete query['categories']
          break
        case 'wildStringForJobs':
          query.wildStringForJobs = query.wildStringForJobs.trim()
          const regexForJobs = new RegExp(`^${query.wildStringForJobs}`, 'i')
          query['$or'] = [{ jobtitle: regexForJobs }, { description: regexForJobs }]
          delete query['wildStringForJobs']
          break
        case 'wildString':
          query.wildString = query.wildString.trim()
          const words = query.wildString.split(' ')
          // Single word search
          const regex = new RegExp(`^${query.wildString}`, 'i')
          query['$or'] = [{ firstname: regex }, { lastname: regex }, { aboutme: regex }]
          delete query['wildString']
          break
        case 'location':
          delete query['location']
          break

        default:
          break
      }
    })
    hook.params.query = query
  }
  return hook
}
