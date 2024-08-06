import { HttpMethods } from '../constant/http-methods.js'
import { logger } from '../logger.js'
export const addHttpMethodToFeathersContext = async (context, next) => {
  const httpMethod = HttpMethods[context.method]
  logger.debug(`🚀 AddHttpMethodToFeathersContext  httpMethod: ${httpMethod}`)
  await next()
}
