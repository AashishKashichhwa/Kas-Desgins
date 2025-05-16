// cartCheckoutController.js
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Checkout from '../models/Checkout.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCartCheckoutSession = async (req, res) => {
    try {
        const { cartItems } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total amount from cart items
        const totalAmount = cartItems.reduce((sum, item) => {
            return sum + (item.productId.price * item.quantity);
        }, 0);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const successUrl = `${frontendUrl}/cartpaymentsuccess?session_id={CHECKOUT_SESSION_ID}`;  // New success URL
        const cancelUrl = `${frontendUrl}/cartpaymentfailed`; // New cancel URL
        // Create line items for Stripe
        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'npr', // Changed currency to Nepali Rupees
                product_data: {
                    name: item.productId.name,
                },
                unit_amount: Math.round(item.productId.price * 100),
            },
            quantity: item.quantity,
        }));
        const cartItemIds = cartItems.map(item => item._id);
        //console.log("This is user id", req.userId);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                cartItemIds: JSON.stringify(cartItemIds),
                userId: req.user._id.toString() // Convert to string
            },
        });

        console.log('Stripe session created for cart:', session.id);
        res.json({ id: session.id, url: session.url });

    } catch (error) {
        console.error("Error creating checkout session for cart:", error);
        res.status(500).json({
            message: 'Error creating checkout session for cart',
            error: error.message
        });
    }
};


const getCheckoutBySessionId = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const checkout = await Checkout.findOne({ sessionId })
            .populate('products.productId');
        if (!checkout) {
            return res.status(404).json({ message: 'Checkout not found' });
        }
        res.json(checkout);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export { createCartCheckoutSession, getCheckoutBySessionId };