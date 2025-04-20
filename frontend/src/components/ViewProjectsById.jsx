import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../services/ApiEndpoint';
import '../assets/styles/ViewProjectsById.css';

const ViewProjectsById = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await get(`/api/projects/${id}`);
                setProject(res.data);
            } catch (error) {
                console.error("Error fetching project by ID:", error);
            }
        };
        fetchProject();
    }, [id]);

    if (!project) return <p>Loading project details...</p>;

    return (
        <div className="project-details">
            <div className="project-top">
                <div className="project-info">
                    <p><strong>Name:</strong> {project.name}</p>
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Category:</strong> {project.category}</p>
                </div>
                {project.image && (
                    <div className="project-image-container">
                        <img
                            src={`http://localhost:4000${project.image}`}
                            alt={project.name}
                            className="project-image"
                        />
                    </div>
                )}
            </div>

            {project.project3DVisualization && (
                <div
                    className="project-iframe-container"
                    dangerouslySetInnerHTML={{ __html: project.project3DVisualization }}
                />
            )}
        </div>
    );
};

export default ViewProjectsById;
