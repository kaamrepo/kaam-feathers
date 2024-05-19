export const userQueryfilters = () => async (hook) => {
  let query = hook.params.query
  if (query && query !== undefined) {
    Object.keys(hook.params.query).forEach((key) => {
      switch (key) {
        case 'name':
          query.name = query.name.trim()
          if (query.name.includes(' ')) {
            let fullName = query.name.split(' ')
            query['$and'] = [
              {
                $or: [
                  {
                    firstname: new RegExp(`^${fullName[0]}`, 'i') || ''
                  },
                  {
                    lastname: new RegExp(`^${fullName[0]}`, 'i') || ''
                  }
                ]
              },
              {
                $or: [
                  {
                    firstname: new RegExp(`^${fullName[1]}`, 'i') || ''
                  },
                  {
                    lastname: new RegExp(`^${fullName[1]}`, 'i') || ''
                  }
                ]
              }
            ]
          } else {
            query['$or'] = [
              {
                firstname: new RegExp(`^${query.name}`, 'i') || ''
              },
              {
                lastname: new RegExp(`^${query.name}`, 'i') || ''
              }
            ]
          }
          delete query['name']
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
