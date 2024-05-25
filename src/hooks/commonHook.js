import { ObjectId } from 'mongodb'
export const commonHook = (hook) => async (hook) => {
  let query = hook.params.query
  console.log("in the common hook query",query);
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
        case 'paginate':
          if (query['paginate'] == 'false') {
            hook.params.paginate = false
          } else if (query['paginate'] === false) {
            hook.params.paginate = false
          }
          delete hook.params.query['paginate']
          break
        case 'excludeIds':
          if (Array.isArray(query['excludeIds'])) {
            query['_id'] = { $nin: query['excludeIds'].map((id) => new ObjectId(id)) }
          } else if (query['excludeIds']) {
            query['_id'] = { $nin: [new ObjectId(query['excludeIds'])] }
          }
          delete query['excludeIds']
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
    hook.params.query = query
  }
  return hook
}
