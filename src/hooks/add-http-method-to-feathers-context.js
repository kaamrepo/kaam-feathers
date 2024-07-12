import { HttpMethods } from '../constant/http-methods.js'

export const addHttpMethodToFeathersContext = async (context) => {
  context.httpMethod = HttpMethods[context.method]
  return context
}
