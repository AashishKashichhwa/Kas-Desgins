// backend/controllers/BookingController.js
import Booking from '../models/Booking.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addBooking = async (req, res) => {
    try {
        console.log('Request files:', req.files); // Debug file uploads
        
        const { projectName, roomType, roomSqft, roomDetails, name, phone, date, time, message } = req.body;

        // Process uploaded files
        const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];

        const newBooking = new Booking({
            userId: req.user._id,
            projectName,
            roomType,
            roomSqft,
            roomDetails,
            images: imagePaths,
            name,
            phone,
            date,
            time,
            message
        });

        await newBooking.save();
        res.status(201).json({ 
            success: true,
            message: 'Booking created successfully',
            booking: newBooking 
        });
    } catch (error) {
        console.error('Add booking error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create booking',
            error: error.message 
        });
    }
};

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error(`Error fetching booking by ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
};

const updateBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { costEstimate, status } = req.body;

        const bookingToUpdate = await Booking.findById(bookingId);

        if (!bookingToUpdate) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (costEstimate !== undefined) {
            bookingToUpdate.costEstimate = costEstimate;
        }
        if (status !== undefined) {
            bookingToUpdate.status = status;
        }

        await bookingToUpdate.save();

        res.status(200).json({ message: 'Booking updated successfully', booking: bookingToUpdate });
    } catch (error) {
        console.error(`Error updating booking ${req.params.id}:`, error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }

        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};

const deleteBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.images && booking.images.length > 0) {
            booking.images.forEach(imgPath => {
                try {
                    const fullPath = path.join(__dirname, imgPath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log(`Deleted image on booking delete: ${fullPath}`);
                    } else {
                        console.warn(`Image not found on booking delete, skipping: ${fullPath}`);
                    }
                } catch (unlinkErr) {
                    console.error(`Error deleting image ${imgPath} during booking delete:`, unlinkErr);
                }
            });
        }

        await Booking.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(`Error deleting booking ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
};

export {
    getBookings,
    addBooking,
    getBookingById,
    updateBookingById,
    deleteBookingById
};