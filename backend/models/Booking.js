// // backend/models/Booking.js
// import mongoose from 'mongoose';

// const BookingSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     projectName: {
//         type: String,
//         required: true
//     },
//     roomType: {
//         type: String,
//         required: true
//     },
//     roomSqft: {
//         type: String,
//         required: true
//     },
//     roomDetails: {
//         type: String,
//         required: true
//     },
//     images: [{  // User-uploaded images
//         type: String,
//         required: true // Or false, depending on if it's always required
//     }],
//     costEstimate: {
//         type: Number
//     },
//     status: {
//         type: String,
//         enum: ['Pending', 'Approved by Admin', 'Rejected by Admin', 'Approved by User', 'Rejected by User', 'Paid', 'Completed'],
//         default: 'Pending'
//     },
//     finalDesignImages: [{ // Admin-uploaded design images
//         type: String
//     }],
//     final3DPreview: { // Admin-uploaded 3D visualization (link or code)
//         type: String
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         required: true
//     },
//     time: {
//         type: String,
//         required: true
//     },
//     message: {
//         type: String
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     timestamps: true
// });

// const Booking = mongoose.model('Booking', BookingSchema);

// export default Booking;



import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    projectName: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    roomSqft: {
        type: String,
        required: true
    },
    roomDetails: {
        type: String,
        required: true
    },
    images: [{  // User-uploaded images
        type: String,
        required: true // Or false, depending on if it's always required
    }],
    costEstimate: {
        type: Number,
        default: 0 // Add a default value
    },
      costApproval: {  // Customer Approval for Designs
        type: String,
        enum: ['Not Approved', 'Approved'], // Use an enum for clarity
        default: 'Not Approved' // Default to "Not Approved"
    },

    // Status Tracking
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'AwaitingCostApproval', 'Designing', 'AwaitingFinalDesign', 'Completed', 'Canceled'],
        default: 'Draft'
    },

    // Financials (General Project Payment)
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Partial', 'Paid'],
        default: 'Unpaid'
    },

    finalDesignImages: [{ // Admin-uploaded design images
        type: String
    }],
    final3DPreview: { // Admin-uploaded 3D visualization (link or code)
        type: String,
        default: '',
    },

    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;