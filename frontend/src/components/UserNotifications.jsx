import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../services/notificationService';
import { setNotifications } from '../redux/notificationsSlice';
import '../assets/styles/Notifications.css';
import { put, deleteUser as del } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';

const UserNotifications = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);
  const notifications = useSelector((state) => state.notifications.notifications);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !user._id) {
        console.warn('User not loaded yet.');
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
        console.error('Error fetching notifications:', error);
        toast.error('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [dispatch, user]);

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

  const handleNotificationClick = async (notification) => { // Pass full notification object
    if (!notification.read) {
      await handleMarkAsRead(notification._id); // Mark as read if unread
    }
    navigate(`/userhome/bookings/${notification.bookingId}`);
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="notifications-page dark-theme">
      {notifications && notifications.length > 0 ? (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li key={notification._id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
              <span
                className="notification-link"
                onClick={() => handleNotificationClick(notification)} // Pass entire notification
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
          ))}
        </ul>
      ) : (
        <p>No notifications available.</p>
      )}
    </div>
  );
};

export default UserNotifications;