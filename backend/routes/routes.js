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


    import {
        getProducts,
        addProducts,
        getProductById,
        updateProductsById,
        deleteProductsById
    } from '../controllers/ProductController.js';

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Import the fs module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        // Ensure the uploads directory exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
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
//router.post('/projects/add', upload.single('image'), addProject); // ✅ File upload handled
const MAX_IMAGE_COUNT = 10; // Adjust the maximum number of images as needed
router.post('/projects/add', upload.array('images', MAX_IMAGE_COUNT), addProject);
router.get('/projects/:id', getProjectById);
router.put('/projects/:id', updateProjectById);
router.delete('/projects/:id', deleteProjectById);


// Product routes
router.get('/products', getProducts);
router.post('/products/add', upload.array('images', 10), addProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProductsById);
router.delete('/products/:id', deleteProductsById);

export default router;