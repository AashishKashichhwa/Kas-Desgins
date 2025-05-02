import express from 'express';
import {
    getBookings,
    addBooking,
    getBookingById,
    updateBookingById,
    deleteBookingById
} from '../controllers/BookingController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { isUser } from '../middlewares/VerifyToken.js';

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
router.get('/', getBookings);
router.post('/', isUser, upload.array('images', 10), addBooking);
router.get('/:id', getBookingById);
router.put('/:id', upload.array('images', 10), updateBookingById);
router.delete('/:id', deleteBookingById);

export default router;