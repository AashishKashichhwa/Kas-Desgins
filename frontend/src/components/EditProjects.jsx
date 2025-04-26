// frontend/src/components/EditProject.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../assets/styles/AddProject.css'; // Reuse AddProject styles
import '../assets/styles/EditProject.css'; // Add specific EditProject styles if needed
import { useNavigate, useParams } from 'react-router-dom';
import { get } from '../services/ApiEndpoint';

const EditProject = ({ fetchProjects }) => {
    const { id } = useParams();
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [category, setCategory] = useState('');
    const [existingImages, setExistingImages] = useState([]); // URLs of current images
    const [imageFields, setImageFields] = useState([0]);      // IDs for the NEW file input fields
    const [project3DVisualization, setProject3DVisualization] = useState('');
    const navigate = useNavigate();
    let currentId = 1; // Start next ID from 1

    // Fetch existing project data
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const request = await get(`/api/projects/${id}`);
                const response = request.data;

                if (request.status === 200) {
                    setProjectName(response.name);
                    setProjectDescription(response.description);
                    setCategory(response.category);
                    setProject3DVisualization(response.project3DVisualization);

                    // Set existing images state
                    if (response.images && response.images.length > 0) {
                        setExistingImages(response.images);
                    } else if (response.image) { // Handle legacy single image field
                        setExistingImages([response.image]);
                    } else {
                        setExistingImages([]);
                    }
                    // Reset the new file input fields whenever project data loads
                    setImageFields([0]);
                    currentId = 1; // Reset counter
                } else {
                    toast.error("Failed to fetch project.");
                }
            } catch (e) {
                toast.error("Failed to fetch project.");
                console.error(e);
            }
        };

        fetchProject();
    }, [id]); // Depend on the project ID

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', projectName);
            formData.append('description', projectDescription);
            formData.append('category', category);
            formData.append('project3DVisualization', project3DVisualization);

            let newFilesSelected = false;
            // Gather files from all the dynamic input fields
            imageFields.forEach((fieldId) => {
                const fileInput = document.getElementById(`projectImage-${fieldId}`);
                if (fileInput && fileInput.files.length > 0) {
                    newFilesSelected = true; // Mark that new files were chosen
                    Array.from(fileInput.files).forEach(file => formData.append('images', file));
                }
            });

            // Set the flag for the backend based on whether new files were selected
            formData.append('replaceImages', newFilesSelected ? 'true' : 'false');

            // Use PUT request for updates
            const res = await axios.put(`http://localhost:4000/api/projects/${id}`, formData, {
                headers: {
                    // Content-Type is set automatically by Axios for FormData
                },
            });

            if (res.status === 200) {
                toast.success(res.data.message || 'Project updated successfully!');
                if (fetchProjects) fetchProjects();
                navigate('/admin/projects');
            } else {
                toast.error(res.data.message || 'Failed to update project.');
            }
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error(error.response?.data?.message || 'Error updating project');
        }
    };

    // Function to add a new file input field
    const handleAddImageField = () => {
        setImageFields((prevFields) => [...prevFields, currentId++]);
    };

    // Note: We don't need a specific handleImageChange for *each* input anymore
    // because we gather the files directly from the DOM in handleSubmit.

    return (
        <div className="add-project-container edit-project-container">
                              {/* Cross Button */}
                              <button className="closebutton" onClick={() => navigate('/admin/projects')}>×</button>
            <form onSubmit={handleSubmit} className="add-project-form">
            <h2 className="add-project-title">Edit Project</h2>
                {/* Fields for Name, Description, Category */}
                <div className="add-project-group">
                    <label htmlFor="projectName">Project Name:</label>
                    <input type="text" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} required className="add-project-input" />
                </div>
                <div className="add-project-group">
                    <label htmlFor="projectDescription">Project Description:</label>
                    <textarea id="projectDescription" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required className="add-project-textarea" />
                </div>
                <div className="add-project-group">
                    <label htmlFor="projectCategory">Category:</label>
                    <input type="text" id="projectCategory" value={category} onChange={(e) => setCategory(e.target.value)} required className="add-project-input" />
                </div>

                {/* Display Existing Images */}
                {existingImages.length > 0 && (
                    <div className="add-project-group existing-images-preview">
                        <label className="add-project-label">Current Image(s):</label>
                        <div className="image-preview-container">
                            {existingImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:4000${imgUrl}`}
                                    alt={`Current project ${index + 1}`}
                                    className="current-project-image-preview"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Dynamically added file inputs for replacing images */}
                <div className="add-project-group">
                    <label>
                        {existingImages.length > 0 ? 'Replace Image(s) with New Files:' : 'Upload Image(s):'}
                    </label>
                    {imageFields.map((fieldId) => (
                        <input
                            key={fieldId}
                            type="file"
                            id={`projectImage-${fieldId}`} // Unique ID for each input
                            accept="image/*"
                            className="add-project-input"
                            multiple // Allow multiple selection within each input
                        />
                    ))}
                    <button type="button" className="add-image-button" onClick={handleAddImageField}>+ Add more file inputs</button>
                </div>


                {/* 3D Visualization Field */}
                <div className="add-project-group">
                    <label htmlFor="project3DVisualization">Project 3D Visualization (Iframe Code):</label>
                    <textarea id="project3DVisualization" value={project3DVisualization} onChange={(e) => setProject3DVisualization(e.target.value)} className="add-project-textarea" />
                </div>

                <button type="submit" className="add-project-button">Update Project</button>
            </form>
        </div>
    );
};

export default EditProject;