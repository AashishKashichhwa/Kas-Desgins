import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // <-- added useNavigate
import { get } from '../services/ApiEndpoint';
import '../assets/styles/ViewProjectsById.css'; // Ensure this CSS supports a gallery

const ViewProjectsByIdUsers = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // <-- initialize navigate
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const goToPrevious = () => {
        setCurrentImageIndex(prevIndex =>
            project.images
                ? (prevIndex - 1 + project.images.length) % project.images.length
                : 0
        );
    };

    const goToNext = () => {
        setCurrentImageIndex(prevIndex =>
            project.images
                ? (prevIndex + 1) % project.images.length
                : 0
        );
    };

    return (
        <div className="project-details-container">
            {/* Cross Button */}
            <button className="close-button" onClick={() => navigate('/projects')}>×</button>

            <div className="project-details-contents">

                <h2 className="project-detail-title">{project.name}</h2>
                <div className="project-details-content">
                    <div className="project-info">
                        <p><strong>Description:</strong> {project.description}</p>
                        <p><strong>Category:</strong> {project.category}</p>
                    </div>

                    {project.images && project.images.length > 0 ? (
                        <div className="project-image-gallery">
                            <h3>Images:</h3>
                            <div className="imagebox">
                                <button className="image-button back" onClick={goToPrevious}>‹</button>
                                <img
                                    src={`http://localhost:4000${project.images[currentImageIndex]}`}
                                    alt={`${project.name} -  ${currentImageIndex + 1}`}
                                    className="project-gallery-image"
                                />
                                <button className="image-button next" onClick={goToNext}>›</button>
                            </div>
                        </div>
                    ) : project.image ? (
                        <div className="project-image-gallery">
                            <h3>Image:</h3>
                            <img src={`http://localhost:4000${project.image}`} alt={project.name} className="project-gallery-image" />
                        </div>
                    ) : (
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
        </div>
    );
};

export default ViewProjectsByIdUsers;
