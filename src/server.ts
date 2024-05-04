/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from 'http'
import mongoose from 'mongoose'
import config from './config'
import app from './app'

process.on('uncaughtException', (error) => {
  console.log(error)
  process.exit(1)
})

let server: Server

async function initializeDbConnection() {
  try {
    await mongoose.connect(config.database_url as string)
    console.info(`Database connection successful`)

    app.listen(config.port, () => {
      console.info(`Application listening on port ${config.port}`)
    })

    process.on('unhandledRejection', (error) => {
      if (server) {
        server.close(() => {
          // errorlogger.error(error);
          process.exit(1)
        })
      } else {
        process.exit(1)
      }
    })
  } catch (error) {
    console.error(`Database connection error: ${error}`)
  }
}

initializeDbConnection()

process.on('SIGTERM', () => {
  console.info('SIGTERM is received')
  if (server) {
    server.close()
  }
})
