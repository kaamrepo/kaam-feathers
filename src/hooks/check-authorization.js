import { HttpMethods } from '../constant/http-methods.js'
import { logger } from '../logger.js'
import { Forbidden } from '@feathersjs/errors'

export const authorizeApiRequest = async (context, next) => {
  const {
    method,
    path,
    params: {
      authentication: { payload },
      user
    }
  } = context

  if (!user.isactive) {
    throw new Forbidden('Access denied')
  }
  const { permissionIds, apiScopes } = payload

  if (!permissionIds?.length || !apiScopes?.length) {
    throw new Forbidden("You don't have access to this resource")
  }

  const checkAuthDto = {
    httpMethod: HttpMethods[method],
    urlToValidate: '/' + path
  }

  const isAuthorized = checkScopesMatch(apiScopes, path, checkAuthDto)

  if (!isAuthorized) {
    throw new Forbidden("You don't have access to this resource")
  }
  await next()
}

function checkScopesMatch(scopes, urlToValidate, checkAuthDto) {
  for (const aScope of scopes) {
    logger.debug('===================================================================')
    logger.debug('aScope --> ' + aScope)

    const [scopeMethod, scopeEndPoint] = aScope.split('::')
    if (scopeMethod === 'ALL' || scopeMethod === checkAuthDto.httpMethod) {
      const regex = new RegExp(
        scopeEndPoint.replaceAll('?', '\\?').replaceAll('permissionEntity.', 'permissionEntity\\.')
      )
      logger.debug('Request endpoint ' + urlToValidate)
      logger.debug('Scope EndPoint ' + regex)
      logger.debug('Scope Method ' + scopeMethod)

      const isMatched = regex.test(urlToValidate)
      logger.debug('isMatched --> ' + isMatched)
      logger.debug('===================================================================')

      if (isMatched) {
        return true
      }
    }
  }

  return false
}
