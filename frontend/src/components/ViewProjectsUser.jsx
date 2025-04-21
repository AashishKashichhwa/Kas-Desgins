import React, { useEffect, useState } from 'react';
import { get } from '../services/ApiEndpoint';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/ViewProjects.css';

const ViewProjectsUser = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await get('/api/projects');
            setProjects(res.data);
        };
        fetchProjects();
    }, []);

    const handleProjectClick = (id) => {
        navigate(`/admin/projects/${id}`);
    };

    return (
        <div className="project-grid-container">
            {projects.map(project => (
                <div
                    key={project._id}
                    className="project-card"
                    onClick={() => handleProjectClick(project._id)}
                >
                    <img
                        src={`http://localhost:4000${project.image}`}
                        alt={project.name}
                        className="project-image"
                    />
                    <div className="project-infos">
                        <div className="project-name">{project.name}</div>
                        {/* Display the category instead of description */}
                        <div className="project-category">{project.category}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ViewProjectsUser;
