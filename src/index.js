import { app } from './app.js'
import { logger } from './logger.js'

const port = process.env.KAAM_PORT;
const host = process.env.KAAM_HOST;
process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${ host }:${ port }`)
  logger.info(`Feathers app listening on http://${ host }:${ port }`)
})
