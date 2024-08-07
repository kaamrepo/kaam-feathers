import { HttpMethods } from '../constant/http-methods.js'
import { logger } from '../logger.js'
import { Forbidden } from '@feathersjs/errors'

export const authorizeApiRequest = async (context, next) => {
  const {
    method,
    path,
    params: { authentication, user }
  } = context

  console.log('method', context?.method, 'path', context?.path)

  if (!user?.isactive) {
    throw new Forbidden('Access denied')
  }
  const { permissionIds, apiScopes } = authentication?.payload

  if (!permissionIds?.length || !apiScopes?.length) {
    throw new Forbidden("You don't have access to this resource")
  }

  const checkAuthDto = {
    httpMethod: HttpMethods[method],
    urlToValidate: '/' + path
  }

  const isAuthorized = checkScopesMatch(apiScopes, checkAuthDto)

  if (!isAuthorized) {
    throw new Forbidden("You don't have access to this resource")
  }
  await next()
}

function checkScopesMatch(scopes, checkAuthDto) {
  for (const aScope of scopes) {
    logger.debug('===================================================================')
    logger.debug('aScope --> ' + aScope)

    const [scopeMethod, scopeEndPoint] = aScope.split('::')
    if (scopeMethod === 'ALL' || scopeMethod === checkAuthDto.httpMethod) {
      const regex = new RegExp(
        scopeEndPoint.replaceAll('?', '\\?').replaceAll('permissionEntity.', 'permissionEntity\\.')
      )
      logger.debug('Request endpoint ' + checkAuthDto.urlToValidate)
      logger.debug('Scope EndPoint ' + regex)
      logger.debug('Scope Method ' + scopeMethod)

      const isMatched = regex.test(checkAuthDto.urlToValidate)
      logger.debug('isMatched --> ' + isMatched)
      logger.debug('===================================================================')

      if (isMatched) {
        return true
      }
    }
  }

  return false
}
