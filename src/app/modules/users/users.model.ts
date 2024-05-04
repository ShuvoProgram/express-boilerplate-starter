/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../../../config'
import { IUser, IUserModel } from './users.interface'
import { role } from './users.constant'
import validator from 'validator'

// Define the Mongoose schema
const userSchema = new mongoose.Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    role: {
      type: String,
      enum: role,
      default: 'user',
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      maxlength: 20,
      select: false,
      required: true,
      validate: [validator.isStrongPassword, 'Please provide a strong password'],
    },
    passwordConfirm: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: function (this: IUser, el: string): boolean {
          return el === this.password
        },
        message: 'Passwords do not match',
      },
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save hook for password hashing and other modifications
userSchema.pre('save', async function (next) {
  // If the password has not been modified, continue
  if (!this.isModified('password')) return next()

  const user = this

  // Hashing user password
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds), // Make sure config.bycrypt_salt_rounds is a valid number
  )

  user.passwordConfirm = undefined

  // Update passwordChangedAt if it's not set
  if (!user.passwordChangedAt) {
    user.passwordChangedAt = new Date()
  }

  next()
})

userSchema.statics.isUserExist = async function (email: string): Promise<IUser | null> {
  return await User.findOne({ email }, { name: 1, email: 1, role: 1, password: 1 })
}

// Create an instance method to check if the password is correct
userSchema.statics.isPasswordMatched = async function (givenPassword: string, savedPassword: string): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

userSchema.methods.changedPasswordAfterJwtIssued = function (jwtTimestamp: number) {
  console.log({ jwtTimestamp }, 'JWT changed')
}

// Create the User model using the schema
export const User = mongoose.model<IUser, IUserModel>('User', userSchema)
