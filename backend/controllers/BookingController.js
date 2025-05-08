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
const getBookingsUser = async (req, res) => {
    try {
        // Retrieve the user ID from the request (assuming it's passed in the query)
        const userId = req.user._id; //We can use the token
        console.log('User id', userId)

        // Fetch only bookings associated with the logged-in user
        const bookings = await Booking.find({ userId: userId });

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
        const { costEstimate, status, costApproval, designModificationComments } = req.body;  // Include designModificationComments

        const bookingToUpdate = await Booking.findById(bookingId);

        if (!bookingToUpdate) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (costEstimate !== undefined) {
            bookingToUpdate.costEstimate = costEstimate;
        }
        if (status !== undefined) {
             if (!['Draft', 'Submitted', 'AwaitingCostApproval', 'Designing', 'AwaitingFinalDesign', 'Completed', 'Canceled'].includes(status)) {
                    return res.status(400).json({ message: 'Invalid status value.' });
                }
            bookingToUpdate.status = status;
        }

        // Handle costApproval update.  Crucially, validate against enum values
        if (costApproval !== undefined) {
            if (!['Not Approved', 'Approved'].includes(costApproval)) {
                return res.status(400).json({ message: 'Invalid costApproval value. Must be "Not Approved" or "Approved".' });
            }
            bookingToUpdate.costApproval = costApproval;
        }
      if (designModificationComments !== undefined) {
            bookingToUpdate.designModificationComments = designModificationComments;
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


const sendQuotation = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const { costEstimate } = req.body;
        if (!costEstimate) {
            return res.status(400).json({ message: 'Cost estimate is required' });
        }

        booking.costEstimate = costEstimate;
        booking.status = 'AwaitingCostApproval';
        await booking.save();

        res.status(200).json({ message: 'Quotation sent successfully', booking });
    } catch (error) {
        console.error('Error sending quotation:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const submitFinalDesign = async (req, res) => {
    try {
        console.log('FILES:', req.files);
        console.log('BODY:', req.body);

        const bookingId = req.params.id;
        // Access files using the correct fieldname
        const finalImages = req.files?.map(file => `/uploads/${file.filename}`) || []; // Check finalImages or finalDesignImages
        const { final3DPreview } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Assign the filepaths to the finalDesigns field
        booking.finalDesignImages = finalImages; // finalImages contains the value
        booking.final3DPreview = final3DPreview;
        booking.status = 'AwaitingFinalDesign'; // This line was wrong, it is now corrected

        console.log('booking before save:', booking); // 👈 Add this line

        await booking.save();

        res.status(200).json({
            message: 'Design submitted successfully',
            booking
        });
    } catch (error) {
        console.error('Error submitting design:', error); // Log full error
        res.status(500).json({
            message: 'Failed to submit design',
            error: error.message
        });
    }
};

const editDesignById = async (req, res) => {
    try {
        console.log('EditDesign FILES:', req.files);
        console.log('EditDesign BODY:', req.body);

        const bookingId = req.params.id;
        const finalImages = req.files?.map(file => `/uploads/${file.filename}`) || [];
        const { final3DPreview } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.finalDesignImages = finalImages;
        booking.final3DPreview = final3DPreview;

        await booking.save();

        res.status(200).json({
            message: 'Final design updated successfully',
            booking
        });
    } catch (error) {
        console.error('Error updating final design:', error);
        res.status(500).json({
            message: 'Failed to update final design',
            error: error.message
        });
    }
};

const updateCostApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const { costApproval } = req.body;

        // Validate input
        if (!['Pending', 'Approved', 'Not Approved'].includes(costApproval)) {
            return res.status(400).json({ 
                message: 'Invalid cost approval status',
                validStatuses: ['Pending', 'Approved', 'Not Approved']
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { costApproval },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({
            message: 'Cost approval updated successfully',
            booking
        });

    } catch (error) {
        console.error('Error updating cost approval:', error);
        res.status(500).json({ 
            message: 'Error updating cost approval',
            error: error.message
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            console.log("Booking Not found")
            return res.status(404).json({
                verified: false,
                message: 'Booking not found'
            });
        }
        console.log("Booking found, checking payment status: ", booking.paymentStatus);
        res.json({
            verified: booking.paymentStatus === 'Paid',
            booking
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            verified: false,
            error: 'Error verifying payment'
        });
    }
};

const performPaymentUpdate = async ({ id, paymentStatus, costApproval, status, paymentDate }) => {
    console.log('Updating payment for booking ID:', id); // Add this

    if (!['Paid', 'Unpaid'].includes(paymentStatus)) {
        throw new Error('Invalid payment status');
    }

    const booking = await Booking.findByIdAndUpdate(
        id,
        { paymentStatus, costApproval, status, paymentDate },
        { new: true, runValidators: true }
    );

    if (!booking) {
        throw new Error('Booking not found');
    }

    console.log('Booking after payment update:', booking); // Add this
    return booking;
};


const updatePayment = async (req, res) => {
    try {
        const booking = await performPaymentUpdate({ id: req.params.id, ...req.body });
        res.json({ message: 'Payment Updated Successfully', booking });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Error updating payment status', error: error.message });
    }
};

export {
    getBookings,
    getBookingsUser,
    addBooking,
    getBookingById,
    updateBookingById,
    deleteBookingById,
    sendQuotation,
    submitFinalDesign,
    editDesignById,
    updateCostApproval,
    verifyPayment,
    updatePayment,
    performPaymentUpdate
};