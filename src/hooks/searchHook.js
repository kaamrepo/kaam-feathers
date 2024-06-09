import { ObjectId } from 'mongodb'
export const searchHook = (hook) => async (hook) => {
  let query = hook.params.query
  console.log('in the SEARCH hook query Entered', query)
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
        case 'wildString':
          query.wildString = query.wildString.trim()
          const words = query.wildString.split(' ')
          // Single word search
          const regex = new RegExp(`^${query.wildString}`, 'i')
          query['$or'] = [
            { firstname: regex },
            { lastname: regex },
            { aboutme: regex },
          ]
          delete query['wildString']
          break
        default:
          break
      }
    })
    hook.params.query = query
    console.log('hoook.params.query at LAST', hook.params.query)
  }
  return hook
}