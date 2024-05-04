/* eslint-disable prettier/prettier */
import express from 'express'
import { UserController } from './users.controller'

const router = express.Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)

export const UserRoutes = router
