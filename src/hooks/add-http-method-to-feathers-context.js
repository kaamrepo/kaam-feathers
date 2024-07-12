import { HttpMethods } from '../constant/http-methods.js'

export const addHttpMethodToFeathersContext = async (context, next) => {
  const httpMethod = HttpMethods[context.method]
  console.log('🚀 ~ addHttpMethodToFeathersContext ~ httpMethod:', httpMethod)
  await next()
}
