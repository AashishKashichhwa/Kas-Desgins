import Booking from '../models/Booking.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
    try {
        console.log('Creating checkout session for booking:', req.params.id);

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            console.log('Booking not found');
            return res.status(404).json({ message: 'Booking not found' });
        }

        console.log('Booking found, costApproval:', booking.costApproval);
        if (booking.costApproval !== 'Pending') {
            console.log('Cost approval not in Pending state');
            return res.status(400).json({
                message: 'Cost must be in pending state before payment'
            });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        // const successUrl = `${frontendUrl}/user/bookings/${req.params.id}?payment=success`; // Old success URL
        const successUrl = `${frontendUrl}/paymentsuccess?bookingId=${req.params.id}`;  // New success URL
        const cancelUrl = `${frontendUrl}/paymentfailed?bookingId=${req.params.id}`; // New cancel URL

        console.log('Success URL:', successUrl);
        console.log('Cancel URL:', cancelUrl);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'npr', // Changed currency to Nepali Rupees
                    product_data: {
                        name: booking.projectName || 'Interior Design Service',
                    },
                    unit_amount: Math.round(booking.costEstimate * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                booking_id: req.params.id.toString()
            },
        });

        console.log('Stripe session created:', session.id);
        res.json({
            id: session.id,
            url: session.url
        });

    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({
            message: 'Error creating checkout session',
            error: error.message
        });
    }
};


export { createCheckoutSession };