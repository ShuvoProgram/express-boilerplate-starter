/* eslint-disable prettier/prettier */
import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import httpStatus from 'http-status'
import helmet from 'helmet'
import compression from 'compression'
import router from './app/routes'
import globalErrorHandler from './app/middlewares/globalErrorHandler'

const app: Application = express()

// Middleware
app.disable('x-powered-by')
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.REQUEST_LIMIT || '100kb',
  }),
)

//development routes
app.use('/api/v1', router)

// Testing route
app.get('/api/v1', async (req: Request, res: Response) => {
  res.send('Working Successfully')
})

// Global error handler (should be placed after route handlers)
app.use(globalErrorHandler)

// Handle not found routes (should be placed at the end)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessage: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})

export default app
