import { app } from './app.js'
import { logger } from './logger.js'

const port = app.get('kaam_port')
const host = app.get('kaam_host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${ host }:${ port }`)
})
