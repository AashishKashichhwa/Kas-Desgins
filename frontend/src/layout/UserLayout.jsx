import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UserLayout() {
    const user = useSelector((state) => state.Auth.user);
    const navigate = useNavigate(); // ✅ Fix spelling here

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]); // ✅ Fix: Add navigate to the dependency array

    return <Outlet />;
}
