// models/Checkout.js

import mongoose from 'mongoose';

const CheckoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  // Assuming you have a User model
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Assuming you have a Product model
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'], // Adjust as needed
        default: 'pending',
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    sessionId: {
        type: String,
        required: false, // Adjust as needed
    },
    customerEmail: {
        type: String,
        required: false, // Adjust as needed
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Checkout = mongoose.model('Checkout', CheckoutSchema);

export default Checkout;