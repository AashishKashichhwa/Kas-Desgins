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
            <h2>{project.name}</h2>
            <p><strong>Category:</strong> {project.category}</p>
            <p>{project.description}</p>
            {project.image && (
                <img
                    src={`http://localhost:4000${project.image}`}
                    alt={project.name}
                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
            )}
            {project.project3DVisualization && (
                <div
                    className="iframe-container"
                    dangerouslySetInnerHTML={{ __html: project.project3DVisualization }}
                />
            )}
        </div>
    );
};

export default ViewProjectsById;
