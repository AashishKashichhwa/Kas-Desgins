import express from 'express';
import {
    createContact,
    getAllContacts,
    getContact,
    updateContact,
    deleteContact
} from '../controllers/contactController.js';
import {
    getProjects,
    addProject,
    getProjectById,
    updateProjectById,
    deleteProjectById
} from '../controllers/projectController.js';

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// Contact routes
router.post('/contact', createContact);
router.get('/contact', getAllContacts);
router.get('/contact/:id', getContact);
router.put('/contact/:id', updateContact);
router.delete('/contact/:id', deleteContact);

// Project routes
router.get('/projects', getProjects);
router.post('/projects/add', upload.single('image'), addProject); // ✅ File upload handled
router.get('/projects/:id', getProjectById);
router.put('/projects/:id', updateProjectById);
router.delete('/projects/:id', deleteProjectById);

export default router;
