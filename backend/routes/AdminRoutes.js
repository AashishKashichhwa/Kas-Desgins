import express from 'express'
import getUser from '../controllers/Admin.js'
import isAdmin from '../middlewares/VerifyToken.js'

const AdminRoutes = express.Router()
AdminRoutes.get('/getuser',isAdmin, getUser)


export default AdminRoutes