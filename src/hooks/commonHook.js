import { ObjectId } from 'mongodb'
export const commonHook = (hook) => async (hook) => {
  let query = hook.params.query
  if (query && query !== undefined) {
    query['$sort'] = !query.sortAsc && !query.sortDesc ? { createdAt: -1 } : {}
    Object.keys(hook.params.query).forEach((key) => {
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
        case 'excludeIds':
          const exclude = query.exclude
          if (Array.isArray(query['excludeIds']) && exclude) {
            query[exclude] = { $nin: query['excludeIds'].map((id) => new ObjectId(id)) }
          } else if (query['excludeIds']) {
            query['exclude'] = { $nin: [new ObjectId(query['excludeIds'])] }
          }
          delete query['excludeIds']
          delete query['exclude']
          break
        case 'includeIds':
          if (Array.isArray(query['includeIds'])) {
            query['_id'] = { $in: query['includeIds'].map((id) => new ObjectId(id)) }
          } else if (query['includeIds']) {
            query['_id'] = { $in: [ObjectId(query['includeIds'])] }
          }
          delete query['includeIds']
          break
        case 'isActive':
          if (query['isActive'] == 'false') {
            hook.params.isActive = false
          } else if (query['isActive'] === 'true') {
            hook.params.isActive = true
          }
          delete hook.params.query['isActive']
          break
          case 'activeforjobs':
            if (query['activeforjobs'] == 'false') {
              hook.params.query.activeforjobs = false
            } else if (query['activeforjobs'] === 'true') {
              hook.params.query.activeforjobs = true
            }
            delete hook.params.query['activeforjobs']
            break
        case 'paginate':
          if (query['paginate'] == 'false') {
            hook.params.paginate = false
          } else if (query['paginate'] === false) {
            hook.params.paginate = false
          } else {
          }
          delete hook.params.query['paginate']
        default:
          break
      }
    })
    delete query['type']
    hook.params.query = query
  }
  return hook
}
