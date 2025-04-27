// backend/controllers/ProjectController.js
import Project from '../models/Project.js';
import fs from 'fs'; // Import the fs module for file system operations
import path from 'path';
import { fileURLToPath } from 'url';

// Correctly determine the directory containing the 'uploads' folder
// Assuming controllers are in backend/controllers and uploads is in backend/uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename)); // Go up one level from /controllers

// Add a new project
const addProject = async (req, res) => {
    try {
        const { name, description, category, project3DVisualization } = req.body;

        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        }

        const newProject = new Project({
            name,
            description,
            category,
            images: imagePaths, // Use the 'images' array field
            project3DVisualization
        });

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        console.error('Error in addProject:', error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error); // Log error
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// Get single project
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error(`Error fetching project by ID ${req.params.id}:`, error); // Log error
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

// Update project by ID
// Update project by ID
const updateProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { name, description, category, project3DVisualization, replaceImages } = req.body;

        const projectToUpdate = await Project.findById(projectId);

        if (!projectToUpdate) {
            return res.status(404).json({ message: 'Project not found' });
        }

        let updatedImagePaths = projectToUpdate.images || [];

        const shouldReplaceImages = replaceImages === 'true' && req.files && req.files.length > 0;

        if (shouldReplaceImages) {
            // Delete old images
            for (const imgPath of projectToUpdate.images) {
                try {
                    const fullPath = path.join(__dirname, imgPath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log(`Deleted old image: ${fullPath}`);
                    }
                } catch (unlinkErr) {
                    console.error(`Error deleting old image ${imgPath}:`, unlinkErr);
                }
            }

            // Save new images
            updatedImagePaths = req.files.map(file => `/uploads/${file.filename}`);
        }

        // Update project fields
        projectToUpdate.name = name !== undefined ? name : projectToUpdate.name;
        projectToUpdate.description = description !== undefined ? description : projectToUpdate.description;
        projectToUpdate.category = category !== undefined ? category : projectToUpdate.category;
        projectToUpdate.project3DVisualization = project3DVisualization !== undefined ? project3DVisualization : projectToUpdate.project3DVisualization;
        projectToUpdate.images = updatedImagePaths;

        // Save the updated project
        await projectToUpdate.save();

        res.status(200).json({ message: 'Project updated successfully', project: projectToUpdate });

    } catch (error) {
        console.error(`Error updating project ${req.params.id}:`, error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }

        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};



// Delete project by ID
const deleteProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId); // Find first to get image paths

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Delete associated image files from the server (best practice)
        if (project.images && project.images.length > 0) {
            project.images.forEach(imgPath => {
                try {
                    const fullPath = path.join(__dirname, imgPath);
                     if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log(`Deleted image on project delete: ${fullPath}`);
                    } else {
                         console.warn(`Image not found on project delete, skipping: ${fullPath}`);
                     }
                } catch (unlinkErr) {
                    console.error(`Error deleting image ${imgPath} during project delete:`, unlinkErr);
                }
            });
        }

        // Delete the project document from the database
        await Project.findByIdAndDelete(projectId);

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(`Error deleting project ${req.params.id}:`, error); // Log error
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};

export {
    getProjects,
    addProject,
    getProjectById,
    updateProjectById,
    deleteProjectById
};