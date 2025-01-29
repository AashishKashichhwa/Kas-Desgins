import express from 'express'
import {getUser, deleteUser} from '../controllers/Admin.js'
import {isAdmin} from '../middlewares/VerifyToken.js'

const AdminRoutes = express.Router()
AdminRoutes.get('/getuser',isAdmin, getUser)
AdminRoutes.delete('/deleteuser/:id',isAdmin, deleteUser)




export default AdminRoutes