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

import {getAllCheckouts, getCheckoutsByUser} from '../controllers/cartCheckoutController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Import the fs module
import { isUser, isAdmin } from '../middlewares/VerifyToken.js';
import Checkout from '../models/Checkout.js';

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
router.put('/projects/:id', upload.array('images', 10), updateProjectById);
router.delete('/projects/:id', deleteProjectById);


// Product routes
router.get('/products', getProducts);
router.post('/products/add', upload.array('images', 10), addProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', upload.array('images', 10), updateProductsById);
router.delete('/products/:id', deleteProductsById);

router.get('/admin/checkouts', getAllCheckouts); // Admin only
router.get('/userhome/checkouts', isUser, getCheckoutsByUser); // User only

router.get('/checkouts', async (req, res) => {
    try {
        const checkouts = await Checkout.find();

        res.status(200).json(checkouts);
    } catch (error) {
        console.error('❌ Error in GET /api/checkouts:', error); // ✅ full error log
        res.status(500).json({
            message: 'Error fetching checkout data',
            error: error.message || error.toString()
        });
    }
});


export default router;