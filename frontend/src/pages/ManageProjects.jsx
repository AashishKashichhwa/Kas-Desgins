import React, { useEffect, useState } from 'react';
import { get } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import '../assets/styles/AdminHome.css';
import AdminSidebar from '../components/AdminSidebar';
import { Link } from 'react-router-dom';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const request = await get('/api/projects');
                const response = request.data;

                if (request.status === 200) {
                    setProjects(response.projects);
                } else {
                    toast.error("Failed to fetch projects.");
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast.error("Failed to fetch projects.");
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="admin-page-container">
            <AdminSidebar />
            <main className="main-content">
                <div className="admin-container">
                    <h2>Manage Projects</h2>
                    <Link to="/admin/add-project">
                        <button>Add Project</button>
                    </Link>
                    {projects && projects.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    {/* Add other relevant project information */}
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project._id}>
                                        <td>{project.name}</td>
                                        <td>{project.description}</td>
                                        {/* Add other project details here */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No projects found.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManageProjects;