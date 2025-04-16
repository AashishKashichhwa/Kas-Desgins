import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios'; // ✅ Use axios directly for FormData upload
import '../assets/styles/AdminHome.css';
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
        <div className="admin-container">
            <h2>Add New Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="projectDescription">Project Description:</label>
                    <textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="projectCategory">Category:</label>
                    <input
                        type="text"
                        id="projectCategory"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="projectImage">Project Image:</label>
                    <input
                        type="file"
                        id="projectImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="project3DVisualization">Project 3D Visualization (Iframe Code):</label>
                    <textarea
                        id="project3DVisualization"
                        value={project3DVisualization}
                        onChange={(e) => setProject3DVisualization(e.target.value)}
                    />
                </div>
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
};

export default AddProject;
