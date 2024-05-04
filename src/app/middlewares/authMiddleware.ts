/* eslint-disable prettier/prettier */
import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import ApiError from '../../error/ApiError'
import { User } from '../modules/users/users.model'
import { jwtHelper } from '../../common/jwtHelper'

const authMiddleware =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get authorization token from the request header
      const authorizationHeader = req.headers.authorization

      if (!authorizationHeader) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid authorization token')
      }

      const token = authorizationHeader.replace('Bearer ', '')

      try {
        // Verify the token
        const verifiedUser = jwtHelper.verifyToken(token)

        // Check if required roles are specified and verify user's role
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions')
        }

        // Attach the verified user payload to the request object
        const decodedUser = await User.findOne({ _id: verifiedUser.id })
        // console.log(decodedUser);
        req.body.user = decodedUser
        next()
      } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
      }
    } catch (error) {
      next(error)
    }
  }

export default authMiddleware
