// For more information about this file see https://dove.feathersjs.com/guides/cli/logging.html
import { createLogger, format, transports } from 'winston'

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(
    format.splat(),
    format.simple(),
    format.timestamp(),
    format.printf(info => `\n${ info.level }: ${ [info.timestamp] }: ${ info.message }`)
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.File({ level: 'error', filename: 'logs/error.log' }),
  ]
})
