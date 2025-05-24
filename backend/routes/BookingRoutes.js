import express from 'express';
import {
    getBookings,
    getBookingsUser,
    addBooking,
    getBookingById,
    updateBookingById,
    deleteBookingById,
    sendQuotation,
    submitFinalDesign,
    editDesignById,
    updateCostApproval
} from '../controllers/BookingController.js';
import {createCheckoutSession} from '../controllers/CheckoutController.js'
import {stripeWebhook} from '../controllers/WebhookController.js'


import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { isUser, isAdmin } from '../middlewares/VerifyToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// Routes
// router.get('/', isUser,isAdmin, getBookings);
router.get('/user', isUser, getBookingsUser);
router.get('/',isAdmin, getBookings);
router.post('/', isUser, upload.array('images', 10), addBooking);
router.get('/:id', getBookingById);
router.put('/:id', upload.array('images', 10), updateBookingById); //Ensure User is logged in before updating
router.delete('/:id', deleteBookingById);
router.put('/:id/send-quotation', isAdmin, sendQuotation);
router.put('/:id/submit-design', isAdmin, upload.array('finalDesignImages', 10), submitFinalDesign);
router.put('/:id/edit-design', isAdmin, upload.array('finalDesignImages', 10), editDesignById);
router.post('/:id/create-checkout-session', isUser, createCheckoutSession);
// Add this new route
router.put('/:id/cost-approval', isUser, updateCostApproval);
router.post('/webhook', stripeWebhook); // No express.raw here



export default router;