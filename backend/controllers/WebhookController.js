import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import { createNotification } from './NotificationController.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
                console.log('Attempting to update booking:', bookingId); // ADD THIS LINE
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

                console.log('Booking updated successfully:', updatedBooking); // ADD THIS LINE

                // Send notification to admin
                await createNotification(
                    null,
                    'admin', // role: 'admin' - Target all admins
                    bookingId,
                    'payment_received',
                    `Payment received for booking ${booking.projectName} from ${booking.name}. Design work can now begin.`
                );
                console.log('Admin notification sent'); // Add this line

                // Send notification to user
                await createNotification(
                    booking.userId,
                    null,
                    bookingId,
                    'payment_confirmation',
                    `Your payment for booking ${booking.projectName} has been received. Our design team is now working on your project.`
                );
                console.log('User notification sent'); // Add this line


                console.log('Booking updated:', updatedBooking);
                console.log('Payment Successfully updated for booking Id: ', bookingId);
                return res.status(200).json({ received: true });

            } catch (dbError) {
                console.error('Database update error:', dbError);
                return res.status(500).json({ error: 'Database update failed' });
            }
        } else {
            console.log('Event type is not checkout.session.completed'); // ADD THIS LINE
        }
    } catch (err) {
        console.error('Error handling webhook:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    res.status(200).json({ received: true })
};