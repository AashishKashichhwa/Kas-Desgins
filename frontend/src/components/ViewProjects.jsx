import React, { useEffect, useState } from 'react';
import { get, deleteUser } from '../services/ApiEndpoint';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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

    const handleProjectClick = (id) => {
        navigate(`/admin/projects/${id}`);
    };

    const handleDelete = async (id) => {
        try {
             await deleteUser(`/api/projects/${id}`);
             toast.success("Success on Delete the booking")
              window.location.reload();;
        } catch (error) {
            console.error('Error deleting reservation:', error);
            toast.error("Error on Deleting"); //Print even if fails.
        }
    };

    return (
        <div className="project-grid-container">
            {projects.map(project => (
                <ProjectCard key={project._id} project={project} onClick={handleProjectClick}  handleDelete={handleDelete}/>
            ))}
        </div>
    );
};

const ProjectCard = ({ project, onClick, handleDelete }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        let intervalId;

        const imageCount = project.images ? project.images.length : 0;
        if (imageCount > 1) {
            intervalId = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageCount);
            }, 3000);
        }

        return () => clearInterval(intervalId);
    }, [project.images]);

    return (
        <div className="project-card">

   <div className="project-actions">
                    {/*Link to component Edit Projects */}
    

                    <Link to={`/admin/edit-project/${project._id}`} className="edit-button">Edit</Link>
             {/*Action Deleter */}
                    <button onClick={() => handleDelete(project._id)} className="delete-button">Delete</button>
                </div>

            <div className="project-image-container" onClick={() => onClick(project._id)}>
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

export default ViewProjects;