import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../services/notificationService';
import { setNotifications } from '../redux/notificationsSlice';
import AdminSidebar from './AdminSidebar';
import '../assets/styles/Notifications.css'; // Use shared CSS
import { put, deleteUser as del } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';

const AdminNotification = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.Auth.user);
  const notifications = useSelector((state) => state.notifications.notifications);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!admin || !admin._id) {
        console.warn('Admin user not loaded yet.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getNotifications();

        if (response.status === 200) {
          dispatch(setNotifications(response.data.notifications));
        } else {
          console.error('Failed to fetch notifications:', response.status);
          toast.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching admin notifications:', error);
        toast.error('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [admin, dispatch]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await put(`/api/notifications/${notificationId}/read`);
      if (response.status === 200) {
        const updatedNotifications = notifications.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        );
        dispatch(setNotifications(updatedNotifications));
        toast.success('Notification marked as read');
      } else {
        console.error('Failed to mark as read:', response.status);
        toast.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Error marking notification as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        const response = await del(`/api/notifications/${notificationId}`);
        if (response.status === 200) {
          const updatedNotifications = notifications.filter(n => n._id !== notificationId);
          dispatch(setNotifications(updatedNotifications));
          toast.success('Notification deleted successfully');
        } else {
          console.error('Failed to delete notification:', response.status);
          toast.error('Failed to delete notification');
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        toast.error('Error deleting notification');
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification._id);
    }
    navigate(`/admin/bookings/${notification.bookingId}`);
  };

  if (loading) {
    return (
      <div className="admin-page-container dark-theme">
        <AdminSidebar />
        <main className="main-content">
          <div className="admin-container">
            <p>Loading notifications...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-page-container dark-theme">
      <AdminSidebar />
      <main className="main-content">
        <div className="admin-container">
          <div className="manage-users-header">
            <h2>Notifications</h2>
          </div>

          <ul className="notification-list">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification._id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                  <span
                    className="notification-link"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.message} - {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteNotification(notification._id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>No notifications available.</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminNotification;