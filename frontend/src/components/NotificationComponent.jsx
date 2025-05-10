// src/components/AdminNotification.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setNotifications, //Import this
  fetchNotifications,
  addNotification,
  markAllAsRead,
  clearNotifications,
} from '../redux/notificationSlice';

const NotificationComponent = ({ userId }) => {
    const dispatch = useDispatch();
    const { list: notifications, unreadCount, status, error } = useSelector((state) => state.notifications); //Destructure state

    useEffect(() => {
        if (userId) {
            //dispatch(fetchNotifications(userId)); Replace this
            const fetchNotification = async () => {
                try{
                  const response = await axios.get(`/api/notifications?userId=${userId}`); // Adjust URL
                  dispatch(setNotifications(response.data));
                } catch(err){
                   console.log(err)
                }
            }
            fetchNotification();
        }
    }, [dispatch, userId]);

        //Optional Loading and Error Display
        if (status === 'loading') {
            return <div>Loading notifications...</div>;
        }

        if (status === 'failed') {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                <h2>Notifications ({unreadCount} unread)</h2>
                <button onClick={() => dispatch(markAllAsRead())}>Mark All as Read</button>
                <button onClick={() => dispatch(clearNotifications())}>Clear All</button>

                <ul>
                    {notifications.map((n) => (
                        <li key={n._id || n.id}>
                            {n.message} {n.read ? '(read)' : '(unread)'}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    export default NotificationComponent;