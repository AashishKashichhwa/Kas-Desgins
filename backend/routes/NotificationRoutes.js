// backend/routes/NotificationRoutes.js
import express from 'express';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/NotificationController.js';
import { isUser, isAdmin } from '../middlewares/VerifyToken.js'; // Import your auth middleware

const router = express.Router();

// Protect these routes with authentication middleware
router.get('/', isUser, getNotifications); // Get notifications for user or admin
router.put('/:id/read', isUser, markAsRead);    // Mark a notification as read
router.delete('/:id', isUser, deleteNotification); // Delete a notification

export default router;