import { ObjectID } from 'mongodb';

export const searchHook = async (hook) => {
  let query = hook.params.query;
  console.log('in the SEARCH hook query Entered', query);

  if (query && query !== undefined) {
    Object.keys(query).forEach((key) => {
      switch (key) {
        case 'categories':
          if (Array.isArray(query['categories'])) {
            query['tags'] = query['categories'].map((category) => new ObjectID(category));
          } else if (query['categories']) {
            query['tags'] = [new ObjectID(query['categories'])];
          }
          delete query['categories'];
          break;
        default:
          break;
      }
    });

    // Convert to the required query format
    if (query['tags']) {
      query['tags'] = { $in: query['tags'] };
    }

    hook.params.query = query;
    console.log('hoook.params.query at LAST in search', hook.params.query);
  }
  return hook;
}
