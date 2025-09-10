const app = require('./app')
const env = require('./utils/config')
const logger = require('./utils/logger')

const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`)
})

process.on('SIGTERM', () => {
  logger.warn('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    logger.info('HTTP server closed')
  })
})