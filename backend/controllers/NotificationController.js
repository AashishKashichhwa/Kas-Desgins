import Notification from '../models/Notification.js';
import { io } from '../server.js'; // Import the Socket.IO instance

const createNotification = async (userId, role, bookingId, type, message) => {
   try {
       const newNotification = new Notification({
           userId,
           role, // Store the role
           bookingId,
           type,
           message
       });

       await newNotification.save();

       // Emit the notification based on the role
       if (userId) {
           io.to(`user:${userId}`).emit('newNotification', newNotification);
       } else if (role) {
           io.to(role).emit('newNotification', newNotification); // Send to the role's room
       } else {
           io.emit('newNotification', newNotification); // Broadcast to all connected clients
       }

       console.log('Notification created and emitted:', newNotification);
       return newNotification;

   } catch (error) {
       console.error('Error creating notification:', error);
       throw error;
   }
};

// backend/controllers/NotificationController.js
const getNotifications = async (req, res) => {
   try {
       // Check if user exists and has an ID
       if (!req.user || !req.user._id) {
           return res.status(401).json({ message: 'Unauthorized: User ID not found in request' });
       }

       const userId = req.user._id;
       const page = parseInt(req.query.page) || 1; // Default to page 1
       const limit = parseInt(req.query.limit) || 10; // Default to 10 notifications per page

       // Determine if the user is an admin (You'll need a way to determine this)
       const role = req.user.role; // Assuming you have a role field in your user model

       let query = {};

       if (role === 'admin' || role === 'superadmin') {
           // If the user is an admin, fetch notifications for all admins
           query = { role: role };
       } else {
           // If the user is a regular user, fetch notifications only for that user
           query = { userId: userId };
       }

       const notifications = await Notification.find(query)
           .sort({ createdAt: -1 })
           .skip((page - 1) * limit)
           .limit(limit)
           .exec();

       const totalNotifications = await Notification.countDocuments(query);

       return res.status(200).json({
           notifications,
           total: totalNotifications,
           currentPage: page,
           totalPages: Math.ceil(totalNotifications / limit),
       });
   } catch (error) {
       console.error('Error fetching notifications:', error);
       return res
           .status(500)
           .json({ message: 'Error fetching notifications', error: error.message });
   }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error marking notification as read', error: error.message });
    }
};

   const deleteNotification = async (req, res) => {
   try {
       const { id } = req.params;
       const notification = await Notification.findByIdAndDelete(id);

       if (!notification) {
           return res.status(404).json({ message: 'Notification not found' });
       }

       res.status(200).json({ message: 'Notification deleted successfully' });
   } catch (error) {
       console.error('Error deleting notification:', error);
       res.status(500).json({ message: 'Error deleting notification', error: error.message });
   }
};

export { createNotification, getNotifications, markAsRead, deleteNotification };