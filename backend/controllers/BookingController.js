// backend/controllers/BookingController.js
import Booking from '../models/Booking.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createNotification } from './NotificationController.js';

// backend/controllers/BookingController.js
import User from '../models/User.js'; // Import your User model

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

        // Create a single notification for all admins
        await createNotification(
            null,             // userId: null - Not specific to a user
            'admin',          // role: 'admin' - Target all admins
            newBooking._id,    // bookingId
            'new_booking',    // type
            `New booking submitted by ${req.user.name} for project ${projectName}.`
        );

        // Create notification for the user
        await createNotification(
            req.user._id,     // userId: User specific ID
            null,         // role: null - Not specific to a Role
            newBooking._id,     // bookingId
            'booking_submitted',// type
            `Your booking for project ${projectName} submitted successfully. You will get the cost estimation of project soon.`
        );

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

const updateBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { costEstimate, status, costApproval, designModificationComments } = req.body;

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
        let notificationMessage = '';

        if (status === 'Submitted') {
            notificationMessage = `Booking ${bookingToUpdate.projectName} has been submitted and is awaiting review.`;

            // Create a single notification for all admins
            await createNotification(
                null,             // userId: null - Not specific to a user
                'admin',          // role: 'admin' - Target all admins
                bookingToUpdate._id,    // bookingId
                'new_booking',    // type
                notificationMessage
            );

        } else if (status === 'AwaitingCostApproval' && costEstimate !== undefined) {
            notificationMessage = `A cost estimate of $${costEstimate} has been provided for your project ${bookingToUpdate.projectName}.`;

            await createNotification(
                req.user._id,     // userId: User specific ID
                null,         // role: null - Not specific to a Role
                bookingToUpdate._id, // Booking ID
                'cost_estimate_provided', // Notification Type
                notificationMessage  // Notification Message
            );
        } else if (status === 'Completed') {
            notificationMessage = `Your project ${bookingToUpdate.projectName} has been completed.`;

            await createNotification(
                null,         // role: null - Not specific to a Role
                'admin',
                bookingToUpdate._id, // Booking ID
                'project_completed', // Notification Type
                `User ${bookingToUpdate.name} has approved the final design for project ${bookingToUpdate.projectName}. Project is now completed.`  // Notification Message
            );
        } else if ( status === 'AwaitingFinalDesign') {
            notificationMessage = `Your project ${bookingToUpdate.projectName} is awaiting final design.`;

            await createNotification(
                null,         // role: null - Not specific to a Role
                'admin',
                bookingToUpdate._id, // Booking ID
                'awaiting_final_design', // Notification Type
                `User ${bookingToUpdate.name} has requested final design for project ${bookingToUpdate.projectName}.`  // Notification Message
            );
        }
         else if (status === 'Canceled') {
            notificationMessage = `Your project ${bookingToUpdate.projectName} has been canceled. Please contact support for more information.`;

            // Create a single notification for all admins
            await createNotification(
                null,             // userId: null - Not specific to a user
                'admin',          // role: 'admin' - Target all admins
                bookingToUpdate._id,    // bookingId
                'booking_cancelled',    // type
                notificationMessage
            );
        }

        res.status(200).json({ message: 'Booking updated successfully', booking: bookingToUpdate });
    } catch (error) {
        console.error(`Error updating booking ${req.params.id}:`, error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }

        res.status(500).json({ message: 'Error updating booking', error: error.message });
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

        // Create notification for the user that the cost estimate has been provided
        await createNotification(
            booking.userId,  // userId: send to user
            null,          // role: null - Not specific to a Role
            booking._id,      // bookingId
            'cost_estimate_provided', // type
            `A cost estimate has been provided for your project ${booking.projectName}. Please review and approve.`
        );

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
        const finalImages = req.files?.map(file => `/uploads/${file.filename}`) || [];
        const { final3DPreview } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.finalDesignImages = finalImages;
        booking.final3DPreview = final3DPreview;
        booking.status = 'AwaitingFinalDesign';

        console.log('booking before save:', booking);

        await booking.save();

        // Send notification to user
        await createNotification(
            booking.userId,
            null,
            booking._id,
            'final_design_ready',
            `The design for your project ${booking.projectName} is now available. Please review and provide your approval.`
        );

        res.status(200).json({
            message: 'Design submitted successfully',
            booking
        });
    } catch (error) {
        console.error('Error submitting design:', error);
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

        // Send notification to user
        await createNotification(
            booking.userId,
            null,
            booking._id,
            'final_design_updated',
            `The design for your project ${booking.projectName} is now updated. Please review and provide your approval.`
        );

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