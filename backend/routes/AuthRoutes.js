import express from 'express'
import {register,login, logout, checkuser} from '../controllers/Auth.js'
import {isUser} from '../middlewares/VerifyToken.js'
const AuthRoutes = express.Router()

AuthRoutes.post('/register', register)
AuthRoutes.post('/login', login)
AuthRoutes.post('/logout', logout)
AuthRoutes.get('/checkuser',isUser,checkuser )

export default AuthRoutes