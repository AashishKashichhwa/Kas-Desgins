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
                    <ProjectCard key={project._id} project={project} onClick={handleProjectClick} />
                ))}
            </div>
        );
    };
    
    const ProjectCard = ({ project, onClick }) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
        useEffect(() => {
            let intervalId;
    
            const imageCount = project.images ? project.images.length : 0;
            if (imageCount > 1) {
                intervalId = setInterval(() => {
                    setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageCount);
                }, 3000);
            }
    
            return () => clearInterval(intervalId); // Clean up even if there's one image
        }, [project.images]);
    
        return (
            <div className="project-card" onClick={() => onClick(project._id)}>
                <div className="project-image-container">
                    {project.images && project.images.length > 0 ? (
                        // Multiple Images
                        <img
                            src={`http://localhost:4000${project.images[currentImageIndex]}`}
                            alt={project.name}
                            className="project-image"
                        />
                    ) : project.image ? (
                        // Single Image (Legacy Support)
                        <img
                            src={`http://localhost:4000${project.image}`}
                            alt={project.name}
                            className="project-image"
                        />
                    ) : (
                        // No Image
                        <div className="project-image-placeholder">No Image</div>
                    )}
                </div>
                <div className="project-infos">
                    <div className="project-name">{project.name}</div>
                    <div className="project-category">{project.category}</div>
                </div>
            </div>
        );
};

export default ViewProjectsUser;
