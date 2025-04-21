import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../assets/styles/AddProject.css';
import { useNavigate } from 'react-router-dom';

const AddProject = ({ fetchProjects }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageFields, setImageFields] = useState([0]); // Array of numbers as IDs
    const [project3DVisualization, setProject3DVisualization] = useState('');
    const navigate = useNavigate();
    let currentId = 1;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', projectName);
            formData.append('description', projectDescription);
            formData.append('category', category);
            formData.append('project3DVisualization', project3DVisualization);

            imageFields.forEach((fieldId) => {
                const fileInput = document.getElementById(`projectImage-${fieldId}`);
                if (fileInput && fileInput.files.length > 0) {
                    Array.from(fileInput.files).forEach(file => formData.append('images', file));
                }
            });

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
                setImageFields([0]);  // Reset to one input
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

    const handleAddImageField = () => {
        setImageFields((prevFields) => [...prevFields, currentId++]);
    };

    return (
        <div className="add-project-container">
            <h2 className="add-project-title">Add New Project</h2>
            <form onSubmit={handleSubmit} className="add-project-form">
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

                <div className="add-project-group">
                    <label>Project Images:</label>
                    {imageFields.map((fieldId) => (
                        <input
                            key={fieldId}
                            type="file"
                            id={`projectImage-${fieldId}`}
                            accept="image/*"
                            className="add-project-input"
                            multiple //Enable the multiple images being selected

                            
                        />
                    ))}
                    <button type="button" className="add-image-button" onClick={handleAddImageField}>+ Add more</button>
                </div>

                <div className="add-project-group">
                    <label htmlFor="project3DVisualization">Project 3D Visualization (Iframe Code):</label>
                    <textarea id="project3DVisualization" value={project3DVisualization} onChange={(e) => setProject3DVisualization(e.target.value)} className="add-project-textarea" />
                </div>
                <button type="submit" className="add-project-button">Add Project</button>
            </form>
        </div>
    );
};

export default AddProject;