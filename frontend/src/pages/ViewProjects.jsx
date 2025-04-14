import React, { useEffect, useState } from 'react';
import { get } from '../services/ApiEndpoint';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/ViewProjects.css';

const ViewProjects = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await get('/api/projects');
            setProjects(res.data);
        };
        fetchProjects();
    }, []);

    return (
        <div className="project-grid">
            {projects.map(project => (
                <div key={project._id} className="project-card" onClick={() => navigate(`/projects/${project._id}`)}>
                    <img src={`http://localhost:4000${project.image}`} alt={project.name} />
                    <h3>{project.name}</h3>
                </div>
            ))}
        </div>
    );
};

export default ViewProjects;
