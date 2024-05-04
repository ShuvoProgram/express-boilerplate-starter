/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, Request, Response } from 'express'
import morgan from 'morgan'
import config from '../../config'
import app from '../../app'
import ApiError from '../../error/ApiError'
import { ZodError } from 'zod'
import handleValidationError from '../../error/HandleValidationError'
import handleZodError from '../../error/handleZodError'
import handleCastError from '../../error/handleCastError'
import HandleMongoServerError from '../../error/HandleMongooseServerError'
import { IGenericErrorMessage } from './../../interface/error'

const isDevelopment = config.env === 'development'

const logError = (error: any) => {
  if (isDevelopment) {
    app.use(morgan('dev'))
  } else {
    console.error(`🐱‍🏍 globalErrorHandler ~~`, error)
  }
}

const handleSpecificErrors = (error: any) => {
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorMessage: IGenericErrorMessage[] = []

  if (error instanceof ZodError) {
    ;({ statusCode, message, errorMessage } = handleZodError(error))
  } else if (error.name === 'ValidationError') {
    ;({ statusCode, message, errorMessage } = handleValidationError(error))
  } else if (error.name === 'MongoServerError') {
    ;({ statusCode, message, errorMessage } = HandleMongoServerError(error))
  } else if (error.name === 'CastError') {
    ;({ statusCode, message, errorMessage } = handleCastError(error))
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode
    message = error.message
    errorMessage = error.message ? [{ path: '', message: error.message }] : []
  } else if (error instanceof Error) {
    message = error.message || message
    errorMessage = error.message ? [{ path: '', message: error.message }] : []
  }

  return { statusCode, message, errorMessage }
}

const globalErrorHandler: ErrorRequestHandler = (error: any, req: Request, res: Response) => {
  logError(error)

  const { statusCode, message, errorMessage } = handleSpecificErrors(error)

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: isDevelopment ? error.stack : undefined,
  })
}

export default globalErrorHandler
