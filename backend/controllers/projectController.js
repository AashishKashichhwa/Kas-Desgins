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
const updateProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { name, description, category, project3DVisualization, replaceImages } = req.body;
        const projectToUpdate = await Project.findById(projectId);

        if (!projectToUpdate) {
            return res.status(404).json({ message: 'Project not found' });
        }

        let imagePaths = projectToUpdate.images || []; // Keep existing images by default

        // Determine if images should be replaced based on the flag and if new files are present
        const shouldReplaceImages = replaceImages === 'true' && req.files && req.files.length > 0;

        if (shouldReplaceImages) {
            // 1. Delete old image files from the server (best practice)
            if (projectToUpdate.images && projectToUpdate.images.length > 0) {
                projectToUpdate.images.forEach(imgPath => {
                    try {
                        // Construct the full path relative to the backend root
                        const fullPath = path.join(__dirname, imgPath);
                        if (fs.existsSync(fullPath)) {
                            fs.unlinkSync(fullPath);
                            console.log(`Deleted old image: ${fullPath}`);
                        } else {
                            console.warn(`Old image not found, skipping delete: ${fullPath}`);
                        }
                    } catch (unlinkErr) {
                        // Log deletion errors but don't necessarily stop the update
                        console.error(`Error deleting old image ${imgPath}:`, unlinkErr);
                    }
                });
            }

            // 2. Set imagePaths to the paths of the NEWLY uploaded files
            imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        }
        // If replaceImages is 'false' or no new files uploaded, imagePaths remains the existing ones

        // Prepare update data
        const updateData = {
            name: name || projectToUpdate.name, // Use existing if not provided
            description: description || projectToUpdate.description,
            category: category || projectToUpdate.category,
            project3DVisualization: project3DVisualization !== undefined ? project3DVisualization : projectToUpdate.project3DVisualization, // Handle empty string correctly
            images: imagePaths // Update with new or existing paths
        };

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updateData,
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedProject) {
             // Should not happen if findById found it, but good practice
             return res.status(404).json({ message: 'Project not found after update attempt' });
        }

        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        console.error(`Error updating project ${req.params.id}:`, error); // Log error
        // Handle potential validation errors from Mongoose
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