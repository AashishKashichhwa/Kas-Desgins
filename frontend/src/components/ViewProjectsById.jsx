// frontend/src/components/ViewProjectsById.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../services/ApiEndpoint';
import '../assets/styles/ViewProjectsById.css'; // Ensure this CSS supports a gallery

const ViewProjectsById = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await get(`/api/projects/${id}`);
                setProject(res.data);
            } catch (err) {
                console.error("Error fetching project by ID:", err);
                setError("Failed to load project details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return <p>Loading project details...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!project) return <p>Project not found.</p>;

    return (
        <div className="project-details-container">
            <h2 className="project-detail-title">{project.name}</h2>
            <div className="project-details-content">
                <div className="project-info">
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Category:</strong> {project.category}</p>
                </div>

                {project.images && project.images.length > 0 ? (
                    // Multiple Images
                    <div className="project-image-gallery">
                        <h3>Images:</h3>
                        <div className="gallery-grid">
                            {project.images.map((imgPath, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:4000${imgPath}`}
                                    alt={`${project.name} - Image ${index + 1}`}
                                    className="project-gallery-image"
                                />
                            ))}
                        </div>
                    </div>
                ) : project.image ? (
                    // Single Image (Legacy Support)
                    <div className="project-image-gallery">
                        <h3>Image:</h3>
                        <img src={`http://localhost:4000${project.image}`} alt={project.name} className="project-gallery-image" />
                    </div>
                ) : (
                    // No Image
                    <h1>No Images</h1>
                )}
            </div>

            {project.project3DVisualization && (
                <div className="project-3d-visualization">
                    <h3>3D Visualization:</h3>
                    <div
                        className="project-iframe-container"
                        dangerouslySetInnerHTML={{ __html: project.project3DVisualization }}
                    />
                </div>
            )}
        </div>
    );
};

export default ViewProjectsById;