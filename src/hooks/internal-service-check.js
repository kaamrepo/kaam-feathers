import { NotFound } from '@feathersjs/errors'
import { HttpMethods } from '../constant/http-methods.js'

export const checkIsInternalService = async (context, next) => {
  console.log()
  if (context.params.provider !== 'internal') {
    throw new NotFound(`Cannot ${HttpMethods[context.method]} /${context.path}`)
  }
  return context
}
