import { ObjectId } from 'mongodb'
export const commonHook = (hook) => async (hook) => {
  let query = hook.params.query
  console.log("in the common hook query Entered",query);
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
            const exclude = query.exclude;
            if (Array.isArray(query['excludeIds']) && exclude) {
              query[exclude] = { $nin: query['excludeIds'].map((id) => new ObjectId(id)) }
            } else if (query['excludeIds']) {
              query['exclude'] = { $nin: [new ObjectId(query['excludeIds'])] }
            }
            delete query['excludeIds']
            delete query['exclude']
            break
            break;
        case 'includeIds':
          if (Array.isArray(query['includeIds'])) {
            query['_id'] = { $in: query['includeIds'].map((id) => new ObjectId(id)) }
          } else if (query['includeIds']) {
            query['_id'] = { $in: [ObjectId(query['includeIds'])] }
          }
          delete query['includeIds']
          break
          case 'categories':
            if (Array.isArray(query['categories'])) {
              const categoryRegexes = query['categories'].map(category => new RegExp(category, 'i'));
              query['tags'] = { $in: categoryRegexes };
            } else if (query['categories']) {
              const categoryRegex = new RegExp(query['categories'], 'i');
              query['tags'] = { $in: categoryRegex };
            }
            delete query['categories'];
            break;
          
        default:
          break
      }
    })
    delete query['type']
    hook.params.query = query
    console.log("hoook.params.query",hook.params.query);
  }
  return hook
}
