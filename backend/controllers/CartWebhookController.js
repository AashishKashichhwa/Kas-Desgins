// controller/cartWebhookController.js

import Stripe from 'stripe';
import Cart from '../models/Cart.js';
import Checkout from '../models/Checkout.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_CART; // new secret

export const cartWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Cart Webhook verified");
  } catch (err) {
    console.error('Cart Webhook construct error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Cart Checkout session completed', session.id);

    // Payment successful, fulfill order
    try {
      const cartItemIds = JSON.parse(session.metadata.cartItemIds);
      const userId = session.metadata.userId;

      const cartItems = await Cart.find({ _id: { $in: cartItemIds } }).populate('productId');

      // Create Checkout record
      const checkoutData = {
        userId: userId,
        products: cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        totalAmount: session.amount_total / 100, // Amount in cents from Stripe
        paymentStatus: session.payment_status,
        paymentDate: new Date(),
        sessionId: session.id,
        customerEmail: session.customer_details.email,
      };

      const checkout = await Checkout.create(checkoutData);
      console.log('Cart Checkout record created:', checkout);

      // Clear user's cart
      const deleteResult = await Cart.deleteMany({ userId: userId });
      console.log('Cart cleared. Delete result:', deleteResult);

      console.log('Cart Order fulfillment complete.');

    } catch (error) {
      console.error('Cart Fulfillment error:', error);
      return res.status(500).json({ error: 'Failed to fulfill cart order' });
    }
  }

  res.status(200).end();
};