import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

export default function PublicLayout() {
    const user = useSelector((state) => state.Auth.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/');  // Redirect admin to the admin panel
            } else {
                navigate('/');      // Redirect non-admin users to home
            }
        }
    }, [user, navigate]); // ✅ Fix: Add navigate

    return <Outlet />;
}
