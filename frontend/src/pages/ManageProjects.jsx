import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import ViewProjects from './ViewProjects';
import { Link } from 'react-router-dom';
import '../assets/styles/AdminHome.css';

const ManageProjects = () => {
    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <main className="main-content">
                <div className="admin-container">
                    <h2>Manage Projects</h2>
                    <Link to="/admin/add-project">
                        <button className="add-project-button">Add Project</button>
                    </Link>

                    <ViewProjects />
                </div>
            </main>
        </div>
    );
};

export default ManageProjects;
