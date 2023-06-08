const errors = require('@feathersjs/errors')

const DEFAULT_ERROR_MSG = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error. Something went wrong.',
  USER_NOT_FOUND: 'username: %username% does not exist',
  ESCALATION_LEVEL_ALREADY_EXISTS: 'Escalation %escalationLevel% already exist',
  INDUCTEE_WITH_FN_LN_CN_ALREADY_EXISTS:
    'Category: %category% with firstName lastName contactNumber already exist',
  INVALID_REQUEST: 'Invalid Request',
  CONFLIC_OF_VALUES: 'Conflict Of Values: %value% already exists.',
  EMERGENCY_CONTACT: 'Emergency Contact already exist',
  AREA: '%areatype% with same name already exist',
  WORKPEMITERR: 'Checkers Not Found.',
  ANSWERSHEET_EXISTS: 'This checklist is already %status% by another reviewer.'
}

const HTTP_ERRORS = {
  BadRequest: 'BadRequest',
  NotAuthenticated: 'NotAuthenticated',
  PaymentError: 'PaymentError',
  Forbidden: 'Forbidden',
  NotFound: 'NotFound',
  MethodNotAllowed: 'MethodNotAllowed',
  NotAcceptable: 'NotAcceptable',
  Timeout: 'Timeout',
  Conflict: 'Conflict',
  Unprocessable: 'Unprocessable',
  GeneralError: 'GeneralError',
  NotImplemented: 'NotImplemented',
  Unavailable: 'Unavailable'
}

const processErrorText = (errorText, value) => {
  if (value) {
    return errorText.replace(/%\w+%/g, value)
  }

  return errorText
}

/**
 * @param {string} httpErrorType
 * @param {string} messageCode
 * @param {object} data
 * @param {string} customMessage
 * HTTP Error Types -
 * BadRequest: 400,
 * NotAuthenticated: 401,
 * PaymentError: 402,
 * Forbidden: 403,
 * NotFound: 404,
 * MethodNotAllowed: 405,
 * NotAcceptable: 406,
 * Timeout: 408,
 * Conflict: 409,
 * Unprocessable: 422,
 * GeneralError: 500,
 * NotImplemented: 501,
 * Unavailable: 503
 */
const handleError = (httpErrorType, defaultErrorMessage, data, customMessage) => {
  let errorText = customMessage
  let errorType = 'GeneralError'

  if (!customMessage) {
    errorType = httpErrorType
    errorText = defaultErrorMessage
  }

  throw new errors[errorType](processErrorText(errorText, data?.value), data)
}

module.exports = { handleError, HTTP_ERRORS, DEFAULT_ERROR_MSG }
