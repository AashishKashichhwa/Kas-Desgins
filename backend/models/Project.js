// backend/models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    project3DVisualization: {
        type: String,
        default: '',
    },
    images: [{ // Changed from 'image' to 'images' and made it an array
        type: String, // Array of URL paths to the images
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

export default Project;