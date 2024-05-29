import { COMMON_ENDPOINT } from "../../constant/endpoints.js"

export const categoriesPath = `${ COMMON_ENDPOINT }categories`

export const categoriesMethods = ['find', 'get', 'create', 'patch', 'remove']


export const categoriesClient = (client) => {
  const connection = client.get('connection')

  client.use(categoriesPath, connection.service(categoriesPath), {
    methods: categoriesMethods
  })
}
