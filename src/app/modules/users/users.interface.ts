/* eslint-disable prettier/prettier */
import { Model } from 'mongoose'

// User interface
export type IUser = {
  _id: string
  name: string
  email: string
  role: 'user'
  password: string
  passwordConfirm: string | undefined
  passwordChangedAt?: Date
}

export type ILoginUser = {
  email: string
  password: string
}

// Response after user login
export type ILoginUserResponse = {
  email: string
  accessToken: string
  refreshToken?: string
}

// Response after refreshing access token
export type IRefreshTokenResponse = {
  accessToken: string
}

// The IUserModel interface combines the Model interface with custom methods
export type IUserModel = Model<IUser> & {
  // Method to check if a user exists by email
  isUserExist(email: string): Promise<Pick<IUser, '_id' | 'name' | 'email' | 'role' | 'password'>>

  // Method to check if a given password matches the saved password
  isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>
}
