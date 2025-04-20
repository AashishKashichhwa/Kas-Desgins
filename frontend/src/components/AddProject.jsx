// AddProject.jsx

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../assets/styles/AddProject.css';
import { useNavigate } from 'react-router-dom';

const AddProject = ({ fetchProjects }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [project3DVisualization, setProject3DVisualization] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', projectName);
            formData.append('description', projectDescription);
            formData.append('category', category);
            formData.append('project3DVisualization', project3DVisualization);

            if (image) {
                formData.append('image', image);
            }

            const res = await axios.post('http://localhost:4000/api/projects/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                toast.success(res.data.message);
                setProjectName('');
                setProjectDescription('');
                setCategory('');
                setImage(null);
                setProject3DVisualization('');
                if (fetchProjects) fetchProjects();
                navigate('/admin/projects');
            } else {
                toast.error('Failed to add project.');
            }
        } catch (error) {
            console.error('Error adding project:', error);
            toast.error('Error adding project');
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="add-project-container">
            <h2 className="add-project-title">Add New Project</h2>
            <form onSubmit={handleSubmit} className="add-project-form">
                <div className="add-project-group">
                    <label htmlFor="projectName" className="add-project-label">Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                        className="add-project-input"
                    />
                </div>
                <div className="add-project-group">
                    <label htmlFor="projectDescription" className="add-project-label">Project Description:</label>
                    <textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        required
                        className="add-project-textarea"
                    ></textarea>
                </div>
                <div className="add-project-group">
                    <label htmlFor="projectCategory" className="add-project-label">Category:</label>
                    <input
                        type="text"
                        id="projectCategory"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="add-project-input"
                    />
                </div>
                <div className="add-project-group">
                    <label htmlFor="projectImage" className="add-project-label">Project Image:</label>
                    <input
                        type="file"
                        id="projectImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="add-project-input"
                    />
                </div>
                <div className="add-project-group">
                    <label htmlFor="project3DVisualization" className="add-project-label">Project 3D Visualization (Iframe Code):</label>
                    <textarea
                        id="project3DVisualization"
                        value={project3DVisualization}
                        onChange={(e) => setProject3DVisualization(e.target.value)}
                        className="add-project-textarea"
                    />
                </div>
                <button type="submit" className="add-project-button">Add Project</button>
            </form>
        </div>
    );
};

export default AddProject;
