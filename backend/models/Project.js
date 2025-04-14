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
    image: {
        type: String, // URL path to the image
        default: '',
    }
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
