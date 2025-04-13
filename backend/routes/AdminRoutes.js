// backend/routes/AdminRoutes.js
import express from 'express';
import { getUser, deleteUser, getUserById, updateUser } from '../controllers/Admin.js'; // Import updateUser
import { isAdmin } from '../middlewares/VerifyToken.js';

const AdminRoutes = express.Router();

AdminRoutes.get('/getuser', isAdmin, getUser);
AdminRoutes.get('/getuser/:id', isAdmin, getUserById);
AdminRoutes.delete('/deleteuser/:id', isAdmin, deleteUser);
AdminRoutes.put('/updateuser/:id', isAdmin, updateUser);  // Add the PUT route for updates

export default AdminRoutes;