import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications } from '../services/notificationService';
import { setNotifications } from '../redux/notificationsSlice';
import AdminSidebar from './AdminSidebar';
import '../assets/styles/AdminHome.css';

const AdminNotification = () => {
    const dispatch = useDispatch();
    const admin = useSelector((state) => state.Auth.user);
    const notifications = useSelector((state) => state.notifications.notifications);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!admin || !admin._id) {
                console.warn('Admin user not loaded yet.');
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
                console.error('Error fetching admin notifications:', error);
            }
        };

        fetchNotifications();
    }, [admin, dispatch]);

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <main className="main-content">
                <div className="admin-container">
                    <div className="manage-users-header">
                        <h2>Notifications</h2>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications && notifications.length > 0 ? (
                                notifications.map((notification, index) => (
                                    <tr key={notification._id}>  {/* Use _id as key */}
                                        <td>{index + 1}</td>
                                        <td>{notification.message}</td>
                                        <td>
                                            <span className={notification.read ? 'read' : 'unread'}>
                                                {notification.read ? 'Read' : 'Unread'}
                                            </span>
                                        </td>
                                        <td>{new Date(notification.createdAt).toLocaleString()}</td> {/* Display createdAt */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No notifications available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminNotification;