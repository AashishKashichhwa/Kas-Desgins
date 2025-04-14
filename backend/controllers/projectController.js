import Project from '../models/Project.js';

// Add a new project
const addProject = async (req, res) => {
    try {
        const { name, description, category, project3DVisualization } = req.body;

        const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

        const newProject = new Project({
            name,
            description,
            category,
            image: imagePath, // ✅ Fixed field name
            project3DVisualization
        });

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// Get single project
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

// Update
const updateProjectById = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

// Delete
const deleteProjectById = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
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
