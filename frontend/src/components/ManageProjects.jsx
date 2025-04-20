import React from 'react';
import AdminSidebar from './AdminSidebar';
import ViewProjects from './ViewProjects';
import { Link } from 'react-router-dom';
import '../assets/styles/AdminHome.css';

const ManageProjects = () => {
    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <main className="main-content">
                <div className="admin-container">
                <div className="manage-users-header">
                    <h2>Manage Projects</h2>
                    <Link to="/admin/add-project">
                        <button className="addProjectButton">Add Project</button>
                    </Link>
                </div>
                    <ViewProjects />
                </div>
            </main>
        </div>
    );
};

export default ManageProjects;
