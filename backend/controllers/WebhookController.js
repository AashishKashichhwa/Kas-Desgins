import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import {performPaymentUpdate} from './BookingController.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const fulfillOrder = async (session) => {
//     console.log('Fulfilling order for session:', session.id);

//     try {
//         const bookingId = session.metadata.booking_id;

//         // Check if the booking has already been processed for this payment intent
//         const existingBooking = await Booking.findOne({
//             _id: bookingId,
//             stripePaymentId: session.payment_intent,
//         });

//         if (existingBooking) {
//             console.log(`Booking ${bookingId} already processed for payment intent ${session.payment_intent}. Skipping.`);
//             return existingBooking; // Or return null, depending on your logic
//         }

//         const booking = await Booking.findOneAndUpdate(
//             { _id: bookingId },
//             {
//                 paymentStatus: 'Paid',
//                 costApproval: 'Approved',
//                 status: 'Designing',
//                 paymentDate: new Date(),
//                 stripePaymentId: session.payment_intent,
//             },
//             { new: true }
//         );

//         if (!booking) {
//             console.error('Booking not found:', bookingId);
//             return;
//         }

//         console.log(`Booking ${booking._id} updated successfully`);
//         return booking;
//     } catch (error) {
//         console.error('Error fulfilling order:', error);
//         throw error;
//     }
// };



export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    console.log("Webhook received!"); // Immediate verification

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('Received event:', event);
        console.log('Event data:', event.data.object); // Log full event data

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session.metadata.booking_id;

            console.log(`Session completed for booking: ${bookingId}`);

            try {
                // Fetch the booking first
                const booking = await Booking.findById(bookingId);
                if (!booking) {
                    console.error('Booking not found:', bookingId);
                    return res.status(404).json({ error: 'Booking not found' });
                }
                console.log('Booking found:', booking);

                // Now, update the booking
                const updatedBooking = await Booking.findByIdAndUpdate(
                    bookingId,
                    {
                        costApproval: 'Approved',
                        status: 'Designing',
                        paymentStatus: 'Paid',
                        paymentDate: new Date(),
                    },
                    { new: true, runValidators: true }
                );

                if (!updatedBooking) {
                    console.error('Booking not found during update:', bookingId);
                    return res.status(404).json({ error: 'Booking not found' });
                }

                console.log('Booking updated:', updatedBooking);
                return res.status(200).json({ received: true });

            } catch (dbError) {
                console.error('Database update error:', dbError);
                return res.status(500).json({ error: 'Database update failed' });
            }
        }
    } catch (err) {
        console.error('Error handling webhook:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    res.status(200).json({ received: true });
};