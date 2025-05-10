import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications } from '../services/notificationService';
import { setNotifications } from '../redux/notificationsSlice';
import '../assets/styles/Notifications.css'

const UserNotifications = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.Auth.user);  // Get user from Redux
    const notifications = useSelector((state) => state.notifications.notifications);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user || !user._id) {
                console.warn('User not loaded yet.');
                return;
            }

            try {
                // Fetch notifications for the current user
               const response = await getNotifications();  //Pass in nothing since backend handles it

                if (response.status === 200) {
                    dispatch(setNotifications(response.data.notifications)); // Access the notifications array from the response
                } else {
                    console.error('Failed to fetch notifications:', response.status);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [dispatch, user]);

    return (
        <div className="notifications-page">
            {/* <h1>Your Notifications</h1> */}
            {notifications && notifications.length > 0 ? (
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={notification._id} className={notification.read ? 'read' : 'unread'}> {/* Use _id as key */}
                            {notification.message} - {new Date(notification.createdAt).toLocaleString()}
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