/* eslint-disable prettier/prettier */
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import config from '../config'
import ApiError from '../error/ApiError'
import httpStatus from 'http-status'

const secret: string = config.jwt.secret || ''
const expireTime: string = config.jwt.expires_in || '30d'

const createToken = (payload: object): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  })
}

// Function to generate refresh token
const generateRefreshToken = (payload: Record<string, unknown>): string => {
  const refreshToken = jwt.sign(
    { _id: payload._id, role: payload.role },
    config.jwt.refresh_secret as string,
    { expiresIn: config.jwt.refresh_expires_in }, // Set the refresh token expiry time, e.g., '7d'
  )
  return refreshToken
}

const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ApiError(httpStatus.UNAUTHORIZED, error.message)
    }
    throw error
  }
}

export const jwtHelper = { createToken, generateRefreshToken, verifyToken }
